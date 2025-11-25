import { GoogleGenAI } from '@google/genai';
import '@dotenvx/dotenvx/config';

const ai = new GoogleGenAI({});

export async function generateResponse(
  prompt: string,
): Promise<string | undefined> {
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
  return response.text;
}

export async function generateResponseWithSummary(
  prompt: string,
  learningProfile: string,
) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `You are an AI assistant helping users learn programming. The user has the following
              learning profile: "${learningProfile}". Based on this, answer their query and update their 
              profile with a once-sentence summary of strengths and weaknesses. Respond in **valid JSON format**:
              {
                "response": "Your AI-generated respnse",
                "updatedProfileSummary": "Updated profile summary"
              }`,
          },
          { text: `User query: ${prompt}` },
        ],
      },
    ],
  });

  return response.text;
}
