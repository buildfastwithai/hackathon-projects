from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from educhain import Educhain
from educhain.core import config
from langchain.chat_models import ChatOpenAI
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Replace with your OpenAI API credentials
custom_template = """
Generate {num} multiple-choice question (MCQ) based on the given topic and level.
Provide the question, four answer options, and the correct answer.
Topic: {topic}
Learning Objective: {learning_objective}
Difficulty Level: {difficulty_level}
"""

llama = ChatOpenAI(
    model="llama-3.1-70b-versatile",
    openai_api_base="https://api.groq.com/openai/v1",
    openai_api_key=os.getenv('GROQ_API_KEY')  # Replace with your actual key
)

llm_config = config.LLMConfig(
    custom_model=llama
)

client = Educhain(llm_config)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/generate_questions", methods=["POST"])
def generate_questions():
    if request.method == "POST":
        data = request.get_json(force=True)  # Get data from the request body

        topic = data.get("topic")
        num = data.get("num")
        learning_objective = data.get("learning_objective")
        difficulty_level = data.get("difficulty_level")

        if not all([topic, num, learning_objective, difficulty_level]):
            return jsonify({"error": "Missing required parameters"}), 400

        try:
            result = client.qna_engine.generate_questions(
                topic=topic, num=num, learning_objective=learning_objective, difficulty_level=difficulty_level, prompt_template=custom_template
            )
            return jsonify(result.json())
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Invalid request method"}), 405

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5002)
