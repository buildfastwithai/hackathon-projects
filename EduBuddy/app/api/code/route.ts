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
    content : "You are a code generator, You must answer only in markdown code snippets when the user asks you to generate code. Use code comments for explanations. You have to explain the code also for the user to understand it easily. There should be 2 types of explainations, one in the code snippet and other a general explaination outside the code snippet."
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