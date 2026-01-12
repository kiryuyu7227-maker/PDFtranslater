import { GoogleGenAI } from "@google/genai";
import { LanguageDirection } from "../types";

export const translateText = async (
  text: string, 
  direction: LanguageDirection = 'da-en', 
  userApiKey: string
): Promise<string> => {
  
  // Strictly use user provided key. No server-side env fallback to ensure pure client-side security.
  if (!userApiKey) {
    throw new Error("MISSING_API_KEY");
  }

  if (!text.trim()) return "No text found on this page.";

  const ai = new GoogleGenAI({ apiKey: userApiKey });

  const isDanishToEnglish = direction === 'da-en';
  const sourceLang = isDanishToEnglish ? 'Danish' : 'English';
  const targetLang = isDanishToEnglish ? 'English' : 'Danish';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert translator specializing in academic PDF documents. Translate the following ${sourceLang} text to ${targetLang}.

      Crucial Pre-processing Steps:
      1. **Fix Broken Words**: PDFs often split words with hyphens at line ends (e.g., "uni-\nversity"). Reconstruct these into full words ("university") before translating.
      2. **Merge Lines**: PDFs often have hard line breaks within sentences. Treat newlines within a paragraph as spaces, unless it's a clear paragraph break.

      Translation Guidelines:
      1. **Tone**: Academic, precise, and professional.
      2. **Structure**: Maintain Markdown paragraph structure. Use blank lines to separate paragraphs.
      3. **Math/Latex**: Preserve all mathematical notation exactly as is.
      4. **Formatting**: If the input is a header or page number, format it subtly (e.g. *Page 1*).
      5. **Output**: Return ONLY the translated text. No conversational filler or preamble.

      Source Text (${sourceLang}):
      ${text}`,
    });

    return response.text || "Translation failed.";
  } catch (error: any) {
    console.error("Gemini Translation Error:", error);
    
    // Check for common API Key errors (400 Invalid Argument often means bad key format, 403 means permission denied)
    if (error.status === 400 || error.status === 403 || error.message?.includes('API key')) {
        throw new Error("INVALID_API_KEY");
    }
    
    throw new Error("TRANSLATION_ERROR");
  }
};