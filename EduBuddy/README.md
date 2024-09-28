# EduBuddy

*EduBuddy* is an AI-powered learning companion designed to enhance the study experience by providing personalized learning support for students of all levels. The platform leverages AI to deliver interactive educational tools that help students excel in their academic journey.

## Features

EduBuddy offers a comprehensive suite of learning tools:

- *Doubt Solving*: Ask questions and receive clear explanations from AI.
- *Flashcards*: Generate custom flashcards to aid memorization and revision.
- *Quiz Generation*: Create personalized quizzes to test knowledge.
- *Code Generation*: Get code snippets and explanations for various programming topics.

## Getting Started

These instructions will help you set up EduBuddy on your local machine for development and testing.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

## Installation

1. Clone the repository:

    bash
    git clone https://github.com/bhavkushwaha/EduBuddy
    

2. Navigate into the project directory:

    bash
    cd EduBuddy
    

3. Install dependencies:

    bash
    npm install
    

4. (Optional) Set up the database and configure environment variables:

    Create a .env file in the root directory with the following variables:

    
    # Example .env file

    ```

    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=your-username
    DATABASE_URL=your-url

    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "your_key"
    CLERK_SECRET_KEY = "your_key"   

    ```
    

## Usage

1. Start the development server:

    bash
    npm run dev
    

2. Open your browser and navigate to:

    
    http://localhost:3000
    

3. To create a production build:

    bash
    npm run build
    
    

## Configuration

EduBuddy requires certain environment variables to be set for database connections and API key integration:

- **Database Configuration**: Modify the `.env` file as needed.
- **API Keys**: If using third-party APIs for quiz generation or code snippets, add them in the `.env` file (we used OpenAI )

    ```

    OPENAI_API_KEY=your-openai-api-key

    ```

## Scripts/Commands

The project includes several scripts to streamline development and deployment:

- npm start: Starts the server in production mode.
- npm run dev: Starts the server in development mode with hot-reloading.
- npm run build: Builds the project for production.