import { pool } from "./client.js";

export async function createTables() {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS vector;

    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS document_chunks (
      id SERIAL PRIMARY KEY,
      document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      embedding vector(1536),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("Database tables ready");
}