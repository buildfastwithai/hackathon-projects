from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from langchain.vectorstores import Qdrant
from langchain.embeddings import HuggingFaceBgeEmbeddings
from langchain_groq import ChatGroq
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain.prompts import PromptTemplate
from langchain.chains import ConversationChain
from qdrant_client import QdrantClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)  # This will allow all origins. You can customize it if needed.

# Initialize Qdrant and embeddings
model_name = "BAAI/bge-large-en"
embeddings = HuggingFaceBgeEmbeddings(
    model_name=model_name,
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': False}
)
url = "http://localhost:6333"
client = QdrantClient(url=url, prefer_grpc=False)

memory = ConversationBufferWindowMemory(k=5)
collection_name = "AIML"
db = Qdrant(client=client, embeddings=embeddings, collection_name=collection_name)

# Initialize Groq LLM
groq_llm = ChatGroq(
    groq_api_key=os.getenv('GROQ_API_KEY'),
    model='mixtral-8x7b-32768'
)

# Define the prompt template
prompt_template = PromptTemplate(
    input_variables=["query", "retrieved_documents"],
    template=( 
        "You are an expert in Artificial Intelligence and Machine Learning (AIML). "
        "Your task is to assist users with their queries related to AIML concepts, applications, and recent advancements. "
        "You have access to relevant documents that provide detailed information about various AIML topics, algorithms, and case studies.\n\n"
        "User Query: {query}\n\n"
        "{retrieved_documents}\n\n"
        "Your Response:\n"
        "- Provide a concise and informative answer based on the user's query and the retrieved documents.\n"
        "- Include key definitions, explanations of relevant concepts, and any important points from the retrieved documents.\n"
        "- Ensure that the response is accessible to users with varying levels of knowledge about AIML."
    )
)

# API endpoint to handle query
@app.route('/aiml_query', methods=['POST'])
def handle_query():
    # Get the query from the POST request
    data = request.json
    query = data.get('query', '')

    if not query:
        return jsonify({"error": "No query provided"}), 400

    # Perform similarity search with context
    docs = db.similarity_search_with_score(query=query, k=5)

    # Prepare retrieved documents content
    retrieved_content = ""
    for i, (doc, score) in enumerate(docs):
        retrieved_content += f"**Result {i + 1}:**\n"
        retrieved_content += f"**Score:** {score}\n"
        retrieved_content += f"**Content:** {doc.page_content}\n"
        retrieved_content += f"**Metadata:** {doc.metadata}\n"
        retrieved_content += "-" * 40 + "\n"

    # Format the input using the prompt template
    formatted_input = prompt_template.format(query=query, retrieved_documents=retrieved_content)

    # Initialize Groq Langchain chat object and conversation
    groq_chat = ChatGroq(groq_api_key=os.getenv('GROQ_API_KEY'), model_name='mixtral-8x7b-32768')
    conversation = ConversationChain(llm=groq_chat, memory=memory)

    # Generate response using the formatted input
    response = conversation.run(formatted_input)

    # Return the response as JSON
    return jsonify({"response": response})

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
