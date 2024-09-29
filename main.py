# from fastapi import FastAPI, Form, HTTPException
# import os
# import json
# from dotenv import load_dotenv
# import google.generativeai as genai

# app = FastAPI()

# # Load environment variables
# load_dotenv()

# # Configure Gemini API
# genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# # Helper function to get response from the Gemini API
# def get_gemini_response(input_text: str):
#     """
#     Get a response from the Gemini model based on the input prompt.
#     """
#     try:
#         model = genai.GenerativeModel('gemini-pro')
#         response = model.generate_content(input_text)
#         return response.text
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

# # Endpoint 1: Radio Button Type Question Generation
# @app.post("/dynamic_question_generation_radio")
# async def dynamic_assessment_radio(
#     knowledge_level: str = Form(...), 
#     learning_goal: str = Form(...)
# ):
#     """
#     Endpoint to dynamically generate radio button questions.
#     """
#     prompt = f"""
#     You are an AI-powered assessment platform that dynamically adapts questions based on a student's performance and knowledge level.

#     **Student's Knowledge Level:**
#     {knowledge_level}

#     **Learning Goal:**
#     {learning_goal}

#     **Adaptive Questions:**
#     Generate 5 personalized radio button questions for the student based on their current knowledge level.
#     Each question should:
#     - Have 4 answer options for radio button selection (only one correct answer).
#     - Provide a correct answer for evaluation.
#     Provide output in this format:
#     {{
#         "questions": [
#             {{
#                 "question_id": 1,
#                 "question": "What is 2+2?",
#                 "difficulty_level": "easy",
#                 "options": ["3", "4", "5", "6"],
#                 "correct_answer": "4"
#             }},
#             ...
#         ]
#     }}
#     """

#     response = get_gemini_response(prompt)
#     try:
#         response_dict = json.loads(response)
#     except json.JSONDecodeError:
#         raise HTTPException(status_code=500, detail="Failed to parse the response into JSON.")

#     return response_dict


# # Endpoint 2: Checkbox Type Question Generation
# @app.post("/dynamic_question_generation_checkbox")
# async def dynamic_assessment_checkbox(
#     knowledge_level: str = Form(...), 
#     learning_goal: str = Form(...)
# ):
#     """
#     Endpoint to dynamically generate checkbox questions.
#     """
#     prompt = f"""
#     You are an AI-powered assessment platform that dynamically adapts questions based on a student's performance and knowledge level.

#     **Student's Knowledge Level:**
#     {knowledge_level}

#     **Learning Goal:**
#     {learning_goal}


#     **Adaptive Questions:**
#     Generate 5 personalized checkbox questions for the student based on their current knowledge level. 
#     Each question should:
#     - Have 4 answer options for checkbox selection (multiple correct answers possible).
#     - Provide a list of correct answers for evaluation.
#     Provide output in this format:
#     {{
#         "questions": [
#             {{
#                 "question_id": 1,
#                 "question": "Which of the following are prime numbers?",
#                 "difficulty_level": "medium",
#                 "options": ["2", "4", "6", "7"],
#                 "correct_answers": ["2", "7"]
#             }},
#             ...
#         ]
#     }}
#     """

#     response = get_gemini_response(prompt)
#     try:
#         response_dict = json.loads(response)
#     except json.JSONDecodeError:
#         raise HTTPException(status_code=500, detail="Failed to parse the response into JSON.")

#     return response_dict


# # Endpoint 3: Fill-in-the-Blank Question Generation
# @app.post("/dynamic_question_generation_fill_in_the_blanks")
# async def dynamic_assessment_fill_in_the_blanks(
#     knowledge_level: str = Form(...), 
#     learning_goal: str = Form(...)
# ):
#     """
#     Endpoint to dynamically generate fill-in-the-blank questions.
#     """
#     prompt = f"""
#     You are an AI-powered assessment platform that dynamically adapts questions based on a student's performance and knowledge level.

#     **Student's Knowledge Level:**
#     {knowledge_level}

#     **Learning Goal:**
#     {learning_goal}

#     **Adaptive Questions:**
#     Generate 5 personalized fill-in-the-blank questions for the student based on their current knowledge level. 
#     Each question should:
#     - Include a sentence with one or more blanks for the student to fill in.
#     - Provide the correct answers for the blanks for evaluation.
#     Provide output in this format:
#     {{
#         "questions": [
#             {{
#                 "question_id": 1,
#                 "sentence": "The capital of France is ____.",
#                 "difficulty_level": "easy",
#                 "correct_answers": ["Paris"]
#             }},
#             ...
#         ]
#     }}
#     """

#     response = get_gemini_response(prompt)
#     try:
#         response_dict = json.loads(response)
#     except json.JSONDecodeError:
#         raise HTTPException(status_code=500, detail="Failed to parse the response into JSON.")

#     return response_dict

# print("Script is running")



from fastapi import FastAPI, Form, HTTPException
import os
import json
from dotenv import load_dotenv
from io import BytesIO
from PIL import Image
import base64
from diffusers import StableDiffusionPipeline, EulerDiscreteScheduler
import torch

app = FastAPI()

# Load environment variables
load_dotenv()

from diffusers import StableDiffusionPipeline, EulerDiscreteScheduler
import torch

model_id = "stabilityai/stable-diffusion-2"
scheduler = EulerDiscreteScheduler.from_pretrained(model_id, subfolder="scheduler")

# Remove the torch_dtype argument for compatibility with CPU
pipe = StableDiffusionPipeline.from_pretrained(model_id, scheduler=scheduler)

# If running on CPU, use float32 (the default)
pipe = pipe.to("cpu")

prompt = "a photo of an astronaut riding a horse on mars"
image = pipe(prompt).images[0]
image.show()

# Helper function to convert PIL image to base64 string
def pil_to_base64(img: Image.Image) -> str:
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
    return img_str

# Helper function to get response from the Stable Diffusion model using the new scheduler
def generate_image_from_prompt(prompt: str):
    """
    Generate an image from a text prompt using Stable Diffusion with EulerDiscreteScheduler.
    """
    try:
        # Generate image
        image = pipe(prompt).images[0]
        # Convert image to base64 string
        return pil_to_base64(image)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating image: {str(e)}")

# Helper function to get response from the Gemini API
def get_gemini_response(input_text: str):
    """
    Get a response from the Gemini model based on the input prompt.
    """
    try:
        model = genai.GenerativeModel('gemini-pro')  # Use the Gemini API
        response = model.generate_content(input_text)
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

# Endpoint 1: Radio Button Type Question Generation
@app.post("/dynamic_question_generation_radio")
async def dynamic_assessment_radio(
    knowledge_level: str = Form(...), 
    learning_goal: str = Form(...)
):
    """
    Endpoint to dynamically generate radio button questions.
    """
    prompt = f"""
    You are an AI-powered assessment platform that dynamically adapts questions based on a student's performance and knowledge level.

    **Student's Knowledge Level:**
    {knowledge_level}

    **Learning Goal:**
    {learning_goal}

    **Adaptive Questions:**
    Generate 5 personalized radio button questions for the student based on their current knowledge level.
    Each question should:
    - Have 4 answer options for radio button selection (only one correct answer).
    - Provide a correct answer for evaluation.
    Provide output in this format:
    {{
        "questions": [
            {{
                "question_id": 1,
                "question": "What is 2+2?",
                "difficulty_level": "easy",
                "options": ["3", "4", "5", "6"],
                "correct_answer": "4"
            }},
            ...
        ]
    }}
    """

    # Generate the questions using Gemini
    response = get_gemini_response(prompt)
    try:
        response_dict = json.loads(response)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse the response into JSON.")

    # Generate an image related to the generated questions using Stable Diffusion
    image_prompt = f"Create an educational image related to {learning_goal} for students at {knowledge_level} level."
    image_base64 = generate_image_from_prompt(image_prompt)

    return {"questions": response_dict, "image_base64": image_base64}

# Endpoint 2: Checkbox Type Question Generation
@app.post("/dynamic_question_generation_checkbox")
async def dynamic_assessment_checkbox(
    knowledge_level: str = Form(...), 
    learning_goal: str = Form(...)
):
    """
    Endpoint to dynamically generate checkbox questions.
    """
    prompt = f"""
    You are an AI-powered assessment platform that dynamically adapts questions based on a student's performance and knowledge level.

    **Student's Knowledge Level:**
    {knowledge_level}

    **Learning Goal:**
    {learning_goal}

    **Adaptive Questions:**
    Generate 5 personalized checkbox questions for the student based on their current knowledge level. 
    Each question should:
    - Have 4 answer options for checkbox selection (multiple correct answers possible).
    - Provide a list of correct answers for evaluation.
    Provide output in this format:
    {{
        "questions": [
            {{
                "question_id": 1,
                "question": "Which of the following are prime numbers?",
                "difficulty_level": "medium",
                "options": ["2", "4", "6", "7"],
                "correct_answers": ["2", "7"]
            }},
            ...
        ]
    }}
    """

    # Generate the questions using Gemini
    response = get_gemini_response(prompt)
    try:
        response_dict = json.loads(response)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse the response into JSON.")

    # Generate an image related to the generated questions using Stable Diffusion
    image_prompt = f"Create an educational image related to {learning_goal} for students at {knowledge_level} level."
    image_base64 = generate_image_from_prompt(image_prompt)

    return {"questions": response_dict, "image_base64": image_base64}

# Endpoint 3: Fill-in-the-Blank Question Generation
@app.post("/dynamic_question_generation_fill_in_the_blanks")
async def dynamic_assessment_fill_in_the_blanks(
    knowledge_level: str = Form(...), 
    learning_goal: str = Form(...)
):
    """
    Endpoint to dynamically generate fill-in-the-blank questions.
    """
    prompt = f"""
    You are an AI-powered assessment platform that dynamically adapts questions based on a student's performance and knowledge level.

    **Student's Knowledge Level:**
    {knowledge_level}

    **Learning Goal:**
    {learning_goal}

    **Adaptive Questions:**
    Generate 5 personalized fill-in-the-blank questions for the student based on their current knowledge level. 
    Each question should:
    - Include a sentence with one or more blanks for the student to fill in.
    - Provide the correct answers for the blanks for evaluation.
    Provide output in this format:
    {{
        "questions": [
            {{
                "question_id": 1,
                "sentence": "The capital of France is ____. ",
                "difficulty_level": "easy",
                "correct_answers": ["Paris"]
            }},
            ...
        ]
    }}
    """

    # Generate the questions using Gemini
    response = get_gemini_response(prompt)
    try:
        response_dict = json.loads(response)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse the response into JSON.")

    # Generate an image related to the generated questions using Stable Diffusion
    image_prompt = f"Create an educational image related to {learning_goal} for students at {knowledge_level} level."
    image_base64 = generate_image_from_prompt(image_prompt)

    return {"questions": response_dict, "image_base64": image_base64}

# Start the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
