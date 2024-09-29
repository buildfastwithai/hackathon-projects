import os
import requests
import streamlit as st
from bs4 import BeautifulSoup
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
google_api_key = os.getenv("GOOGLE_API_KEY")

# Function to extract text from a webpage
def extract_text_from_url(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")

        # Extract the main text from the page (can be refined based on specific websites)
        text = soup.get_text()
        return text.strip()
    except Exception as e:
        return str(e)

# Function to summarize text and prepare for Q&A
def summarize_and_answer(text):
    # Initialize Google LLM
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        api_key=google_api_key
    )

    # Summarization
    messages_summary = [
        ("system", "You're a helpful assistant that summarizes websites."),
        ("human", text),
    ]
    summary = llm.invoke(messages_summary).content

    # Prepare for Q&A with memory
    memory = ConversationBufferMemory()
    conversation = ConversationChain(
        llm=llm,
        verbose=False,
        memory=memory
    )

    # Save the context for Q&A
    memory.save_context({"input": text}, {"output": ""})

    return summary, conversation

# Main function for the Streamlit app
def main():
    # Set up page config
    st.set_page_config(page_title="WebSage", layout="wide")

    # Add a title and description
    st.title("🌐 WebSage")
    st.write("""\
    Unleash your online learning potential with **WebSage!** This powerful tool effortlessly summarizes website content, distilling articles, blogs, and online tutorials into digestible insights. With integrated Q&A features, you can easily clarify doubts and enhance your understanding of complex topics. **WebSage** empowers you to navigate the vast web of information quickly and efficiently, making knowledge acquisition a seamless experience. Transform the way you learn online with **WebSage**—your intelligent guide to web content!
    """)

    # CSS to style the input box
    st.markdown(
        """
        <style>
        .stTextInput > div > div > input {
            border: 2px solid black; /* Set border color */
            border-radius: 5px; /* Set border radius */
        }
        </style>
        """, unsafe_allow_html=True
    )

    # URL input field
    st.sidebar.header("Website Input")
    website_url = st.sidebar.text_input("Paste your Website URL here!")

    # Initialize session state for messages, summary, and conversation if not already done
    if "web_messages" not in st.session_state:
        st.session_state.web_messages = []
    if "summary" not in st.session_state:
        st.session_state.summary = ""
    if "conversation" not in st.session_state:
        st.session_state.conversation = None

    # Add a button to process the URL
    if st.sidebar.button("Process"):
        # Check if a URL has been entered
        if website_url:
            with st.spinner(f"Fetching and summarizing content from {website_url}..."):
                # Extract text from the website
                text = extract_text_from_url(website_url)

                if text:
                    # Summarize the text and set up the Q&A conversation
                    summary, conversation = summarize_and_answer(text)

                    # Store summary and conversation in session state
                    st.session_state.summary = summary
                    st.session_state.conversation = conversation

    # Display the summary if it exists
    if st.session_state.summary:
        st.subheader("Website Summary:")
        st.write(st.session_state.summary)

        # Q&A section
        st.subheader("💬 Ask Questions About the Website")
        web_messages = st.container()
        with web_messages:
            # Display chat messages
            for message in st.session_state.web_messages:
                if message['role'] == 'user':
                    st.chat_message("user").write(message['content'])
                else:
                    st.chat_message("assistant").write(message['content'])

            # User input for Q&A
            if prompt := st.chat_input("Ask a question about the website"):
                st.session_state.web_messages.append({"role": "user", "content": prompt})
                st.chat_message("user").write(prompt)

                with st.spinner("Generating response..."):
                    response = st.session_state.conversation.predict(input=prompt)
                    if response.strip() == "":
                        response = "The context is not provided on the website."

                st.session_state.web_messages.append({"role": "assistant", "content": response})
                st.chat_message("assistant").write(response)

if __name__ == "__main__":
    main()
