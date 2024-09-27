import streamlit as st
import requests
import random
from PIL import Image
from io import BytesIO
import plotly.graph_objects as go


GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes"

st.set_page_config(layout="wide")
st.title('📚 CEREBRO - Your Ultimate Learning Companion')


st.markdown(
    """
    <style>
    .stApp {
        background: linear-gradient(to right, #000428, #004e92);
        color: white;
        font-family: 'Arial', sans-serif;
    }
    .title {
        color: #1f77b4;
        font-size: 2.5rem;
    }
    .progress-bar {
        background-color: #1f77b4;
    }
    h1 {
        color: #ff6f61;
        text-align: center;
    }

    .cool-button {
        background-color: #1f77b4;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    .cool-button:hover {
        background-color: #ff6f61;
    }
    </style>
    """, unsafe_allow_html=True
)


mood = st.sidebar.selectbox("How are you feeling today?",
                            ["Happy", "Curious", "Focused", "Mysterious", "Energetic", "Creative"])

st.sidebar.header("Interactive Features")
st.sidebar.write(f"Based on your selection, you're feeling {mood}!")


st.sidebar.subheader("📖 Reading Challenge")
books_to_read = st.sidebar.number_input("Set your learning goal (books per month):", min_value=1, max_value=50, value=5)
progress = st.sidebar.slider("Update your progress:", 0, books_to_read, 0)
progress_percentage = (progress / books_to_read) * 100

fig = go.Figure(go.Indicator(
    mode="gauge+number",
    value=progress,
    title={'text': "Reading Progress"},
    gauge={'axis': {'range': [0, books_to_read]},
           'bar': {'color': "#1f77b4"}},
    domain={'x': [0, 1], 'y': [0, 1]}
))
st.sidebar.plotly_chart(fig)

col1, col2 = st.columns([2, 1])


with col1:
    input_text = st.text_input("Search for a book or subject:")


    def fetch_book_data(query):
        response = requests.get(GOOGLE_BOOKS_API_URL, params={'q': query})
        if response.status_code == 200:
            data = response.json()
            return data['items'] if 'items' in data else None
        else:
            return None


    def extract_book_info(book):
        info = book['volumeInfo']
        return {
            'title': info.get('title', 'No title available'),
            'authors': ', '.join(info.get('authors', ['Unknown author'])),
            'description': info.get('description', 'No summary available'),
            'publishedDate': info.get('publishedDate', 'Unknown publication date'),
            'categories': ', '.join(info.get('categories', ['Unknown category'])),
            'pageCount': info.get('pageCount', 'Unknown'),
            'averageRating': info.get('averageRating', 'Not rated'),
            'imageLinks': info.get('imageLinks', {}).get('thumbnail', None),
            'infoLink': info.get('infoLink', '#')
        }


    if input_text:
        books = fetch_book_data(input_text)
        if books:
            book = extract_book_info(books[0])

            # Display book information
            st.subheader(book['title'])
            st.write(f"By: {book['authors']}")

            if book['imageLinks']:
                try:
                    response = requests.get(book['imageLinks'])
                    if response.status_code == 200:
                        img = Image.open(BytesIO(response.content))
                        if img.format:  # Check if the image format is valid
                            st.image(img, width=200)
                        else:
                            st.write("Invalid image format.")
                    else:
                        st.write("Failed to fetch image.")
                except Exception as e:
                    st.write("Error in fetching or displaying the image:", str(e))
            else:
                st.write("No image available for this book.")

            st.write(f"**Published:** {book['publishedDate']}")
            st.write(f"**Categories:** {book['categories']}")
            st.write(f"**Pages:** {book['pageCount']}")
            st.write(f"**Rating:** {book['averageRating']}/5")

            with st.expander("Book Summary"):
                st.write(book['description'])

            st.markdown(f"[More Info]({book['infoLink']})")


            st.subheader("Key Takeaways")
            st.write("- The main idea of the book is to understand the essence of knowledge retention.")
            st.write("- It highlights the importance of adaptive learning in modern education.")
            st.write("- The book offers strategies to conquer complex subjects more efficiently.")

with col2:
    st.subheader(f"📚 Books for your {mood} mood")


    def recommend_books_by_mood(mood):
        mood_genres = {
            "Happy": ["Comedy", "Self-help", "Inspirational"],
            "Curious": ["Non-fiction", "Science", "History"],
            "Focused": ["Business", "Technology", "Productivity"],
            "Mysterious": ["Mystery", "Crime", "Suspense"],
            "Energetic": ["Adventure", "Thriller", "Science Fiction"],
            "Creative": ["Art", "Design", "Creativity"]
        }
        genre = random.choice(mood_genres[mood])
        response = requests.get(GOOGLE_BOOKS_API_URL, params={'q': f'subject:{genre}', 'maxResults': 5})
        if response.status_code == 200:
            data = response.json()
            return [extract_book_info(book) for book in data.get('items', [])]
        else:
            return None


    mood_books = recommend_books_by_mood(mood)
    if mood_books:
        for book in mood_books[:3]:
            st.markdown(f"""
                <div style="background-color: #f9f9f9; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                    <h4 style="color: #ff6f61;">{book['title']}</h4>
                    <p><em>by {book['authors']}</em></p>
                    <div style="display: flex; align-items: center;">
                        <img src="{book['imageLinks']}" alt="Book cover" style="border-radius: 10px; width: 80px; margin-right: 15px;" />
                        <div>
                            <p style="color: #555;">{book['description'][:150]}...</p>
                            <a href="{book['infoLink']}" target="_blank" style="color: #1f77b4; text-decoration: none;">More Info</a>
                        </div>
                    </div>
                </div>
            """, unsafe_allow_html=True)
    else:
        st.write("No mood-based recommendations found. Try another mood!")

st.subheader("🧠 Adaptive Quiz")
questions = [
    {"question": "What is the capital of France?", "options": ["Paris", "London", "Berlin", "Madrid"],
     "answer": "Paris"},
    {"question": "Who wrote '1984'?", "options": ["George Orwell", "J.K. Rowling", "Ernest Hemingway", "Mark Twain"],
     "answer": "George Orwell"},
    {"question": "What is the largest planet in the Solar System?", "options": ["Jupiter", "Mars", "Earth", "Saturn"],
     "answer": "Jupiter"}
]

quiz_question = random.choice(questions)
st.write(f"**{quiz_question['question']}**")
selected_option = st.radio("Choose your answer:", quiz_question['options'])

if st.button("Submit Answer"):
    if selected_option == quiz_question['answer']:
        st.success("Correct! 🎉")
    else:
        st.error(f"Wrong! The correct answer is {quiz_question['answer']}.")

st.subheader("🗂️ Study Planner")
if 'tasks' not in st.session_state:
    st.session_state['tasks'] = []

task = st.text_input("Add a new task to your to-do list:")
if st.button("Add Task"):
    st.session_state['tasks'].append(task)
    st.write(f"Added task: {task}")

if st.session_state['tasks']:
    st.subheader("Your Tasks")
    for i, task in enumerate(st.session_state['tasks']):
        st.write(f"{i + 1}. {task}")
        if st.button(f"Remove Task {i + 1}", key=f"remove_task_{i}"):
            st.session_state['tasks'].pop(i)

