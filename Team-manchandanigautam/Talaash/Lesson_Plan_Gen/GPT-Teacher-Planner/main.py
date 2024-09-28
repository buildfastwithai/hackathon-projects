from fastapi import FastAPI, UploadFile, File, HTTPException, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from typing import List
import openai
import json
from response_html import Preview
from datetime import date
import pdfkit

openai.api_key = "sk-YOUR OPENAI API CODE" # Enter your openAI code

today = date.today().strftime("%Y-%m-%d")


def get_completion_from_messages(messages,
                                 model="gpt-3.5-turbo",
                                 temperature=0.7,
                                 max_tokens=1900):
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=temperature, # this is the degree of randomness of the model's output
        max_tokens=max_tokens, # the maximum number of tokens the model can ouptut
    )
    return response.choices[0].message["content"]


delimiter = "####"
system_message = """\
You will be provided with lesson strategy plan queries. you have to assisst teachers and schools to make 
new lesson plan to be more interactive for students. Explain all following process in details so teacher 
will understand what you mean and what to do. Also provide strategy so teacher will know stepwise and when and what to show. for example the video you provide. \
The lesson strategy plan query will be delimited with \
#### characters.\

You will get input in json format from user that are school teachers in\
following format:
'Lesson Title': <It will be the string that describes the lesson title>
'Subject':<The user will give you the Subject name>
'Grade':<the user will provide that which grade the students are so you have\
to explain it related to respective grade and consider the student understanding at that age >
'Duration':<will be an integer for example 1 or 2, based on integer provided you have to write lesson strategy plan.\
keep in mind each session is 50 minutes>
Key vocabulary: <it will be in python list format that gives you understanding which part to focus more.>

Supporting Materials and resources:<It will be the options like video, Microsoft office and etc. If any available you have to use that method or tools in strategy material for video you have to suggest video or tutorial from internet.>

Output a python list of objects, where each object has \
the following format:
    'Learning outcomes (What will they learn?)': < It will be the answer to following questions:Does the plan include a lesson or unit title?\
Does the plan specify a subject or subject/s?\
Does the plan include key vocabulary needed?\
Does the plan include a list of materials and equipment needed?\
Is the plan supported by digital resources in addition to the main curriculum content?\
Does the plan include duration and a date?\
Does the plan identify specific knowledge, skills, and understandings referenced in the curriculum standards?\
You have to answer these question in following format: ['knowladge':<we want students know about:>\
'skils':<We want students to become proficient in:>\
'understanding':<We want students to understand the consept/s of:>\
'Differentitaion': <It's two parts to answer two different question in this part,\ 
these are two questions:\
How will you modify the task for students needing additional support?\

How will you extend the task for students needing additional challenge?\
Set student a time limit to complete different task, e.g. set 3 minute timer for the student to list 10 bones\
    Students find adjectives to describe different bones'\}, \{'Learning experiences (How will they learn?)': \{'Prepare': 'Look at the pictures (https://drive.google.com/drive/folders/1vXbyrS0WJBW3N_h1EwjK5fjlRGVxx2xC?usp=sharing )\
Now look at this picture of a slug https://drive.google.com/drive/folders/1dwX2fv19IC3kIFz2QxI10T8_eZgV3HGM?usp=share_link\
Which of these movements is the slug unable to do? Why do you think so?\
What is a skeleton?\
What parts of your skeleton do you know?\
What is the most important bone in your body? Why? (students’ opinions)
>]
>,
AND
    'Learning experiences (How will they learn?)': <an answer to different sections as following:\
    'Prepare':<Students get ready for learning by making a personal connection to the topic\
    They think about:\
    What do I already know about the topic?\
    Why do I need to learn this?\
    What are some key words I need to know?\
    >,
    'Plan':<Students decide on their steps for learning\
            They think about:\
            What do I need to complete by the end?\
            How much time do I have?\
            What will I do first?\
            Do I have all the materials I need?\
            How will I get help if I need it?\
    >,
    'Investigate': <Students explore in a structured way to collect and record information\
                    They think about:\
                    What do I want to find out?\
                    Where can I find what I need?\
                    How can I record my findings?\
                    Now that you have planned, you may start the activities.\
                    Welcome to our new friend The Skeleton\
                    https://learn.tdschool.org/d2l/le/lessons/12710/topics/1152344 Compare the bones of a child with the bones of an adult\
                    Look at how bones grow\
                    Connect each bone with its location in the skeleton, and its main function

    >,
    'apply':<Students organize the information; practice skills; deepen understanding\
            They think about:\
            What did I find out?\
            How can I organize the information?\
            What skills did I use?\
            How can I get better at them?\
    >,
    'Connect':<Students make connections to personal, local and global situations; share learning with others\
                They think about:\
                How does what I learned affect my life? My country? Other people in the wider world?\
                How can I share my learning with others?
    >,
    'Evaluate and reflect': <Students review what was learned, the process, next steps
                            They think about:\
                            What did I learn about?\
                            What skills did I use?\
                            What important points did I learn?\
                            What else would I like to learn about this topic or related topics?\
                            How well did I organize my learning?\
                            How could I improve my learning next time?\
    >
    ' Educator assessment of student learning outcomes (What did they learn?)':<a text to explain\
    this section regarding the material that you used and plan for it, Or make small quiz to test students knowladge\
    provide a questions for student testing.>,
    'Educator reflection (How can I improve this lesson next time?)': <answer to this as a paragraph or ask guiding question.>
    >,


Example that how will it look like:

input example 2:
Lesson Title: multiplication in math
Subject: Math
Grade: 3
Duration: 1
Key Vocabulary: ['multiply numbers', 'multiply two digit to one digit number', 'multiply n digit to n digit numbers']
supporting materials and resources: ['Laptops', 'Microsoft Office']


output example 2:
[{
    "Learning outcomes (What will they learn?)": {
        "knowladge": "We want students to know about: the concept of multiplication, how to multiply numbers, how to multiply two-digit numbers by one-digit numbers, and how to multiply n-digit numbers by n-digit numbers.",
        "skils": "We want students to become proficient in: multiplying numbers, multiplying two-digit numbers by one-digit numbers, and multiplying n-digit numbers by n-digit numbers.",
        "understanding": "We want students to understand the concept/s of: multiplication as repeated addition, the relationship between multiplication and division, and the commutative and associative properties of multiplication."
    },
    "Learning experiences (How will they learn?)": {
        "Prepare": "Students will be asked to think about the following questions:<br>- What is multiplication?<br>- How is multiplication related to addition?<br>- What are some real-life situations where multiplication is used?",
        "Plan": "Students will be given a worksheet with multiplication problems of varying difficulty. They will be asked to plan their approach to solving the problems, including:<br>- How will they break down the problem?<br>- What strategies will they use to solve the problem?<br>- How will they check their work?",
        "Investigate": "Students will work independently on the worksheet, using laptops and Microsoft Office to help them solve the problems. They will be encouraged to use online resources to help them if they get stuck.",
        "Apply": "Students will work in pairs to create their own multiplication problems, using two-digit and three-digit numbers. They will then swap problems with another pair and solve each other's problems.",
        "Connect": "Students will be asked to think about how multiplication is used in the real world, and how it relates to other areas of math such as division and fractions. They will be encouraged to share their thoughts with the class.",
        "Evaluate and reflect": "Students will complete a short quiz to test their understanding of the key concepts covered in the lesson. They will then reflect on their learning by answering the following questions:<br>- What did you learn about multiplication today?<br>- What strategies did you use to solve the problems?<br>- What could you do differently next time?"
    },
    "Educator assessment of student learning outcomes (What did they learn?)": "A final quiz to test the key vocabulary:<br>1. What is multiplication?<br>2. What is the relationship between multiplication and addition?<br>3. What are the commutative and associative properties of multiplication?<br>4. How do you multiply two-digit numbers by one-digit numbers?<br>5. How do you multiply n-digit numbers by n-digit numbers? <br> two times 8?",
    "Educator reflection (How can I improve this lesson next time?)": "Guiding questions:<br>- Were the learning outcomes achieved?<br>- Were the learning experiences engaging and effective?<br>- Were the supporting materials and resources helpful?<br>- Were the differentiation strategies effective?<br>- What could be improved next time?" 
}]

NOTE: All of the above objects mentioned should be available an answer in detail as much as you can. Also, don't forget to provide all the exlanation as study plan strategist. 
ALERT: <The output should be in JSON format otherwise it's not acceptable.> 
AND 
<All json keys should be double qouted. && INsted of using \/n for new line use <br> element so it will good for HTML.>


WARNING: You're not supposed to write any content before or after the json output you made. Provided structure will be acceptable only. 
"""

app = FastAPI()
templates = Jinja2Templates(directory="templates")


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/js", StaticFiles(directory="js"), name="css")
app.mount("/css", StaticFiles(directory="css"), name="css")

@app.get("/")
def index():
    with open("index.html", "r") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content, status_code=200)


@app.post("/")
def process_form(
        lesson_title: str = Form(...),
        subject: str = Form(...),
        grade: int = Form(...),
        duration: int = Form(...),
        key_vocabulary: str = Form(...),
        supporting_materials_and_resources: List[str] = Form(...),

):
    # Process the form data
    # You can perform further operations here, such as saving the data or processing the files
    tag_list = [tag.strip() for tag in key_vocabulary.split(",")]
    # Example: printing the form data
    print("Lesson Title:", lesson_title)
    print("Subject:", subject)
    print("Grade:", grade)
    print("Duration:", duration)
    print("Key Vocabulary:", tag_list)
    print("supporting materials and resources:", supporting_materials_and_resources)
    user_message_1 = f""""Lesson Title:"{lesson_title}\n"Subject:"{subject}\n"Grade:"{grade}
    \n"Duration:"{duration}\n"Key Vocabulary:"{tag_list}\n
    "supporting materials and resources:"{supporting_materials_and_resources}"""

    messages = [
        {'role': 'system',
         'content': system_message},
        {'role': 'user',
         'content': f"{delimiter}{user_message_1}{delimiter}"},
    ]
    global category_and_product_response_1
    category_and_product_response_1 = get_completion_from_messages(messages)
    print(type(category_and_product_response_1))
    print(category_and_product_response_1)
    return RedirectResponse(url="/success")


@app.post("/success")
def success():
    # Define path to wkhtmltopdf.exe
    path_to_wkhtmltopdf = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
    # Point pdfkit configuration to wkhtmltopdf.exe
    config = pdfkit.configuration(wkhtmltopdf=path_to_wkhtmltopdf)
    html_response = Preview(response=category_and_product_response_1)
    pdf_path = "static/lesson_details.pdf"
    pdfkit.from_string(html_response, pdf_path, configuration=config)
    return HTMLResponse(content=html_response)


@app.post("/api")
def process_form(
        lesson_title: str = Form(...),
        subject: str = Form(...),
        grade: int = Form(...),
        duration: int = Form(...),
        key_vocabulary: str = Form(...),
        supporting_materials_and_resources: List[str] = Form(...),

):
    # Process the form data
    # You can perform further operations here, such as saving the data or processing the files
    tag_list = [tag.strip() for tag in key_vocabulary.split(",")]
    # Example: printing the form data
    print("Lesson Title:", lesson_title)
    print("Subject:", subject)
    print("Grade:", grade)
    print("Duration:", duration)
    print("Key Vocabulary:", tag_list)
    print("supporting materials and resources:", supporting_materials_and_resources)
    user_message_1 = f""""Lesson Title:"{lesson_title}\n"Subject:"{subject}\n"Grade:"{grade}
    \n"Duration:"{duration}\n"Key Vocabulary:"{tag_list}\n
    "supporting materials and resources:"{supporting_materials_and_resources}"""

    messages = [
        {'role': 'system',
         'content': system_message},
        {'role': 'user',
         'content': f"{delimiter}{user_message_1}{delimiter}"},
    ]

    category_and_product_response_1 = get_completion_from_messages(messages)
    print(type(category_and_product_response_1))
    print(category_and_product_response_1)
    json_object = json.loads(category_and_product_response_1)

    return json_object, {"Date:": f"{today}"}, {"Teacher Name:": f"user.login.name"}

@app.get("/download-pdf")
def process_form():
    return FileResponse("static/lesson_details.pdf", media_type="application/pdf", filename="lesson_details.pdf")
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=8000)
