from youtube_transcript_api._errors import NoTranscriptFound, TranscriptsDisabled
from youtube_transcript_api.formatters import TextFormatter
from langchain_google_genai import ChatGoogleGenerativeAI
from youtube_transcript_api import YouTubeTranscriptApi
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import streamlit as st
import requests
import re
import os


load_dotenv()
google_api_key = os.getenv("GOOGLE_API_KEY")


def get_title(url:str) -> str:

    link = url
    page = requests.get(link)
    soup = BeautifulSoup(page.text,'html.parser')
    title = soup.title.text

    return title

def fetch_and_format_transcript(url):
    """Fetches and formats the transcript of a YouTube video given its URL."""
    match = re.search(r"(?:v=|\/)([a-zA-Z0-9_-]{11})", url)
    if match:
        video_id = match.group(1)
    else:
        return "No video ID found."

    formatter = TextFormatter()
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        formatted_transcript = formatter.format_transcript(transcript)
        return formatted_transcript
    except NoTranscriptFound:
        try:
            print(video_id)
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            print("Obtained Transcripts lists")
            transcript = transcript_list.find_transcript(['hi'])
            print("Obtained Transcripts-hi")
            translated_transcript = transcript.translate('en')
            print("Obtained -en")
            transcript = translated_transcript.fetch()
            print("Translated")
            formatted_transcript = formatter.format_transcript(transcript)
            print("Formatted Script")
            
            return formatted_transcript
        except (NoTranscriptFound, TranscriptsDisabled):
            return "Subtitles have not been provided for this video yet."
    except TranscriptsDisabled:
        return "Subtitles have been disabled for this video."

def ai(url):
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        api_key=google_api_key
    )

    
    transcript = fetch_and_format_transcript(url)
    messages = [
        (
            "system",
            "You're an helpful assistant. You will be given the transcripts of a YouTube Video. You have to provide a summary of the video",
        ),
        ("human", f"{transcript}"),
    ]
    ai_msg = llm.invoke(messages)
    return ai_msg.content



def main():
    st.title("YouTube Video Summarizer")
    st.write("Enter the YouTube video link below:")

    yt_link = st.text_input("YouTube Link:")

    # Initialize session state for summary and chat messages if not already done
    if "summary" not in st.session_state:
        st.session_state.summary = None
    if "messages" not in st.session_state:
        st.session_state.messages = []

    if st.button("Summarize"):
        st.session_state.summary = None
        st.session_state.messages = []
        st.write(f'<h4>{get_title(yt_link)}</h4>',unsafe_allow_html=1)
        if yt_link:
            with st.spinner("Generating summary... Please wait."):
                st.session_state.summary = ai(yt_link)  
            # st.subheader("Video Summary:")
            # st.write(st.session_state.summary)



    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        api_key=google_api_key
    )

    memory = ConversationBufferMemory()

    conversation = ConversationChain(
        llm=llm,
        verbose=False,
        memory=memory
    )
    memory.save_context({"input":f"You are an helpful AI Assistant. You are given a Youtube video transcript. You must answer any questions, regardless if its answer is in the video or not. Following is the video Script {fetch_and_format_transcript(yt_link)}"}, {"output": ""})


    


    # Sidebar for chat messages
    with st.sidebar:
        st.title("Ask me any questions you have about the video")
        messages = st.container()
        
        # Display chat messages
        for message in st.session_state.messages:
            if message['role'] == 'user':
                messages.chat_message("user").write(message['content'])
            else:
                messages.chat_message("assistant").write(message['content'])

        # Get user input
        if prompt := st.chat_input("Say something"):
            st.session_state.messages.append({"role": "user", "content": prompt})
            messages.chat_message("user").write(prompt)
            
            with st.spinner("Generating..."):
                response = conversation.predict(input=prompt)

            st.session_state.messages.append({"role": "assistant", "content": response})
            messages.chat_message("assistant").write(response)

    # Display the summary if it exists
    if st.session_state.summary:
        st.subheader("Video Summary:")
        st.write(st.session_state.summary)

if __name__ == "__main__":
    main()
