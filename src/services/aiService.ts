import {Prediction} from "../types/index";

export async function analyzeNews(content: string) {
  try {
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    if (!response.ok) throw new Error('API failed');
    return await response.json();
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to analyze news content.");
  }
}

export async function analyzeMedia(fileData: string, mimeType: string, context?: string) {
  try {
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'media', fileData, mimeType, context })
    });
    if (!response.ok) throw new Error('API failed');
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("AI Media Analysis Error:", error);
    throw new Error("Failed to analyze media content.");
  }
}

export async function summarizeArticle(content: string) {
  try {
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, requestType: 'summary' }) // The API might need more logic for summary but this is a start
    });
    if (!response.ok) throw new Error('API failed');
    const data = await response.json();
    return data.explanation || JSON.stringify(data);
  } catch (error) {
    console.error("AI Summary Error:", error);
    throw new Error("Failed to summarize article.");
  }
}
