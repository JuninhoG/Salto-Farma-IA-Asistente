import { GoogleGenAI, Chat } from "@google/genai";
import { GEMINI_API_KEY, SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;
let aiClient: GoogleGenAI | null = null;

export const initializeChat = async (): Promise<string> => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error("API Key not found");
    }

    aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    // We use gemini-2.5-flash for fast, responsive chat interactions
    chatSession = aiClient.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balanced creativity and adherence to instructions
      },
    });

    // We send a hidden "Start" signal to trigger the Greeting Phase defined in the prompt
    // This ensures the bot starts with the specific "Phase 1" text.
    const response = await chatSession.sendMessage({ message: "Hola, inicio de conversación." });
    
    return response.text || "Hola 👋, soy Salto Farma Assistente Virtual.";
  } catch (error) {
    console.error("Error initializing chat:", error);
    throw error;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "";
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};