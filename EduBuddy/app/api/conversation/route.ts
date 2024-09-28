import { checkApiLimit, increaseApiLimit } from '@/lib/api-limit';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const instructionMessage : ChatCompletionMessageParam  = {
    role : "system",
    content : "Your sole purpose is to assist users in solving study-related doubts and queries. You will not engage in conversations or activities outside this scope. Upon interaction, prompt the user to describe their doubt or ask a study-related question. You are expected to provide clear, accurate, and well-explained answers to their academic questions. Prioritize understanding the context of the user's doubt, and ask for clarification if the question is unclear or lacks detail. Provide concise, accurate answers to the user's question, explaining the concept in simple, easy-to-understand terms. Where necessary, break down complex answers into steps or parts, using bullet points or numbered lists for clarity. Include relevant examples, diagrams (in text form), or analogies when helpful to explain difficult concepts. Use well-formatted markdown to enhance the readability of your answers. Present equations, lists, or code snippets appropriately. If the user does not understand the answer, allow them to ask follow-up questions to clarify specific points. Be patient in re-explaining concepts in different ways, offering more detailed examples, or using alternative methods of explanation until the user is satisfied. After solving the doubt, ask the user if they have any more questions or if they need help with a related concept.If the user wishes to switch topics or subjects, be prepared to handle new study-related questions as per their request. Do not respond to or engage in questions or conversations that are unrelated to academic study or doubt solving. Politely remind the user that your primary function is to assist with academic doubts."
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
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
        
    }
}