import { pool } from "../db/client.js";
import { generateEmbedding } from "./embeddings.js";

export async function searchDocuments(
  query: string,
  limit = 5
) {
  const embedding = await generateEmbedding(query);

  const result = await pool.query(
    `
    SELECT
      dc.id,
      dc.content,
      d.filename,
      1 - (dc.embedding <=> $1::vector) AS similarity
    FROM document_chunks dc
    JOIN documents d
      ON d.id = dc.document_id
    ORDER BY dc.embedding <=> $1::vector
    LIMIT $2
    `,
    [JSON.stringify(embedding), limit]
  );

  return result.rows;
}
