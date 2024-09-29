import { Label } from '@radix-ui/react-label';
import { Input } from "@/components/ui/input"
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Assuming you're using Axios to make API requests


import { useAuth } from "@/AuthContext";
import Loading from '../loading/Loading';



const CreateBattle = () => {
    const [battleName, setBattleName] = useState('');
    const [battleDescription, setBattleDescription] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [timeLimit, setTimeLimit] = useState(30);
    const [deadline, setDeadline] = useState(1);

    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false); // Add loading state
    
    const handleBackButton = () => {
        if(!isAuthenticated){
            navigate('/');
          }
        else{
            navigate('/battlepage');
        }
    }

    const creatorUsername = localStorage.getItem('username');  
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form fields (simple validation)
        if (!battleName || !battleDescription || numQuestions <= 0 || timeLimit <= 0) {
            alert('Please fill out all fields correctly.');
            return;
        }

        setLoading(true);

        // Battle creation logic (API request to backend)
        try {
            const response = await axios.post('http://localhost:5000/api/create_battle', {
                battleName :battleName,
                battleDescription :battleDescription,
                numQuestions :numQuestions,
                timeLimit :timeLimit,
                creatorUsername :creatorUsername,
                deadline: deadline,
            });
            if (response.status === 201) {
                console.log(response.data.battle_id);
                navigate('/joinbattle')
            } else {
                alert('Failed to create battle');
            }
        } catch (error) {
            console.error('Error creating battle:', error);
            alert('An error occurred while creating the battle.');
        } finally{
            setLoading(false);
        }
    }

    return (
        <div className="max-w-screen">
            
            {loading && (
                // Loading spinner overlay
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <Loading type="bars" color="#3565EC" />
                </div>
            )}
            
            <div className='flex h-[43vw] my-[1vw]'>
                <div className='w-[50%] h-full relative'>
                    <div onClick={handleBackButton} className='p-4 active:scale-105 rounded-full transition-all hover:ease-in duration-150 hover:bg-gray-100 text-[2vw] absolute'>
                        <BiArrowBack />
                    </div>
                    <div className='h-full justify-center flex flex-col items-center'>
                        <h2 className="leading-[5vw] flex flex-col justify-center items-center text-[5vw] w-full font-bold text-[#3565EC]">Create your <span className='text-yellow-500'>Battle Arena.</span></h2>
                        <p className='text-[1.5vw] font-semibold'>Set up a quiz battle and challenge your friends!</p>
                    </div>
                </div>

                <div className='w-[50%] flex justify-center'>
                    <Card className='w-[80%] h-[40vw] border-none drop-shadow-none'>
                        <CardHeader>
                            <CardTitle className='text-[2vw]'>Enter the following details for a battle</CardTitle>
                            <CardDescription>Make sure to fill valid values</CardDescription>
                        </CardHeader>
                        <CardContent className=''>
                            <form onSubmit={handleSubmit} className='flex flex-col gap-[1vw]'>
                                <div>
                                    <Label htmlFor="battletitle" className='drop-shadow-sm'>Battle Title</Label>
                                    <Input 
                                        type="text" 
                                        placeholder="Enter Battle Title"
                                        value={battleName}
                                        onChange={(e) => setBattleName(e.target.value)} 
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="battledesc" className='drop-shadow-sm'>Battle Description</Label>
                                    <Textarea 
                                        placeholder="Describe your battle"
                                        value={battleDescription}
                                        onChange={(e) => setBattleDescription(e.target.value)} 
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="NumberOfQuestions" className='drop-shadow-sm'>No. of Questions</Label>
                                    <Input 
                                        type="number" 
                                        placeholder="Enter number of questions"
                                        value={numQuestions}
                                        onChange={(e) => setNumQuestions(Number(e.target.value))} 
                                        min={1}
                                        required
                                    />
                                </div>

                                {/* <div>
                                    <Label htmlFor="difficulty" className='drop-shadow-sm'>Level of Difficulty</Label>
                                    <Select
                                        value={difficulty}  // Set the difficulty state
                                        onValueChange={(value) => setDifficulty(value)}  // Update difficulty state
                                        required
                                    >
                                        <SelectTrigger aria-label="Select difficulty">
                                            <SelectValue placeholder="Select difficulty level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div> */}

                                <div>
                                    <Label htmlFor="timelimit" className='drop-shadow-sm'>Set the time duration of quiz (in minutes)</Label>
                                    <Input 
                                        type="number" 
                                        placeholder="Enter time duration"
                                        value={timeLimit}
                                        onChange={(e) => setTimeLimit(Number(e.target.value))} 
                                        min={1}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="deadline" className='drop-shadow-sm'>Set the Contest Deadline (in hours)</Label>
                                    <Input 
                                        type="number" 
                                        placeholder=""
                                        value={deadline}
                                        onChange={(e) =>(setDeadline(e.target.value))} 
                                        min={1}
                                        required
                                    />
                                </div>

                                <Button type='submit'>Create Quiz Contest</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default CreateBattle;
