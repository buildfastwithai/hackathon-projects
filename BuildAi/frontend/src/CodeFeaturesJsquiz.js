import React, { useContext, useState } from "react";
import axios from "axios";
import { CodeContext } from "./CodeContext";
const backend_url = process.env.REACT_APP_Backend

const CodeFeaturesJSQuiz = ({ jsCode, setJsCode , Shufflequestion ,output
 }) => {
  const {
    explanation,
    setExplanation,
    rewrittenCode,
    setRewrittenCode,
    optimizedCode,
    setOptimizedCode,
  } = useContext(CodeContext);

  const handleJsChange = (newJsCode) => {
    setJsCode(newJsCode);
  };

const extractCodeSnippets = (markdown) => {
    const jsMatch = markdown.match(/```javascript\s*([\s\S]*?)```/);

    const jsCode = jsMatch ? jsMatch[1].trim() : "";

    return jsCode;
  };

  const handleSubmitCode = async () => {
    try {
      console.log("here1")
      const response = await axios.post(
        `${backend_url}/api/code/js/quiz/submit`,
        {
          jsCode,
          output
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log("here1")
      console.log(response.data);
      setRewrittenCode(response.data.solutionCode);
      setExplanation("")
      setOptimizedCode("")
      // const data = extractCodeSnippets(response.data.rewrittenCode);
      // console.log(data.htmlCode)
      // handleJsChange(data);
    } catch (error) {
      console.error("Error rewriting code:", error);
    }
  };


  return (
    <div className="code-features p-4 bg-gray-800 mt-1">
      <div className="flex gap-4">
        <button
          onClick={Shufflequestion}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Shuffle
        </button>
        <button
          onClick={handleSubmitCode}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CodeFeaturesJSQuiz;
