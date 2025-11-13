import { GoogleGenAI } from '@google/genai';
import '@dotenvx/dotenvx/config';

const ai = new GoogleGenAI({});

async function main(prompt: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `You are an AI assistant that helps users learn programming and prepare for
        technical interviews. Provide clear explanations with examples when needed.`,
          },
        ],
      },
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  });

  console.log('AI response', response.text);
}

main('In one sentence, explain recursion');
