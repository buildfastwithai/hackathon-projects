import { checkApiLimit, increaseApiLimit } from '@/lib/api-limit';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { topic } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }

    if (!topic) {
      return new NextResponse("Topic is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    if (!freeTrial) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Generate a concise explanation for the topic in one line: ${topic}.`
        }
      ]
    });

    // Check if response and choices exist
    if (!response || !response.choices || response.choices.length === 0) {
      return new NextResponse("No response from OpenAI", { status: 500 });
    }
    //@ts-ignore
    const flashcardContent = response.choices[0].message.content.trim();

    await increaseApiLimit();

    // Return both topic and content
    return NextResponse.json({ title: topic, content: flashcardContent });

  } catch (error) {
    console.log("[FLASHCARD_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
