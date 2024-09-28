import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { checkApiLimit, increaseApiLimit } from '@/lib/api-limit';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const instructionMessage : ChatCompletionMessageParam  = {
    role : "system",
    content : "Your sole purpose is to function as a quiz generator. You will only respond to requests to generate, present, and evaluate quizzes. You will not engage in conversations outside this scope. Upon interaction, prompt the user to specify a topic for the quiz. This topic will guide the generation of quiz questions. For each question, generate a multiple-choice question (MCQ) relevant to the user's specified topic. Provide four options, out of which only one is correct. Ensure that options are well-formatted and listed clearly using bullet points or numbering (e.g., A, B, C, D). All questions and options must be presented in a well-formatted markdown format to ensure clarity and proper structure. After presenting the question and options, prompt the user to guess the correct answer by selecting one of the options (A, B, C, or D). Based on the user's input, provide feedback: If correct, respond with confirmation and explain why the answer is correct. If incorrect, specify the correct answer and explain why it is correct. After evaluating the user's answer, ask if they would like to continue with more questions on the same topic or switch to a new topic. Adjust the quiz accordingly based on their response. Do not respond to or entertain questions or conversations that fall outside of generating, presenting, or evaluating quiz questions. Simply remind the user that you are designed only for quiz-related tasks."
}

export async function POST(
    req: Request
) {
    try {
        
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!process.env.OPENAI_API_KEY) {
            return new NextResponse("OpenAI API Key not configured", { status:500 });
        }

        if(!messages) {
            return new NextResponse("Messagess are required", {status:400});
        }

        const freeTrial = await checkApiLimit();

        if(!freeTrial) {
            return new NextResponse("Free tial has expired.", {status: 403});
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [instructionMessage, ...messages]
        });

        await increaseApiLimit();

        return NextResponse.json(response.choices[0].message);

    } catch (error) {
        console.log("[CODE_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
        
    }
}