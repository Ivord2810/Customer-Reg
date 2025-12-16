import { GoogleGenAI } from "@google/genai";
import { Customer, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Utility to calculate distance (duplicated here to keep service pure and self-contained)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
};

export const analyzeCustomerData = async (customers: Customer[]): Promise<AnalysisResult> => {
  if (customers.length === 0) {
    return {
      summary: "No data available to analyze.",
      strategy: "Start collecting customer data to generate insights.",
      clusters: []
    };
  }

  // Calculate segments for context
  const HQ_LAT = 5.6037;
  const HQ_LNG = -0.1870;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const highVolumeCount = customers.filter(c => c.averageBags > 50).length;
  const localCount = customers.filter(c => getDistance(c.latitude, c.longitude, HQ_LAT, HQ_LNG) <= 5).length;
  const newCount = customers.filter(c => new Date(c.lastVisit) >= thirtyDaysAgo).length;

  const dataSummary = customers.map(c => ({
    name: c.businessName,
    loc: `${c.latitude.toFixed(3)},${c.longitude.toFixed(3)}`,
    vol: c.averageBags
  }));

  const prompt = `
    Analyze this sachet water customer data in Ghana.
    
    Segmentation Context:
    - High Volume Customers (>50 bags): ${highVolumeCount}
    - Local Customers (<5km from Accra HQ): ${localCount}
    - New Customers (last 30 days): ${newCount}

    Detailed Data: ${JSON.stringify(dataSummary)}
    
    Provide a JSON response with the following fields:
    - summary: A brief executive summary of the customer base, mentioning the segments.
    - strategy: Suggest a sales or delivery strategy based on the segmentation (e.g. how to retain high volume, or expand local routes).
    - clusters: An array of strings, where each string describes a suggested delivery cluster/zone based on location and volume.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      summary: "Analysis currently unavailable.",
      strategy: "Please check your network connection or API key.",
      clusters: ["Analysis failed"]
    };
  }
};