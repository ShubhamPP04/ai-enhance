import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key
const getGeminiClient = () => {
  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not defined in environment variables");
  }

  return new GoogleGenerativeAI(apiKey);
};

export async function enhancePrompt(userInput: string): Promise<string> {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-04-17",
      generationConfig: {
        maxOutputTokens: 2048,  // Allow for longer responses
        temperature: 0.7,       // Slightly creative but still focused
      }
    });

    const prompt = `Generate a significantly expanded and enhanced version of this prompt. The enhanced version should be comprehensive, detailed, and much longer than the original. Include all relevant context, specifications, and details that would make the prompt more effective. Your response should be at least 3-4 times longer than the original input.

Reply with ONLY the enhanced prompt - no conversation, explanations, lead-in text, bullet points, placeholders, or surrounding quotes.

Original prompt: ${userInput}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    return "Error enhancing prompt. Please try again.";
  }
}
