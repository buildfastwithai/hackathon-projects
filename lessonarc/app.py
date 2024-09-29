from flask import Flask, render_template, request
import openai
import requests

# Initialize the Flask app
app = Flask(__name__)

# Set your OpenAI API key
openai.api_key = ""  # Replace with your OpenAI API key

# Function to generate course material using OpenAI
def generate_course_material(prompt, max_tokens=200, temperature=0.7, n=1):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Updated to use GPT-3.5
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=temperature,
            n=n,
        )
        return [choice['message']['content'].strip() for choice in response['choices']]
    except Exception as e:
        return [f"Error generating content: {str(e)}"]

# Fetch an image from Unsplash based on the topic
def fetch_image(topic):
    access_key = ""  # Replace with your Unsplash API access key
    url = f"https://api.unsplash.com/photos/random?query={topic}&client_id={access_key}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()['urls']['regular']
    return None

# Generate quiz questions based on the topic
def generate_quiz(topic):
    prompt = f"Create a quiz with 5 questions about {topic}."
    return generate_course_material(prompt, max_tokens=150, temperature=0.5, n=1)

# Generate assignments based on the topic
def generate_assignment(topic):
    prompt = f"Create an assignment based on {topic}."
    return generate_course_material(prompt, max_tokens=150, temperature=0.5, n=1)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    topic = request.form['topic']
    level = request.form['level']
    max_tokens = int(request.form['max_length'])
    temperature = float(request.form['temperature'])
    num_return_sequences = int(request.form['num_return_sequences'])

    # Prompt to generate advanced course material
    prompt = f"Create a detailed course outline on {topic} for {level} level, including an introduction, chapters, and key learning points."

    # Generate course material
    content = generate_course_material(prompt, max_tokens, temperature, num_return_sequences)

    # Fetch an image for the topic
    image_url = fetch_image(topic)

    # Generate quiz and assignments
    quiz = generate_quiz(topic)[0]
    assignment = generate_assignment(topic)[0]

    return render_template('result.html', content=content, image_url=image_url, quiz=quiz, assignment=assignment, topic=topic)

if __name__ == '__main__':
    app.run(debug=True)
