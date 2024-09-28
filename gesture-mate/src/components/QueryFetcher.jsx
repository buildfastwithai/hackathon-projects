import axios from "axios"
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import { FaHandSparkles } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IntractAI from "./IntractAI";


function QueryFetcher() {
  const API_KEY = process.env.REACT_APP_API_KEY; //Taking API key From environment

  const [query, setQuery] = useState("");  // State to store the fetched query
  const [responses, setResponses] = useState([]); // Array to store responses
  const [loading,setLoading] = useState(false); // Loading variable to detact the action state of appication
  const responseEndRef = useRef(null); // Reference to the bottom of the responses

  
  // Function to Generate Error toast ===============================================================
  const notify = (msg) => {
    toast.error(msg , {
      position: "bottom-center", 
      autoClose: 2000,            
      theme:"dark"
    });
  };

  // Function to fetch the query from Flask API=================================================
  async function fetchQuery(){
    setLoading(true);
    try {
      const res = await fetch('/get-query');
      console.log("Call to Flask-API")
      console.log(res)
      const data = await res.json();
      console.log(data)
      setQuery(data.query);  // Store the query in the useState variable
    } catch (error) {
      notify("Error in hand-recogination")
      console.error("Error fetching the query:", error);
    }
    setLoading(false);
  };

  
    
    
  // Function to fetch the answer from Gemini API=================================================
  async function generateAnswer(){
    console.log("Query: ");

    
    console.log(query)

    if(query!==""){
      setLoading(true);
      try{
        console.log("Call to Gemini-API...")
        const res = await axios({
          method: "post",
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
          data: {
            "contents":[
              {"parts":[{"text":query}]}
            ]
          }
        })
  
        console.log(res);
        const newResponse =res.data.candidates[0].content.parts[0].text;
        setResponses((prevResponses) => [...prevResponses, newResponse]);
        
      }catch(err){
        notify("Error in AI request")
        console.log(`Error in axios POST request:\n ${err}`)
      }
      setQuery("");
      setLoading(false);
      console.log("finish...")
    }
  }

   // Use `useEffect` to Scroll to the bottom whenever a new response is added
   useEffect(() => {
    if (responseEndRef.current) {
      responseEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [responses]);
  
  function onChangeHandler(event){
  setQuery(event.target.value);
  }

  return (
    <div className='relative z-10 min-h-screen flex flex-col gap-6 items-center justify-end pb-16'>
      <h1 className="text-3xl text-center text-slate-200 p-10 font-bold">
      Gesturemate
      </h1>
      
      <div className="fixed -z-10 top-0 bottom-0 left-0 right-0">
      <IntractAI/>
      </div>

      {/* Responses Container */}
        <div className="flex flex-col gap-2 px-2 sm:px-16 md:px-20 lg:px-48 w-full ">
          {responses.map((response, index) => (
            <div key={index} className="w-full  p-2 border-slate-300 text-slate-200 bg-slate-950 bg-opacity-80 border-2 rounded-md">
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          ))}
          {loading &&

            <div className="text-slate-200 text-xl font-semibold text-center p-2">Loading...</div>
          }
        </div>

      {/* Input Bottom Bar */}
      <div className="w-full flex gap-4 px-2 py-2 sm:px-16 md:px-20 lg:px-60 justify-center items-center bg-black border-t-2 border-slate-200 fixed bottom-0">
        
        {/* Taking Query From Hand Gestures using flask API */}
        <button 
          onClick={() => {
            if (!loading) {
              fetchQuery();
            }
          }} 
          className={`font-semibold text-yellow-500 flex gap-2 ${ loading ? "bg-slate-600" : "bg-slate-900 hover:bg-slate-950" } rounded-full items-center p-2`}
          >
          <FaHandSparkles className="text-2xl" />
          <span className="hidden md:block">Use Hand-Gesture</span>
        </button>

        {/* Taking Query Input From User in text fromat */}
        <input type="text" placeholder="Ask any Question!" value={query} onChange={onChangeHandler} disabled={loading} 
          className={`p-2 border-2 text-slate-200 border-slate-200 rounded-md  bg-transparent flex-grow ${ loading ? "cursor-not-allowed opacity-50" :"opacity-100"}`}/>

        {/* Button to call function-> make Gemini-API request for response */}
        <button
          onClick={() => {
            if (!loading) {
              generateAnswer();
            }
          }}
          className={`font-semibold text-yellow-500 flex gap-2 ${ loading ? "bg-slate-600" : "bg-slate-900 hover:bg-slate-950" }  rounded-full items-center py-2 px-4`}        >
          Generate
        </button>
      </div>

      {/* Ref to scroll to the end */}
      <div ref={responseEndRef}></div>

      {/* Adding container to show ERROR Toast */}
      <div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default QueryFetcher;
