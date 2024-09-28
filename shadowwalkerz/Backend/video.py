import os
import re
import PyPDF2
import google.generativeai as genai
from moviepy.editor import ImageClip, VideoFileClip, concatenate_videoclips,AudioFileClip
from concurrent.futures import ThreadPoolExecutor
from moviepy.video.fx.all import speedx
from moviepy.video.fx.all import fadein, fadeout

# Configure the Gemini API
genai.configure(api_key="AIzaSyAcpkdxOkgN0iPb_tgq3ZV_pFVpotx_-gA")

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

# Function to clean text (remove special characters, extra spaces, etc.)
def clean_text(text):
    cleaned_text = re.sub(r'[#*]', '', text)  
    cleaned_text = ' '.join(cleaned_text.split()) 
    return cleaned_text

# Function to extract keywords from image filenames
def extract_keywords_from_images(image_folder):
    keywords = set()  # Use a set to avoid duplicate keywords
    try:
        # Iterate through all files in the image folder
        for file_name in os.listdir(image_folder):
            if file_name.endswith(('.jpg', '.jpeg', '.png', '.webp', '.gif')):  
                # Remove the file extension and split by underscore
                name_without_extension = os.path.splitext(file_name)[0]
                keyword_parts = name_without_extension.split('_')
                # Add each part as a keyword
                keywords.update(keyword_parts)
    except Exception as e:
        print(f"Error reading files from {image_folder}: {e}")

    return list(keywords) 

# Function to extract keywords using Gemini AI
def extract_keywords_gemini(text, top_n=8):
    try:
        prompt = f"{text} Extract the top {top_n} simple and most common keywords without any symbols, descriptions,reactions(like HAA HAA,W W) and also arrange in manner of story "
        
        # Use Gemini AI to process the request
        response = model.generate_content(prompt)

        keywords = response.text.splitlines()

        return keywords[:top_n]
    except Exception as e:
        print(f"Error extracting keywords with Gemini: {e}")
        return []

# Function to read a text file and return its content
def read_text_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        return ""


# Function to save the combined extracted keywords to a new file
def save_combined_keywords_to_file(keywords, output_folder, base_filename):
    try:
        # Define the path where the keywords will be saved
        keywords_output_path = os.path.join(output_folder, f"{base_filename}_combined_keywords.txt")
        # Write the keywords to the file
        with open(keywords_output_path, 'w', encoding='utf-8') as file:
            file.write('\n'.join(keywords))  
        print(f"Combined keywords saved to {keywords_output_path}")
    except Exception as e:
        print(f"Error saving combined keywords: {e}")


#effects 
def apply_pan_effect(clip, pan_duration, direction="right", pan_speed=15):
    width, height = clip.size

    def pan_frame(get_frame, t):
        frame = get_frame(t)
        x_move = int(pan_speed * t)
        if direction == "right":
            return frame[:, x_move:min(width, x_move + width), :]
        elif direction == "left":
            return frame[:, max(0, width - x_move):width, :] 
        return frame

    return clip.fl(pan_frame).set_duration(pan_duration)


def generate_video_from_keywords(keywords, image_folder, output_folder, video_number, used_images, target_size=(1280, 720)):
    clips = []
    used_keywords = set() 
    normalized_keywords = [kw.lower() for kw in keywords]

    for keyword in normalized_keywords:
        # Construct the image filename base (no extension)
        image_base_name = f"{keyword}"  
        image_found = False
        
        # Check for all image formats
        for ext in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
            image_filename = f"{image_base_name}{ext}"
            image_path = os.path.join(image_folder, image_filename)
            
            # Check if the image exists and has not been used
            if os.path.exists(image_path) and image_path not in used_images:
                if ext == '.gif':
                    gif_clip = VideoFileClip(image_path)
                    
                    slow_gif_clip = speedx(gif_clip, factor=0.5) 
                    
                    clip = slow_gif_clip.resize(target_size).subclip(0, min(5, slow_gif_clip.duration))  
                    
           
                    # duration = gif_clip.duration  # Get the GIF's total duration
                    
                    # # If the GIF is longer than 5 seconds, play the full duration
                    # clip = gif_clip.resize(target_size) 
                    # # if duration > 2 else gif_clip.subclip(0, 5).resize(target_size)
 
                else:
                    # Use ImageClip for static images
                    clip = ImageClip(image_path).set_duration(8).resize(target_size) 
                    clip = clip.resize(lambda t: 1 + 0.1 * t)  # Zoom in over time
                    clip = apply_pan_effect(clip, pan_duration=8, direction="right") 
                    clip = fadeout(clip, 1) 
                clips.append(clip)
                used_keywords.add(keyword) 
                used_images.add(image_path)
                image_found = True
                break  
        if not image_found:
            print(f"Image not found for keyword: {keyword}")

    # Concatenate the video clips
    if clips:
        video = concatenate_videoclips(clips[:3], method="compose") 
        video_output_path = os.path.join(output_folder, f"story_video_{video_number}.mp4")
        video.write_videofile(video_output_path, fps=24)
        print(f"Video {video_number} saved to {video_output_path}")
        return video_output_path
    else:
        print(f"No clips to create video {video_number}.")
        return None

#merge audio file
def merge_videos_with_audio(video_paths, output_folder, audio_folder):
    try:
        # Merge video clips
        video_clips = [VideoFileClip(path) for path in video_paths]
        final_video = concatenate_videoclips(video_clips)
        final_output_path = os.path.join(output_folder, "final_merged_video.mp4")

        # Find the audio file with 'full_audio.mp3' suffix
        audio_file = None
        for file_name in os.listdir(audio_folder):
            if file_name.endswith("full_audio.mp3"):
                audio_file = os.path.join(audio_folder, file_name)
                break

        if audio_file:
            # Load audio and set it to the video
            final_audio = AudioFileClip(audio_file)
            final_video = final_video.set_audio(final_audio)

        # Write the final video with audio, explicitly setting FPS
        final_video.write_videofile(final_output_path, fps=24, codec='libx264')
        print(f"Final merged video with audio saved to {final_output_path}")
    except Exception as e:
        print(f"Error merging videos with audio: {e}")

# Function to process text files and images for keyword extraction
def process_files_for_keywords(text_folder, image_folder, output_folder):
    combined_keywords = set()  # Use a set to avoid duplicates
    used_images = set()  # Track used images across all videos

    # Process text files for keywords
    for text_file in os.listdir(text_folder):
        if text_file.endswith(".txt"):
            text_file_path = os.path.join(text_folder, text_file)
            raw_text = read_text_file(text_file_path)
            if raw_text:
                cleaned_text = clean_text(raw_text)
                keywords_from_text = extract_keywords_gemini(cleaned_text, top_n=10) 
                combined_keywords.update(keywords_from_text)

    # Extract keywords from image filenames
    keywords_from_images = extract_keywords_from_images(image_folder)
    combined_keywords.update(keywords_from_images)

    # Save the combined keywords to a new file
    save_combined_keywords_to_file(list(combined_keywords), output_folder, 'all')

    # Split keywords into groups for 30-second videos
    keywords_list = list(combined_keywords)
    keyword_groups = [keywords_list[i:i + 6] for i in range(0, len(keywords_list), 6)]

    video_paths = []  

    # Generate videos in parallel
    with ThreadPoolExecutor() as executor:
        futures = []
        for i, keyword_group in enumerate(keyword_groups):
            futures.append(executor.submit(generate_video_from_keywords, keyword_group, image_folder, output_folder, i + 1, used_images))

        # Wait for all futures to complete and collect video paths
        for future in futures:
            video_path = future.result()
            if video_path:
                video_paths.append(video_path)

    # Merge all videos into one final video
    if video_paths:
        merge_videos_with_audio(video_paths, output_folder,text_folder)
    else:
        print("No videos were generated to merge.")

# Function to merge multiple videos into one
# def merge_videos(video_paths, output_folder):
#     try:
#         video_clips = [VideoFileClip(path) for path in video_paths]
#         final_video = concatenate_videoclips(video_clips)
#         final_output_path = os.path.join(output_folder, "final_merged_video.mp4")
#         final_video.write_videofile(final_output_path, fps=24)
#         print(f"Final merged video saved to {final_output_path}")
#     except Exception as e:
#         print(f"Error merging videos: {e}")

# Function to process a single PDF and extract text
def process_third_pdf(pdf_path, output_folder):
    # Extract text from the PDF using PyPDF2
    with open(pdf_path, 'rb') as pdf_file:
        pdf_reader = PyPDF2.PdfFileReader(pdf_file)
        text = ""
        for page_num in range(pdf_reader.numPages):
            page = pdf_reader.getPage(page_num)
            text += page.extractText()

    # Clean the text (using the clean_text function)
    cleaned_text = clean_text(text)

    # Extract keywords using Gemini AI
    keywords = extract_keywords_gemini(cleaned_text)

    # Use these keywords to generate video clips (existing function)
    used_images = set()  # Track used images
    video_paths = []
    
    # Generate video using keywords
    video_paths = generate_video_from_keywords(keywords, image_folder="./dataset/english", output_folder=output_folder, video_number=1, used_images=used_images)

    return video_paths  # Return video paths for further use


# Example usage
# if __name__ == "__main__":
    # Folder with input paragraph text files
    # text_folder = "D:\\Projects ALL\\AI Based\\P-Dio\\PRECEPTION\\output_txt"
    # # Folder with images
    # image_folder = "D:\\Projects ALL\\AI Based\\P-Dio\\PRECEPTION\\dataset\\english"
    # # Folder where the keywords and videos will be saved
    # output_folder = "D:\\Projects ALL\\AI Based\\P-Dio\\PRECEPTION\\Keywords"

    # # Process text files and images to generate combined keywords and videos
    # process_files_for_keywords(text_folder, image_folder, output_folder)

    # print("Keyword extraction, video generation, and merging complete.")  