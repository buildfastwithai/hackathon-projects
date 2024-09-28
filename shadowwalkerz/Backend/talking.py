import PyPDF2
import google.generativeai as genai

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

# Function to extract text from the PDF
def extract_text_from_pdf(pdf_path):
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

pdf_path = r"D:\Projects ALL\Practice Apps models\preception\Backend\input_pdfs\geah102.pdf"

# Extract text
pdf_text = extract_text_from_pdf(pdf_path)

def ask_question(question):
    prompt = (
        f"{question}\n\n"
        f"Please answer in a concise manner using the following text:\n"
        f"{pdf_text}\n\n"
        "Provide your answer in 1-2 lines."
    )
    
    response = model.generate_content(prompt)


    answer_text = response.text if hasattr(response, 'text') else str(response)

    if "I don't know" in answer_text or "not found" in answer_text:
        return "I don't know."
    
    return answer_text.strip() 
# Example usage
question = "what meteoroid?"
answer = ask_question(question)
print(answer)
