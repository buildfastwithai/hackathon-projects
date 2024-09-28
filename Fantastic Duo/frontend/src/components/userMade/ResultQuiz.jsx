import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import axios from 'axios'
import { useParams } from 'react-router-dom'

import { marked } from 'marked'; // Import the marked library

const ResultQuiz = () => {
  
  const {quiz_id, username} = useParams();

  const [quizResults, setQuizResults] = useState([]);
  const [score, setScore] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [noOfQuestions, setNoOfQuestions] = useState(null);
  const [feedBack, setFeedBack] = useState(null);



  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/quiz/${quiz_id}/user_score`, {
          params: { username }
        });
        console.log(response.data);
        const { questions, score, time_completion } = response.data;
        setNoOfQuestions(response.data.noOfQuestions)
        setFeedBack(response.data.feedback);
        setQuizResults(questions);
        setScore(score);
        setTimeTaken(time_completion);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResult();
  }, [quiz_id, username]);


  const createMarkup = (text) => {
    return text ? { __html: marked(text) } : { __html: '' }; // Return empty HTML if text is falsy
};

  return (
    <div className='max-w-screen'>
      <div className='h-[40vw] w-full flex flex-row'>
        <div className='w-[50%] h-full flex flex-col items-center justify-center text-center '>
          <h2 className="leading-[5vw] flex flex-row gap-[1vw] justify-center items-center text-[5vw] font-bold text-[#3565EC]">
            Your Score: <span className='text-yellow-500 flex'>{score} / {noOfQuestions}</span>
          </h2>
          <p className='text-[1.5vw] font-semibold w-[65%] text-center'>Time Taken⏰: {timeTaken} secs</p>
          <p className='text-[0.9vw] font-semibold w-[65%] text-center'>Visit the quiz leaderboard page to see your rankings</p>
          <p className='font-semibold w-[65%] text-center italic text-[0.7vw]'>Scroll down to see the correct answers</p>
        </div>
        <div className='w-[50%] flex items-center justify-center h-full'>
          <Card className="w-[90%] min-h-[90%]">
            <CardHeader>
              <CardTitle className='text-[2vw] font-bold leading-[3vw]'>Personalized Feedback and Learning Paths</CardTitle>
              <CardDescription className='italic text-[0.8vw]'>This is AI-generated feedback.</CardDescription>
            </CardHeader>
            <CardContent>
              <Card className='min-h-[26.5vw] p-[1vw] w-full shadow-none'>
              <div dangerouslySetInnerHTML={createMarkup(feedBack)} />
              </Card>
            </CardContent>
            <CardFooter className="flex justify-between"></CardFooter>
          </Card>
        </div>
      </div>

      <div className='my-[2vw] w-[90%] mx-auto'>
        <div>
          <h2 className='font-bold text-[3vw] mb-[2vw] '>Quiz Solutions and Explanation</h2>
        </div>
        <div className='h-full w-full'>
          {quizResults.map((question, index) => (
            <Card
              key={index}
              className={`mb-[1.5vw] border-[0.2vw] bg-opacity-10 ${
                question.user_answer === question.correct_answer ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-600'
              }`}
            >
              <CardHeader>
                <CardTitle className='text-[1.6vw] font-bold leading-[3vw] text-gray-800'>
                  {`Question ${index + 1}: ${question.question}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={`item-${index}-1`}>
                    <AccordionTrigger className='font-bold text-yellow-600'>Your Answer</AccordionTrigger>
                    <AccordionContent>{question.user_answer}</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={`item-${index}-2`}>
                    <AccordionTrigger className='font-bold text-green-500'>Correct Answer</AccordionTrigger>
                    <AccordionContent>{question.correct_answer}</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={`item-${index}-3`}>
                    <AccordionTrigger className='font-bold text-gray-700'>Explanation</AccordionTrigger>
                    <AccordionContent>{question.explanation}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter className="flex justify-between"></CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResultQuiz