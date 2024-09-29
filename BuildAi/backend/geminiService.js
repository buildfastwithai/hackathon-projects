import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || null;

if (!GEMINI_API_KEY) {
  console.error("Api key not found");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Helper function to make a request to the Gemini API
const makeGeminiRequest = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(prompt);
    const text = response.response.text();
    return text;
  } catch (error) {
    console.error(
      "Error in Gemini API request:",
      error.response?.data || error.message
    );
  }
};

// Function to explain code chunkwise
const explainCodeChunkwise = async (htmlCode, cssCode, jsCode) => {
  // const combinedCode = `HTML CODE\n${htmlCode}\nCSS CODE\n${cssCode}\nJS CODE\n${jsCode}`;
  const prompt = `Analyze the provided HTML, CSS, and JavaScript code. Break down the explanation into blocks, explaining each section individually. Identify the purpose, logic, and important details of each code block. Use Markdown with headings, code blocks, and clear explanations.

HTML CODE:
${htmlCode}

CSS CODE:
${cssCode}

JS CODE:
${jsCode}
`;
  return await makeGeminiRequest(prompt);
};
const explainCodeChunkwisejs = async (jsCode) => {
  const prompt = `Analyze the provided JavaScript code. Break down the explanation into blocks, explaining each section individually. Identify the purpose, logic, and important details of each code block. Use Markdown with headings, code blocks, and clear explanations.

  JS CODE:
  ${jsCode}
  `;
  return await makeGeminiRequest(prompt);
};

// Function to rewrite the code for HTML, CSS, and JS files
const rewriteCodeFiles = async (htmlCode, cssCode, jsCode) => {
  const prompt = `Analyze the provided HTML, CSS, and JavaScript code and rewrite it using best practices in programming. Ensure the logic and variable names remain the same, and split the HTML, CSS, and JavaScript into three distinct blocks (one for each). The code should follow these guidelines:

Add comments to clarify key parts of the code.
Improve readability and organization by proper indentation and structuring.
Refactor code to follow semantic conventions where applicable (e.g., using appropriate tags and structure in HTML).
Maintain variable and function names as they are, ensuring the code remains recognizable but clean.
Do not optimize the code logic or structure beyond these basic improvements.
    
    HTML CODE:
    ${htmlCode}
    
    CSS CODE:
    ${cssCode}
    
    JS CODE:
    ${jsCode}
    `;

  return await makeGeminiRequest(prompt);
};

const rewriteCodeFilesjs = async (jsCode) => {
  const prompt = `Analyze the provided JavaScript code and rewrite it using best practices in programming. Ensure the logic and variable names remain the same. The code should follow these guidelines:
Add comments to clarify key parts of the code.
Improve readability and organization by proper indentation and structuring.
Refactor code to follow conventions and clean coding practices.
Maintain variable and function names as they are, ensuring the code remains recognizable but clean.

JS CODE: ${jsCode}`;

  return await makeGeminiRequest(prompt);
};

// Function to optimize the code for HTML, CSS, and JS files
const optimizeCodeFiles = async (htmlCode, cssCode, jsCode) => {
  const prompt = `Rewrite the provided HTML, CSS, and JavaScript code, optimizing it for both time complexity and space complexity. Consider reducing redundant logic, minimizing DOM manipulation, improving JavaScript algorithms, and streamlining CSS. 
    Generate three distinct blocks: one for HTML, one for CSS, and one for JavaScript. As you go through each block of code, add comments that explain the improvements you are making. In these comments, make sure to discuss how each change affects performance, scalability, or maintainability, and also mention any relevant trade-offs
    Please maintain the functionality and logic of the original code.
    Provided code:
    HTML CODE:
    ${htmlCode}
    
    CSS CODE:
    ${cssCode}
    
    JS CODE:
    ${jsCode}
    `;
  return await makeGeminiRequest(prompt);
};
const optimizeCodeFilesjs = async (jsCode) => {
  const prompt = `Rewrite the provided JavaScript code, optimizing it for both time complexity and space complexity. Consider reducing redundant logic,
  improving algorithms, and minimizing memory usage. 
  As you go through the code, add comments that explain the improvements you're making. In these comments, discuss how each change affects performance, scalability, or maintainability, and mention any relevant trade-offs.
  Please maintain the functionality and logic of the original code.
  Provided code:

  JS CODE:
${jsCode}`;
  return await makeGeminiRequest(prompt);
};
const solutionCodeFilesjs = async (jsCode,output) => {
  const prompt = `### Question & Code - 
${jsCode}

### Expected Output - 
${output}

### Requirements for the solution:
1. First, verify if the provided code produces the correct output for the given question.
   - If the code is correct, provide both time complexity (TC) and space complexity (SC) of the code.
   - Suggest a more optimized solution if applicable, explaining why it’s more efficient.

2. If the code is incorrect:
   - Return a new corrected code version.
   - Point out mistakes in the user's code with short comments inside the code (explaining what went wrong).
   - After fixing the code, give a more optimized solution (if possible) and explain why the new approach is better in terms of efficiency.`;
  return await makeGeminiRequest(prompt);
};

export {
  explainCodeChunkwise,
  rewriteCodeFiles,
  optimizeCodeFiles,
  explainCodeChunkwisejs,
  rewriteCodeFilesjs,
  optimizeCodeFilesjs,
  solutionCodeFilesjs
};
