
# Setup Scripts

## React setup

### `npm i`
This command will install all required packages for Frontend project

## ADD Gemini API

Create `.env` file in root. In this file ,Add API-KEY as:  

`REACT_APP_API_KEY = Your_API_Key_Here`


**Get your api key from Google Ai Studio**  

[Visit : Google AI STUDIO](https://aistudio.google.com/)

---
### `npm start`

Runs the app in the development mode automatically.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---
## Gesture detection model setup
This project using an virtual environment to run python scripts to run gesture-detection model

## Steps to create virtual environment:

 1. Open the **new terminal** in the root of this project and navigate to the API folder:  
 `cd api`

1. Install virtual environment of python in this folder
    
    `api> python -m venv venv`
    
2. Activate the virtual environment:
    
    `.\venv\Scripts\Activate`
    

    ### If this not works, Change execution policy
    ---

    **Step 1: Check the Current Execution Policy**

    First, check your current execution policy by running the following command in PowerShell:

    `Get-ExecutionPolicy`


    You will likely see `Restricted`, which means that scripts cannot be run.

    **Step 2: Change the Execution Policy**

    Run the following command **as an Administrator** (open PowerShell as Administrator):

    `Set-ExecutionPolicy RemoteSigned -Scope CurrentUse`

    **Step 3: Activate the Virtual Environment Again**

    Now, try activating your virtual environment again:

    `.\venv\Scripts\Activate`


    **Step 4: Revert the Execution Policy (Optional)**

    If you want to revert to the original execution policy after you finish your work, you can run:

    `Set-ExecutionPolicy Restricted -Scope CurrentUser`
    
    ---
4. Install required packages:
    
    `pip install flask`
    
    `pip install python-dotenv` 

    There are .env or .flaskenv files present. Do "pip install python-dotenv" to use them.

    `pip install opencv-python`
    
    `pip install mediapipe`

    `pip install sklearn`

---
5. Run flask using 
    
    `flask run`
    
6. Deactivate virtual environment, use Command:
`deactivate`

---

**We are using the Gesture Recognition Model that we trained using sklearn python library.**

