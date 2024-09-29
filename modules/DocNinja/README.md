# DocuNinja

Master your document review process with DocuNinja! Effortlessly upload any document format—be it PPTs, DOCs, PDFs, HTMLs, or CSVs—and let our advanced AI transform lengthy texts into concise summaries. With integrated Q&A capabilities, DocuNinja helps you clarify complex ideas and extract critical insights swiftly. Whether you're a student preparing for exams or a professional needing quick insights, DocuNinja equips you with the tools to maximize the value of your documents in record time!

## Features

- Upload various document formats (PDF, DOCX, TXT, HTML, CSV, PPTX)
- Generate concise summaries of uploaded documents
- Ask questions about the document content and receive AI-generated responses

## Requirements

Before running the application, ensure you have the following installed:

- Python 3.7 or higher
- `pip` (Python package installer)

### Required Python Packages

The required packages are listed in `requirements.txt`. 

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>

2. Create a virtual environment (recommended):

   python -m venv venv
   source venv/bin/activate  

   On Windows use  `venv\Scripts\activate`

3. Install the required packages:

   pip install -r requirements.txt

4. Set up your environment variables. Create a .env file in the root directory and add your Google API key:
   
   GOOGLE_API_KEY=<your_google_api_key>

5. Running the Application
   
   To run the application, execute the following command in your terminal:

   streamlit run app.py

   This will start the Streamlit server, and you can access the application in your web browser at http://localhost:8501.

## Usage

1. Open the application in your web browser.
2. Use the sidebar to upload a document (PDF, DOCX, TXT, HTML, CSV, PPTX).
3. View the generated summary of the document.
4. Ask questions related to the document content using the chat interface.
