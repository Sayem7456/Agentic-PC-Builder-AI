
import { GoogleGenAI, Type } from "@google/genai";
import type { PCConfiguration } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    totalPrice: {
      type: Type.NUMBER,
      description: "The total estimated price of all components combined."
    },
    currency: {
      type: Type.STRING,
      description: "The currency symbol for the budget and prices (e.g., USD, EUR, CAD)."
    },
    components: {
      type: Type.ARRAY,
      description: "A list of all the recommended PC components.",
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            description: "The type of component (e.g., CPU, GPU, Motherboard)."
          },
          name: {
            type: Type.STRING,
            description: "The specific model name of the component."
          },
          price: {
            type: Type.NUMBER,
            description: "The estimated price of this individual component."
          },
          purchaseLink: {
            type: Type.STRING,
            description: "A direct URL to purchase the component from a retailer in the user's region."
          },
          justification: {
            type: Type.STRING,
            description: "A brief explanation of why this component was chosen for the specified use case and budget."
          }
        },
        required: ["type", "name", "price", "purchaseLink", "justification"]
      }
    }
  },
  required: ["totalPrice", "currency", "components"]
};


export const getPCConfiguration = async (useCase: string, budget: number, region: string): Promise<PCConfiguration> => {
  const prompt = `
Generate a complete and optimized PC configuration for the following requirements:
- Primary Use Case: ${useCase}
- Maximum Budget: ${budget} (please use a currency relevant to the region)
- User's Region for Purchase Links: ${region}

Provide a detailed list of components including CPU, GPU, RAM, Storage (SSD), Motherboard, Power Supply (PSU), and a suitable Case. All components must be compatible with each other. 
For each component, include a brief justification for its selection. The total price must not exceed the specified budget. 
Find real, current purchase links from popular online retailers in the specified region (e.g., Amazon, Newegg, Best Buy for USA; Caseking, Mindfactory for Germany).
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert AI agent named 'BuildBot' specializing in creating optimal custom PC configurations. Your goal is to act as a personal computer hardware consultant. You must adhere strictly to the user's budget and provide components that are compatible with each other. You must provide purchase links relevant to the user's specified region. Your response MUST be in the specified JSON format and schema.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);

    // Basic validation to ensure the parsed object matches the expected structure
    if (!parsedJson.totalPrice || !parsedJson.components || !Array.isArray(parsedJson.components)) {
        throw new Error("AI response is missing required fields.");
    }
    
    return parsedJson as PCConfiguration;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
        throw new Error("The AI returned an invalid JSON response. Please try again.");
    }
    throw new Error("Failed to generate PC configuration from AI. Please try again later.");
  }
};
