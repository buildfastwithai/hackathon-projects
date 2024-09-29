import React, { useContext } from 'react';
import { CodeContext } from './CodeContext'; 
import MarkdownPreviewer from "./MarkdownPreviewer";

const ResultsComponent = () => {
  // Consume the context to get explanation, rewrittenCode, and optimizedCode
  const { explanation, rewrittenCode, optimizedCode } = useContext(CodeContext);

  return (
    <div className="results w-full min-h-screen flex justify-center items-center">
      {/* Explanation Section */}
      {explanation && (
        <div className="explanation  bg-gray-900 p-4  mb-2">
          <h3 className="font-semibold text-2xl p-2 flex justify-center items-center text-white">Explanation of code</h3>
          <MarkdownPreviewer markdown={explanation}/>
        </div>
      )}

      {/* Rewritten Code Section */}
      {rewrittenCode && (
        <div className="rewritten bg-gray-700 p-2 rounded mb-2">
          <h3 className="font-bold text-white">Rewritten Code:</h3>
          <MarkdownPreviewer markdown={rewrittenCode}/>
        </div>
      )}

      {/* Optimized Code Section */}
      {optimizedCode && (
        <div className="optimized bg-gray-700 p-2 rounded">
          <h3 className="font-bold text-white">Optimized Code:</h3>
          <MarkdownPreviewer markdown={optimizedCode}/>
        </div>
      )}
    </div>
  );
};

export default ResultsComponent;