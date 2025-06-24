import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function generateResponse(prompt: string) {
  // For text-only input, use the gemini-pro model
 const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash"  // or "gemini-pro" for older versions
});

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating response:", error);
    return "Sorry, I encountered an error while generating a response.";
  }
}