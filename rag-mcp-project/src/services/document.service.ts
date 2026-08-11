import { pool } from "../db/client.js";
import { chunkText } from "../rag/chunking.js";
import { generateEmbedding } from "../rag/embeddings.js";

export async function saveDocument(
  filename: string,
  content: string
) {
  const documentResult = await pool.query(
    `
    INSERT INTO documents (filename, content)
    VALUES ($1, $2)
    RETURNING id
    `,
    [filename, content]
  );

  const documentId = documentResult.rows[0].id;

  const chunks = chunkText(content);

  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);

    await pool.query(
      `
      INSERT INTO document_chunks
      (document_id, content, embedding)
      VALUES ($1, $2, $3)
      `,
      [documentId, chunk, JSON.stringify(embedding)]
    );
  }

  return {
    documentId,
    chunks: chunks.length
  };
}

export async function getDocuments() {
  const result = await pool.query(`
    SELECT
      d.id,
      d.filename,
      d.created_at,
      COUNT(dc.id) as chunk_count
    FROM documents d
    LEFT JOIN document_chunks dc ON d.id = dc.document_id
    GROUP BY d.id
    ORDER BY d.created_at DESC
  `);
  return result.rows;
}