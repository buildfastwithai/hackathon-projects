import google.generativeai as genai
import PyPDF2
import re
import sqlite3
import os

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

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
    return text

def generate_mcqs(text):
    prompt = f"Generate only mcqs with always 4 options in alphabetical order only and answer based on the following text:\n\n{text}"
    response = model.generate_content(prompt)
    if not response.text:
        raise ValueError("No MCQs were generated. Check the input text.")
    return response.text.strip()

def clean_text(text):
    cleaned_text = re.sub(r"[*]", "", text)
    cleaned_text = re.sub(r"[^\w\s,.?]", "", cleaned_text)
    return cleaned_text

def delete_database_if_exists(db_path):
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('DROP TABLE IF EXISTS options')
        cursor.execute('DROP TABLE IF EXISTS mcqs')
        cursor.execute('DROP TABLE IF EXISTS answers')
        conn.commit()
        conn.close()

def save_questions_to_database(mcqs):
    conn = sqlite3.connect('mcq_database.db')
    cursor = conn.cursor()
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS mcqs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT
    )''')

    current_question = ""
    for line in mcqs.splitlines():
        line = line.strip()
        if re.match(r'^\d+\.', line):
            if current_question:
                cursor.execute('INSERT INTO mcqs (question) VALUES (?)', (current_question,))
            current_question = line

    if current_question:
        cursor.execute('INSERT INTO mcqs (question) VALUES (?)', (current_question,))

    conn.commit()
    conn.close()

def save_options_to_database(mcqs):
    conn = sqlite3.connect('mcq_database.db')
    cursor = conn.cursor()
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS options (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_id INTEGER,
        option_text TEXT,
        FOREIGN KEY (question_id) REFERENCES mcqs(id)
    )''')

    current_question_id = None
    options = []
    
    cursor.execute('SELECT id, question FROM mcqs')
    questions = cursor.fetchall()
    
    for line in mcqs.splitlines():
        line = line.strip()
        if re.match(r'^\d+\.', line):
            if current_question_id is not None and options:
                for option in options:
                    cursor.execute('INSERT INTO options (question_id, option_text) VALUES (?, ?)', 
                                   (current_question_id, option))
            current_question = line
            current_question_id = next((q[0] for q in questions if q[1] == current_question), None)
            options = []
        elif re.match(r'^[a-d]\s', line):
            options.append(line)

    if current_question_id is not None and options:
        for option in options:
            cursor.execute('INSERT INTO options (question_id, option_text) VALUES (?, ?)', 
                           (current_question_id, option))

    conn.commit()
    conn.close()

def save_answers_to_database(mcqs):
    conn = sqlite3.connect('mcq_database.db')
    cursor = conn.cursor()

    cursor.execute('''CREATE TABLE IF NOT EXISTS answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_id INTEGER,
        answer TEXT,
        FOREIGN KEY (question_id) REFERENCES mcqs(id)
    )''')

    current_question_id = None
    correct_answer = None
    
    cursor.execute('SELECT id, question FROM mcqs')
    questions = cursor.fetchall()

    for line in mcqs.splitlines():
        line = line.strip()
        if re.match(r'^\d+\.', line):
            current_question = line
            current_question_id = next((q[0] for q in questions if q[1] == current_question), None)
        elif re.match(r'^Answer', line):
            correct_answer = line

            if current_question_id is not None and correct_answer:
                cursor.execute('INSERT INTO answers (question_id, answer) VALUES (?, ?)',
                               (current_question_id, correct_answer))
                correct_answer = None

    conn.commit()
    conn.close()

def ask_questions():
    conn = sqlite3.connect('mcq_database.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT id, question FROM mcqs')
    questions = cursor.fetchall()
    score = 0

    for question_id, question in questions:
        print(question)
        
        cursor.execute('SELECT option_text FROM options WHERE question_id = ?', (question_id,))
        options = cursor.fetchall()
        
        for option in options:
            print(option[0])

        answer = input("Your answer (a/b/c/d): ").strip().lower()
        
        cursor.execute('SELECT answer FROM answers WHERE question_id = ?', (question_id,))
        correct_answer = cursor.fetchone()[0]

        if answer == correct_answer[0].lower():
            score += 1

    print(f"Your score: {score}/{len(questions)}")
    conn.close()

    return score

def save_score_to_database(score):
    conn = sqlite3.connect('mcq_database.db')
    cursor = conn.cursor()
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        score INTEGER
    )''')

    cursor.execute('INSERT INTO scores (score) VALUES (?)', (score,))
    
    conn.commit()
    conn.close()

def save_mcqs_to_file(mcqs, mcqs_path):
    with open(mcqs_path, 'w', encoding='utf-8') as f:
        f.write(mcqs)

def save_cleaned_text_to_file(cleaned_text, cleaned_txt_path):
    with open(cleaned_txt_path, 'w', encoding='utf-8') as f:
        f.write(cleaned_text)

# pdf_path = r"D:\Projects ALL\AI Based\P-Dio\PRECEPTION\input_pdfs\geah101.pdf"
db_path = 'mcq_database.db'
mcqs_path = './mcqs.txt'
cleaned_txt_path = './cleaned_mcqs.txt'

try:
    delete_database_if_exists(db_path)

    # extracted_text = extract_text_from_pdf(pdf_path)
    # if not extracted_text:
    #     raise ValueError("No text extracted from PDF. Check the PDF file.")

    # mcqs = generate_mcqs(extracted_text)

    # save_mcqs_to_file(mcqs, mcqs_path)

    # cleaned_mcqs = clean_text(mcqs)
    # save_cleaned_text_to_file(cleaned_mcqs, cleaned_txt_path)

    # save_questions_to_database(cleaned_mcqs)

    # save_options_to_database(cleaned_mcqs)

    # save_answers_to_database(cleaned_mcqs)

    # print("MCQs generated, cleaned, and saved to the databases and files successfully.")

    # score = ask_questions()

    # save_score_to_database(score)

except Exception as e:
    print(f"An error occurred: {str(e)}")
