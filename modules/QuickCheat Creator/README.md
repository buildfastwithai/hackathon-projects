# QuickCheat Creator

Supercharge your exam preparation with QuickCheat Creator, your go-to tool for generating instant cheat sheets! Simply enter the topic name, and watch as our intelligent AI crafts a concise and organized summary of key concepts and essential information tailored to that subject. No need for extensive study materials—just a few clicks, and you’ll have a personalized cheat sheet at your fingertips. Perfect for quick reviews and last-minute studying, QuickCheat Creator helps you maximize your study efficiency and approach your exams with confidence!

## Features

- Generate comprehensive cheat sheets on any topic using Google Gemini LLM.
- Export cheat sheets to PDF and DOCX formats.
- Designed for quick reviews and last-minute studying.

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

1. Enter a topic in the sidebar input field (e.g., Machine Learning).
2. Click the Generate Cheat Sheet button.
3. Wait for the app to generate a cheat sheet summary on the entered topic.
4. Once the cheat sheet is generated, you can download it as a PDF or DOCX by clicking the respective download buttons in the sidebar.
