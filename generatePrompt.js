import { config } from 'dotenv';
import { OpenAI } from 'openai';

config(); // Loads OPENAI_API_KEY from .env

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateMidjourneyPrompt() {
  const basePrompt = `
    Generate a visually striking Midjourney prompt in the style of:
    "futuristic AI working in a neon-lit server room, cinematic lighting, highly detailed, trending on ArtStation".
    Output only the prompt text, no explanation.
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: basePrompt }],
    temperature: 0.9,
  });

  return response.choices[0].message.content.trim();
}
