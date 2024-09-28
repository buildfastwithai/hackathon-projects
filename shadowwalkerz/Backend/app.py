import re
import sqlite3
import PyPDF2
from flask import Flask, request, jsonify, send_from_directory
import os
from werkzeug.utils import secure_filename
import google.generativeai as genai
import threading
from flask_cors import CORS
from video import process_files_for_keywords
from gen import process_single_pdf
from quiz import process_second_pdf
from quiz_game import save_score_to_database  

app = Flask(__name__)
CORS(app)

input_folder = r"./input_pdfs"
output_folder = r"./output_txt"
image_folder = "./dataset/english"
output_video = "./Keywords"

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['pdf']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(input_folder, filename)
        file.save(file_path)

        threading.Thread(target=process_single_pdf, args=(filename, input_folder, output_folder)).start()
        threading.Thread(target=process_second_pdf, args=(filename, input_folder, output_folder)).start()
        threading.Thread(target=process_files_for_keywords, args=(output_folder, image_folder, output_video)).start()

        return jsonify({'message': 'File uploaded and processing started'}), 200
    else:
        return jsonify({'error': 'Invalid file format. Please upload a PDF file.'}), 400

@app.route('/get_mcqs', methods=['GET'])
def get_mcqs():
    db_path = os.path.join(r"../Backend", 'mcq_database.db')
 
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT id, question FROM mcqs')
        questions = cursor.fetchall()
        mcqs_data = []
        
        for question_id, question in questions:
            cursor.execute('SELECT option_text FROM options WHERE question_id = ?', (question_id,))
            options = cursor.fetchall()
            mcqs_data.append({
                'id': question_id,
                'question': question,
                'options': [option[0] for option in options]
            })
        
        conn.close()
        return jsonify(mcqs_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/submit_answers', methods=['POST'])
def submit_answers():
    db_path = os.path.join(r"../Backend", 'mcq_database.db')

    try:
        data = request.json
        print(data)
        if 'answers' not in data or not isinstance(data['answers'], list):
            return jsonify({'error': 'No answers provided or invalid format'}), 400
        
        answers = data['answers']
        score = 0
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        for answer in answers:
            question_id = answer.get('question_id')  
            user_answer = answer.get('selected_option') 
            
            if question_id is None or user_answer is None:
                continue 

            cursor.execute('SELECT answer FROM answers WHERE question_id = ?', (question_id,))
            correct_answer = cursor.fetchone()
            
            if correct_answer is not None:
                correct_answer = correct_answer[0]  
                print(f"Correct answer: {correct_answer}")

                # Use regex to extract the correct answer letter (e.g., 'a' from 'Answer a...')
                correct_match = re.search(r'Answer\s+([a-d])', correct_answer, re.IGNORECASE)
                
                user_match = re.search(r'Answer\s+([a-d])', user_answer, re.IGNORECASE)

                if correct_match and user_match:
                    correct_letter = correct_match.group(1).strip().lower()
                    user_letter = user_match.group(1).strip().lower()

                    print(f"User answer: {user_letter}, Correct answer: {correct_letter}")

                    if user_letter == correct_letter:
                        score += 1  # Increment score if the answer is correct
                        print(f"Score: {score}")
        
        # Close the database connection
        conn.close()
        save_score_to_database(score)
        return jsonify({'score': score, 'total': len(answers)}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# audio file and txt file
@app.route('/check-files', methods=['GET'])
def check_files():
    folder_path = r"./output_txt"
    
    files = os.listdir(folder_path)

    file1 = next((f for f in files if "summary.txt" in f), None)
    file2 = next((f for f in files if "full_audio.mp3" in f), None)

    print(f"Summary File: {file1}\nAudio File: {file2}")

    # Check if files exist
    file1_exists = file1 is not None and os.path.exists(os.path.join(folder_path, file1))
    file2_exists = file2 is not None and os.path.exists(os.path.join(folder_path, file2))

    if file1_exists and file2_exists:
        return jsonify({'files_exist': True, 'file1': file1, 'file2': file2})
    else:
        return jsonify({'files_exist': False, 'missing_files': {'summary': file1 is None, 'audio': file2 is None}})

# Video File
@app.route('/check-video', methods=['GET'])
def check_video():
    folder_path = r"./Keywords"
    
    files = os.listdir(folder_path)

    file = next((f for f in files if "merged_video.mp4" in f), None)

    print(f"video File: {file}\n")

    # Check if files exist
    file_exists = file is not None and os.path.exists(os.path.join(folder_path, file))

    if file_exists:
        return jsonify({'files_exist': True, 'video': file})
    else:
        return jsonify({'files_exist': False, 'missing_files': {'video': file is None}})


# Route to download specific files
@app.route('/download-video/<filename>', methods=['GET'])
def download_video(filename):
    folder_path = r"./Keywords"
    
    if os.path.exists(os.path.join(folder_path, filename)):
        return send_from_directory(folder_path, filename, as_attachment=True)
    else:
        return jsonify({'error': 'File not found'}), 404
    

# Route to download specific files
@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    folder_path = r"./output_txt"
    
    if os.path.exists(os.path.join(folder_path, filename)):
        return send_from_directory(folder_path, filename, as_attachment=True)
    else:
        return jsonify({'error': 'File not found'}), 404
    
#Chatting with pdfs
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


# Extract text from the PDF
def extract_text_from_pdf(pdf_path):
    if not os.path.exists(pdf_path):
        return "PDF file not found."
    
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.json
    question = data.get('question')
    pdf_filename = data.get('pdf_filename')

    pdf_directory = r"./input_pdfs"
    pdf_path = os.path.join(pdf_directory, pdf_filename)

    # Extract the text from the provided PDF
    pdf_text = extract_text_from_pdf(pdf_path)
    
    if pdf_text == "PDF file not found.":
        return jsonify({'answer': "The specified PDF file could not be found."})
    
    # Create the prompt
    prompt = (
        f"{question}\n\n"
        f"Please answer in a concise manner using the following text:\n"
        f"{pdf_text}\n\n"
        "Provide your answer in 1-2 lines."
    )

    response = model.generate_content(prompt)
    answer_text = response.text if hasattr(response, 'text') else str(response)

    if "I don't know" in answer_text or "not found" in answer_text:
        return jsonify({'answer': "I don't know."})
    
    return jsonify({'answer': answer_text.strip()})

if __name__ == '__main__':
    os.makedirs(input_folder, exist_ok=True)
    os.makedirs(output_folder, exist_ok=True)

    app.run(host='0.0.0.0', port=5000)
