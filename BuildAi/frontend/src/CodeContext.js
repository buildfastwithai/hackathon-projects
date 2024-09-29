import React, { createContext, useState } from 'react';

// Create the context
export const CodeContext = createContext();

// Create the provider component
export const CodeProvider = ({ children }) => {
  const [explanation, setExplanation] = useState('');
  const [rewrittenCode, setRewrittenCode] = useState('');
  const [optimizedCode, setOptimizedCode] = useState('');

  return (
    <CodeContext.Provider
      value={{
        explanation,
        setExplanation,
        rewrittenCode,
        setRewrittenCode,
        optimizedCode,
        setOptimizedCode
      }}
    >
      {children}
    </CodeContext.Provider>
  );
};
