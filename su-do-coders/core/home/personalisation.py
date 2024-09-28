# Import necessary libraries
from transformers import pipeline
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Initialize the Gemini model for embeddings (change the model name based on your access)
model_name = "gemini-large"  # Use the appropriate model name if different
embedder = pipeline("feature-extraction", model=model_name, tokenizer=model_name)

# Sample job descriptions and user data
jobs = [
    {"id": 1, "description": "Software engineer with experience in Python and Django."},
    {"id": 2, "description": "Data analyst with skills in SQL and data visualization."},
    {"id": 3, "description": "Frontend developer proficient in React and JavaScript."},
]

users = [
    {"id": 1, "profile": "Experienced software developer skilled in Python and backend development."},
    {"id": 2, "profile": "Recent graduate with a passion for data analytics and machine learning."},
]

# Function to generate embeddings using Gemini
def get_embeddings(texts):
    embeddings = []
    for text in texts:
        # Get the first element since the pipeline returns a list of lists
        embedding = embedder(text)[0]
        embeddings.append(np.mean(embedding, axis=0))  # Taking the mean of the embeddings for simplicity
    return np.array(embeddings)

# Get embeddings for job descriptions and user profiles
job_texts = [job["description"] for job in jobs]
user_texts = [user["profile"] for user in users]

job_embeddings = get_embeddings(job_texts)
user_embeddings = get_embeddings(user_texts)

# Function to recommend jobs to each user
def recommend_jobs(job_embeddings, user_embeddings, jobs, top_n=3):
    recommendations = {}
    for idx, user_embedding in enumerate(user_embeddings):
        similarities = cosine_similarity([user_embedding], job_embeddings)[0]
        # Get the indices of the top-n most similar jobs
        top_jobs_idx = similarities.argsort()[-top_n:][::-1]
        # Store the recommendations for the user
        recommendations[idx] = [{"job_id": jobs[i]["id"], "similarity": similarities[i]} for i in top_jobs_idx]
    return recommendations

# Generate personalized job recommendations
personalized_recommendations = recommend_jobs(job_embeddings, user_embeddings, jobs)

# Display recommendations
for user_id, recommendations in personalized_recommendations.items():
    print(f"Recommendations for User {user_id + 1}:")
    for rec in recommendations:
        print(f" - Job ID: {rec['job_id']}, Similarity Score: {rec['similarity']:.2f}")
