import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const translateText = async (text: string): Promise<string> => {
  if (!text.trim()) return "No text found on this page.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional Danish to English translator. 
      Translate the following Danish text from a PDF document into clear, academic English.
      
      Instructions:
      1. Preserve the original paragraph structure using Markdown (e.g., separate paragraphs with newlines).
      2. If you encounter mathematical formulas, keep them in their original format or LaTeX.
      3. If the text is just page numbers or headers, include them but formatted subtly.
      4. Output ONLY the translation, no preamble.

      Source Text:
      ${text}`,
    });

    return response.text || "Translation failed.";
  } catch (error) {
    console.error("Gemini Translation Error:", error);
    return "Error generating translation. Please check your API key and try again.";
  }
};