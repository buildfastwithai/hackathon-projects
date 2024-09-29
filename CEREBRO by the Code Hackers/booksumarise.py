import streamlit as st
import requests
import random
from PIL import Image
from io import BytesIO
import plotly.graph_objects as go
import datetime

GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes"

# Set page configuration
st.set_page_config(layout="wide")
st.title('📚 CEREBRO - Your Ultimate Learning Companion')

# Cool CSS for visuals and animations
st.markdown(
    """
    <style>
    /* Background and Global Style */
    .stApp {
        background: linear-gradient(to right, #000428, #004e92);
        color: white;
        font-family: 'Arial', sans-serif;
    }

    h1, h2, h3, h4, h5, h6 {
        color: #ff6f61;
        text-align: center;
    }

    /* Title Styling */
    .title {
        color: #1f77b4;
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 10px;
    }

    /* Cool Button */
    .cool-button {
        background-color: #1f77b4;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
        font-weight: bold;
        margin: 10px;
    }
    .cool-button:hover {
        background-color: #ff6f61;
        transform: scale(1.05);
    }

    /* Book Information Card */
    .book-card {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 25px;
        transition: all 0.3s ease-in-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    .book-card:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
    }

    /* Progress Bar Section */
    .progress-section {
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        padding: 10px;
    }

    /* Mood Section */
    .mood-section {
        border: 2px solid #ff6f61;
        padding: 20px;
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.1);
        text-align: center;
        margin-top: 20px;
        transition: all 0.3s ease;
    }

    /* Quiz Card Styling */
    .quiz-card {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 20px;
        text-align: center;
        color: #ff6f61;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        margin-bottom: 20px;
    }

    /* Expander Styling */
    .expander {
        border-radius: 10px;
        border: 2px solid #1f77b4;
    }
    </style>
    """, unsafe_allow_html=True
)

# Sidebar with mood selection and book progress
st.sidebar.header("📊 Personalized Experience")
mood = st.sidebar.selectbox("How are you feeling today?",
                            ["Happy", "Curious", "Focused", "Mysterious", "Energetic", "Creative"])

st.sidebar.subheader("📖 Reading Challenge")
books_to_read = st.sidebar.number_input("Set your learning goal (books per month):", min_value=1, max_value=50, value=5)
progress = st.sidebar.slider("Update your progress:", 0, books_to_read, 0)
progress_percentage = (progress / books_to_read) * 100

# Circular progress bar
fig = go.Figure(go.Indicator(
    mode="gauge+number",
    value=progress,
    title={'text': "Reading Progress", 'font': {'color': "white"}},
    gauge={'axis': {'range': [0, books_to_read], 'tickwidth': 2, 'tickcolor': "white"},
           'bar': {'color': "#ff6f61"},
           'bgcolor': "black",
           'borderwidth': 2,
           'bordercolor': "white",
           'steps': [{'range': [0, books_to_read], 'color': "#1f77b4"}]},
    domain={'x': [0, 1], 'y': [0, 1]}
))
st.sidebar.plotly_chart(fig, use_container_width=True)

# Book Finder Section
col1, col2 = st.columns([2, 1])
with col1:
    st.subheader("🔍 Book Finder")
    input_text = st.text_input("Search for a book or subject:")


    def fetch_book_data(query):
        response = requests.get(GOOGLE_BOOKS_API_URL, params={'q': query})
        if response.status_code == 200:
            data = response.json()
            return data['items'] if 'items' in data else None
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
            st.write(f"**By:** {book['authors']}")

            if book['imageLinks']:
                try:
                    response = requests.get(book['imageLinks'])
                    if response.status_code == 200:
                        img = Image.open(BytesIO(response.content))
                        st.image(img, width=200)
                except Exception as e:
                    st.write(f"Image error: {e}")
            st.write(f"**Published:** {book['publishedDate']}")
            st.write(f"**Categories:** {book['categories']}")
            st.write(f"**Pages:** {book['pageCount']}")
            st.write(f"**Rating:** {book['averageRating']}/5")

            with st.expander("📖 Book Summary"):
                st.write(book['description'])

            st.markdown(f"[More Info]({book['infoLink']})")

# Mood-based book recommendations
with col2:
    st.subheader(f"📚 Books for Your {mood} Mood")


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
        return None


    mood_books = recommend_books_by_mood(mood)
    if mood_books:
        for book in mood_books[:3]:
            st.markdown(f"""
                <div class="book-card">
                    <h4 style="color: #ff6f61;">{book['title']}</h4>
                    <p class="book-author">by {book['authors']}</p>
                    <img src="{book['imageLinks']}" alt="Book cover" style="width: 80px; float:left; margin-right: 15px; border-radius: 10px;" />
                    <p style="color: #ddd;">{book['description'][:100]}...</p>
                    <a href="{book['infoLink']}" style="color: #1f77b4; text-decoration: none;">More Info</a>
                    <div style="clear: both;"></div>
                </div>
            """, unsafe_allow_html=True)
    else:
        st.write("No recommendations found. Try another mood!")
# Adaptive quiz related to the book search
st.subheader("🧠 Book-Related Quiz")

if input_text and books:
    # Generate questions from book metadata
    book_question = {
        "question": f"Who is the author of '{book['title']}'?",
        "options": [book['authors'], "Unknown", "J.K. Rowling", "George Orwell"],
        "answer": book['authors']
    }

    publication_question = {
        "question": f"When was '{book['title']}' published?",
        "options": [book['publishedDate'], "2020", "2010", "Unknown"],
        "answer": book['publishedDate']
    }

    # Select a random question to display
    quiz_question = random.choice([book_question, publication_question])
    st.write(f"**{quiz_question['question']}**")
    selected_option = st.radio("Choose your answer:", quiz_question['options'])

    if st.button("Submit Book Quiz Answer"):
        if selected_option == quiz_question['answer']:
            st.success("Correct! 🎉")
        else:
            st.error(f"Wrong! The correct answer is {quiz_question['answer']}.")

# Study planner with tasks
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

# AI-powered study time suggestions
st.subheader("📅 AI-Powered Study Time Suggestions")


def suggest_study_time():
    current_hour = datetime.datetime.now().hour
    return "Morning" if current_hour >= 18 else "Afternoon"


suggested_time = suggest_study_time()
st.write(
    f"Based on your current schedule, it's best to study in the **{suggested_time}** tomorrow for maximum productivity!")
