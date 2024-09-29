from django.shortcuts import render
from django.http import HttpResponse
import google.generativeai as genai
import os
import pathlib
from django.core.files.storage import FileSystemStorage
from .helping_utils import text_formatter

# response = model.generate_content("Ask 5 question abt deep learning to test my knowledge so you can hekp me accordingly give ques seprated by - nothin else.")


API_KEY = 'AIzaSyDhfavnFBGdFw_p-GEsEmYYMZbovlV1WH4'
genai.configure(api_key= API_KEY)

model = genai.GenerativeModel("gemini-1.5-pro")

def test(request):
    if request.method == 'POST':
        query = request.POST.get('search')  # Get the search term from the HTML form
        uploaded_file = request.FILES.get('file') # i have used get as file upload is optional

        if (not uploaded_file) and (not query):
            context = {
                'popup' : True
            }
            return render(request, 'home.html', context)


        # complete beginner section
        if uploaded_file:
            # Get the root directory of the project
            root_directory = pathlib.Path(__file__).parents[1] # Root directory of your Django project

            # Save the file in the root directory
            filename = uploaded_file.name
            file_path = os.path.join(root_directory, filename)

            # Save file using FileSystemStorage
            with open(file_path, 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)

            query = None

            sample_pdf = genai.upload_file(file_path) #media / file_url)
            response = model.generate_content(["read this pdf file  and generate a quiz of upto 7-9 mcqs display your output on my html page after each quiz question put a small button clicking which its answer should be shown", sample_pdf])

        else:
            response = model.generate_content(f"generate a quiz of upto 7-9 mcqs on topic {query} respond using html tags so i can display your output on my html page after each quiz question put a small button clicking which its answer should be shown")

        txt = response.text
        lst = list(txt.rpartition('```'))
        txt = lst[0]
        return render(request, 'quiz.html', {'results':[txt]})
            
    else:
        return render(request,'test.html')

def roadmap(request):
    if request.method == 'POST':
        roadmap_text = request.POST.get('roadmap_text')
        print(roadmap_text)
        roadmap_lst = text_formatter(roadmap_text)
        print(roadmap_lst)

        return render(request, 'roadmap.html', {'roadmap' : [''.join(roadmap_lst)]})
    else:
        return render(request, 'home.html',{'popup':None})
    
# Create your views here.
def response(request):
    if request.method == 'POST':
        query = request.POST.get('query')  # Get the search term from the HTML form
        dictt = request.POST.get('questions')
        uploaded_file_path = request.POST.get('file') 

        # print(f"DICTIONARY : {type(dictt)}")
        dictt =  eval(dictt)
        questions = dictt.values()
        answers = []
        for i in dictt:
            answers.append(request.POST.get(f'question{i}'))


        # print(f"QUESTIONS : {questions}")
        # print(f'ANSWERS : {answers}')
        # print(f'QUERY : {query}')

        # for i in dictt:
        print(f'UPLOADED IN REPONSE : {uploaded_file_path}')

        if uploaded_file_path:
            
            sample_pdf = genai.upload_file(uploaded_file_path) #media / file_url)
            # response = model.generate_content([f"You are a teacher and this is a pdf file that a student is not able to understand , so you asked the student some questions : {questions} and here's how he/she responded : {answers} now just explain the pdf Dont talk anything about how to explain or how student responded.", sample_pdf])
            response = model.generate_content([f"I will provide you with a set of questions, their corresponding answers, and a PDF document related to the topic. Your task is to understand the students knowledge based on their answers, then explain the content of the PDF in a way the student can understand, Questions: {questions} Answers: {answers} respond using html tags so i can display your output on my html page", sample_pdf])
        else:
            # response = model.generate_content(f"These are the questions i asked user : {questions} and these are answers givenby user: {answers} now judge the knowledge of user and accordingly explain about {query} this response will be given to user so write accordingly")
            response = model.generate_content(f"You are a teacher and These are the questions you asked your student to test their knowledge so you can accordingly explain them about {query} : {questions} and these are answers given by student: {answers} now according to knowledge of your student explain about {query} respond using html tags so i can display your output on my html page")

        roadmap_response = model.generate_content(f"this is the response you gave to me for learning : {response.text}, also generate a roadmap for me and use html tags in your response so i can show the results on my html page")
        print(f"ROADMAP : {roadmap_response.text}")
        
        txt = response.text
        # print(txt)
        lst = text_formatter(txt)
        # lst[1] = '</h2>'
                
        # You can now process the query (e.g., search in the database)
        context = {
            'query': query,
            'results': [' '.join(lst)],  # Dummy results for now
            'roadmap_text' : roadmap_response.text
        }
        return render(request, 'response.html', context)
    else:
        return render(request, 'home.html',{'popup':None})

def home(request):
    if request.method == 'POST':
        # HANDLING THE SEARCH
        query = request.POST.get('search')  # Get the search term from the HTML form
        beginner = request.POST.get('beginner')
        print(f"BEGIN : {beginner}")
        uploaded_file = request.FILES.get('file') # i have used get as file upload is optional

        
        if (not uploaded_file) and (not query):
            context = {
                'popup' : True
            }
            return render(request, 'home.html', context)


        if beginner:
            # complete beginner section
            if uploaded_file:
                # Get the root directory of the project
                root_directory = pathlib.Path(__file__).parents[1] # Root directory of your Django project

                # Save the file in the root directory
                filename = uploaded_file.name
                file_path = os.path.join(root_directory, filename)

                # Save file using FileSystemStorage
                with open(file_path, 'wb+') as destination:
                    for chunk in uploaded_file.chunks():
                        destination.write(chunk)

                query = None

                sample_pdf = genai.upload_file(file_path) #media / file_url)
                response = model.generate_content(["You are a teacher and this is a pdf file that a student is not able to understand as he i a complete beginner so read the pdf and explain him respond using html tags so i can display your output on my html page", sample_pdf])

            else:
                response = model.generate_content(f"You are a teacher and  your student is a complete beginner and dont know about {query} now accordingly explain about {query} to your student respond using html tags so i can display your output on my html page")
            
            roadmap_response = model.generate_content(f"this is the response you gave to me for learning : {response.text}, also generate a roadmap for me and use html tags in your response so i can show the results on my html page")
            print(f"ROADMAP : {roadmap_response.text}")

            lst = text_formatter(response.text) 

            context = {
                'query': query,
                'results': [' '.join(lst)],  # Dummy results for now
                'roadmap_text' : roadmap_response.text,
            }
            
            return render(request, 'response.html', context)
        
        ## HANDLING THE FILES
        # Save file using FileSystemStorage
        if uploaded_file:
            # Get the root directory of the project
            root_directory = pathlib.Path(__file__).parents[1] # Root directory of your Django project

            # Save the file in the root directory
            filename = uploaded_file.name
            file_path = os.path.join(root_directory, filename)

            # Save file using FileSystemStorage
            with open(file_path, 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)

            query = None
            
            print(f'file_path : {file_path}')
            # print(f'UPLOADED FILES : {uploaded_file}')
            # media = pathlib.Path(__file__).parents[1] / "third_party"

            sample_pdf = genai.upload_file(file_path) #media / file_url)
            response = model.generate_content(["You are a teacher and this is a pdf file that a student is not able to understand , read the pdf and ask the student 4 to 5 questions to know if the student have prerequisite knowledge to understand pdf and give ques seprated by <==> and give only ques not any other text and dont give numbering of questions.", sample_pdf])
            # print(f'Final PDf response : {response.text}')
            
        else:
            file_path = None

            response = model.generate_content(f"Ask 5 question abt {query} to test my knowledge so you can help me accordingly give ques seprated by <==> nothin else and don't give numbering of questions.")        
        
        #  common preprcoessing for both rfile upload and topic asked
        txt = response.text
        txt = txt.replace('\n','')
        lst = txt.split('<==>')
        new_list = []
        for i in lst:
            if not (i == '' or i == ' '):
                new_list.append(i)

        lst = new_list
        d = {}
        for num, i in enumerate(lst):
            d[num+1] = i
        # d.pop(0)
                
        # You can now process the query (e.g., search in the database)


        context = {
            'query': query,
            'questions': d,  # Dummy results for now
            'file_path' : file_path
        }


        return render(request, 'ques.html', context)
    else:
        return render(request, 'home.html', {'popup':None})
