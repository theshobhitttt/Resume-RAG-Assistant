import { Router } from "express";
import { askRAG } from "../services/rag.service.js";

const router = Router();

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required"
      });
    }

    const result = await askRAG(question);

    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "RAG request failed"
    });
  }
});

export default router;