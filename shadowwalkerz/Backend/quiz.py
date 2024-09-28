import google.generativeai as genai
import PyPDF2
import re
import sqlite3
import os

from quiz_game import save_answers_to_database, save_cleaned_text_to_file, save_mcqs_to_file, save_options_to_database, save_questions_to_database

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

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
    return text

def generate_mcqs(text):
    prompt = f"Generate only mcqs with 4 options and answer based on the following text:\n\n{text}"
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
        os.remove(db_path)  

def process_second_pdf(filename, input_folder, output_folder):
    
    pdf_path = os.path.join(input_folder, filename)
    db_path = os.path.join(output_folder, 'mcq_database.db')
    mcqs_path = os.path.join(output_folder, 'mcqs.txt')
    cleaned_txt_path = os.path.join(output_folder, 'cleaned_mcqs.txt')

    try:
        delete_database_if_exists('./mcq_database.db')

        # Extract text from the PDF
        extracted_text = extract_text_from_pdf(pdf_path)
        if not extracted_text:
            raise ValueError("No text extracted from PDF. Check the PDF file.")

        # Generate MCQs from the extracted text
        mcqs = generate_mcqs(extracted_text)
        save_mcqs_to_file(mcqs, mcqs_path)

        cleaned_mcqs = clean_text(mcqs)
        save_cleaned_text_to_file(cleaned_mcqs, cleaned_txt_path)

        save_questions_to_database(cleaned_mcqs)
        save_options_to_database(cleaned_mcqs)
        save_answers_to_database(cleaned_mcqs)

        print("MCQs generated, cleaned, and saved successfully.")

    except Exception as e:
        print(f"An error occurred: {str(e)}")


