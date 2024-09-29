from flask import Flask, render_template, request, redirect, url_for, session
from educhain import Educhain, LLMConfig
from langchain_google_genai import ChatGoogleGenerativeAI
import requests
import PyPDF2
from io import BytesIO
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

app = Flask(__name__)
app.secret_key = 'supersecretkey'

tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")
model = AutoModelForSeq2SeqLM.from_pretrained("facebook/bart-large-cnn")

# Initialize Educhain client
gemini = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro-002",
    api_key="AIzaSyDPvXj9Tfn6wZ6w9qGfq5XNjOlOiz_qxlc"  # Make sure to put your API key here
)

gemini_config = LLMConfig(custom_model=gemini)
client = Educhain(gemini_config)

# Function to extract MCQs into lists
def mcqs_to_lists(mcq_list):
    question_list = []
    options_list = []
    correct_answers = []
    for i, mcq in enumerate(mcq_list.questions):
        question_str = f"{mcq.question}"
        options_str = [option for option in mcq.options]  # Options without numbers
        question_list.append(question_str)
        options_list.append(options_str)
        correct_answers.append(mcq.answer)
    return question_list, options_list, correct_answers


@app.route('/', methods=['GET', 'POST'])
def MYS():
    print("MYS function is being called")
    print(request.method)
    if request.method == 'POST':
        print("Form data received") 
        pdf_url = request.form['pdf_url']
        print("url",pdf_url)
        response = requests.get(pdf_url)
        if response.status_code == 200:
            pdf_file = BytesIO(response.content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)

            pdf_text = ''
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                pdf_text += page.extract_text()

        try:
            #response = requests.get(pdf_url)
            #response.raise_for_status()  # Check for HTTP errors
            
            # Generate MCQs using Educhain client
            mcqs_from_url = client.qna_engine.generate_questions_from_data(
                source=pdf_text,
                source_type="text",
                num=5
            )
            
            inputs = tokenizer(pdf_text, return_tensors="pt", max_length=1024, truncation=True)
            summary_ids = model.generate(inputs["input_ids"], max_length=150, min_length=40, length_penalty=2.0, num_beams=4, early_stopping=True)
            summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True) 
            session['summary'] = summary
            print("SUMMARY:")
            print(summary[:50])

            # Extract questions, options, and correct answers
            questions, options, correct_answers = mcqs_to_lists(mcqs_from_url)
            print(correct_answers)
            # Save questions, options, and correct answers to session
            session['questions'] = questions
            session['options'] = options
            session['correct_answers'] = correct_answers

            # Redirect to the quiz page
            return redirect(url_for('quiz'))

        except Exception as e:
            
            return f"OHHH error occurred: {str(e)}"

    return render_template('index.html')


@app.route('/quiz', methods=['GET', 'POST'])
def quiz():
    # Retrieve questions and options from session
    questions = session.get('questions')
    options = session.get('options')
    summary = session.get('summary') 
    print("SUMMARY:",summary[:50])
    if questions and options:
        return render_template('quiz.html', questions=questions, options=options,summary=summary)
    else:
        return "No quiz data found. Please upload a PDF."


@app.route('/submit_quiz', methods=['POST'])
def submit_quiz():
    print("YOU ARE IN QUIZ RESULT")
    score = 0
    feedback = []

    # Retrieve correct answers from session
    correct_answers = session.get('correct_answers')
    questions = session.get('questions')
    if not correct_answers or not questions:
        return "No quiz data found. Please upload a PDF."

    # Evaluate the user's answers
    for idx, correct_answer in enumerate(correct_answers):
        user_answer = request.form.get(f'q{idx+1}') # This will now be the option string the user selected
        print(f"User answer for Q{idx + 1}: {user_answer}")  # Debugging line to check user answers
        print(f"Correct answer for Q{idx + 1}: {correct_answer}")  # Debugging line to check correct answers
        if user_answer and user_answer == correct_answer:
            score += 1
            feedback.append(f"Question {idx + 1}: Correct!!! {correct_answer}.")
        else:
            feedback.append(f"Question {idx + 1}: Incorrect. The correct answer was :{correct_answer}.")

    # Render the results page
    return render_template('quiz_result.html', score=score, total=len(questions), feedback=feedback)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
