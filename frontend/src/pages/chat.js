import React, { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
import "../style/chat.css"; // Make sure to create this CSS file
// import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

const Chat = () => {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [pdf, setPdf] = useState("");
  const [activeInput, setActiveInput] = useState(""); // Track which input is focused

  const [answer, setAnswer] = useState(null);
  const [pre, setPre] = useState([]);
  const [project, setProject] = useState([]);
  const [youtube_link, setYotube] = useState([]);
  const [book_link, setBook] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isListening, setIsListening] = useState(false);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://127.0.0.1:5000/response", {
        question: question,
        context: context,
        pdf: pdf,
      });

      const ans = response.data.answer;
      const prerequisite = response.data.prerequisite;
      const project_list = response.data.project;
      const youtube = response.data.youtube_links;
      const book = response.data.book_links;

      setAnswer(ans);
      setPre(prerequisite);
      setProject(project_list);
      setYotube(youtube);
      setBook(book);

      console.log(response);
      console.log(pre);
    } catch (err) {
      setError(
        "Error: " + (err.response ? err.response.data.error : err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Start speech recognition and set the state as listening
  const startListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true });
  };

  // Stop speech recognition and set the state as not listening
  const stopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
    handleSpeechInput(); // Update the active input with the transcript after speech stops
  };

  // Function to handle speech input based on which textarea is active
  const handleSpeechInput = () => {
    if (activeInput === "question") {
      setQuestion((prev) => prev + " " + transcript); // Append transcript to the existing text
    } else if (activeInput === "context") {
      setContext((prev) => prev + " " + transcript); // Append transcript to the existing text
    }
    resetTranscript(); // Reset the transcript after updating the field
  };

  return (
    <div className="app">
      <div className="content">
        <form onSubmit={handleSubmit}>
          <div className="chat-input">
            <div className="form-section">
              <label htmlFor="learning-topic">What You Want to Learn?</label>
              <textarea
                type="text"
                id="learning-topic"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onFocus={() => setActiveInput("question")}
                placeholder="Ex: Deep Learning"
              />
            </div>
            <div className="form-section">
              <label htmlFor="background-knowledge">Background Knowledge</label>
              <textarea
                type="text"
                id="background-knowledge"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                onFocus={() => setActiveInput("context")}
                placeholder="Ex: Python"
              />
            </div>
          </div>
          <div className="speech-input">
            <div>
              <button onClick={startListening} disabled={isListening}>
                Start
              </button>
              <button
                onClick={stopListening}
                style={{
                  backgroundColor: listening ? "green" : "red",
                  color: "white",
                }}
                disabled={!isListening}
              >
                Stop
              </button>
              <button onClick={resetTranscript}>Reset</button>
            </div>
            <div>
              <p>{transcript}</p>
            </div>
          </div>
          <button className="button" id="background-knowledge-button">
            {loading ? "loading..." : "start"}
          </button>
        </form>
        <hr></hr>
        <div className="answer">
          <label htmlFor="answer">Answer</label>
          <p> {answer}</p>
        </div>

        <div className="output">
          <div className="form-section feature-box prerequisite">
            <label htmlFor="prerequisite">Prerequisite</label>
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              {pre.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          </div>

          <div className="form-section feature-box project-to-do">
            <label htmlFor="project-to-do">Project to Do</label>
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              {project.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          </div>

          <div className="form-section feature-box prerequisite">
            <label htmlFor="youtube-links">YouTube Links</label>
            <ul
              style={{
                listStyleType: "none",
                color: "white",
              }}
            >
              {youtube_link.map((name, index) => (
                <li key={index}>
                  <a href={name} style={{ color: "white" }}>
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="form-section feature-box project-to-do">
            <label htmlFor="textbook">Textbook</label>
            <ul
              style={{
                listStyleType: "none",
                color: "white",
              }}
            >
              {book_link.map((name, index) => (
                <li key={index}>
                  <a href={name} style={{ color: "white" }}>
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
