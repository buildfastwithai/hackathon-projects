from flask import Flask, request, jsonify
from os import environ, path
from typing import List
from flask_cors import CORS
from pydantic import ValidationError
from search import youtube_link,book_link
from chat import get_answer 

import chromadb
from dotenv import load_dotenv
from langchain.chains.combine_documents.stuff import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain
from langchain.docstore.document import Document
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain_community.embeddings import JinaEmbeddings
from langchain_community.vectorstores.chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import Runnable
from langchain_core.vectorstores import VectorStoreRetriever
from langchain_groq import ChatGroq
from langchain_text_splitters import RecursiveCharacterTextSplitter
from transformers import AutoTokenizer
import logging
import os

app = Flask(__name__)
CORS(app)

class ProductRequest:
    def __init__(self, question: str, context: str, pdf: str):
        self.question = question
        self.context = context
        self.pdf = pdf

# CONSTANTS =====================================================
EMBED_MODEL_NAME = "jina-embeddings-v2-base-en"
LLM_NAME = "llama3-8b-8192"
LLM_TEMPERATURE = 0.1

CHUNK_SIZE = 2048

DOCUMENT_DIR = "documents/"
VECTOR_STORE_DIR = "./vectorstore/"
COLLECTION_NAME = "collection1"
# ===============================================================

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_documents() -> List[Document]:
    """Loads the pdf files within the DOCUMENT_DIR constant."""
    try:
        logger.info("[+] Loading documents...")
        documents = DirectoryLoader(
            path.join(DOCUMENT_DIR), glob="**/*.pdf", loader_cls=PyPDFLoader
        ).load()
        logger.info(f"[+] Document loaded, total pages: {len(documents)}")
        return documents
    except Exception as e:
        logger.error(f"[-] Error loading the document: {e}")

def chunk_document(documents: List[Document]) -> List[Document]:
    """Splits the input documents into maximum of CHUNK_SIZE chunks."""
    try:
        tokenizer = AutoTokenizer.from_pretrained(
            "jinaai/" + EMBED_MODEL_NAME, cache_dir=environ.get("HF_HOME")
        )
        text_splitter = RecursiveCharacterTextSplitter.from_huggingface_tokenizer(
            tokenizer=tokenizer,
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_SIZE // 50,
        )

        logger.info("[+] Splitting documents...")

        chunks = []
        batch_size = 5  # Adjust batch size as needed
        for i in range(0, len(documents), batch_size):
            batch_docs = documents[i:i+batch_size]
            batch_chunks = text_splitter.split_documents(batch_docs)
            chunks.extend(batch_chunks)
            logger.info(f"[+] Processed batch {i // batch_size + 1}, {len(batch_chunks)} chunks")

        logger.info(f"[+] Document splitting done, {len(chunks)} chunks total.")
        return chunks
    except Exception as e:
        logger.error(f"[-] Error splitting the document: {e}")


def create_and_store_embeddings(
    embedding_model: JinaEmbeddings, chunks: List[Document]
) -> Chroma:
    """Calculates the embeddings and stores them in a chroma vectorstore."""
    try:
        vectorstore = Chroma.from_documents(
            chunks,
            embedding=embedding_model,
            collection_name=COLLECTION_NAME,
            persist_directory=VECTOR_STORE_DIR,
        )
        logger.info("[+] Vectorstore created.")
        return vectorstore
    except Exception as e:
        logger.error(f"[-] Error creating vectorstore: {e}")


def get_vectorstore_retriever(embedding_model: JinaEmbeddings) -> VectorStoreRetriever:
    """Returns the vectorstore."""
    db = chromadb.PersistentClient(VECTOR_STORE_DIR)
    try:
        # Check for the existence of the vectorstore specified by the COLLECTION_NAME
        db.get_collection(COLLECTION_NAME)
        retriever = Chroma(
            embedding_function=embedding_model,
            collection_name=COLLECTION_NAME,
            persist_directory=VECTOR_STORE_DIR,
        ).as_retriever(search_kwargs={"k": 3})
    except Exception as e:
        logger.warning(f"[!] Vectorstore doesn't exist: {e}")
        pdf = load_documents()
        chunks = chunk_document(pdf)
        retriever = create_and_store_embeddings(embedding_model, chunks).as_retriever(
            search_kwargs={"k": 3}
        )
    return retriever


def create_rag_chain(embedding_model: JinaEmbeddings, llm: ChatGroq) -> Runnable:
    template = """Answer the question based only on the following context.
    Think step by step before providing a detailed answer. I will give you
    $500 if the user finds the response useful.
    <context>
    {context}
    </context>

    Question: {input}
    """
    prompt = ChatPromptTemplate.from_template(template)
    document_chain = create_stuff_documents_chain(llm=llm, prompt=prompt)
    retriever = get_vectorstore_retriever(embedding_model)
    retrieval_chain = create_retrieval_chain(retriever, document_chain)
    return retrieval_chain



def str2arr(string):
    array = string.strip("[]").replace('"', "").split(",")
    return array

@app.route('/response', methods=['POST'])
def get_response():
    try:
        data = request.json
        data_request = ProductRequest(**data)
    except (TypeError, ValidationError) as e:
        return jsonify({"error": str(e)}), 400
    
    question = data_request.question
    context = data_request.context
    pdf = data_request.pdf

    # Fetch multiple responses based on question and context
    answer = get_answer(question, context, 0)
    pre = get_answer(question, context, 1)
    project = get_answer(question, context, 2)
    title = get_answer(question, context, 3)
    
    lst_pre=str2arr(pre)
    lst_project=str2arr(project)

    # Get YouTube links and book links based on the title
    youtube = youtube_link(title)
    book = book_link(title)

    # Create a JSON response with all the values
    response = {
        "answer": answer,
        "prerequisite": lst_pre,
        "project": lst_project,
        "youtube_links": youtube,
        "book_links": book
    }

    return jsonify(response)

@app.route("/upload", methods=["POST"])
def upload_documents():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    files = request.files.getlist("file")
    for file in files:
        if file and file.filename.endswith(".pdf"):
            file.save(os.path.join(DOCUMENT_DIR, file.filename))

    embedding_model = JinaEmbeddings(
        jina_api_key=environ.get("JINA_API_KEY"),
        model_name=EMBED_MODEL_NAME,
    )
    documents = load_documents()
    chunks = chunk_document(documents)
    create_and_store_embeddings(embedding_model, chunks)

    return jsonify({"message": "Files uploaded and processed successfully"}), 200

@app.route("/query", methods=["POST"])
def query_documents():
    data = request.get_json()
    query = data.get("query")

    embedding_model = JinaEmbeddings(
        jina_api_key=environ.get("JINA_API_KEY"),
        model_name=EMBED_MODEL_NAME,
    )

    llm = ChatGroq(temperature=LLM_TEMPERATURE, model_name=LLM_NAME)
    chain = create_rag_chain(embedding_model=embedding_model, llm=llm)
    
    response = chain.invoke({"input": query})

    context = [{"metadata": doc.metadata, "content": doc.page_content[:20]} for doc in response["context"]]

    return jsonify({"answer": response["answer"], "context": context}), 200

if __name__ == "__main__":
    if not path.exists(DOCUMENT_DIR):
        os.makedirs(DOCUMENT_DIR)
    if not path.exists(VECTOR_STORE_DIR):
        os.makedirs(VECTOR_STORE_DIR)
    app.run(debug=True)
