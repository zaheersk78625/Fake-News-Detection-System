import {GoogleGenAI, Type} from "@google/genai";
import {Prediction} from "../types";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY as string});

const NEWS_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    prediction: {
      type: Type.STRING,
      description: "Whether the news is 'Real', 'Fake', or 'Uncertain'.",
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence score percentage (0-100).",
    },
    explanation: {
      type: Type.STRING,
      description: "Detailed AI explanation of the prediction, highlighting red flags or supporting evidence.",
    },
    language: {
      type: Type.STRING,
      description: "Detected language of the news.",
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Relevant tags (e.g., 'political', 'clickbait', 'sensational').",
    },
    transcription: {
      type: Type.STRING,
      description: "The transcribed text of the audio or text extracted from an image (OCR).",
    }
  },
  required: ["prediction", "confidence", "explanation"]
};

export async function analyzeNews(content: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following news content for authenticity. Provide a detailed report including a prediction (Real/Fake/Uncertain), confidence score, and explanation. Consider sensationalism, source reliability (if applicable), and linguistic patterns.

Content:
${content}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: NEWS_ANALYSIS_SCHEMA,
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to analyze news content.");
  }
}

async function transcribeMedia(base64Data: string, mimeType: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: mimeType.startsWith('audio/') 
              ? "Transcribe this audio file accurately. If it is not speech, describe the sounds." 
              : "Extract all visible text from this image accurately (OCR).",
          },
        ],
      },
    });
    return response.text;
  } catch (error) {
    console.error("Transcription Error:", error);
    throw new Error("Failed to transcribe media. Please ensure the file format is supported.");
  }
}

export async function analyzeMedia(fileData: string, mimeType: string, context?: string) {
  try {
    const base64Data = fileData.split(',')[1];
    
    // Step 1: Transcribe
    const transcription = await transcribeMedia(base64Data, mimeType);

    // Step 2: Analyze with Transcript
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this media (image/audio) for potential news misinformation or fake signals.
            
            Transcribed Text/OCR:
            """
            ${transcription}
            """

            ${context ? `Additional Context: ${context}` : ""}

            Verify the claims made in the media and the transcribed text. Provide a detailed report including prediction, confidence, and explanation.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: NEWS_ANALYSIS_SCHEMA,
      },
    });

    const result = JSON.parse(response.text);
    return { ...result, transcription };
  } catch (error: any) {
    console.error("AI Media Analysis Error:", error);
    if (error.message?.includes('supported')) {
      throw error;
    }
    throw new Error("Failed to analyze media content.");
  }
}

export async function summarizeArticle(content: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a concise summary of the following article, highlighting key claims.

Content:
${content}`,
    });

    return response.text;
  } catch (error) {
    console.error("AI Summary Error:", error);
    throw new Error("Failed to summarize article.");
  }
}
