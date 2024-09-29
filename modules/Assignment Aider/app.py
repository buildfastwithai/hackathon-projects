import re
import streamlit as st
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import io
import base64
import os

load_dotenv()
google_api_key = os.getenv("GOOGLE_API_KEY")

# Function to strip markdown using regex
def strip_markdown(md_text):
    """Removes markdown formatting from text."""
    # Remove headings (## or #)
    md_text = re.sub(r'#+ ', '', md_text)
    # Remove bold (** or __)
    md_text = re.sub(r'\*\*(.*?)\*\*', r'\1', md_text)
    md_text = re.sub(r'__(.*?)__', r'\1', md_text)
    # Remove italics (* or _)
    md_text = re.sub(r'\*(.*?)\*', r'\1', md_text)
    md_text = re.sub(r'_(.*?)_', r'\1', md_text)
    # Remove unordered list bullets (* or -)
    md_text = re.sub(r'^[-*] ', '', md_text, flags=re.MULTILINE)
    # Remove links [text](url)
    md_text = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', md_text)
    # Remove any remaining markdown symbols
    md_text = re.sub(r'[`~>]', '', md_text)
    
    return md_text

def wrap_text(text, max_length):
    """Wraps text to a specified maximum length and preserves new lines."""
    lines = []
    paragraphs = text.split('\n')  # Split the text into paragraphs
    
    for para in paragraphs:
        words = para.split(' ')
        current_line = ""
        
        for word in words:
            test_line = f"{current_line} {word}".strip()
            if len(test_line) <= max_length:
                current_line = test_line
            else:
                if current_line:  # Save the current line if it's not empty
                    lines.append(current_line)
                current_line = word
        
        if current_line:  # Append the last line in the paragraph
            lines.append(current_line)
        
        lines.append('')  # Add an empty string to represent the paragraph break (new line)
    
    return lines


def create_handwritten_pdf(text, font_path):
    """Creates a handwritten PDF from the provided text."""
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    pdfmetrics.registerFont(TTFont("NanumPen", font_path))
    
    # Set the handwriting font
    c.setFont("NanumPen", 18)
    
    width, height = A4
    lines = wrap_text(text, 80)  # Wrap text with max 85 characters per line
    y_position = height - 30  # Start from the top of the page
    
    for line in lines:
        if line:  # Only draw text if the line is not empty
            c.drawString(50, y_position, line)
        y_position -= 20  # Move down for the next line, including blank lines
        
        if y_position < 50:  # If reaching the bottom of the page
            c.showPage()  # Create a new page
            c.setFont("NanumPen", 18)  # Reset the font after new page creation
            y_position = height - 50  # Reset y_position for the new page
    
    c.save()
    buffer.seek(0)
    return buffer


def main():
    st.title("Assignment Aider")
    
    # Text input
    text = st.text_area("Enter your Assignment Questions here:", height=200)

    st.markdown(
        'Want to create fonts in your own handwriting? '
        '[Click here to learn how](https://youtu.be/tnhqLJIf7Uk?si=OIDsxQZ26iuCnlQM).'
    )

    # Font upload
    uploaded_font = st.file_uploader("Upload your handwriting.ttf font file: (optional)", type=["ttf"])

    # Set default font path if no font is uploaded
    default_font_path = "./NanumPenScript-Regular.ttf"  # Path to your default handwriting font
    font_path = None

    if uploaded_font is not None:
        # Save the uploaded font temporarily
        font_path = f"/tmp/{uploaded_font.name}"
        with open(font_path, "wb") as f:
            f.write(uploaded_font.getbuffer())
    else:
        font_path = default_font_path

    if st.button("Generate PDF"):
        if text:
            # Show spinner while generating PDF
            with st.spinner("Generating PDF..."):
                # LLM answer generator
                llm = ChatGoogleGenerativeAI(
                    model="gemini-1.5-flash",
                    temperature=0,
                    max_tokens=None,
                    timeout=None,
                    max_retries=2,
                    api_key=google_api_key
                )

                messages = [
                    (
                        "system",
                        "You're a helpful Assignment helper for students. You will be given school/college assignment questions, you must only return the Q. (Question) followed by the Ans. (Answer)"
                    ),
                    ("human", f"{text}"),
                ]

                ans = (llm.invoke(messages)).content
                print("Markdown Response:\n", ans)
                
                # Strip markdown from the response
                plain_text_ans = strip_markdown(ans)
                print("Plain Text Response:\n", plain_text_ans)

                pdf_buffer = create_handwritten_pdf(plain_text_ans, font_path)

            st.success("PDF generated successfully! Scroll down to Download!")
            
            # Encode the PDF for displaying in an iframe
            pdf_data = pdf_buffer.getvalue()
            b64 = base64.b64encode(pdf_data).decode('utf-8')
            pdf_display = f"data:application/pdf;base64,{b64}"

            # Show PDF in Streamlit
            st.markdown(f'<iframe src="{pdf_display}" width="700" height="500" type="application/pdf"></iframe>', unsafe_allow_html=True)

            # Download button
            st.download_button("Download PDF", pdf_data, file_name="handwritten_text.pdf", mime="application/pdf")
        else:
            st.warning("Please enter some text.")



if __name__ == "__main__":
    main()
