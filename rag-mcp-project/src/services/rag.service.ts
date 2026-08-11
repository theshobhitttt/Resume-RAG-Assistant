import { searchDocuments } from "../rag/retrieval.js";
import { generateAnswer } from "../rag/generation.js";

export async function askRAG(question: string) {
  const results = await searchDocuments(question, 5);

  const context = results
    .map(
      (item: any, index: number) =>
        `[Source ${index + 1}: ${item.filename}]\n${item.content}`
    )
    .join("\n\n");

  const answer = await generateAnswer(
    question,
    context
  );

  return {
    answer,
    sources: results.map((item: any) => ({
      filename: item.filename,
      similarity: item.similarity,
      content: item.content
    }))
  };
}