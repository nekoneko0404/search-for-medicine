import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API key is available. 
// In Next.js, environment variables are loaded from .env.local
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "DUMMY_KEY");

// Using gemini-3.0-flash as requested
export const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
  generationConfig: {
    responseMimeType: "application/json",
  }
});
