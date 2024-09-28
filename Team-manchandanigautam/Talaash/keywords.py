from flask import Flask, render_template, request
from transformers import BertTokenizer, BertModel
import torch
import numpy as np

app = Flask(__name__)

# Load BERT tokenizer and model
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/extract_keywords', methods=['POST'])
def extract_keywords():
    if request.method == 'POST':
        text = request.form['text']
        keywords = extract_keywords_from_text(text)
        return render_template('index.html', keywords=keywords)

def extract_keywords_from_text(text):
    # Tokenize text and get BERT embeddings
    inputs = tokenizer(text, return_tensors="pt", max_length=512, truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
        embeddings = outputs.last_hidden_state.mean(dim=1).squeeze()

    # Calculate token importance
    token_importance = torch.abs(embeddings).sum(dim=0)

    # Convert tensor to numpy array and ensure it's an iterable array
    token_importance_np = token_importance.cpu().numpy()
    token_importance_list = np.asarray([token_importance_np])

    # Get tokens from the input IDs
    tokens = tokenizer.convert_ids_to_tokens(inputs['input_ids'][0].tolist())

    # Convert token importance to dictionary for easier processing
    token_importance_dict = {token: float(importance) for token, importance in zip(tokens, token_importance_list)}

    # Exclude the "[CLS]" token before sorting
    sorted_tokens = [(token, importance) for token, importance in token_importance_dict.items() if token != '[CLS]']

    # Sort the token-importance pairs and extract the top 10 keywords
    sorted_tokens = sorted(sorted_tokens, key=lambda x: x[1], reverse=True)
    keywords = [token for token, _ in sorted_tokens[:10]]

    # Return the keywords as a list
    return keywords

if __name__ == '__main__':
    app.run(debug=True)