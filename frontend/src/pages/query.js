// src/components/DocumentQuery.js

import React, { useState } from "react";
import axios from "axios";
import "../style/query.css";

const DocumentQuery = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [context, setContext] = useState([]);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/query",
        { query },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setAnswer(response.data.answer);
      setContext(response.data.context);
    } catch (error) {
      setAnswer("Error querying documents");
      console.error(error);
    }
  };

  return (
    <div id="rag">
      <h2>Query Documents</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Enter your query"
        />
        <button type="submit">Search</button>
      </form>
      {answer && (
        <div>
          <h3>Answer</h3>
          <p>{answer}</p>
          {context.length > 0 && (
            <div>
              <h4>Context</h4>
              <ul>
                {context.map((doc, index) => (
                  <li key={index}>
                    {JSON.stringify(doc.metadata)} | {doc.content}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentQuery;
