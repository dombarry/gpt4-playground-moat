import { OpenAIStream, StreamingTextResponse } from 'ai';

// ./app/api/chat/route.ts
import OpenAI from 'openai';

const MODEL = 'gpt-4';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

// Custom instruction for the model
const HIDDEN_INSTRUCTION = {
  role: 'system',
  content: 'You are a GPT-4 model focused on emotional care. Prioritize the users well being, and talk in a conversational, welcoming and open way.'
};

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages: userMessages } = await req.json();

  // Prepend the hidden instruction to the user's messages
  const messages = [HIDDEN_INSTRUCTION, ...userMessages];

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: MODEL,
    stream: true,
    messages: messages,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}

