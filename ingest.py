from langchain.vectorstores import Qdrant
from langchain.embeddings import HuggingFaceBgeEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader

# List of PDF files and their corresponding collection names
pdf_files = [
    ("AIML.pdf", "AIML"),
    ("BLOCKCHAIN.pdf", "BLOCKCHAIN"),
    ("APP.pdf", "APP"),
    ("WEB.pdf", "WEB")
]

# Load the embedding model 
model_name = "BAAI/bge-large-en"
model_kwargs = {'device': 'cpu'}
encode_kwargs = {'normalize_embeddings': False}
embeddings = HuggingFaceBgeEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs,
    encode_kwargs=encode_kwargs
)

# Qdrant URL
url = "http://localhost:6333"

# Ingest PDFs and create collections
for pdf_file, collection_name in pdf_files:
    # Load the PDF document
    loader = PyPDFLoader(pdf_file)
    documents = loader.load()
    
    # Split the document into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = text_splitter.split_documents(documents)
    
    # Create a new collection in Qdrant for each PDF
    qdrant = Qdrant.from_documents(
        texts,
        embeddings,
        url=url,
        prefer_grpc=False,
        collection_name=collection_name
    )
    
    print(f"Vector DB for '{collection_name}' Successfully Created!")

