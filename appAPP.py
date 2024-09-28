from langchain.vectorstores import Qdrant
from langchain.embeddings import HuggingFaceBgeEmbeddings
from langchain_groq import ChatGroq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain.prompts import PromptTemplate
from langchain.chains import ConversationChain
from qdrant_client import QdrantClient
from dotenv import load_dotenv
import os
load_dotenv()

# Initialize Qdrant and embeddings
model_name = "BAAI/bge-large-en"
embeddings = HuggingFaceBgeEmbeddings(
    model_name=model_name,
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': False}
)
url = "http://localhost:6333"

# Load the AIML vector database
client = QdrantClient(
    url=url, prefer_grpc=False
)
memory = ConversationBufferWindowMemory(k=5)
collection_name = "APP"
db = Qdrant(client=client , embeddings=embeddings,collection_name=collection_name)

# Initialize Groq LLM
groq_llm = ChatGroq(
    groq_api_key = os.environ['GROQ_API_KEY'],
    model = 'mixtral-8x7b-32768' 
)

# User input for query
query = input("Enter your query: ")

if query:
    # Perform similarity search with context
    docs = db.similarity_search_with_score(query=query, k=5)

    # Display retrieved documents
    print("Retrieved Documents:")
    retrieved_content = ""
    for i, (doc, score) in enumerate(docs):
        retrieved_content += f"**Result {i + 1}:**\n"
        retrieved_content += f"**Score:** {score}\n"
        retrieved_content += f"**Content:** {doc.page_content}\n"
        retrieved_content += f"**Metadata:** {doc.metadata}\n"
        retrieved_content += "-" * 40 + "\n"

    # Define the prompt template
    prompt_template = PromptTemplate(
        input_variables=["query", "retrieved_documents"],
        template=(
            "You are an expert in APP DEVELOPMENT. "
            "Your task is to assist users with their queries related to APP DEVELOPMENT concepts, applications, and recent advancements. "
            "You have access to relevant documents that provide detailed information about various APP DEVELOPMENT topics, algorithms, and case studies.\n\n"
            "User Query: {query}\n\n"
            "{retrieved_documents}\n\n"
            "Your Response:\n"
            "- Provide a concise and informative answer based on the user's query and the retrieved documents.\n"
            "- Include key definitions, explanations of relevant concepts, and any important points from the retrieved documents.\n"
            "- Ensure that the response is accessible to users with varying levels of knowledge about APP DEVELOPMENT."
        )
    )

    # Format the input using the prompt template
    formatted_input = prompt_template.format(query=query, retrieved_documents=retrieved_content)

    # Set up generation model
    groq_api_key = os.getenv('GROQ_API_KEY')
    model = 'mixtral-8x7b-32768'  # Or any other model you prefer

    # Initialize Groq Langchain chat object and conversation
    groq_chat = ChatGroq(groq_api_key=groq_api_key, model_name=model)
    conversation = ConversationChain(llm=groq_chat, memory=memory)

    # Generate response using the formatted input
    response = conversation.run(formatted_input)
    print(response)