import express from "express";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import path from "path";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const PDFCO_API_KEY = "siddhantphule2020@gmail.com_QLtsravmwwKh51mLTAbHaPe65xWTouc7m4B5g9m33W2zSmJW5wGby7q693OQeboN"; // Replace with actual API key

// Ensure 'uploads' directory exists
const ensureUploadDir = () => {
  const uploadDir = path.resolve("uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
};
ensureUploadDir();

router.post("/parse-resume", upload.single("resume"), async (req, res) => {
  try {
    console.log("Uploaded File:", req.file);
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const fileStream = fs.createReadStream(filePath);

    // Step 1: Upload file to PDF.co storage
    const uploadFormData = new FormData();
    uploadFormData.append("file", fileStream, req.file.originalname);

    const uploadResponse = await axios.post("https://api.pdf.co/v1/file/upload", uploadFormData, {
      headers: {
        "x-api-key": PDFCO_API_KEY,
        ...uploadFormData.getHeaders(),
      },
    });

    if (!uploadResponse.data.url) {
      console.error("Upload Failed:", uploadResponse.data);
      throw new Error("Failed to upload file to PDF.co");
    }

    const fileUrl = uploadResponse.data.url;
    console.log("Uploaded File URL:", fileUrl);

    // Step 2: Extract text from PDF
    const textResponse = await axios.post(
      "https://api.pdf.co/v1/pdf/convert/to/text-simple",
      JSON.stringify({ url: fileUrl }),
      {
        headers: {
          "x-api-key": PDFCO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!textResponse.data.url) {
      console.error("Text Extraction Failed:", textResponse.data);
      throw new Error("Failed to extract text from PDF");
    }

    console.log("Text File URL:", textResponse.data.url);

    // Step 3: Download extracted text
    const extractedTextResponse = await axios.get(textResponse.data.url);
    const extractedText = extractedTextResponse.data;

    console.log("Extracted Text:", extractedText.slice(0, 100)); // Log first 100 chars
    res.json({ text: extractedText });

    // Cleanup
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Resume parsing error:", error.response?.data || error.message);
    res.status(500).json({ error: error.message || "Failed to parse resume" });
  }
});

export default router;
