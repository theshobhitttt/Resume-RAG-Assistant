import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createTables } from "./db/schema.js";
import chatRoutes from "./routes/chat.routes.js";
import documentRoutes from "./routes/document.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes);
app.use("/api/documents", documentRoutes);
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "RAG backend is running"
  });
});

const PORT = process.env.PORT || 5000;

createTables()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error("Database initialization failed:", error);
  });