import os
import re
import time
import threading
from pdfminer.high_level import extract_text
import google.generativeai as genai
from gtts import gTTS
from pydub import AudioSegment, effects

# Configure the Gemini API
genai.configure(api_key="AIzaSyAcpkdxOkgN0iPb_tgq3ZV_pFVpotx_-gA")

# Create the model
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

# Function to extract text from a PDF and save it to a .txt file
def extract_text_from_pdf(pdf_path, txt_output_path):
    try:
        full_text = extract_text(pdf_path)
        with open(txt_output_path, 'w', encoding='utf-8') as txt_file:
            txt_file.write(full_text)
        print(f"Text extracted and saved to {txt_output_path}")
        return full_text
    except Exception as e:
        print(f"Error extracting text from {pdf_path}: {e}")
        return None

# Function to clean up text
def clean_text(text):
    cleaned_text = re.sub(r'[#*]', '', text)
    keywords_to_remove = ["example", "activity","Question"]  # Add more keywords if needed
    for keyword in keywords_to_remove:
        cleaned_text = re.sub(rf'\b{keyword}\b', '', cleaned_text, flags=re.IGNORECASE)
    cleaned_text = ' '.join(cleaned_text.split())
    return cleaned_text

# Function to send the extracted text to the Gemini model and get a response
def send_text_to_gemini(extracted_text):
    try:
        start_time = time.time()
        response = model.generate_content(extracted_text)
        elapsed_time = time.time() - start_time
        print(f"Gemini response received (took {elapsed_time:.2f} seconds)")
        return response.text if response else "No response generated."
    except Exception as e:
        print(f"Error generating content: {e}")
        return "Sorry, I'm having trouble generating a response."

# Function to generate an audio file from the text using gTTS
def generate_audio_from_text(text, audio_output_path):
    try:
        tts = gTTS(text=text, lang='en')
        temp_audio_file_path = audio_output_path.replace('.mp3', '_temp.mp3')
        tts.save(temp_audio_file_path)
        audio = AudioSegment.from_mp3(temp_audio_file_path)

        speed_change = 1.0  # Speed adjustment
        new_sample_rate = int(audio.frame_rate * speed_change)
        audio = audio._spawn(audio.raw_data, overrides={'frame_rate': new_sample_rate})
        audio = audio.set_frame_rate(44100)

        volume_change = 5  # Volume adjustment
        audio = audio + volume_change
        audio = effects.strip_silence(audio, silence_thresh=audio.dBFS - 14)
        audio.export(audio_output_path, format='mp3')

        if os.path.exists(temp_audio_file_path):
            os.remove(temp_audio_file_path)

        print(f"Adjusted audio file saved as: {audio_output_path}")
    except Exception as e:
        print(f"Error generating audio from text: {e}")

# Function to generate audio in parallel
def generate_audio_from_text_parallel(text_chunk, audio_output_path):
    threading.Thread(target=generate_audio_from_text, args=(text_chunk, audio_output_path)).start()

# Function to save chunks, generate audio, and create a full audio file
def save_chunks_and_generate_audio(cleaned_response, output_folder, base_filename):
    words = cleaned_response.split()
    chunk_size = 200
    num_chunks = len(words) // chunk_size + (1 if len(words) % chunk_size != 0 else 0)
    
    all_text = []

    for i in range(num_chunks):
        chunk = ' '.join(words[i * chunk_size:(i + 1) * chunk_size])
        chunk_txt_path = os.path.join(output_folder, f"{base_filename}_chunk_{i + 1}.txt")
        audio_output_path = os.path.join(output_folder, f"{base_filename}_chunk_{i + 1}_audio.mp3")

        with open(chunk_txt_path, 'w', encoding='utf-8') as txt_file:
            txt_file.write(chunk)

        generate_audio_from_text_parallel(chunk, audio_output_path)
        print(f"Saved {chunk_txt_path} and started audio generation for it.")
        
        all_text.append(chunk)

    full_text = ' '.join(all_text)
    full_audio_output_path = os.path.join(output_folder, f"{base_filename}_full_audio.mp3")
    
    generate_audio_from_text(full_text, full_audio_output_path)
    print(f"Generated complete audio file: {full_audio_output_path}")

# Function to process a single PDF
def process_single_pdf(pdf_file, input_folder, output_folder):
    pdf_path = os.path.join(input_folder, pdf_file)
    txt_output_path = os.path.join(output_folder, f"{os.path.splitext(pdf_file)[0]}_raw.txt")
    gemini_output_path = os.path.join(output_folder, f"{os.path.splitext(pdf_file)[0]}_processed.txt")
    summary_output_path = os.path.join(output_folder, f"{os.path.splitext(pdf_file)[0]}_summary.txt")

    print(f"Processing {pdf_file}...")

    extracted_text = extract_text_from_pdf(pdf_path, txt_output_path)
    if extracted_text is None:
        return

    gemini_response = send_text_to_gemini(extracted_text + " I want to remove all unnecessary words and images, keeping only the text and space between paragraphs and remove all activity and questions not examples.")
    if gemini_response is None:
        return
    


    cleaned_response = clean_text(gemini_response)

    with open(gemini_output_path, 'w', encoding='utf-8') as txt_file:
        txt_file.write(cleaned_response)

    print(f"Processed and updated {pdf_file} with Gemini response.")
    summary_response = send_text_to_gemini("Summarize the following text:\n" + cleaned_response)
    if summary_response:
        with open(summary_output_path, 'w', encoding='utf-8') as summary_file:
            summary_file.write(summary_response)
        print(f"Summary generated and saved to {summary_output_path}")

    save_chunks_and_generate_audio(cleaned_response, output_folder, os.path.splitext(pdf_file)[0])

    if os.path.exists(txt_output_path):
        os.remove(txt_output_path)
        print(f"Removed raw file {txt_output_path}")

# Function to process all PDFs sequentially
def process_pdfs_sequentially(input_folder, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    pdf_files = [f for f in os.listdir(input_folder) if f.endswith(".pdf")]

    for pdf_file in pdf_files:
        process_single_pdf(pdf_file, input_folder, output_folder)

    print("All PDFs processed.")

# Example usage
if __name__ == "__main__":
    input_folder = "D:\Projects ALL\Practice Apps models\preception\Backend\input_pdfs"  
    output_folder = "D:\Projects ALL\Practice Apps models\preception\Backend\output_txt" 

    process_pdfs_sequentially(input_folder, output_folder)

    print("Processing complete.")
