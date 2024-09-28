import requests

# Define your API endpoint and API key (replace with actual endpoint and key)
API_URL = 'https://api.genai.com/v1/generate'  # Replace with actual endpoint
API_KEY = 'your_api_key_here'  # Replace with your API key

# Define the prompt or input for the generative model
prompt = {
    "task": "data_cleaning",  # Specify the task
    "input": {
        "url": "https://www.timesjobs.com/candidate/job-search.html?searchType=personalizedSearch&from=submit&txtKeywords=python",
        "instructions": [
            "Extract job postings from the page.",
            "Clean and structure data fields: company name, skills, posted date, and apply link.",
            "Handle missing fields gracefully and return the cleaned data in JSON format."
        ]
    }
}

# Headers including the API key for authentication
headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

try:
    # Make the POST request to the API
    response = requests.post(API_URL, headers=headers, json=prompt)

    # Check if the response was successful
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()
        print("Cleaned Data:", data)
        # Further processing of data if needed
    else:
        print(f"Failed to call the API. Status Code: {response.status_code}, Message: {response.text}")

except Exception as e:
    print(f"An error occurred: {e}")