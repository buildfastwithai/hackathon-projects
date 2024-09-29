import React, { useContext, useState } from "react";
import axios from "axios";
import { CodeContext } from "./CodeContext";
const backend_url = process.env.REACT_APP_Backend

const CodeFeaturesJS = ({ jsCode, setJsCode }) => {
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

  const handleExplainCode = async () => {
    try {
      const response = await axios.post(
        `${backend_url}/api/code/js/explain`,
        {
          jsCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);
      setExplanation(response.data.explanation);
      setRewrittenCode(""); // Clear rewrittenCode
      setOptimizedCode("");
    } catch (error) {
      console.error("Error explaining code:", error);
    }
  };

  const extractCodeSnippets = (markdown) => {
    const jsMatch = markdown.match(/```javascript\s*([\s\S]*?)```/);

    const jsCode = jsMatch ? jsMatch[1].trim() : "";

    return jsCode;
  };

  const handleRewriteCode = async () => {
    try {
      const response = await axios.post(
        `${backend_url}/api/code/js/rewrite`,
        {
          jsCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response.data");
      setRewrittenCode(response.data.rewrittenCode);
      setExplanation(""); // Clear explanation
      setOptimizedCode("");
      const data = extractCodeSnippets(response.data.rewrittenCode);
      // console.log(data.htmlCode)
      handleJsChange(data);
    } catch (error) {
      console.error("Error rewriting code:", error);
    }
  };

  const handleOptimizeCode = async () => {
    try {
      const response = await axios.post(
        `${backend_url}/api/code/js/optimize`,
        {
          jsCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setOptimizedCode(response.data.optimizedCode);
      setExplanation(""); // Clear explanation
      setRewrittenCode("");
      const data = extractCodeSnippets(response.data.optimizedCode);
      // console.log(data.htmlCode)
      handleJsChange(data);
    } catch (error) {
      console.error("Error optimizing code:", error);
    }
  };

  return (
    <div className="code-features p-4 bg-gray-800 mt-1">
      <div className="flex gap-4">
        <button
          onClick={handleExplainCode}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Explain
        </button>
        <button
          onClick={handleRewriteCode}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Rewrite
        </button>
        <button
          onClick={handleOptimizeCode}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Optimize
        </button>
      </div>
    </div>
  );
};

export default CodeFeaturesJS;
