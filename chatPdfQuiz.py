import os
from dotenv import load_dotenv
import tempfile
from flask import Flask, request, jsonify
from langchain_groq import ChatGroq
from langchain.chains import ConversationalRetrievalChain
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.memory import ConversationBufferMemory
from langchain.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader
from langchain.prompts import PromptTemplate
from educhain import Educhain, LLMConfig

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Prompt Template for Document Analysis
template = """
You are an assistant specialized in analyzing documents. Your work is to provide topic of that document.
Topic : 
"""

topic_prompt = PromptTemplate(input_variables=["context", "question"], template=template)

# Prompt Template for answering document questions
qa_template = """
You are an assistant specialized in analyzing documents. The user will provide questions based on a document.
Please answer the following question using the context provided:

Context: {context}

Question: {question}

Answer in a concise and informative manner.
Try to answer in bullet points
"""
qa_prompt = PromptTemplate(input_variables=["context", "question"], template=qa_template)

def conversation_chat(query, chain, history):
    context = chain.retriever.get_relevant_documents(query)
    formatted_prompt = qa_prompt.format(context=context, question=query)
    result = chain({"question": formatted_prompt, "chat_history": history})
    history.append((query, result["answer"]))
    return result["answer"]

def create_conversational_chain(vector_store):
    groq_api_key = os.getenv('GROQ_API_KEY')
    model = 'mixtral-8x7b-32768'
    
    # Initialize Groq LLM
    llm = ChatGroq(groq_api_key=groq_api_key, model_name=model)
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    
    # Create conversational chain
    chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        chain_type='stuff',
        retriever=vector_store.as_retriever(search_kwargs={"k": 2}),
        memory=memory
    )
    return chain

def extract_document_topic(uploaded_files):
    text = []
    for file in uploaded_files:
        file_extension = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(file.read())
            temp_file_path = temp_file.name

        loader = None
        if file_extension == ".pdf":
            loader = PyPDFLoader(temp_file_path)
        elif file_extension in [".docx", ".doc"]:
            loader = Docx2txtLoader(temp_file_path)
        elif file_extension == ".txt":
            loader = TextLoader(temp_file_path)

        if loader:
            text.extend(loader.load())
            os.remove(temp_file_path)

    text_splitter = CharacterTextSplitter(separator="\n", chunk_size=1000, chunk_overlap=100, length_function=len)
    text_chunks = text_splitter.split_documents(text)

    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2", model_kwargs={'device': 'cpu'})
    vector_store = FAISS.from_documents(text_chunks, embedding=embeddings)

    chain = create_conversational_chain(vector_store)
    
    query = "What is the topic of this document?"
    history = []
    document_topic = conversation_chat(query, chain, history)
    
    return document_topic, chain

def generate_questions_based_on_topic(topic):
    groq_llm = ChatGroq(
        groq_api_key=os.getenv('GROQ_API_KEY'),
        model='mixtral-8x7b-32768'
    )
    flash_config = LLMConfig(custom_model=groq_llm)
    client = Educhain(flash_config)

    # Generate questions based on the document topic
    questions = client.qna_engine.generate_questions(topic=topic, num=10)
    return questions

@app.route('/extract_topic', methods=['POST'])
def extract_topic():
    if 'files' not in request.files:
        return jsonify({"error": "No files provided"}), 400
    
    uploaded_files = request.files.getlist('files')
    document_topic, _ = extract_document_topic(uploaded_files)
    return jsonify({"document_topic": document_topic})

@app.route('/generate_quiz', methods=['POST'])
def generate_quiz():
    data = request.json
    topic = data.get('topic')
    
    if not topic:
        return jsonify({"error": "Topic not provided"}), 400
    
    questions = generate_questions_based_on_topic(topic)
    return jsonify({"questions": questions.json()})

@app.route('/chat_with_document', methods=['POST'])
def chat_with_document():
    data = request.json
    print(data)
    question = data.get('question')
    history = data.get('history', [])
    
    # Hardcoded file path
    hardcoded_file_path = 'AIML.pdf'  # Change this to your actual file path
    
    # Simulate the behavior of getting uploaded files
    uploaded_files = [open(hardcoded_file_path, 'rb')]  # Open the file in binary mode

    _, chain = extract_document_topic(uploaded_files)
    
    if not question:
        return jsonify({"error": "Question not provided"}), 400
    
    response = conversation_chat(question, chain, history)
    
    # Close the hardcoded file after processing
    uploaded_files[0].close()
    
    return jsonify({"response": response, "history": history})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001)

