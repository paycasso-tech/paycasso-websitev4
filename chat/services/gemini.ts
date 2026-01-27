
import { GoogleGenAI } from "@google/genai";
import { User } from "../types";

// Fix: Always use named parameter for apiKey and direct process.env access
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSimulatedResponse = async (targetUser: User, lastMessage: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: lastMessage,
      config: {
        // Fix: Use systemInstruction for persona and behavioral rules
        systemInstruction: `You are simulating a professional representative named ${targetUser.fullName} (@${targetUser.username}) in a high-stakes transaction chat. 
        STRICT RULES:
        1. Do NOT use emojis.
        2. Keep your reply concise, professional, and factual.
        3. Use formal language.
        4. Do not offer personal opinions unless they pertain to the transaction at hand.`,
        temperature: 0.5,
      }
    });

    // Fix: response.text is a property, not a method
    return response.text?.trim() || "Message received and acknowledged.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Transaction update acknowledged. Proceeding with standard protocol.";
  }
};
