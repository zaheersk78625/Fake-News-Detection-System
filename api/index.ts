import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

// API Route for REST support (mirrored from server.ts)
app.post("/api/predict", async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following news content for authenticity. Provide a prediction (Real/Fake/Uncertain), confidence score, and explanation in JSON format.
      
      Content: ${content}`,
      config: {
        responseMimeType: "application/json",
      },
    });
    res.json(JSON.parse(response.text));
  } catch (error) {
    console.error("Vercel API Error:", error);
    res.status(500).json({ error: "Failed to analyze" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "News Checker API" });
});

export default app;
