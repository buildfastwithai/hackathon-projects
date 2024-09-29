# Conversational Chatbot with Groq, FAISS, and Hugging Face

You can explore and run the notebook using the following link:  
[Google Colab Notebook](https://colab.research.google.com/drive/1UojO_7mzxdQJUB1od1HbYxfFqSpaBuuN?usp=sharing)


This notebook is based on a chatbot built using the **Langchain** framework. Langchain provides a comprehensive interface for combining large language models (LLMs), data sources, and other components like vector stores, making it easy to build sophisticated, conversational AI applications.

The chatbot is designed to retrieve information from a data source and answer questions interactively, using a combination of **Groq LLM**, **FAISS**, and **Hugging Face** text embeddings. The chatbot retrieves relevant content from the provided data link and responds based on the context of the conversation.

## Features
- **Langchain Integration**: The Langchain framework connects the various components of the chatbot, including document loading, language modeling, and retrieval processes. This simplifies building end-to-end conversational systems.
- **Web-Based Document Loader**: The chatbot loads and processes data from a URL, splitting the text into manageable chunks for efficient retrieval.
- **Retrieval-Augmented Generation (RAG)**: The chatbot employs a RAG approach by retrieving relevant information from the data source before generating a response. This helps improve the factual correctness and relevance of the responses.
    - In this notebook, **Wikipedia** is used as an example data source for the RAG process.
    - The RAG process is looped in the chatbot to continuously interact with the user and retrieve new information with each query.
- **Groq LLM**: The chatbot uses the **ChatGroq** model to generate human-like responses based on user queries.
- **FAISS Vector Store**: The FAISS library is used to store and retrieve document embeddings, enabling quick access to relevant text chunks.
- **Conversational Chain**: The chatbot maintains context through conversation history, allowing it to provide more relevant and coherent responses over time.
- **Accuracy Evaluation**: An accuracy evaluation system is included to compare the chatbot’s responses with expected answers. The evaluation is based on **cosine similarity** between sentence embeddings of the bot’s answers and the correct answers.

## Installation

### Step 1: Install Dependencies
Install the required Python packages for the project. These include libraries such as **Langchain**, **Groq**, **Hugging Face**, **FAISS**, and web scraping tools.

### Step 2: Verify Installations
Verify that all required libraries are installed and imported correctly to ensure smooth execution of the notebook.

### Step 3: Set Up the LLM and Data Retrieval
1. Set your **Groq API key** in the environment to access the Groq model.
2. Define the model name and the data source URL. The chatbot will use this link to load content and process it.
3. Load data from the provided URL using Langchain's web document loader, and split the text into chunks for retrieval using FAISS.

### Step 4: Create the Conversational Chain
1. Initialize the **ChatGroq** model.
2. Set up a **retrieval system** using FAISS to access relevant chunks of text quickly based on user queries.
3. Create a conversational chain that combines the language model with the FAISS retriever, allowing the chatbot to provide detailed responses.

### Step 5: Implement Chatbot Interaction
1. Set up a user interaction loop where the chatbot waits for user input, retrieves relevant information, and generates a response.
2. The chatbot continues to reference previous conversations to maintain context and provide more coherent answers.
3. Optionally display the sources from which the chatbot retrieved its information.

### Step 6: Accuracy Evaluation
1. The notebook includes a function to measure the chatbot's accuracy. The chatbot's answers are compared to expected answers using **sentence embeddings**.
2. **Cosine similarity** is used to calculate the similarity between the chatbot's responses and the expected answers.
3. A similarity score is printed for each query, and an overall accuracy score is calculated based on the defined similarity threshold (e.g., 0.8).
4. This allows you to quantitatively assess the chatbot’s performance.

## Usage
1. Clone the repository and navigate to the project directory.
2. Run the notebook in your preferred environment (e.g., Jupyter Notebook, Google Colab).
3. Install the dependencies and set up the environment by following the instructions.
4. Modify the **Groq API key** and **data source URL** to suit your use case.
5. Execute the cells in the notebook sequentially to load the data, run the chatbot, and evaluate its performance.



## Example Data Source
- In this notebook, **Wikipedia** is used as an example for demonstrating the RAG process. You can replace the Wikipedia link with your custom data source URL to customize the chatbot for specific domains.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
