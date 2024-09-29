# MindWars AI - AI-Generated Quiz Contest Platform

MindWars AI is an AI-generated quiz contest platform that allows users to create, join, and compete in quiz contests. With a focus on interactive and user-friendly design, the platform provides a competitive environment where participants are ranked based on their quiz scores. Our primary goal is to enhance user experience by offering AI-driven quiz generation, real-time matchmaking, and personalized leaderboards for each contest.

## Key Features
- **Create Quiz Contest**: Users can create custom AI-generated quiz contests by specifying the quiz topic, number of questions, and difficulty level.
- **Join Quiz Contest**: Players can join live contests and compete against others in real-time.
- **Leaderboard**: After each contest, a leaderboard displays the rankings based on quiz scores and time taken.
- **User Authentication**: Sign up and log in with secure password hashing to ensure data privacy.
- **Interactive UI**: Built with React.js, providing smooth navigation and an engaging user interface.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Python Flask
- **Database**: MongoDB

## Project Structure
```
Fantastic Duo/
│
├── Frontend/
│   └── [React.js code]
│
└── Backend/
    ├── .env  # Environment variables like API keys, MongoDB URI, and secret key
    ├── app.py  # Flask routes and AI logic
    └── requirements.txt  # Python dependencies
```

## Installation Guide

### Frontend Setup (React.js)
1. Navigate to the `frontend` directory:
   ```bash
   cd Fantastic Duo/frontend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```
   Make sure the frontend server runs on a specific port (e.g., `localhost:3000`).

### Backend Setup (Python Flask)
1. Navigate to the `backend` directory:
   ```bash
   cd Fantastic Duo/backend
   ```
2. **Environment Setup**:  
   Create an `.env` file with the following keys:
   - `MONGO_URI`: Your MongoDB Atlas connection string. The MONGO_URI, for e.g ( mongodb+srv://ashishsah11110112:<db_password>@userauthcluster.fvhu1.mongodb.net/<db_name>) 
   - Then, under the mongodb database <db_name> : You'll have to create two collections
   -  i) users
   -  ii) quizzes

   - `OPENAI_API_KEY`: Generate this from [Google AI Studio](https://ai.google.dev/aistudio).
   - `SECRET_KEY`: A custom secret key for session management (e.g., `mysecretkey123`).

   Example `.env` file:
   ```env
   MONGO_URI="your-mongo-uri-here"
   OPENAI_API_KEY="your-google-api-key-here"
   SECRET_KEY="your-secret-key"
   ```

3. Create a virtual environment:
   ```bash
   python -m venv env
   ```
4. Activate the virtual environment:
   - On Windows:
     ```bash
     env\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source env/bin/activate
     ```

5. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
6. Run the Flask backend server:
   ```bash
   flask run
   ```

### Running the Application
- Ensure both the frontend (React) and backend (Flask) servers are running.
- Once the servers are up and running, open the frontend URL (e.g., `http://localhost:3000`) in your browser to interact with the application.

## Additional Information

### Backend File Breakdown:
- **`.env`**: Contains environment-specific configuration, such as database connection strings and API keys.
- **`app.py`**: The main backend logic, including routes for quiz creation, user authentication, leaderboard fetching, and AI-based quiz generation.
- **`requirements.txt`**: Lists the Python libraries and their specific versions required for Flask to function correctly. Key dependencies include Flask, Flask-CORS, and pymongo.

Make sure to run both servers simultaneously to fully experience the app.

Enjoy the competitive AI-driven quiz platform with MindWars AI!
