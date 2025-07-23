// openaiClient.js
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // بهتره اینو تو env بذاری
});



export async function getAISuggestion(codeSnippet) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content: `You're a coding assistant. You help improve and optimize code snippets from all programming languages with better performance, readability, and best practices.`,
      },
      {
        role: "user",
        content: `Suggest an optimized version for this code:\n\n${codeSnippet}`,
      },
    ],
    temperature: 0.7,
  });

  const fullText = response.choices[0].message.content;

  const match = fullText.match(/```(?:\w*\n)?([\s\S]*?)```/);
  const onlyCode = match ? match[1].trim() : fullText;

  return {
    full: fullText,
    code: onlyCode
  };
}
