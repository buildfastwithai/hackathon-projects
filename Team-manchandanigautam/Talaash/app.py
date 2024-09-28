from flask import Flask, render_template, request, send_from_directory
import spacy
import os
import matplotlib.pyplot as plt
import networkx as nx

# Load spaCy model
nlp = spacy.load('en_core_web_sm')

app = Flask(__name__)

# Function to extract keywords from the text using spaCy
def extract_keywords(text):
    doc = nlp(text)  # Process the text with spaCy NLP pipeline
    keywords = [token.text for token in doc if token.pos_ in ['NOUN', 'ADJ', 'VERB']]  # Extract nouns, adjectives, and verbs
    return keywords

# Function to create a mind map using networkx and matplotlib
def create_mind_map(keywords):
    G = nx.Graph()

    # Add the main node
    main_node = 'Mind Map'
    G.add_node(main_node)

    # Add keywords as child nodes connected to the main node
    for keyword in keywords:
        G.add_node(keyword)
        G.add_edge(main_node, keyword)

    # Draw the mind map
    plt.figure(figsize=(10, 8))
    pos = nx.spring_layout(G)
    nx.draw(G, pos, with_labels=True, node_color='lightblue', node_size=3000, font_size=12, font_weight='bold', edge_color='gray')
    plt.title('Generated Mind Map')

    # Save the mind map as an image
    if not os.path.exists('static'):
        os.makedirs('static')
    plt.savefig('static/mind_map.png')
    plt.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    text = request.form['text']  # Get the input text from the form
    keywords = extract_keywords(text)  # Extract keywords using spaCy
    create_mind_map(keywords)  # Create a mind map based on the keywords
    return render_template('index.html')  # Render the same index page to show the mind map

if __name__ == '__main__':
    app.run(debug=True)




