import { GoogleGenAI } from "@google/genai";
import { LanguageDirection } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const translateText = async (text: string, direction: LanguageDirection = 'da-en'): Promise<string> => {
  if (!text.trim()) return "No text found on this page.";

  const isDanishToEnglish = direction === 'da-en';
  const sourceLang = isDanishToEnglish ? 'Danish' : 'English';
  const targetLang = isDanishToEnglish ? 'English' : 'Danish';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional ${sourceLang} to ${targetLang} translator. 
      Translate the following ${sourceLang} text from a PDF document into clear, academic ${targetLang}.
      
      Instructions:
      1. Preserve the original paragraph structure using Markdown (e.g., separate paragraphs with newlines).
      2. If you encounter mathematical formulas, keep them in their original format or LaTeX.
      3. If the text is just page numbers or headers, include them but formatted subtly.
      4. Output ONLY the translation, no preamble.

      Source Text (${sourceLang}):
      ${text}`,
    });

    return response.text || "Translation failed.";
  } catch (error) {
    console.error("Gemini Translation Error:", error);
    return "Error generating translation. Please check your API key and try again.";
  }
};