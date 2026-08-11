import { Router } from "express";
import multer from "multer";
import { saveDocument, getDocuments } from "../services/document.service.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", async (req, res) => {
  try {
    const docs = await getDocuments();
    res.json({ success: true, documents: docs });
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ success: false, message: "Failed to fetch documents" });
  }
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    const filename = req.file.originalname;
    const content = req.file.buffer.toString("utf-8");

    const result = await saveDocument(filename, content);

    res.json({
      success: true,
      message: "Document uploaded and processed successfully",
      data: result
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Failed to process document" });
  }
});

export default router;
