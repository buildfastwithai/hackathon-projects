
# EduSpot Automated Notes-Making Support System

EduSpot is a Flask-based web application designed to assist students in capturing and organizing information during fast-paced lectures. Using advanced technologies such as Automatic Speech Recognition (ASR), Generative AI, and Retrieval-Augmented Generation (RAG), the app transcribes lecture audio, identifies key concepts, and generates structured notes. It is particularly useful for students in multilingual environments and helps improve retention and revision efficiency.

## Table of Contents

- [EduSpot AI Notes Maker](#eduspot-ai-notes-maker)
- [Overview](#overview)
  - [Key Features](#key-features)
- [Architecture](#architecture)
  - [System Components](#system-components)
  - [System Architecture Diagram](#system-architecture-diagram)
  - [Workflow](#workflow)
- [Project Structure](#project-structure)
- [Installation](#installation)
  - [Clone the Repository](#1-clone-the-repository)
  - [Create a Virtual Environment](#2-create-a-virtual-environment)
  - [Install Dependencies](#3-install-dependencies)
  - [Set Up Environment Variables](#4-set-up-environment-variables)
- [Usage](#usage)
  - [Run the Flask Application](#1-run-the-flask-application)
  - [Access the Application](#2-access-the-application)
  - [Key Operations](#3-key-operations)
- [Technologies Used](#technologies-used)
- [Links](#links)

## Overview

Over 60% of students struggle to capture and organize information during fast-paced lectures, leading to poor retention and revision. Additionally, 25% of students come from multilingual backgrounds, making it harder for them to engage and understand the content fully. EduSpot AI Notes Maker addresses this by automatically detecting key terms during lectures, transcribing audio in real time, and generating structured notes to improve understanding and retention.

### Key Features
- **Multi-language Support**: Users can upload lectures in various languages.
- **Automatic Transcription**: Converts audio to text using advanced ASR technology.
- **Intelligent Note Generation**: Utilizes AI to create relevant and concise notes.
- **Interactive Chat**: Users can interact with the generated notes for further clarification or information.
- **Structured Lecture Note Generation**: Automatically creates notes summarizing key concepts.
- **Continuous Learning**: The system improves over time by incorporating user feedback and interactions.

## Architecture

The EduSpot AI system is designed with several key components that process and present information efficiently in real time.

### System Components:

1. **Audio Input & ASR**: Processes audio files, identifies the language, and generates transcripts.
2. **Context Processing**: Transcripts are processed through a Language Model (LM) to recognize the context and generate structured prompts.
3. **Embedding & Search**: Data is embedded as vectors for efficient search and retrieval. The system employs both vector-based and traditional search techniques.
4. **Keyword Spotting**: A Small Language Model (LLM) identifies and highlights key terms for note generation.
5. **Note Generation & Display**: Structured notes are generated based on detected keywords and displayed to users for review and revision.

### System Architecture Diagram
![image](https://github.com/user-attachments/assets/86156813-c2f6-43d4-938a-270a0a9e849d)

## Workflow

1. The user uploads an audio file of a lecture in their preferred language.
2. The ASR system converts the audio to text, creating a transcript.
3. The transcript is processed by the Language Model (LM) to:
   - Recognize the context
   - Generate a prompt template
   - Create a required language transcript (if translation is needed)
4. The system prepares data for RAG by creating embeddings and storing them in a Vector Database.
5. The SLM uses the prompt template and performs a hybrid search on the Vector DB to retrieve relevant information.
6. Key Word Spotting identifies important terms and concepts from the SLM output.
7. The Notes Making component generates concise notes based on the processed information.
8. The generated notes are displayed to the user and stored in the Data Storage.
## Project Structure

```
.
├── instance
├── static
│   └── assets
│       ├── vendor
│       │   ├── edutech
│       │   ├── edutech-icons
│       │   ├── glightbox
│       │   ├── purecounter
│       │   └── swiper
│       ├── css
│       │   ├── home.css
│       │   └── login.css
│       ├── images
│       └── js
│           ├── home.js
│           └── script.js
├── templates
│   ├── chat.html
│   ├── home.html
│   ├── login.html
│   ├── notes.html
│   ├── register.html
│   └── upload.html
├── uploads
├── app.py
├── index.py
├── requirements.txt
├── vercel.json
└── wsgi.py
```

This structure shows the organization of the EduSpot AI project:

- `instance`: Likely contains instance-specific configurations and  SQlite database .
- `static`: Houses all static assets.
  - `assets/vendor`: Third-party libraries and frameworks.
  - `css`: Custom stylesheets.
  - `js`: Custom JavaScript files.
- `templates`: HTML templates for different pages.
- `uploads`: Directory for user-uploaded files.
- `app.py`, `index.py`: Main Python application files.
- `requirements.txt`: List of Python dependencies.
- `vercel.json`: Configuration for Vercel deployment.
- `wsgi.py`: WSGI application entry point.
## Installation

### 1. Clone the Repository
   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

### 2. Create a Virtual Environment
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

### 3. Install Dependencies
   ```bash
   pip install -r requirements.txt
   ```

### 4. Set Up Environment Variables
   Create a `.env` file to store your secret keys and API tokens:
   ```plaintext
   SECRET_KEY=your_secret_key
   HF_TOKEN=your_hugging_face_token
   GROQ_API_KEY=your_groq_api_key
   ```

## Usage

### 1. Run the Flask Application
   ```bash
   python app.py
   ```

### 2. Access the Application
   Open your browser and go to `http://127.0.0.1:5000`.

### 3. Key Operations
- **Register/Login**: Users can register or log in using the authentication system.
- **Upload Audio**: Upload an audio file (such as a lecture recording) via the upload page.
- **View Notes**: After transcription and processing, view the auto-generated notes from the lecture.
- **Use the Chatbot**: Interact with the chatbot to ask questions about the uploaded lecture content.

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Flask, Python
- **Database**: SQLite (using SQLAlchemy for ORM)
- **Audio Processing**: Pydub, SpeechRecognition
- **Keyword Spotting & Retrieval**: LangChain, ChromaDB, BM25Retriever, EnsembleRetriever
- **Automatic Speech Recognition (ASR)**: Google Speech Recognition API (via speech_recognition package)
- **Embeddings**: HuggingFace API (`Model: BAAI/bge-base-en-v1.5` via HuggingFaceInferenceAPIEmbeddings)
- **Generative AI & Language Models**: ChatGroq (`Model: mixtral-8x7b-32768`)
Multilingual Support: HuggingFace APIs

## Links

- **Google Colab Notebook**: [Link to Colab](https://colab.research.google.com/drive/1LDeccHNSNkC4nHuCBppIpfaPyMHB3KtD?usp=sharing)
- **Video Demonstration**: [Watch the Demo](https://drive.google.com/file/d/1ZOJhOZh39Qypg4jk7at1vKE8bg055JLp/view?usp=sharing)
