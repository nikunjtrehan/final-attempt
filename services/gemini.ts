import { GoogleGenAI, Type } from "@google/genai";
import { Expert } from '../types';

// Initialize Gemini
// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
// Use import.meta.env for Vite, and ensure the variable starts with VITE_
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

export const matchExpertsWithAI = async (query: string, experts: Expert[]): Promise<{
  matchedExpertIds: string[];
  reasoning: string;
}> => {
  try {
    // Use gemini-2.5-flash for basic text tasks and reasoning
    const model = 'gemini-2.5-flash';
    
    // Prepare the prompt context
    // Limiting context fields to save tokens while providing enough info for matching
    const expertsContext = experts.map(e => ({
      id: e.id,
      name: e.name,
      title: e.title,
      skills: e.skills.join(", "),
      company: e.company,
      bio: e.bio
    }));

    const prompt = `
      You are an intelligent expert matching assistant for a consultation platform.
      
      User Query: "${query}"
      
      Available Experts Database:
      ${JSON.stringify(expertsContext)}
      
      Task: 
      1. Analyze the user's query to understand their problem.
      2. Select the top 1-3 experts from the database who are best suited to help.
      3. Provide a short, punchy reason why they are a match.
      
      Return JSON only.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedExpertIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of expert IDs that match the query"
            },
            reasoning: {
              type: Type.STRING,
              description: "A brief explanation of why these experts were selected for the user."
            }
          },
          required: ["matchedExpertIds", "reasoning"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    
    throw new Error("No response text from AI");

  } catch (error) {
    console.error("Gemini Match Error:", error);
    // Fallback behavior
    return { matchedExpertIds: [], reasoning: "AI matching unavailable. Please try manual search." };
  }
};
