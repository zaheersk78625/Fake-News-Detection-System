import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

// API Route for REST support (mirrored from server.ts)
app.post("/api/predict", async (req, res) => {
  const { content, type, fileData, mimeType, context } = req.body;
  
  try {
    if (type === 'media' && fileData) {
      const base64Data = fileData.split(',')[1];
      const result = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType,
                },
              },
              {
                text: `Analyze this media for news authenticity. Context: ${context || 'None'}. Return JSON with prediction, confidence, explanation, tags.`
              }
            ]
          }
        ],
        config: { responseMimeType: "application/json" }
      });
      return res.json(JSON.parse(result.text));
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Analyze for news authenticity: ${content}. Return JSON with prediction, confidence, explanation, tags.`,
      config: { responseMimeType: "application/json" }
    });
    res.json(JSON.parse(response.text));
  } catch (error) {
    console.error("Vercel API Error:", error);
    res.status(500).json({ error: "Analysis failed" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "News Checker API" });
});

export default app;
