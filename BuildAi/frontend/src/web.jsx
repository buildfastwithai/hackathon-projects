import React, { useState, useEffect,useContext } from "react";
import html2canvas from "html2canvas";
import axios from "axios";
import { CodeContext } from "./CodeContext";
import Editor from "@monaco-editor/react";
import {
    FaPlay,
    FaStop,
    FaHtml5,
    FaCss3Alt,
    FaJs,
    FaDownload,
    FaRedo,
} from "react-icons/fa";
import CodeFeatures from "./CodeFeatures"; // Import the new CodeFeatures component
import { CodeProvider } from "./CodeContext";
import ResultsComponent from "./Codeoutput";
const backend_url = process.env.REACT_APP_Backend

function Web() {

    const [activeTab, setActiveTab] = useState("html");
    const [livePreview, setLivePreview] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const htmlDefault = `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Simple Webpage</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

    <div class="container">
        <h1>Hello, World!</h1>
        <button id="changeTextBtn">Change Text</button>
        <p id="textChange">Click the button to change this text.</p>
    </div>

    <script src="script.js"></script>
</body>
</html>`;

    const cssDefault = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; 
}

.container {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}

h1 {
    color: #333;
}

button {
    padding: 10px 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: #007BFF;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0056b3;
}`;

    const jsDefault = `document.getElementById('changeTextBtn').addEventListener('click', function () {
    document.getElementById('textChange').textContent = 'Text has been changed!';
});`;

    const [htmlCode, setHtmlCode] = useState(htmlDefault);
    const [cssCode, setCssCode] = useState(cssDefault);
    const [jsCode, setJsCode] = useState(jsDefault);

    const extractcssSnippets = (markdown) => {
        const cssMatch = markdown.match(/```css\s*([\s\S]*?)```/);

        // Store the extracted code in variables
        const cssCode = cssMatch ? cssMatch[1].trim() : "";

        return cssCode;
    };

    const handleExtraButtonClick = async () => {
        const extractedCssCode = cssCode;
        const extractedHtmlCode = htmlCode;
        const extractedJsCode = jsCode;

        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.style.top = "-9999px"; // Hide it off-screen
        iframe.style.width = "800px"; // Set width
        iframe.style.height = "600px"; // Set height
        document.body.appendChild(iframe);

        const iframeDocument =
            iframe.contentDocument || iframe.contentWindow.document;

        iframeDocument.open();
        iframeDocument.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <style>
          ${extractedCssCode}
        </style>
      </head>
      <body>
        ${extractedHtmlCode}
        <script>
          ${extractedJsCode}
        </script>
      </body>
      </html>
    `);
        iframeDocument.close();

        // Wait for the iframe to load its content
        iframe.onload = async () => {
            try {
                const canvas = await html2canvas(iframeDocument.body);
                canvas.toBlob(async (blob) => {
                    if (blob) {
                        const formData = new FormData();
                        formData.append("cssCode", extractedCssCode);
                        formData.append("htmlCode", extractedHtmlCode);
                        formData.append("screenshot", blob, "screenshot.png");

                        try {
                            const response = await axios.post(
                                `${backend_url}/api/code/cssredesign`,
                                formData,
                                {
                                    headers: {
                                        "Content-Type": "multipart/form-data",
                                    },
                                }
                            );
                            console.log("Response from backend: ", response.response);
                            const datafromback = response.data.response;
                            console.log(datafromback);
                            const finaldata = extractcssSnippets(datafromback);
                            console.log(finaldata);

                            setCssCode(finaldata);
                        } catch (error) {
                            console.error("Error uploading data: ", error);
                        }
                    }
                }, "image/png");
            } catch (error) {
                console.error("Error capturing screenshot or sending data:", error);
            } finally {
                document.body.removeChild(iframe); // Remove the iframe after capturing the screenshot
            }
        };
    };

    useEffect(() => {
        function hideError(e) {
            if (
                e.message ===
                "ResizeObserver loop completed with undelivered notifications."
            ) {
                const resizeObserverErrDiv = document.getElementById(
                    "webpack-dev-server-client-overlay-div"
                );
                const resizeObserverErr = document.getElementById(
                    "webpack-dev-server-client-overlay"
                );
                if (resizeObserverErr) {
                    resizeObserverErr.setAttribute("style", "display: none");
                }
                if (resizeObserverErrDiv) {
                    resizeObserverErrDiv.setAttribute("style", "display: none");
                }
            }
        }

        window.addEventListener("error", hideError);
        return () => {
            window.addEventListener("error", hideError);
        };
    }, []);

    useEffect(() => {
        if (isRunning && livePreview) {
            updateOutput();
        }
    }, [htmlCode, cssCode, jsCode, livePreview, isRunning]);

    const updateOutput = () => {
        const output = document.getElementById("output");
        const html = htmlCode || "";
        const css = `<style>${cssCode || ""}</style>`;
        const js = `<script>${jsCode || ""}<\/script>`;
        output.srcdoc = `${html}${css}${js}`;
    };

    const resetEditor = () => {
        setHtmlCode("");
        setCssCode("");
        setJsCode("");
        if (isRunning) {
            updateOutput();
        }
    };

    const downloadCode = () => {
        const code = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Downloaded Code</title>
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode}
        <script>${jsCode}<\/script>
      </body>
      </html>`;

        const blob = new Blob([code], { type: "text/html" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "code.html";
        a.click();
    };

    const handleInputChange = (e, lang) => {
        const value = e.target.value;
        if (lang === "html") setHtmlCode(value);
        if (lang === "css") setCssCode(value);
        if (lang === "js") setJsCode(value);
    };

    const handleEditorChangehtml = (value) => {
        // Ensure value exists and is not undefined
        if (value !== undefined) {
            setHtmlCode(value); // Update state with the new HTML code
        }
    };
    const handleEditorChangecss = (value) => {
        // Ensure value exists and is not undefined
        if (value !== undefined) {
            setCssCode(value); // Update state with the new HTML code
        }
    };
    const handleEditorChangejs = (value) => {
        // Ensure value exists and is not undefined
        if (value !== undefined) {
            setJsCode(value); // Update state with the new HTML code
        }
    };

    const handleRunButtonClick = () => {
        if (isRunning) {
            setIsRunning(false);
            setLivePreview(false);
        } else {
            setIsRunning(true);
            setLivePreview(true);
            updateOutput();
        }
    };

    return (
        <CodeProvider>
            <div className="App flex flex-col h-screen bg-gray-900 text-white">
                <div className="top-tabs w-full flex justify-between space-x-2 p-2 bg-gray-800">
                    <div className="flex gap-4 p-2">
                        <button
                            onClick={() => setActiveTab("html")}
                            className={`flex items-center ${activeTab === "html" ? "bg-blue-600" : "bg-gray-700"
                                } hover:bg-gray-600 px-3 rounded`}
                        >
                            <FaHtml5 className="mr-2" /> HTML
                        </button>
                        <button
                            onClick={() => setActiveTab("css")}
                            className={`flex items-center ${activeTab === "css" ? "bg-blue-600" : "bg-gray-700"
                                } hover:bg-gray-600 px-3 rounded`}
                        >
                            <FaCss3Alt className="mr-2" /> CSS
                        </button>
                        <button
                            onClick={() => setActiveTab("js")}
                            className={`flex items-center ${activeTab === "js" ? "bg-blue-600" : "bg-gray-700"
                                } hover:bg-gray-600 px-3 rounded`}
                        >
                            <FaJs className="mr-2" /> JavaScript
                        </button>
                        {/* Conditionally render extra button when CSS tab is active */}
                        {activeTab === "css" && (
                            <button
                                onClick={handleExtraButtonClick}
                                className="flex items-center bg-green-600 hover:bg-green-500 px-3 rounded"
                            >
                                Redesign
                            </button>
                        )}
                    </div>

                    <div className="run-btn-container p-2">
                        <button
                            onClick={handleRunButtonClick}
                            className={`px-4 py-2 rounded flex items-center ${isRunning
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-green-500 hover:bg-green-600"
                                }`}
                        >
                            {isRunning ? (
                                <FaStop className="mr-2" />
                            ) : (
                                <FaPlay className="mr-2" />
                            )}{" "}
                            {isRunning ? "Stop" : "Run Code"}
                        </button>
                    </div>

                    <div className="toolbar flex justify-between p-4 bg-gray-800">
                        <div className="flex gap-4">
                            <button
                                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded flex items-center"
                                onClick={resetEditor}
                            >
                                <FaRedo className="mr-1" /> Reset
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded flex items-center"
                                onClick={downloadCode}
                            >
                                <FaDownload className="mr-1" /> Download Code
                            </button>
                        </div>
                    </div>
                </div>

                <div className="editor flex flex-grow ">
                    <div className="code-container  w-1/2 p-2">
                        {activeTab === "html" && (
                            <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
                                <Editor
                                    className="w-full h-full bg-gray-800 text-white border border-gray-600 p-2 rounded"
                                    language="html"
                                    value={htmlCode}
                                    defaultValue=""
                                    theme="vs-dark"
                                    onChange={handleEditorChangehtml} // Correct onChange handler
                                />
                            </div>
                        )}
                        {activeTab === "css" && (
                            // <textarea
                            //   placeholder="CSS Code"
                            //   value={cssCode}
                            //   onChange={(e) => handleInputChange(e, "css")}
                            //   className="w-full h-full bg-gray-800 text-white border border-gray-600 p-2 rounded"

                            // />
                            <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
                                <Editor
                                    className="w-full h-full bg-gray-800 text-white border border-gray-600 p-2 rounded"
                                    language="css"
                                    value={cssCode}
                                    defaultValue=""
                                    theme="vs-dark"
                                    onChange={handleEditorChangecss} // Correct onChange handler
                                />
                            </div>
                        )}
                        {activeTab === "js" && (
                            <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
                                <Editor
                                    className="w-full h-full bg-gray-800 text-white border border-gray-600 p-2 rounded"
                                    language="javascript"
                                    value={jsCode}
                                    defaultValue=""
                                    theme="vs-dark"
                                    onChange={handleEditorChangejs} // Correct onChange handler
                                />
                            </div>
                        )}
                    </div>

                    <iframe
                        id="output"
                        className="output flex-grow border-none"
                        title="Output"
                    ></iframe>
                </div>

                <CodeFeatures
                    htmlCode={htmlCode}
                    cssCode={cssCode}
                    jsCode={jsCode}
                    setCssCode={setCssCode}
                    setHtmlCode={setHtmlCode}
                    setJsCode={setJsCode}
                />
            </div>
            <ResultsComponent />
            <div id="output-container"></div>
        </CodeProvider>
    );
}

export default Web;
