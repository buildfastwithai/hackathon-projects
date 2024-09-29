import React, { useState, useEffect, useRef } from 'react';
import { loader } from '@monaco-editor/react';

const CodeEditor = ({ language, value = '', onChange }) => {
  const editorRef = useRef(null);  // Ref for Monaco editor instance
  const containerRef = useRef(null); // Ref for editor container

  useEffect(() => {
    let editor;
    
    // Initialize Monaco Editor once container is available
    loader.init().then((monaco) => {
      if (containerRef.current) {
        editor = monaco.editor.create(containerRef.current, {
          value: value || '', // Default to an empty string if value is undefined
          language: language,
          theme: 'vs-dark',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          automaticLayout: true,
        });

        editorRef.current = editor;

        // Listen for changes in the editor
        editor.onDidChangeModelContent(() => {
          if (onChange) {
            onChange(editor.getValue());
          }
        });
      }
    });

    // Cleanup on unmount
    return () => {
      if (editor) {
        editor.dispose(); // Properly dispose of the editor instance
      }
    };
  }, [language]); // Only reinitialize editor if the language changes

  // Update the editor value when props change
  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== value) {
        editorRef.current.setValue(value || ''); // Ensure value is always a valid string
      }
    }
  }, [value]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}></div>
  );
};

export default CodeEditor;
