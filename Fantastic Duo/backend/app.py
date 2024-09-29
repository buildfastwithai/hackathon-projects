from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
import bcrypt
import jwt
import datetime
from bson import ObjectId
import uuid
import threading
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
load_dotenv()

# Generative AI libraries
import google.generativeai as genai
from langchain_community.vectorstores import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI
from educhain import Educhain, LLMConfig



app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Your MongoDB URI
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

# Secret key for JWT encoding/decoding
SECRET_KEY =  os.getenv('SECRET_KEY') 


# Set up Educhain and the Gemini model
gemini_flash = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash-exp-0827",
    google_api_key=os.getenv("OPENAI_API_KEY")
)
flash_config = LLMConfig(custom_model=gemini_flash)
educhain_client = Educhain(flash_config)


@app.route('/signup', methods=['POST'])
def signup():
    username = request.json['username']
    email = request.json['email']
    password = request.json['password']
    
    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    # Insert the new user into the database
    mongo.db.users.insert_one({
        'username': username,
        'email': email,
        'password': hashed_password.decode('utf-8')
    })
    return jsonify({"message": "User registered successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    identifier = request.json['identifier']  # Can be username or email
    password = request.json['password']
    
    # Find user by username or email
    user = mongo.db.users.find_one({'$or': [{'username': identifier}, {'email': identifier}]})
    
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        # Create a JWT token
        token = jwt.encode({
            'user_id': str(user['_id']),
            'username': user['username'],
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({"message": "Login successful", "token": token, "username": user['username']}), 200
    
    return jsonify({"message": "Invalid credentials"}), 401

# Optional: Middleware to protect certain routes
@app.route('/protected', methods=['GET'])
def protected():
    token = request.headers.get('Authorization')  # Expecting token in Authorization header
    if not token:
        return jsonify({"message": "Token is missing!"}), 401

    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return jsonify({"message": "Protected content", "user_id": data['user_id'], "username": data['username']})
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired!"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token!"}), 401

from datetime import datetime

@app.route('/api/battles', methods=['GET'])
def get_battles():
    try:
        battles = mongo.db.quizzes.find()  # or your correct collection name
        battle_list = []
        for battle in battles:
            battle_list.append({
                "id": battle.get("quiz_id"),
                "title": battle.get("quiz_name"),
                "description": battle.get("quiz_description"),
                "num_questions": battle.get("num_of_questions"),
                "time": battle.get("time_limit"),
                "username": battle.get("creator_username"),
                "deadline": battle.get("deadline"),
                "created_at": battle.get("created_at")  # This is already a datetime object
            })

        # Sort the battle_list by 'created_at' in descending order
        sorted_battle_list = sorted(
            battle_list, 
            key=lambda x: x['created_at'], 
            reverse=True  # Descending order
        )

        return jsonify(sorted_battle_list)
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@app.route('/api/create_battle', methods=['POST'])
def create_battle():
    try:
        data = request.get_json()

        # Extract battle data from frontend
        battle_name = data['battleName']
        battle_description = data['battleDescription']
        num_questions = data['numQuestions']
        time_limit = data['timeLimit']
        creator_username = data['creatorUsername']
        deadline_hours = data['deadline']


        prompt = battle_name + '' + battle_description
        print("Hello hello x1")
        # Generate AI-powered questions using Educhain
        quiz_questions = educhain_client.qna_engine.generate_questions(
            topic=prompt,
            num=num_questions,

        )
        # print(quiz_questions)
        print("Hello hello x2")
        print(vars(quiz_questions)) 
        print(type(quiz_questions))
        print("Hello hello x2")
        # Create a unique ID and store quiz details
        quiz_id = str(uuid.uuid4())
        created_at = datetime.utcnow()
        deadline = created_at + timedelta(hours=int(deadline_hours))
        

        quiz_data = {
            "quiz_id": quiz_id,
            "quiz_name": battle_name,
            "quiz_description": battle_description,
            "num_of_questions": num_questions,
            "time_limit": time_limit,
            "created_at": created_at,
            "creator_username": creator_username,
            "deadline": deadline,
            "questions": [],  # Initialize as a list for structured data
            "users_attempted": []
        }

        try:
            for question in quiz_questions.questions:   # Accessing the questions
                quiz_data["questions"].append({
                    "question": question.question,
                    "answer": question.answer,
                    "explanation": question.explanation,
                    "options": question.options
            })

    # Now quiz_data is structured properly
            print(quiz_data)  # For debugging, to check the structure
        except Exception as e:
            print(f"Error while extracting questions: {e}")

        # Now quiz_data is ready to be inserted into MongoDB
        # Example of inserting into MongoDB (assuming you have a collection defined)
        mongo.db.quizzes.insert_one(quiz_data)

        return jsonify({"battle_id": quiz_id}), 201

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


from bson import ObjectId

@app.route('/api/quiz/<quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    quiz = mongo.db.quizzes.find_one({"quiz_id": quiz_id})
    if quiz:
        # Function to convert ObjectId fields to strings
        def convert_objectid(obj):
            if isinstance(obj, ObjectId):
                return str(obj)
            return obj

        # Create a new dictionary to store converted values
        quiz = {k: convert_objectid(v) for k, v in quiz.items()}

        return jsonify(quiz), 200
    return jsonify({"error": "Quiz not found"}), 404


@app.route('/api/quiz/<quiz_id>/attempted/<username>', methods=['GET'])
def check_quiz_attempted(quiz_id, username):
    quiz = mongo.db.quizzes.find_one({"quiz_id": quiz_id})
    if quiz:
        # Check if the username is in the users_attempted array
        attempted = any(user['username'] == username for user in quiz.get('users_attempted', []))
        return jsonify({"attempted": attempted}), 200
    return jsonify({"attempted": False}), 404


@app.route('/api/quiz/<quiz_id>/submit', methods=['POST'])
def submit_quiz(quiz_id):
    data = request.get_json()
    username = data.get("username")
    score = data.get("score")
    time_taken = data.get("time_taken")

    quiz = mongo.db.quizzes.find_one({"quiz_id": quiz_id})
        
    noOfQuestions = len(quiz.get('questions', []))
    # Find the quiz
    quiztitle = quiz.get('quiz_name') + ' ' + quiz.get('quiz_description')
    genai.configure(api_key=os.getenv("OPENAI_API_KEY"))
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"The learner completed a quiz on the topic of {quiztitle} and scored {score} out of {noOfQuestions}. Based on this score. Provide a feedback and encouragement on that score. Additionally, provide a brief feedback summary in fixed 200 words and a personalized learning path with 2-3 key resources (links to articles, videos, or exercises) to improve their knowledge. The response should only include the following: A concise feedback message, and a learning path with a list of URLs. Also wrap the links in anchor <a className='text-blue'></a>"
    response = model.generate_content(prompt)
    if quiz:
        # Check if the user already exists in users_attempted
        user_found = any(user['username'] == username for user in quiz.get('users_attempted', []))

        if user_found:
            # User exists, so update their score and time taken
            result = mongo.db.quizzes.update_one(
                {"quiz_id": quiz_id, "users_attempted.username": username},
                {
                    "$set": {
                        "users_attempted.$.score": score,
                        "users_attempted.$.time_completition": time_taken,
                        "users_attempted.$.personalized_feedback":response.text
                    }
                }
            )
        else:
            # User does not exist, so create a new entry in users_attempted
            new_user_attempt = {
                "username": username,
                "score": score,
                "time_completition": time_taken,
                "question_attempted": []  # Initialize as empty or populate if needed
            }
            result = mongo.db.quizzes.update_one(
                {"quiz_id": quiz_id},
                {
                    "$addToSet": {
                        "users_attempted": new_user_attempt
                    }
                }
            )

        # Check if any document was modified
        if result.modified_count == 0:
            return jsonify({"error": "No matching quiz or user found"}), 404

        return jsonify({"message": "Quiz submitted successfully"}), 200
    return jsonify({"error": "Quiz not found"}), 404

@app.route('/api/questionattempted/', methods=['POST'])
def question_attempted():
    try:
        data = request.json
        quiz_id = data.get('quiz_id')
        username = data.get('username')
        question = data.get('question')
        correct_answer = data.get('correctAnswer')
        user_answer = data.get('userAnswer')
        explanation = data.get('explanation')
        
        # Create the question_attempt object
        attempt = {
            "question": question,
            "correct_answer": correct_answer,
            "user_answer": user_answer,
            "explanation": explanation,
        }

        # Find the quiz by quiz_id
        quiz = mongo.db.quizzes.find_one({"quiz_id": quiz_id})

        if not quiz:
            return jsonify({"error": "Quiz not found"}), 404

        # Check if the user already exists in users_attempted
        user_found = any(user['username'] == username for user in quiz.get('users_attempted', []))

        if user_found:
            # User exists, so update their question_attempted
            result = mongo.db.quizzes.update_one(
                {
                    "quiz_id": quiz_id,
                    "users_attempted.username": username
                },
                {
                    "$push": {
                        "users_attempted.$.question_attempted": attempt
                    }
                }
            )
        else:
            # User does not exist, so create a new entry in users_attempted
            new_user_attempt = {
                "username": username,
                "question_attempted": [attempt]
            }
            result = mongo.db.quizzes.update_one(
                {"quiz_id": quiz_id},
                {
                    "$addToSet": {
                        "users_attempted": new_user_attempt
                    }
                }
            )

        if result.modified_count == 0:
            return jsonify({"error": "No matching quiz or user found"}), 404

        return jsonify({"message": "Question attempt recorded successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/api/quiz/<quiz_id>/user_score', methods=['GET'])
def get_user_score(quiz_id):
    # Fetch the quiz data from the database
    quiz = mongo.db.quizzes.find_one({"quiz_id": quiz_id})
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    username = request.args.get("username")
    
    noOfQuestions = len(quiz.get('questions', []))
    # Get the user's score, time completion, and attempted questions
    for user in quiz['users_attempted']:
        if user['username'] == username:
            user_data = {
                "username": user['username'],
                "score": user['score'],
                "time_completion": user['time_completition'],  # Assuming this field is named correctly
                "questions": user.get('question_attempted', []),
                "noOfQuestions" : noOfQuestions,
                "feedback" : user.get("personalized_feedback"),
            }
            print(user.get('question_attempted'))
            return jsonify(user_data), 200

    return jsonify({"error": "User not found for this quiz"}), 404



@app.route('/api/leaderboard/<quiz_id>', methods=['GET'])
def get_leaderboard(quiz_id):
    leaderboard = mongo.db.quizzes.aggregate([
        {"$match": {"quiz_id": quiz_id}},  # Filter by quiz_id
        {"$unwind": "$users_attempted"},
        {"$sort": {"users_attempted.score": -1}},
        {"$project": {
            "_id": 0,  # Exclude the default MongoDB _id field
            "username": "$users_attempted.username",
            "score": "$users_attempted.score",
            "time_taken": "$users_attempted.time_completition"
        }}
    ])

    leaderboard_list = []
    for entry in leaderboard:
        leaderboard_list.append({
            "username": entry.get("username"),
            "score": entry.get("score"),
            "time_taken": entry.get("time_taken")
        })

    return jsonify(leaderboard_list)

def delete_expired_quizzes():
    current_time = datetime.utcnow()
    mongo.db.quizzes.delete_many({"deadline": {"$lt": current_time}})

def run_periodic_cleanup():
    delete_expired_quizzes()
    threading.Timer(10, run_periodic_cleanup).start()  # Run every 10 seconds

# Start the periodic cleanup when the app runs
run_periodic_cleanup()

if __name__ == '__main__':
    app.run()
