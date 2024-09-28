import React, { useState } from "react";

const Quiz = () => {
  const [formData, setFormData] = useState({
    topic: "",
    num: "",
    learning_objective: "",
    difficulty_level: "",
  });

  const [Questions, setQuestions] = useState([]); // Change here

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formElements = e.target.elements;
    const updatedFormData = {
      topic: formElements.topic.value,
      num: formElements.num.value,
      learning_objective: formElements.learning_objective.value,
      difficulty_level: formElements.difficulty_level.value,
    };
    setFormData(updatedFormData);
    console.log("Form Data:", updatedFormData);
  
    try {
      const response = await fetch("http://127.0.0.1:5002/generate_questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const result = await response.json();
      const parsedData = JSON.parse(result);
      // console.log(parsedData)
      // console.log(parsedData.questions)
      setQuestions(parsedData.questions); // This remains the same
    } catch (error) {
      console.error("Error fetching questions:", error);
      // Handle error (e.g., show an error message)
    }
  };
  

  const Form = () => {
    return (
      <form onSubmit={handleSubmit} className="bg-gray-800 h-fit p-4 rounded-lg">
        <div className="mb-4">
          <label className="block text-white">Topic</label>
          <input
            type="text"
            name="topic"
            className="w-full p-2 bg-gray-700 text-white rounded-lg"
            placeholder="Enter the topic"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white">Number of Questions</label>
          <input
            type="number"
            name="num"
            className="w-full p-2 bg-gray-700 text-white rounded-lg"
            placeholder="Enter number of questions"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white">Learning Objective</label>
          <input
            type="text"
            name="learning_objective"
            className="w-full p-2 bg-gray-700 text-white rounded-lg"
            placeholder="Enter the learning objective"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white">Difficulty Level</label>
          <select
            name="difficulty_level"
            className="w-full p-2 bg-gray-700 text-white rounded-lg"
            required
          >
            <option value="">Select difficulty level</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-green-500 text-white rounded-lg"
        >
          Generate Quiz
        </button>
      </form>
    );
  };

  const Question = ({ questionObj }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);

    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
    };

    const toggleAnswerVisibility = () => {
      setShowAnswer(!showAnswer);
    };

    const getOptionStyle = (option) => {
      if (!showAnswer) return "";
      return option === questionObj.answer // Adjust to your API response
        ? "bg-green-500 text-white"
        : selectedOption === option
        ? "bg-red-500 text-white"
        : "bg-gray-800 text-white";
    };

    return (
      <div className="bg-gray-800 text-white p-4 rounded-lg mb-4 w-full">
        <h2 className="text-lg font-bold mb-2">{questionObj.question}</h2>
        <ul className="list-none mb-2">
          {questionObj.options.map((option, index) => (
            <li key={index} className={`mb-1 ${getOptionStyle(option)} rounded-lg`}>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`question-${questionObj.question}`}
                  value={option}
                  checked={selectedOption === option}
                  onChange={handleOptionChange}
                  className="mr-2"
                />
                {option}
              </label>
            </li>
          ))}
        </ul>
        <button
          onClick={toggleAnswerVisibility}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </button>
        {showAnswer && (
          <div>
            <div className="mt-2">
              <strong>Answer: </strong>
              {questionObj.answer}
            </div>
            <div className="mt-1">
              <strong>Explanation: </strong>
              {questionObj.explanation}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 min-h-screen flex">
      <div>
        <div className="text-white text-2xl mb-4">Quiz Form</div>
        <Form />
      </div>
      <div className="overflow-y-auto w-full px-4 flex flex-col ">
        <div className="text-white text-2xl mt-8 mx-auto">Generated Quiz</div>
        {Questions.map((questionObj, index) => ( // Change here
          <Question key={index} questionObj={questionObj} />
        ))}
      </div>
    </div>
  );
};

export default Quiz;
