from flask import Flask, render_template
import gradio as gr
from llamaapi import LlamaAPI
from langchain_experimental.llms import ChatLlamaAPI
import PyPDF2

# Initialize Flask app
app = Flask(__name__)

# Initialize the LlamaAPI
llama = LlamaAPI("LL-QoWL9fXItXVpIn4aeAJrWF5ktefdgE5y6iBvV0sIbEgpd62qyKGbTi1fKkFfDnZh")
model = ChatLlamaAPI(client=llama)

def extract_text_from_pdf(file_path):
    """Extracts text from a PDF file, handling potential access errors."""
    try:
        with open(file_path, 'rb') as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() or ""
            return text
    except (FileNotFoundError, PermissionError) as e:
        return f"Error: {e}. Please check the file path and permissions."

def create_study_plan(file_path_1, file_path_2):
    """Extracts text from two PDF files, then starts conversation with LLM."""
    extracted_text_1 = extract_text_from_pdf(file_path_1)
    extracted_text_2 = extract_text_from_pdf(file_path_2)

    # Check if there were errors during extraction
    if "Error:" in extracted_text_1:
        return extracted_text_1  # Return error message from the first PDF
    if "Error:" in extracted_text_2:
        return extracted_text_2  # Return error message from the second PDF

    # Split the extracted texts into parts
    calendar_part = extracted_text_1.split("Syllabus Content", 1)
    syllabus_part = extracted_text_2

    if len(calendar_part) < 2:
        return "Error: 'Syllabus Content' section not found in the academic calendar PDF."

    prompt = (
        f"Based on the following academic calendar content:\n{calendar_part[0]}\n\n"
        f"And the syllabus content:\n{syllabus_part}\n\n"
        "Please generate a comprehensive and detailed study plan for the upcoming semester. "
        "Include the following elements for each unit:\n"
        "- Title: The name of the unit or topic\n"
        "- Weeks: The week number and title of the unit\n"
        "- Daily Schedule: A detailed daily schedule including specific activities and duration\n"
        "- Study Methods: Recommended methods for studying each topic\n"
        "- Resources: Suggested books, articles, or websites for reference\n"
        "- Assessments: Suggested quizzes or assignments to reinforce learning\n"
        "Structure the plan clearly with bullet points for easy readability. Ensure to provide sufficient detail for each topic."
    )

    convo = model.invoke(prompt)
    return convo.content

# Define the Gradio interface
iface = gr.Interface(
    fn=create_study_plan,
    inputs=["file", "file"],
    outputs="text",
    title="Generate Comprehensive Study Plan from Two PDFs",
    description="Upload two PDFs - one for the academic calendar and one for the syllabus - and receive a detailed study plan.",
    allow_flagging=False
)

# Flask route for the homepage
@app.route('/')
def home():
    return render_template('index.html')

# Flask route for Gradio interface
@app.route('/generate')
def generate_study_plan():
    return iface.launch(share=False, inline=True)

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
