import { GoogleGenAI } from "@google/genai";
import { LanguageCode, TranslationMode, SUPPORTED_LANGUAGES } from "../types";

export const translateText = async (
  text: string, 
  sourceLang: LanguageCode,
  targetLang: LanguageCode,
  mode: TranslationMode = 'academic',
  userApiKey: string
): Promise<string> => {
  
  // Strictly use user provided key. No server-side env fallback to ensure pure client-side security.
  if (!userApiKey) {
    throw new Error("MISSING_API_KEY");
  }

  if (!text.trim()) return "No text found on this page.";

  const ai = new GoogleGenAI({ apiKey: userApiKey });

  const sourceName = SUPPORTED_LANGUAGES[sourceLang].full;
  const targetName = SUPPORTED_LANGUAGES[targetLang].full;

  // Construct Prompt based on Mode
  let systemInstruction = "";
  
  if (mode === 'academic') {
    systemInstruction = `You are an expert translator specializing in academic and scientific PDF documents.
    
    Translation Guidelines:
    1. **Tone**: Academic, precise, formal, and objective.
    2. **Math/Latex**: EXTREMELY IMPORTANT. Preserve all mathematical notation, formulas, and variable names exactly as is. Do not translate variables (e.g., keep 'x', 'y' as is).
    3. **Structure**: Maintain the original logical flow and paragraph structure.
    4. **Formatting**: Use Markdown. If input is a header, make it a header.`;
  } else {
    // General Mode
    systemInstruction = `You are a professional translator specializing in natural, fluent communication.
    
    Translation Guidelines:
    1. **Tone**: Natural, readable, and adapted to the context (e.g., if it looks like a letter, be polite; if it's a news article, be journalistic).
    2. **Clarity**: Prioritize readability in ${targetName} over literal word-for-word translation.
    3. **Structure**: Use Markdown to keep the text readable (paragraphs, lists).`;
  }

  // CJK (Chinese/Japanese) handling: We don't want to blindly replace newlines with spaces if the text is CJK, 
  // as that introduces unwanted spaces between characters.
  const isCJK = sourceLang === 'ja' || sourceLang === 'zh';
  
  const preprocessingNote = isCJK 
    ? "2. **Merge Lines**: Join lines intelligently. For Chinese/Japanese, do NOT add spaces between joined characters unless necessary."
    : "2. **Merge Lines**: Treat newlines within a sentence as spaces.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${systemInstruction}

      Crucial Pre-processing Steps for PDF Text:
      1. **Fix Broken Words**: Reconstruct words split by hyphens at line ends (e.g., "uni-\nversity" -> "university").
      ${preprocessingNote}

      Task: Translate the following ${sourceName} text to ${targetName}. return ONLY the translated text.

      Source Text:
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