import streamlit as st
import os
import time
import pickle
import webbrowser
import speech_recognition as sr
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.document_loaders import PyPDFLoader
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain.prompts import ChatPromptTemplate
from deep_translator import GoogleTranslator
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from PIL import Image
import sqlite3
import base64
import PyPDF2
from langchain.docstore.document import Document

# Load environment variables
load_dotenv()

# Set up NVIDIA API key
os.environ['NVIDIA_API_KEY'] = os.getenv("NVIDIA_API_KEY")

# Initialize translator
translator = GoogleTranslator(source='auto', target='en')

def image_to_base64(img):
    """Convert a PIL Image to base64 string."""
    import io
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode()

def vector_embedding(subject, group, book):
    # Adjust the naming to match exactly how files are named in the directory
    pickle_path = f"./{subject}_{group}_{book}_vectors.pkl"  # Note the use of spaces and exact capitalization

    # Check if the pickle file exists
    if os.path.exists(pickle_path):
        with open(pickle_path, "rb") as f:
            st.session_state.vectors = pickle.load(f)
        st.success(f"Loaded existing vector store for {book} in {subject}. You can now ask questions!")
    else:
        with st.spinner(f"Processing {book} in {subject}, please wait..."):
            file_path = f"./{subject}/{book}.pdf"
            st.session_state.loader = PyPDFLoader(file_path)
            st.session_state.docs = st.session_state.loader.load()
            
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
            final_documents = text_splitter.split_documents(st.session_state.docs)

            embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
            st.session_state.vectors = FAISS.from_documents(final_documents, embeddings)

            with open(pickle_path, "wb") as f:
                pickle.dump(st.session_state.vectors, f)

        st.success(f"Vector store for {book} in {subject} is now processed and saved. You can now ask questions!")

def load_topper_embeddings():
    with open("topper_answers_vectors.pkl", "rb") as f:
        data = pickle.load(f)
    
    if isinstance(data, FAISS):
        return data
    elif isinstance(data, np.ndarray):
        return data
    elif isinstance(data, list) and all(isinstance(item, np.ndarray) for item in data):
        return np.array(data)
    else:
        raise ValueError("Unsupported format for topper_answers_vectors.pkl")

def get_embedding(text):
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    return embeddings.embed_query(text)

def calculate_similarity(user_embedding, topper_embeddings):
    if isinstance(topper_embeddings, FAISS):
        similar_docs = topper_embeddings.similarity_search_by_vector(user_embedding, k=1)
        if similar_docs:
            # Assuming the similarity is stored in the metadata
            return similar_docs[0].metadata.get('similarity', 0)
        return 0
    elif isinstance(topper_embeddings, np.ndarray):
        if topper_embeddings.ndim == 1:
            topper_embeddings = topper_embeddings.reshape(1, -1)
        return cosine_similarity([user_embedding], topper_embeddings)[0][0]
    else:
        raise ValueError("Unsupported format for topper_embeddings")

def get_structured_feedback_and_improved_answer(similarity_score, user_answer, question, topper_embeddings):
    llm = ChatNVIDIA(model="meta/llama3-70b-instruct")
    
    # Retrieve the most similar topper's answer
    if isinstance(topper_embeddings, FAISS):
        user_embedding = get_embedding(user_answer)
        similar_docs = topper_embeddings.similarity_search_by_vector(user_embedding, k=1)
        if similar_docs:
            topper_answer = similar_docs[0].page_content
        else:
            topper_answer = "No similar topper answer found."
    else:
        topper_answer = "Unable to retrieve topper's answer due to incompatible data format."

    prompt = ChatPromptTemplate.from_template("""
    You are an AI tutor tasked with providing structured feedback on a student's answer and generating an improved answer. 

    Question: {question}
    Student's Answer: {user_answer}
    Similarity Score to Top Performers: {similarity_score}
    Most Similar Topper's Answer: {topper_answer}

    Please provide:
    1. Structured feedback to help the student improve their answer. Include:
       a) Strengths: Aspects of the answer that are good and should be maintained.
       b) Weaknesses: Areas where the answer falls short compared to top performers.
       c) Areas to Improve: Specific suggestions on how to enhance the response.
    2. An improved answer that combines the strengths of the student's answer with the insights from the topper's answer.

    Your response:
    Feedback:
    Strengths:
    - [List strengths here]

    Weaknesses:
    - [List weaknesses here]

    Areas to Improve:
    - [List specific improvements here]

    Improved Answer:
    [Your improved answer here]
    """)

    response = llm.invoke(prompt.format(
        similarity_score=similarity_score,
        question=question,
        user_answer=user_answer,
        topper_answer=topper_answer
    ))

    return response.content

def process_pdf(file):
    pdf_reader = PyPDF2.PdfReader(file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def topper_evaluation():
    st.title("Topper's Evaluation")

    st.markdown(
        """
        <style>
            .stSidebar .stButton > button {
                background-color: #E83E8C !important;
                color: white;
            }
            .stButton > button {
                background-color: #00FF00 !important;
                color: black;
            }
            h3 {
                color: #FF0000;
            }
        </style>
        """,
        unsafe_allow_html=True,
    )

    # Back to chatbot button
    if st.sidebar.button("⏮ Back to Chatbot"):
        st.session_state.page = "main_chatbot"
        st.rerun()

    try:
        # Load topper embeddings
        topper_embeddings = load_topper_embeddings()
    except Exception as e:
        st.error(f"Error loading topper embeddings: {str(e)}")
        return

    # Question and answer input
    question = st.text_area("Enter the question:")
    answer = st.text_area("Enter your answer:")

    # File upload option
    uploaded_file = st.file_uploader("Or upload a PDF file with your answers", type="pdf")

    if st.button("Evaluate"):
        if uploaded_file is not None:
            # Process the uploaded PDF
            answer = process_pdf(uploaded_file)
        
        if question and answer:
            try:
                # Get embedding for user's answer
                user_embedding = get_embedding(answer)

                # Calculate similarity
                similarity_score = calculate_similarity(user_embedding, topper_embeddings)

                # Get structured feedback and improved answer
                feedback_and_improved_answer = get_structured_feedback_and_improved_answer(similarity_score, answer, question, topper_embeddings)

                # Display results
                st.write(f"Similarity Score: {similarity_score:.2f}")
                st.markdown("<h3 style='color: #FF0000;'>Structured Feedback and Improved Answer:</h3>", unsafe_allow_html=True)
                
                # Split the feedback and improved answer
                feedback, improved_answer = feedback_and_improved_answer.split("Improved Answer:", 1)
                
                # Display feedback with colored headings
                feedback = feedback.replace("Strengths:", "<h3 style='color: #FF0000;'>Strengths:</h3>")
                feedback = feedback.replace("Weaknesses:", "<h3 style='color: #FF0000;'>Weaknesses:</h3>")
                feedback = feedback.replace("Areas to Improve:", "<h3 style='color: #FF0000;'>Areas to Improve:</h3>")
                st.markdown(feedback, unsafe_allow_html=True)
                
                # Display improved answer with colored heading
                st.markdown("<h3 style='color: #FF0000;'>Improved Answer:</h3>", unsafe_allow_html=True)
                st.write(improved_answer)
                
            except Exception as e:
                st.error(f"An error occurred during evaluation: {str(e)}")
        else:
            st.error("Please provide both a question and an answer, or upload a PDF file.")
  
def quiz_generator():
    webbrowser.open("http://127.0.0.1:5500/index.html")
def mindmap_generator():
    webbrowser.open("http://127.0.0.1:5000/")

def lesson_plan():
    webbrowser.open("http://127.0.0.1:8000")

def Apna_Teacher():
    st.title("Apna Teacher Feature")

    st.markdown(
        """
        <style>
            .stSidebar .stButton > button {
                background-color: #E83E8C;
                color: white;
            }
        </style>
        """,
        unsafe_allow_html=True,
    )

    # Back to chatbot button
    if st.sidebar.button("⏮ Back to Chatbot"):
        st.session_state.page = "main_chatbot"
        st.rerun()

    # Feature Explained
    st.header("Feature Explained")
    feature_explained_image = Image.open("./apna_teacher_mindmap.png")
    st.image(feature_explained_image, use_column_width=True)

    # How It Will Look
    st.header("How It Will Look")
    how_it_looks_image = Image.open("./APNA-TEACHER.jpg")
    st.image(how_it_looks_image, use_column_width=True)

    # Inspiration Taken From
    st.header("Inspiration Taken From")
    inspiration_image = Image.open("./ap_3.png")
    st.image(inspiration_image, use_column_width=True)

    # Heavily Depend On
    st.header("Heavily Depend On")
    dependency_image = Image.open("./ap_4.png")
    st.image(dependency_image, use_column_width=True)

# Assuming you have a folder named 'career_books' with your PDF files
CAREER_BOOKS_FOLDER = './CAREER_BOOKS' 
EMBEDDINGS_FOLDER = './career_embeddings'

def process_career_books():
    if not os.path.exists(EMBEDDINGS_FOLDER):
        os.makedirs(EMBEDDINGS_FOLDER)

    for book_file in os.listdir(CAREER_BOOKS_FOLDER):
        if book_file.endswith('.pdf'):
            book_name = book_file[:-4]
            pickle_path = os.path.join(EMBEDDINGS_FOLDER, f"{book_name}_vectors.pkl")

            if not os.path.exists(pickle_path):
                st.write(f"Processing {book_file}...")
                loader = PyPDFLoader(os.path.join(CAREER_BOOKS_FOLDER, book_file))
                documents = loader.load()

                text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
                splits = text_splitter.split_documents(documents)

                embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
                vectorstore = FAISS.from_documents(splits, embeddings)

                with open(pickle_path, "wb") as f:
                    pickle.dump(vectorstore, f)

                st.write(f"Processed and saved embeddings for {book_file}")
            else:
                st.write(f"Embeddings already exist for {book_file}")

def load_career_embeddings():
    vectorstores = []
    for pickle_file in os.listdir(EMBEDDINGS_FOLDER):
        if pickle_file.endswith('_vectors.pkl'):
            with open(os.path.join(EMBEDDINGS_FOLDER, pickle_file), "rb") as f:
                vectorstores.append(pickle.load(f))
    return vectorstores

def apply_career_chat_styling():
    st.markdown("""
    <style>
    .career-chat-container {
        border: 1px solid #4CAF50;
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 10px;
    }
    .career-chat-user {
        background-color: #E8F5E9;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
    }
    .career-chat-advisor {
        background-color: #F1F8E9;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
    }
    .career-chat-heading {
        color: #2E7D32;
        font-weight: bold;
        margin-bottom: 5px;
    }
    .career-chat-text {
        color: #333333;
    }
    .career-chat-list {
        margin-left: 20px;
        list-style-type: disc;
    }
    </style>
    """, unsafe_allow_html=True)

def display_career_chat_message(is_user, text):
    class_name = "career-chat-user" if is_user else "career-chat-advisor"
    heading = "You" if is_user else "Career Advisor"
    
    st.markdown(f"""
    <div class="career-chat-container {class_name}">
        <div class="career-chat-heading">{heading}:</div>
        <div class="career-chat-text">{text}</div>
    </div>
    """, unsafe_allow_html=True)

# Update your career_counseling_chat function to use these new styling functions
def career_counseling_chat():
    st.title("Career Counseling Chat")
    apply_career_chat_styling()

    # Process career books if not already done
    #if st.button("Process Career Books"):
        #process_career_books()

    # Load embeddings
    vectorstores = load_career_embeddings()

    if not vectorstores:
        st.error("No career book embeddings found. Please process the career books first.")
        return

    # Chat interface
    if "career_chat_history" not in st.session_state:
        st.session_state.career_chat_history = []

    for message in st.session_state.career_chat_history:
        display_career_chat_message(message['is_user'], message['text'])

    user_input = st.text_input("Ask a career-related question:")

    if st.button("Send"):
        if user_input:
            st.session_state.career_chat_history.append({"is_user": True, "text": user_input})

            llm = ChatNVIDIA(model="meta/llama3-70b-instruct")

            prompt = ChatPromptTemplate.from_template("""
            You are a knowledgeable and empathetic career counselor. Use the following context to answer the user's question about their career path. 
            Provide a thoughtful, encouraging, and human-like response that goes beyond simply quoting the source material.
            Consider the user's perspective and offer practical advice when appropriate.
        
            Structure your response in the following format:
        
            1. Career Interest Identification: (Brief explanation)
            2. Eligibility Check: (Brief explanation)
            3. Educational Requirements & Marks: (Brief explanation)
            4. Key Skills and Competencies Development: (Brief explanation)
            5. Relevant Certifications & Training: (Brief explanation)
            6. Practical Experience & Internships: (Brief explanation)
            7. Entrance Exams & Tests: (Brief explanation)
            8. Professional Applications & Networking Opportunities: (Brief explanation)
            9. Career-Specific Selection Process: (Brief explanation)
            10. Continuous Learning & Growth: (Brief explanation)
        
            Ensure each point is relevant to the user's specific career question. If a point is not applicable, you may skip it or adapt it as necessary.
        
            Context:
            {context}
        
            User's question: {question}
        
            Career Advisor's response:
            """)

            qa_chain = RetrievalQA.from_chain_type(
                llm=llm,
                chain_type="stuff",
                retriever=vectorstores[0].as_retriever(),  # Using the first vectorstore for simplicity
                return_source_documents=True,
                chain_type_kwargs={"prompt": prompt}
            )

            with st.spinner("Thinking..."):
                response = qa_chain({"query": user_input})

            st.session_state.career_chat_history.append({"is_user": False, "text": response['result']})

            st.rerun()

def career_hub():
    st.title("Career Hub")

    # Add the image right after the title
    image_path = "./various_careers.png"  # Adjust this path as needed
    st.image(image_path, use_column_width=True)

    st.markdown(
        """
        <style>
            .stSidebar .stButton > button {
                background-color: #E83E8C;
                color: white;
            }
        </style>
        """,
        unsafe_allow_html=True,
    )

    # Back to chatbot button
    if st.sidebar.button("⏮ Back to Chatbot"):
        st.session_state.page = "main_chatbot"
        st.rerun()
    
    career_counseling_chat()

def image_to_base64(image):
    from io import BytesIO
    import base64
    buffered = BytesIO()
    # Convert the image to RGB mode
    #image = image.convert("RGB")
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()

# Function to create the education_posts table in the database
def create_education_posts_table():
    conn = sqlite3.connect("education_chatbot.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS education_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_name TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            image_path TEXT,
            date TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

# Function to save an education post to the database
def save_education_post(user_name, role, content, image_path):
    conn = sqlite3.connect("education_chatbot.db")
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO education_posts (user_name, role, content, image_path, date)
        VALUES (?, ?, ?, ?, DATETIME('now'))
    """, (user_name, role, content, image_path))
    conn.commit()
    conn.close()

# Function to get all education posts from the database
def get_all_education_posts():
    conn = sqlite3.connect("education_chatbot.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM education_posts")
    education_posts = cursor.fetchall()
    conn.close()
    return education_posts

# Create the education_posts table in the database
create_education_posts_table()

# Updated discussion forum (Baatcheet Bhavan) function that includes education posts
def discussion_forum():
    st.title("Education Posts")

    st.markdown(
        """
        <style>
            .stSidebar .stButton > button {
                background-color: #E83E8C;
                color: white;
            }
            .like-button {
                background-color: #4CAF50;
                color: white;
                padding: 5px 10px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 14px;
                margin: 2px;
                cursor: pointer;
                border-radius: 5px;
            }
            .dislike-button {
                background-color: #FF4500;
                color: white;
                padding: 5px 10px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 14px;
                margin: 2px;
                cursor: pointer;
                border-radius: 5px;
            }
        </style>
        """,
        unsafe_allow_html=True,
    )

    # Add custom CSS for Flexbox layout
    st.markdown(
        """
        <style>
            .flex-container {
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                justify-content: space-between;
                margin-bottom: 20px;
            }
            .image-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .content-container {
                flex: 3;
                padding-left: 20px;
            }
            .events-container {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-bottom: 20px;
            }
            .event-card {
                flex: 1;
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 10px;
                margin: 10px;
            }
            .event-heading {
                color: #90EE90;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .book-seat-button {
                background-color: #4CAF50;
                color: white;
                padding: 5px 10px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 14px;
                margin: 2px;
                cursor: pointer;
                border-radius: 5px;
           
        </style>
        """,
        unsafe_allow_html=True
    )

    # Back to chatbot button
    if st.sidebar.button("⏮ Back to Chatbot"):
        st.session_state.page = "main_chatbot"
        st.rerun()

    # Define a list of pre-uploaded articles
    pre_uploaded_articles = [
        {
            "title": "Exploring the World of Quantum Computing",
            "content": "Quantum computing is a rapidly evolving field that holds the promise of solving complex problems more efficiently than classical computers. In this post, we delve into the basics of quantum computing and its potential applications.",
            "image_path": "./baatcheet_bhavan_images/image-1.jpg",
            "user_name": "Dr. John Smith",
            "role": "Teacher",
            "date": "2023-07-25",
        },
        {
            "title": "The Future of AI in Healthcare",
            "content": "Artificial intelligence is revolutionizing the healthcare industry by improving diagnostics, personalized treatment, and patient outcomes. This article explores current AI applications in healthcare and future possibilities.",
            "image_path": "./baatcheet_bhavan_images/image-2.jpg",
            "user_name": "Dr. Emily Johnson",
            "role": "Medical Researcher",
            "date": "2023-09-10",
        },
        {
            "title": "Sustainable Energy: Harnessing Solar Power",
            "content": "Solar energy is becoming a key player in the transition to sustainable energy. In this post, we explore how advancements in solar panel technology are increasing efficiency and accessibility worldwide.",
            "image_path": "./baatcheet_bhavan_images/image-3.jpg",
            "user_name": "Alex Carter",
            "role": "Environmental Scientist",
            "date": "2023-06-15",
        }
    ]
    
    # Display pre-uploaded articles
    for i, article in enumerate(pre_uploaded_articles):
        container = st.container()
        container.markdown(
            f"""
            <div class="flex-container">
                <div class="image-container">
                    {f'<img src="data:image/jpeg;base64,{image_to_base64(Image.open(article["image_path"]))}" width="350">' if article["image_path"] else ''}
                    <!-- Rest of your image and button code -->
                </div>
                <div class="content-container">
                    <h3>{article["title"]}</h3>
                    <p>By {article["user_name"]}, {article["role"]}</p>
                    <p>Posted: {article["date"]}</p>
                    <p>{article["content"]}</p>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        # Display likes, dislikes, and comments
        st.write(f"Likes: {article.get('likes', 250)}")
        st.write(f"Dislikes: {article.get('dislikes', 17)}")
        if "comments" in article:
            st.write("Comments:")
            for comment in article["comments"]:
                st.write(f"- {comment}")

        st.write("---")

    # Display education posts from the database
    education_posts = get_all_education_posts()
    for i, education_post in enumerate(education_posts):
        education_post = {
            "id": education_post[0],
            "user_name": education_post[1],
            "role": education_post[2],
            "content": education_post[3],
            "image_path": education_post[4],
            "date": education_post[5],
        }

        container = st.container()
        container.markdown(
            f"""
            <div class="flex-container">
                <div class="image-container">
                    {f'<img src="data:image/jpeg;base64,{image_to_base64(Image.open(education_post["image_path"]))}" width="350">' if education_post["image_path"] else ''}
                    <div style="margin-top: 10px;">
                        <button class="like-button">Like</button>
                        <button class="dislike-button">Dislike</button>
                        <button>Comment</button>
                    </div>
                </div>
                <div class="content-container">
                    <p>By {education_post["user_name"]}, {education_post["role"]}</p>
                    <p>Posted: {education_post["date"]}</p>
                    <p>{education_post["content"]}</p>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )
        if st.button(f"🗑:{i+1}"):
            # Implement delete_education_post(education_post["id"]) function here
            st.rerun()

    st.write("---")

    # Allow users to upload their own education-related posts
    with st.form("user_post_form"):
        user_name = st.text_input("User Name")
        role = st.selectbox("Role", ["Teacher", "Student"])
        content = st.text_area("Post Content", max_chars=500)
        image_file = st.file_uploader("Upload Image", type=["jpg", "jpeg", "png"])
        submit_button = st.form_submit_button("Upload Post")

        if submit_button:
            if user_name and role and content:
                image_path = None
                if image_file:
                    os.makedirs("uploads", exist_ok=True)
                    image_path = f"uploads/{image_file.name}"
                    with open(image_path, "wb") as f:
                        f.write(image_file.getbuffer())
                save_education_post(user_name, role, content, image_path)
                st.success("Post saved successfully!")
                st.rerun()
            else:
                st.error("Please fill in all the required fields.")

    # Create two columns for past and upcoming events
    col1, col2 = st.columns(2)

    # Past events in the first column
    with col1:
        st.markdown("<div class='event-card'>", unsafe_allow_html=True)
        st.markdown("<h3 class='event-heading'>Past Events</h3>", unsafe_allow_html=True)
        st.markdown("<p><b>Event Name:</b> Online Workshop on Advanced Mathematics</p>", unsafe_allow_html=True)
        st.markdown("<p><b>Venue:</b> Virtual Classroom</p>", unsafe_allow_html=True)
        st.markdown("<p><b>Timing:</b> Last Month</p>", unsafe_allow_html=True)
        st.markdown("<p><b>Discussion:</b> Solving Complex Problems Using Calculus</p>", unsafe_allow_html=True)
        st.markdown("<button class='book-seat-button'>View Recording</button>", unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)
    
    # Upcoming events in the second column
    with col2:
        st.markdown("<div class='event-card'>", unsafe_allow_html=True)
        st.markdown("<h3 class='event-heading'>Upcoming Events</h3>", unsafe_allow_html=True)
        st.markdown("<p><b>Event Name:</b> Seminar on Effective Teaching Methods</p>", unsafe_allow_html=True)
        st.markdown("<p><b>Venue:</b> High School Auditorium</p>", unsafe_allow_html=True)
        st.markdown("<p><b>Timing:</b> Next Week</p>", unsafe_allow_html=True)
        st.markdown("<p><b>Discussion:</b> Strategies for Engaging Students in Online and Offline Classrooms</p>", unsafe_allow_html=True)
        st.markdown("<button class='book-seat-button'>Book Your Seat</button>", unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)

# Main chatbot interface
def main_edu_chatbot_interface():
    col1, col2 = st.columns([0.6, 3])  # Create two columns

    with col1:  # This is the column for the image
        st.image("./Talaash.png", width=100)  

    with col2:  # This is the column for the title
        st.title("Talaash AI 🎓")

    # Add CSS for chat interface and buttons (similar to medical chatbot)
    st.markdown(
        """
        <style>
            .chat-message {
                padding: 10px 15px;
                border-radius: 18px;
                margin-bottom: 10px;
                display: inline-block;
                max-width: 70%;
                word-wrap: break-word;
                font-weight: bold;
            }
            .bot-message {
                background-color: #d3d3d3;
                color: black;
                float: left;
                clear: both;
            }
            .user-message {
                background-color: #00E5FF;
                color: black;
                float: right;
                clear: both;
            }
            .chat-container::after {
                content: "";
                display: table;
                clear: both;
            }
            .response-buttons {
                display: flex;
                justify-content: flex-start;
                gap: 5px;
                margin-top: 2px;
            }
            .response-button {
                border: none;
                background: none;
                cursor: pointer;
                font-size: 18px;
                padding: 2px;
                opacity: 0.7;
                transition: opacity 0.3s;
            }
            .response-button:hover {
                opacity: 1;
            }
            .stImage {
             margin-right: -10px;  /* Reduce space to the right of the image */
             margin-top: 18px;  /* Fine-tune vertical alignment */
           }
        </style>
        """,
        unsafe_allow_html=True
    )

    # Add custom CSS for the Edu Dashboard heading
    st.sidebar.markdown(
        """
        <style>
            .edu-dashboard {
                border: 4px solid #007BFF;
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                height: 50px;
                width: 100%;
                box-sizing: border-box;
            }
        </style>
        <div class="edu-dashboard">
            <h6 style='text-align: center; font-size: 22px; margin: 0; padding-top: 15px;'>Edu Dashboard</h6>
        </div>
        """,
        unsafe_allow_html=True
    )

    # Define the CSS style for the buttons
    button_style = """
    <style>
    div.stButton > button:first-child {
        background-color: #008000;
    }
    </style>
    """
    
    # Display the CSS style
    st.markdown(button_style, unsafe_allow_html=True)

    # Add buttons to the sidebar
    if st.sidebar.button("Topper's Evaluation🏆"):
        st.session_state.page = "topper_evaluation"
        st.rerun()

    if st.sidebar.button("Quiz Generator❓📝"):
        st.session_state.page = "quiz_generator"
        st.rerun()

    if st.sidebar.button("Mindmap Generator🧠"):
        mindmap_generator()

    if st.sidebar.button("Career Hub🚀"):
        st.session_state.page = "career_hub"
        st.rerun()

    if st.sidebar.button("Baatcheet Bhavan 💬"):
        st.session_state.page = "discussion_forum"
        st.rerun()
        
    if st.sidebar.button("Lesson Plan🗓"):
        lesson_plan()

    if st.sidebar.button("Apna Teacher👩‍🏫"):
        st.session_state.page = "Apna_Teacher"
        st.rerun()

    # Define books structure (keep as is)
    books_by_level = {
        "FOUNDATION": {
            "Books": ["BUSINESS ENVIRONMENT AND LAW", "BUSINESS MANAGEMENT ETHICS & ENTREPRENEURSHIP", "FUNDAMENTALS OF ACCOUNTING AND AUDITING", "BUSINESS ECONOMICS"]
        },
        "INTER": {
            "GRP-1": ["Tax Laws", "Setting up of Business Entities and Closure", "Company_Law", "Jurisprudence, Interpretation and General Laws"],
            "GRP-2": ["FINANCIAL_AND_STRATEGIC_MANAGEMENT", "Economic, Business and Commercial Laws", "Securities Laws and Capital Markets", "Corporate and Management Accounting"]
        },
        "FINALS": {
            "GRP-1": ["Advanced Tax Laws", "Drafting, Pleadings and Appearances", "Governance, Risk Management, Compliances and Ethics"],
            "GRP-2": ["(Part 2) Corporate Restructuring, Insolvency, Liquidation & Winding –up", "Resolution of Corporate Disputes, Non-Compliances and Remedies", "(Part 1) Corporate Restructuring, Insolvency, Liquidation & Winding –up", "Secretarial Audit, Compliance Management and Due Diligence"],
            "GRP-3": ["Corporate Funding and Listings in Stock Exchanges", "Multidisciplinary Case Studies"],
            "ELECTIVES": ["Insolvency-Law and Practice", "Banking Law & Practice", "Valuations & Business Modelling", "Labour Laws & Practice", "Direct Tax Law & Practice", "Forensic Audit", "Intellectual Property Rights- Laws and Practice", "Insurance Law & Practice"]
        }
    }

    # Document selection and processing
    exam_level = st.selectbox("Select Exam Level", ["FOUNDATION", "INTER", "FINALS"])
    if exam_level == "INTER":
        group = st.selectbox("Select Group", ["GRP-1", "GRP-2"])
    elif exam_level == "FINALS":
        group = st.selectbox("Select Group", ["GRP-1", "GRP-2", "GRP-3", "ELECTIVES"])
    else:
        group = "Books"

    if group == "Books":
        books = books_by_level[exam_level]["Books"]
    else:
        books = books_by_level[exam_level][group]

    book = st.selectbox(f"Select Book for {exam_level} - {group}", books)

    # Initialize chat history
    if "chat_history" not in st.session_state:
        st.session_state["chat_history"] = []
    
    if not st.session_state["chat_history"]:
        st.session_state["chat_history"].append(("bot", "Hi, I'm EduAssist AI. How can I help you with your studies today?"))
    
    # Display chat history with images for both bot and user
    st.markdown('<div class="chat-container">', unsafe_allow_html=True)
    for sender, message in st.session_state["chat_history"]:
        if sender == "bot":
            st.markdown(f""" <div class='chat-message bot-message'> <img src='data:image/png;base64,{image_to_base64(Image.open("./BOT.png"))}' width='45' style='vertical-align: middle; margin-right: 10px;'/> {message} </div>""", unsafe_allow_html=True)
        else:
            st.markdown(f""" <div class='chat-message user-message'> <img src='{os.path.join(os.path.dirname(__file__), "STUDENT.png")}' width='60' style='vertical-align: middle; margin-right: 10px;'/> {message} </div>""", unsafe_allow_html=True)
    
    # User input with an image
    col1, col2 = st.columns([0.7, 8], gap="small")
    with col1:
        st.image(os.path.join(os.path.dirname(__file__), "STUDENT.png"), width=50)
    with col2:
        user_input = st.text_input("Ask me anything about your studies:", key="user_input", value="")
    
    if st.button("Process Documents"):
        vector_embedding(subject=exam_level, group=group, book=book)

    if st.button("▶"):
        if user_input:
            st.session_state["chat_history"].append(("user", user_input))
    
            # Process the question with vector store and LLM
            if "vectors" in st.session_state:
                llm = ChatNVIDIA(model="meta/llama3-70b-instruct")
    
                prompt = ChatPromptTemplate.from_template("""
                    Answer the question based on the provided context. Provide an accurate and helpful response.
                    <context>
                    {context}
                    </context>
                    Question: {question}
                """)
    
                qa_chain = RetrievalQA.from_chain_type(
                    llm=llm,
                    chain_type="stuff",
                    retriever=st.session_state.vectors.as_retriever(),
                    return_source_documents=True,
                    chain_type_kwargs={"prompt": prompt}
                )
    
                with st.spinner("Thinking..."):
                    # Corrected this line
                    response = qa_chain({"query": user_input})
                    
                st.session_state["chat_history"].append(("bot", response['result']))
    
                # Generate follow-up questions
                follow_up_prompt = ChatPromptTemplate.from_template("""
                    Based on the following conversation and answer, generate two relevant follow-up questions:
                    User question: {user_question}
                    Bot answer: {bot_answer}
    
                    Follow-up questions:
                    1.
                    2.
                """)
    
                follow_up_response = llm.invoke(follow_up_prompt.format(
                    user_question=user_input,
                    bot_answer=response['result']
                ))
    
                follow_up_questions = follow_up_response.content.strip().split('\n')
    
                st.session_state["chat_history"].append(("bot", "Here are some follow-up questions you might find helpful:"))
                for question in follow_up_questions:
                    if question.startswith(('1.', '2.')):
                        st.session_state["chat_history"].append(("bot", question))
            else:
                st.error("Please process the documents first.")

def main():
    # Check the current page and display the corresponding interface
    if st.session_state.get("page") == "topper_evaluation":
        topper_evaluation()
    elif st.session_state.get("page") == "Apna_Teacher":
        Apna_Teacher()
    elif st.session_state.get("page") == "quiz_generator":
        quiz_generator()    
    elif st.session_state.get("page") == "mindmap generator":
        mindmap_generator()
    elif st.session_state.get("page") == "career_hub":
        career_hub()
    elif st.session_state.get("page") == "discussion_forum":
        discussion_forum()
    elif st.session_state.get("page") == "lesson_plan":
        lesson_plan()
    else:
        main_edu_chatbot_interface()
    
if __name__ == "__main__":
    if "page" not in st.session_state:
        st.session_state.page = "main_edu_chatbot_interface"
        
    main()

