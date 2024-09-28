# Codify - Elevate Your Coding with AI

Welcome to **Codify**, your all-in-one platform to master coding effortlessly with AI-driven tools and curated resources. This project offers practice questions, coding assistance, and theoretical notes tailored for coders and aspiring developers.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Gradio Integration](#gradio-integration)
- [Temporary Links](#temporary-links)
- [Credits](#credits)

## Project Overview

Codify is designed to simplify and enhance your coding journey by leveraging AI technologies. The website provides:

- AI-generated coding challenges
- Curated notes and project guidance
- Multi-language programming support

The frontend is built with HTML and CSS, providing a smooth user experience and modern design.

## Features

1. **AI-Powered Practice Questions**  
   Access personalized coding challenges tailored to your skill level, using advanced AI models for accuracy and relevance.
   
2. **Short Notes & Theory**  
   Simplified notes and explanations for complex coding concepts.

3. **Problem-Solving Assistance**  
   AI-driven insights to debug and assist in solving coding problems.

4. **Project Guidance**  
   Receive AI support and advice for completing coding projects.

5. **Multi-Language Support**  
   Learn and practice different programming languages with specialized content.

## Live Demo
https://drive.google.com/file/d/15LzAtiv5cwjOrLmpYP6n5Rj7vAJdp02G/view?usp=sharing


## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/codify.git
    cd codify
    ```

2. Open the `index.html` file in your preferred browser.


## Usage

To run the project locally, simply open the `index.html` in a web browser. The website provides a user-friendly interface for exploring features like AI-powered practice questions, notes, and project guidance.

### Gradio Integration

Codify uses Gradio via Colab notebooks to generate temporary links for interactive AI-driven coding tools.

#### Gradio Process:

1. In your Google Colab notebook, ensure the required libraries like `gradio` and `groq` are installed:

    ```python
    !pip install gradio
    !pip install groq
    ```

3. Used Gradio's `Interface` to expose the model:

4. Once executed, Colab will generate a **temporary link** to access your Gradio interface. 

## Temporary Links

Here are the three temporary Gradio links generated from Colab:

1. [https://8bb1d8e4db7904ca14.gradio.live] 
   For Generating Questons
   {Generated from (Gradio is Generating Questions.ipynb) and used in (generate_questions.html)}

3. [https://339ee461b1caa01357.gradio.live]
   For Generating Notes
   {Generated from (Generate Notes.ipynb) and used in (generate_notes.html)}

4. [https://8af799ebd5264850d8.gradio.live]
   For AI Aid
   {Generated from (AI Aid.ipynb) and used in (AI_AID.HTML)}
  

Note: These links are temporary and will expire once the Colab session ends.

## Credits

- **Frontend Design:** HTML, CSS, and Google Fonts
- **AI Integration:** Gradio and Google Colab
- **Temporary Links:** Gradio temporary links were generated using Colab notebooks.
