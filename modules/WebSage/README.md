## WebSage

Unleash your online learning potential with WebSage! This powerful tool effortlessly summarizes website content, distilling articles, blogs, and online tutorials into digestible insights. With integrated Q&A features, you can easily clarify doubts and enhance your understanding of complex topics. WebSage empowers you to navigate the vast web of information quickly and efficiently, making knowledge acquisition a seamless experience. Transform the way you learn online with WebSage—your intelligent guide to web content!

## Features

- Extract Text: Retrieve the main content of any website.
- Summarization: Generate a concise summary of website content.
- Interactive Q&A: Ask questions about the summarized content.

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

1. Enter a website URL in the sidebar and click the Process button.
2. The main content of the webpage will be summarized.
3. Ask questions about the summarized content in the chat input at the bottom of the page.

