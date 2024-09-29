import express from "express";
import {
  explainCodeChunkwise,
  explainCodeChunkwisejs,
  rewriteCodeFiles,
  rewriteCodeFilesjs,
  optimizeCodeFiles,
  optimizeCodeFilesjs,
  solutionCodeFilesjs,
} from "./geminiService.js";
import cors from "cors";
const app = express();
import multer from "multer";
import { config } from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });
config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || null;

if (!GEMINI_API_KEY) {
  console.error("Api key not found");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// API route to explain code chunkwise
app.post("/api/code/explain", async (req, res) => {
  const { htmlCode, cssCode, jsCode } = req.body;
  // console.log(htmlCode,cssCode,jsCode)
  try {
    const explanation = await explainCodeChunkwise(htmlCode, cssCode, jsCode);
    res.json({ explanation });
  } catch (error) {
    console.error("Error explaining code:", error.message);
    res.status(500).json({ message: "Failed to explain code" });
  }
});
app.post("/api/code/js/explain", async (req, res) => {
  const { jsCode } = req.body;
  // console.log(htmlCode,cssCode,jsCode)
  try {
    const explanation = await explainCodeChunkwisejs(jsCode);
    res.json({ explanation });
  } catch (error) {
    console.error("Error explaining code:", error.message);
    res.status(500).json({ message: "Failed to explain code" });
  }
});

// API route to rewrite the code for all three files
app.post("/api/code/rewrite", async (req, res) => {
  const { htmlCode, cssCode, jsCode } = req.body;

  try {
    const rewrittenCode = await rewriteCodeFiles(htmlCode, cssCode, jsCode);
    res.json({ rewrittenCode });
  } catch (error) {
    console.error("Error rewriting code:", error.message);
    res.status(500).json({ message: "Failed to rewrite code" });
  }
});
app.post("/api/code/js/rewrite", async (req, res) => {
  const { jsCode } = req.body;

  try {
    const rewrittenCode = await rewriteCodeFilesjs(jsCode);
    res.json({ rewrittenCode });
  } catch (error) {
    console.error("Error rewriting code:", error.message);
    res.status(500).json({ message: "Failed to rewrite code" });
  }
});

// API route to optimize the code for all three files
app.post("/api/code/optimize", async (req, res) => {
  const { htmlCode, cssCode, jsCode } = req.body;

  try {
    const optimizedCode = await optimizeCodeFiles(htmlCode, cssCode, jsCode);
    res.json({ optimizedCode });
  } catch (error) {
    console.error("Error optimizing code:", error.message);
    res.status(500).json({ message: "Failed to optimize code" });
  }
});
app.post("/api/code/js/optimize", async (req, res) => {
  const { jsCode } = req.body;

  try {
    const optimizedCode = await optimizeCodeFilesjs(jsCode);
    res.json({ optimizedCode });
  } catch (error) {
    console.error("Error optimizing code:", error.message);
    res.status(500).json({ message: "Failed to optimize code" });
  }
});
app.post("/api/code/js/quiz/submit", async (req, res) => {
  const { jsCode, output } = req.body;

  try {
    const solutionCode = await solutionCodeFilesjs(jsCode, output);
    res.json({ solutionCode });
  } catch (error) {
    console.error("Error optimizing code:", error.message);
    res.status(500).json({ message: "Failed to optimize code" });
  }
});

app.post(
  "/api/code/cssredesign",
  upload.single("screenshot"),
  async (req, res) => {
    try {
      // Access the CSS code, image, and text from the request
      const cssCode = req.body.cssCode;
      const htmlCode = req.body.htmlCode;
      const screenshot = req.file; // Access the uploaded screenshot as a Buffer

      // Check if the uploaded file is a PNG
      if (!screenshot || screenshot.mimetype !== "image/png") {
        return res.status(400).json({ message: "Please upload a PNG image." });
      }

      const prompt = `I have the following HTML code and corresponding CSS code. I would like to focus on updating the CSS only to achieve a better user interface while retaining the existing HTML structure, logic, and naming conventions. 
        Please make the following considerations in your redesign:
          1. Improve the overall visual aesthetics while maintaining usability.
          2. Ensure that the existing classes and IDs in the HTML remain unchanged.
          3. Optimize the CSS for better performance and maintainability without altering any HTML elements or their behaviors.
          4. Enhance responsiveness and cross-browser compatibility if applicable.
  
          HTML code:\n${htmlCode}\n
          CSS code:\n${cssCode}`;

      // const prompt = `what you see in image`
      const image = {
        inlineData: {
          data: screenshot.buffer.toString("base64"),
          mimeType: "image/png",
        },
      };

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([prompt, image]);
      const responseText = result.response.text(); // Assuming the API returns a text response
      console.log(responseText);

      res.json({
        message: "Data sent to Gemini API successfully",
        response: responseText,
      });
    } catch (error) {
      console.error("Error processing request:", error);

      // If error has field violations, print those details
      if (
        error.errorDetails &&
        error.errorDetails[0] &&
        error.errorDetails[0].fieldViolations
      ) {
        console.error(
          "Field Violations: ",
          error.errorDetails[0].fieldViolations
        );
      }

      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
);
app.post(
  "/api/code/imgtocode",
  upload.single("screenshot"),
  async (req, res) => {
    try {
      const promptuser = req.body.prompt;
      const screenshot = req.file; // Access the uploaded screenshot as a Buffer

      // Check if the uploaded file is a PNG
      if (!screenshot || screenshot.mimetype !== "image/png") {
        return res.status(400).json({ message: "Please upload a PNG image." });
      }

      const prompt = `Convert the following image into HTML, CSS, and JavaScript code:  1. **Structure:**  - Break down the visual elements of the photo into well-structured HTML elements such as "<div>", "<section>", "<header>", "<footer>", "<button>", etc.
  - Ensure the code is semantically correct and well-organized using meaningful tags (e.g., "<article>" for content, "<nav>" for navigation).
   - Add classes or IDs to each element for CSS styling.

2. **CSS Styling:** 
   - Extract precise colors (e.g., background, text, borders) and use accurate color codes (e.g., "#000000" for black, "#ffffff" for white).
   - Capture all font details, including font family, font size, weight, line height, and letter spacing. Ensure responsiveness across different screen sizes.
   - Specify margins, padding, and alignment for each element. Handle layouts with "flexbox" or "grid" for flexible and modern design.
   - Handle shadows, gradients, borders, and hover effects if present in the image.
   - Maintain pixel-perfect accuracy in terms of spacing, alignments, and positioning.
   
3. **JavaScript:** 
   - Implement basic interactivity (e.g., button clicks, form handling, modal pop-ups) if visible in the image.
   - Add any necessary animations or transitions, such as hover effects, slide-ins, or fade-ins.
   - Capture event listeners (e.g., for buttons, form submissions) and add comments for clarity.

4. **Accessibility & Optimization:**
   - Ensure the code is accessible, with proper use of "alt" attributes for images, "aria" labels for interactive elements, and readable contrast ratios for text.
   - Add media queries for responsive design and optimize the layout for mobile devices.
   - Keep the JavaScript code efficient and well-commented.

5. **User Prompt Details:**
   - Include the following specific request provided by the user if provided.: "${promptuser}".
`;

      const image = {
        inlineData: {
          data: screenshot.buffer.toString("base64"),
          mimeType: "image/png",
        },
      };

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([prompt, image]);
      const responseText = result.response.text(); // Assuming the API returns a text response
      console.log(responseText);

      res.json({
        message: "Data sent to Gemini API successfully",
        response: responseText,
      });
    } catch (error) {
      console.error("Error processing request:", error);

      // If error has field violations, print those details
      if (
        error.errorDetails &&
        error.errorDetails[0] &&
        error.errorDetails[0].fieldViolations
      ) {
        console.error(
          "Field Violations: ",
          error.errorDetails[0].fieldViolations
        );
      }

      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
