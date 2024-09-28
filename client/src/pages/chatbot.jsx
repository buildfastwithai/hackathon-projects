import React, { useState, useRef } from "react";
import Chatsidebar from "../components/chatsidebar";
import { BsArrowUpRightSquareFill } from "react-icons/bs";
import { LuUserSquare2 } from "react-icons/lu";
import { GoPaperclip } from "react-icons/go";
import { BsRobot } from "react-icons/bs";

const Chatbot = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [content, setContent] = useState([]); // Use state for chat messages
  const fileInputRef = useRef(null); // Reference for the hidden file input

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setInputValue(event.target.files[0].name); // Display the file name in the text input
    }
  };

  const handleSubmit = async (e) => {
    // e.preventDefault(); // Prevent the default form submission behavior
  
    // Prepare message to add to content
    const userMessage = {
      username: "You",
      body: selectedFile ? selectedFile.name + ": " + inputValue : inputValue,
      direction: "right",
    };
  
    // Update the content state with the user's message
    setContent((prevContent) => [...prevContent, userMessage]);
  
    // Clear input and selected file after submission
    setInputValue("");
    setSelectedFile(null);
  
    // Create the data object to send to the Flask API
    const data = {
      query: inputValue.trim(), // Trim whitespace from the input
      history: [], // Include any previous history if needed
    };
  
    // Check if the question is provided
    if (!data.query) {
      console.error("No query provided");
      return; // Exit if no question is provided
    }
  
    try {
      let response;
  
      if (selectedFile) {
        // Create FormData to send the file and question
        const formData = new FormData();
        formData.append('file', selectedFile); // Append the file
        formData.append('question', data.query); // Append the question
        formData.append('history', JSON.stringify([])); // Append history as needed
  
        response = await fetch("http://127.0.0.1:5000/chat_with_document", {
          method: "POST",
          body: formData, // Use FormData for file upload
        });
      } else {
        response = await fetch("http://127.0.0.1:5000/aiml_query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Set content type to JSON
          },
          body: JSON.stringify(data), // Convert the data object to JSON
        });
      }
  
      const responseData = await response.json();
      console.log(responseData);
  
      if (response.ok) {
        // Prepare bot's response message
        const botMessage = {
          username: "Bot",
          body: responseData.response || "No response from bot.", // Default message if response is empty
          direction: "left",
        };
  
        // Update the content state with the bot's response
        setContent((prevContent) => [...prevContent, botMessage]);
      } else {
        // Handle errors from the API
        const errorMessage = responseData.error || "An error occurred";
        console.error("API Error:", errorMessage);
      }
    } catch (error) {
      console.error("Error fetching the response:", error);
    }
  };
  
  

  const handleClipClick = () => {
    fileInputRef.current.click(); // Trigger the file input when the clip icon is clicked
  };

  const SearchBar = () => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
          handleSubmit(); // Call the submit handler when Enter is pressed
      }
    };
    return (
      <div className="flex items-center bg-matte-black rounded-xl px-4 py-2 border border-gray-700 border-solid">
        <FilePreview 
          selectedFile={selectedFile} 
          setSelectedFile={setSelectedFile} 
          setInputValue={setInputValue} 
        />

        <GoPaperclip role='button' className="pr-2 text-3xl" onClick={handleClipClick} />

        <input
          type="text"
          className="w-[50vw] flex-grow bg-transparent text-white focus:outline-none"
          placeholder="Ask me something"
          onChange={handleInputChange} // Set onChange handler for the text input
          value={inputValue} // Bind the input value to state
          autoFocus
          onKeyDown={handleKeyDown} 
        />
        
        <input
          type="file"
          ref={fileInputRef} // Reference for the file input
          onChange={handleFileChange} // Handle file selection
          style={{ display: 'none' }} // Hide the file input
        />
        
        <BsArrowUpRightSquareFill 
          className="text-green1 text-4xl bg-white rounded-lg ml-2" 
          onClick={handleSubmit} // Add submit handler for the send button
        />
      </div>
    );
  };

  const FilePreview = ({ selectedFile, setSelectedFile, setInputValue }) => {
    if (!selectedFile) return null;

    const fileUrl = URL.createObjectURL(selectedFile);
    const isImage = selectedFile.type.startsWith('image/');

    const handleRemoveFile = () => {
      setSelectedFile(null);
      setInputValue(""); // Clear the input value when the file is removed
    };

    return (
      <div className="flex items-center justify-between bg-gray-800 p-2 rounded-lg mb-2">
        {isImage ? (
          <img src={fileUrl} alt={selectedFile.name} className="h-16 w-16 object-cover rounded" />
        ) : (
          <div className="text-white">{selectedFile.name}</div>
        )}
        <button onClick={handleRemoveFile} className="text-red-500 ml-2">
          &times; {/* Cross button to remove the file */}
        </button>
      </div>
    );
  };

  const ChatContent = ({ username, body, direction }) => {
    if (direction === "left") {
      return (
        <div className="w-full flex items-center justify-start p-2 my-4 border-b border-gray-700 ">
          <BsRobot className="text-5xl border border-white p-2" />
          <div className="text-white border border-black max-w-[40vw] ml-2 bg-matte-black2/50 p-3 rounded-xl">
            {body}
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full flex items-center justify-end p-2 my-4 border-b border-gray-700">
          <div className="text-white border border-black max-w-[40vw] mr-2 bg-matte-black2/50 p-3 rounded-xl">
            {body}
          </div>
          <LuUserSquare2 className="text-4xl" />
        </div>
      );
    }
  };

  return (
    <div className="flex justify-between w-full h-[90vh]">
      <Chatsidebar />
      <div className="text-white w-fit mr-[10vw] flex flex-col items-center justify-between">
        <div className="flex flex-col h-fit w-full overflow-y-auto">
          {content.map((obj, index) => (
            <ChatContent
              key={index} // Use index as key for messages
              username={obj.username}
              body={obj.body}
              direction={obj.direction}
            />
          ))}
        </div>
        
        <SearchBar />
      </div>
    </div>
  );
};

export default Chatbot;
