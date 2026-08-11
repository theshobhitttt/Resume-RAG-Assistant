import { openai } from "../config/openai.js";

export async function generateAnswer(
  question: string,
  context: string
) {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `
You are a helpful RAG assistant.

Answer the user's question using only the provided context.

If the answer is not present in the context,
say that you could not find the answer in the documents.

Do not invent information.
        `
      },
      {
        role: "user",
        content: `
Context:
${context}

Question:
${question}
        `
      }
    ]
  });

  return response.choices[0].message.content;
}
