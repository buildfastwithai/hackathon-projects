# Import necessary libraries
import google.generativeai as genai
import PIL.Image
import os
import streamlit as st
from groq import Groq

# Set up Streamlit app title and description
st.set_page_config(page_title="EduConnect.AI", layout="wide")
st.title("🎓 EduConnect.AI: Enhance Your Learning with AI")
st.sidebar.success("Select a feature above to get started!")

# Sidebar for navigation between different sections
with st.sidebar:
    st.header("Navigation")
    options = ["Roadmap Generator", "Image Content Extraction", "Text Query", "Learning Schedule Generator", "AI Tutor", "Progress Tracker"]
    selected_feature = st.radio("Choose a feature:", options)

# Initialize Groq and Google API clients
groq_api_key = "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"  # Replace with your actual API key
groq_client = Groq(api_key=groq_api_key)

def llama_model(prompt):
    """Utility to call the LLaMA model from Groq."""
    chat_completion = groq_client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama3-8b-8192",
    )
    return chat_completion

# 1. Roadmap Generator
if selected_feature == "Roadmap Generator":
    st.header("🗺️ Roadmap Generator")
    st.write("Enter the topic you want to generate a roadmap for, and receive YouTube and website links to relevant content.")
    
    sam = st.text_input("Which roadmap do you want?", placeholder="e.g., Data Science, Full Stack Development")

    if st.button("Generate Roadmap"):
        if sam:
            with st.spinner('Generating roadmap...'):
                data = f"Give me the roadmap for {sam} with YouTube links and other website links."
                chat_completion = llama_model(data)
                st.success("Roadmap generated!")
                st.write(chat_completion.choices[0].message.content)
        else:
            st.error("Please enter a topic to generate a roadmap.")

# 2. Image Content Extraction
elif selected_feature == "Image Content Extraction":
    st.header("🖼️ Image Content Extraction")
    st.write("Upload an image and choose the task (get short notes, explanation, or ask a custom question).")

    # Choose the task for the image
    data_photo = st.radio(
        "What do you want to do with this image?",
        ('shortnotes', 'explanation', 'Provide a custom question')
    )
    
    # If custom question is selected, show the input field
    custom_question = None
    if data_photo == "Provide a custom question":
        custom_question = st.text_input("Enter your custom question:", placeholder="e.g., What does this image represent?")

    # Image uploader
    photo = st.file_uploader("Upload an image:", type=["png", "jpg", "jpeg"])

    if photo:
        img = PIL.Image.open(photo)
        st.image(img, caption="Uploaded Image", use_column_width=True)

        # Generate content button
        if st.button("Generate Content"):
            # If a custom question is provided, use that, otherwise fall back to selected task (shortnotes or explanation)
            prompt = custom_question if custom_question else f"Provide {data_photo} for this image."
            
            with st.spinner("Generating content..."):
                try:
                    userdata = {'gemma': 'AIzaSyCtkHjX1sXhvEQ5_6ySoWqCHIO2xMdEsak'}  # Replace with actual API key
                    api_key = userdata.get('gemma')
                    genai.configure(api_key=api_key)
                    model = genai.GenerativeModel(model_name="gemini-1.5-flash")
                    
                    # Here you can modify the prompt based on the task or question
                    response = model.generate_content([prompt, img])
                    st.success("Content generated!")
                    st.write(response.text)
                except Exception as e:
                    st.error(f"Error occurred: {e}")

# 3. Text Query
elif selected_feature == "Text Query":
    st.header("💬 Ask a Question")
    st.write("Type a question you'd like to ask, and get an AI-generated response!")

    data = st.text_input("Enter your question:", placeholder="e.g., What is the capital of France?")
    
    if st.button("Ask"):
        if data:
            with st.spinner('Generating answer...'):
                chat_completion = llama_model(data)
                st.success("Answer generated!")
                st.write(chat_completion.choices[0].message.content)
        else:
            st.error("Please enter a question to ask.")

# 4. Learning Schedule Generator
elif selected_feature == "Learning Schedule Generator":
    st.header("📅 Learning Schedule Generator")
    st.write("Plan your learning with AI! Enter a topic and the number of weeks, and get a detailed study schedule.")

    sam = st.text_input("Topic you want to schedule learning for:", placeholder="e.g., Machine Learning")
    days = st.slider("How many weeks?", min_value=1, max_value=52, value=4, step=1)

    if st.button("Generate Schedule"):
        if sam and days:
            with st.spinner(f"Creating a {days}-week learning schedule for {sam}..."):
                bata = f"I want to learn {sam} in {days} weeks. Make a schedule for it with some study materials."
                userdata = {'gemma': 'AIzaSyCtkHjX1sXhvEQ5_6ySoWqCHIO2xMdEsak'}  # Replace with actual API key
                api_key = userdata.get('gemma')
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel(model_name="gemini-1.5-flash")
                response = model.generate_content(bata)
                st.success(f"{days}-week schedule generated!")
                st.write(response.text)
        else:
            st.error("Please provide both the topic and number of weeks.")

# 5. AI Tutor Chatbot
elif selected_feature == "AI Tutor":
    st.header("👨‍🏫 AI Tutor")
    query = st.text_input("Ask the AI Tutor any question:")

    if st.button("Ask AI Tutor"):
        if query:
            with st.spinner("Generating AI Tutor response..."):
                answer = llama_model(query)
                st.write(answer.choices[0].message.content)
        else:
            st.error("Please ask a question to get an answer.")

# 6. Progress Tracker (with To-Do List functionality)
# 6. Progress Tracker (with n tasks input functionality)
elif selected_feature == "Progress Tracker":
    st.header("📊 Progress Tracker")

    # Initialize the to-do list in session state
    if 'tasks' not in st.session_state:
        st.session_state.tasks = []

    # Function to add multiple tasks to the list
    def add_tasks(task_list):
        for task in task_list:
            if task:  # Ensure task is not empty
                st.session_state.tasks.append({"task": task, "completed": False})

    # Input to determine how many tasks to add at once
    num_tasks = st.number_input("How many tasks do you want to add?", min_value=1, max_value=50, step=1, value=1)

    # Generate task input fields dynamically
    task_list = []
    st.write("### Enter your tasks:")
    for i in range(num_tasks):
        task = st.text_input(f"Task {i + 1}", key=f"task_{i}")
        task_list.append(task)

    if st.button("Add Tasks"):
        add_tasks(task_list)
        st.success(f"{num_tasks} tasks added!")

    # Display current tasks
    if st.session_state.tasks:
        st.write("### Your To-Do List:")
        for idx, task_info in enumerate(st.session_state.tasks):
            col1, col2 = st.columns([6, 1])
            with col1:
                st.write(f"{idx + 1}. {task_info['task']}")
            with col2:
                if st.button(f"Complete {idx + 1}", key=f"complete_{idx}"):
                    st.session_state.tasks[idx]["completed"] = True

        # Display completed tasks
        completed_tasks = [task for task in st.session_state.tasks if task["completed"]]
        if completed_tasks:
            st.write("### Completed Tasks:")
            for task in completed_tasks:
                st.write(f"- {task['task']}")

    # Track total tasks and completed progress
    total_tasks = len(st.session_state.tasks)
    completed_tasks_count = len([task for task in st.session_state.tasks if task["completed"]])
    if total_tasks > 0:
        st.progress(completed_tasks_count / total_tasks)
        if completed_tasks_count == total_tasks:
            st.success("You've completed all your tasks! 🎉")

# Streamlit run command:
# Run this script in your terminal using the command: `streamlit run <script_name>.py`
