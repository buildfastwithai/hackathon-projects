import React, { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { AiFillAudio } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa"; // New icon for image upload
import { BsSend } from "react-icons/bs"; // Send button icon

import axios from "axios";
const backend_url = process.env.REACT_APP_Backend

const SpeechToText = ({ 
  htmlCode, 
  cssCode, 
  jsCode, 
  setHtmlCode, 
  setCssCode, 
  setJsCode 
}) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [inputText, setInputText] = useState("");
  const [imageText, setImageText] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageurl, setUploadedImageurl] = useState(null);
  const [savedTranscript, setSavedTranscript] = useState(""); // New state to save the transcript

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file); // Set the file (not URL) to use in the API call
      setUploadedImageurl(URL.createObjectURL(file));
    }
  };
  
  const extractCodeSnippets = (markdown) => {
    const htmlMatch = markdown.match(/```html\s*([\s\S]*?)```/);
    const cssMatch = markdown.match(/```css\s*([\s\S]*?)```/);
    const jsMatch = markdown.match(/```javascript\s*([\s\S]*?)```/);

    // Store the extracted code in variables
    const htmlCode = htmlMatch ? htmlMatch[1].trim() : "";
    const cssCode = cssMatch ? cssMatch[1].trim() : "";
    const jsCode = jsMatch ? jsMatch[1].trim() : "";

    return { htmlCode, cssCode, jsCode };
  };

  const sendImageToApi = async () => {
    try {
      if (!uploadedImage) {
        console.log("No image to upload");
        return;
      }
  
      const formData = new FormData();
      
      // Append the necessary fields to formData
      formData.append("prompt", inputText); 
      formData.append("screenshot", uploadedImage, uploadedImage.name || "screenshot.png"); // Ensure 'uploadedImage' is a valid File
      
      // Make the API request
      const response = await axios.post(
        `${backend_url}/api/code/imgtocode`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const datafromback = response.data.response;
      const data = extractCodeSnippets(datafromback);
      setHtmlCode(data.htmlCode)
      setCssCode(data.cssCode)
      setJsCode(data.jsCode)
      // Handle the response
      if (response.status === 200) {
        console.log("Image and code successfully sent to the API:", response.data);

      } else {
        console.log("Failed to send image and code:", response.status);
      }
    } catch (error) {
      console.error("Error uploading the image:", error);
    }
  };


  const handleStartListening = () => {
    setSavedTranscript((prev) => prev + " " + transcript);
    resetTranscript();
    SpeechRecognition.startListening();
  };

  const handleRemoveImage = () => {
    setUploadedImage(null); // Remove the uploaded image
    setImageText(""); // Clear the extracted text
  };

  const handleSendData = () => {
    // This is where you'd handle sending the text and image to further processing
    const finalText = inputText || savedTranscript + " " + transcript + " " + imageText;
    const finalImage = uploadedImage;

    console.log("Sending data for further processing:", { finalText, finalImage });

    // Clear the textarea and transcript after sending the data
    setInputText("");
    setSavedTranscript("");
    resetTranscript(); // Reset SpeechRecognition transcript
    setImageText("");
    setUploadedImage(null);
  };

  return (
    <div className="p-5 flex justify-center items-center w-full max-w-2xl mx-auto gap-4  rounded-lg shadow-md">
      {/* Microphone and Status */}
      <div className="flex justify-center items-center gap-3">
        <button
          onClick={handleStartListening}
          className={`bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 flex items-center justify-center transition-all duration-300 ${
            listening ? "bg-green-500" : ""
          }`}
          style={{ width: "56px", height: "56px" }}
        >
          <AiFillAudio size={32} />
        </button>
      </div>

      {/* Text Area and Uploaded Image */}
      <div className="relative w-full flex-1">
        <textarea
          className="w-full h-20 p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none"
          rows="6"
          value={inputText || savedTranscript + " " + transcript + " " + imageText}
          onChange={handleInputChange}
          placeholder="Type here or speak to fill this area..."
          style={{ paddingLeft: uploadedImage ? "80px" : "16px" }}
        />

        {/* Uploaded Image Inside Text Area (Top Left) */}
        {uploadedImage && (
          <div className="absolute top-2 left-2 w-16 h-16 bg-gray-200 border border-gray-300 rounded-md overflow-hidden flex items-center justify-center">
            <img
              src={uploadedImageurl}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            <button
              className="absolute top-0 right-0 bg-white text-black rounded-full p-1 hover:bg-white"
              onClick={handleRemoveImage}
            >
              <MdCancel size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Image Upload Button */}
      <div className="flex flex-col items-center gap-2">
        <label
          htmlFor="imageUpload"
          className="flex items-center space-x-2 bg-blue-600 p-2 rounded-md cursor-pointer hover:bg-blue-700"
        >
          <FaFileUpload size={24} />
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Send Button */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={sendImageToApi}
          className="flex items-center space-x-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
        >
          <BsSend size={24} />
        </button>
      </div>
    </div>
  );
};

export default SpeechToText;