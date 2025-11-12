import { GoogleGenAI } from '@google/genai';
import '@dotenvx/dotenvx/config';

const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: 'In one sentence, explain Node',
  });

  console.log('AI response', response.text);
}

main();
