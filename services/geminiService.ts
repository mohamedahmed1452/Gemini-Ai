
import { GoogleGenAI, Chat } from "@google/genai";
import { Message, Role } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const chatModel = 'gemini-2.5-flash';
const imageModel = 'imagen-4.0-generate-001';

const chatConfig = {
  // The config is the same as the models.generateContent config.
  config: {
    systemInstruction: 'You are a helpful and creative AI assistant.',
  },
};

export async function* streamChatResponse(prompt: string, history: Message[]) {
  const chat: Chat = ai.chats.create({
    model: chatModel,
    ...chatConfig,
    history: history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    })).filter(msg => msg.role !== Role.USER || msg.parts[0].text !== prompt) // Exclude the current prompt from history
  });
  
  const result = await chat.sendMessageStream({ message: prompt });
  for await (const chunk of result) {
    yield chunk.text;
  }
}

export async function generateImage(prompt: string): Promise<string> {
  const response = await ai.models.generateImages({
    model: imageModel,
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '1:1',
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    return response.generatedImages[0].image.imageBytes;
  } else {
    throw new Error('Image generation failed to produce an image.');
  }
}
