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

/**
 * Uses the AI to perform a quick compatibility check on a given configuration.
 * @param config The PC configuration to verify.
 * @returns A boolean indicating whether the configuration is compatible.
 */
const verifyConfigurationCompatibility = async (config: PCConfiguration): Promise<boolean> => {
  const verificationPrompt = `
      Here is a PC component list in JSON format:
      ${JSON.stringify(config.components, null, 2)}
      
      Are all these components fully compatible with each other? 
      Pay specific attention to:
      1. CPU socket compatibility with the Motherboard socket.
      2. RAM type (e.g., DDR4, DDR5) compatibility with the Motherboard.
      3. Power Supply (PSU) wattage being sufficient for the CPU and GPU.
      4. Physical case size accommodating all components.

      Answer with a single word: 'YES' or 'NO'.
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: verificationPrompt,
        config: { temperature: 0 },
    });

    const answer = response.text.trim().toUpperCase();
    console.log(`AI Compatibility Check Response: ${answer}`);
    return answer === 'YES';
  } catch (error) {
    console.error("Error during AI compatibility verification:", error);
    // Be safe: if verification fails, assume incompatibility.
    return false;
  }
};


export const getPCConfiguration = async (useCase: string, budget: number, region: string): Promise<PCConfiguration> => {
  const MAX_RETRIES = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`Attempt ${attempt} of ${MAX_RETRIES} to generate a compatible PC configuration.`);

    const prompt = `
      ${attempt > 1 ? `The previous attempt resulted in an incompatible configuration. Please pay extra close attention to component compatibility (CPU socket vs Motherboard, RAM type vs Motherboard, PSU wattage) and try again.` : ''}
      
      You are an expert PC builder located in **${region}**. Your task is to generate a complete and optimized PC configuration based on the following requirements, using local retailers and pricing.

      **Requirements:**
      - Primary Use Case: ${useCase}
      - Maximum Budget: ${budget}
      - User's Region for All Purchases: **${region}**

      **CRITICAL INSTRUCTIONS (MUST FOLLOW):**
      1.  **Regional Sourcing is Mandatory**: All component prices and purchase links **MUST** come from online retailers that operate and ship within **'${region}'**. Do not use generic US-based retailers unless the region is 'USA'.
      2.  **Correct Currency**: The currency for all prices and the total budget **MUST** be the local currency for **'${region}'**.
      3.  **Provide Real, Local Links**: The \`purchaseLink\` for each component must be a direct link to the product page on a retailer's website for the specified region.

      **Examples of Regional Retailers:**
      - If Region is 'USA': Use newegg.com, amazon.com, microcenter.com. Currency: USD.
      - If Region is 'Canada': Use newegg.ca, canadacomputers.com, memoryexpress.com. Currency: CAD.
      - If Region is 'UK': Use scan.co.uk, overclockers.co.uk, ebuyer.com. Currency: GBP.
      - If Region is 'Germany': Use mindfactory.de, caseking.de, alternate.de. Currency: EUR.
      - If Region is 'Australia': Use pccasegear.com, scorptec.com.au, mwave.com.au. Currency: AUD.
      
      **Task:**
      Provide a detailed list of components including CPU, GPU, RAM, Storage (SSD), Motherboard, Power Supply (PSU), and a suitable Case. All components must be fully compatible. For each component, include a brief justification for its selection. The total price **in the local currency** must not exceed the specified budget. If a component is not available, find a suitable alternative available in **'${region}'**.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert AI agent named 'BuildBot' specializing in creating optimal custom PC configurations. Your goal is to act as a personal computer hardware consultant. You must adhere strictly to the user's budget and provide components that are fully compatible with each other. You must provide purchase links relevant to the user's specified region. Your response MUST be in the specified JSON format and schema.",
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });

      const jsonText = response.text.trim();
      const parsedJson = JSON.parse(jsonText);

      if (!parsedJson.totalPrice || !parsedJson.components || !Array.isArray(parsedJson.components)) {
          throw new Error("AI response is missing required fields.");
      }
      
      const configuration = parsedJson as PCConfiguration;

      const isCompatible = await verifyConfigurationCompatibility(configuration);

      if (isCompatible) {
        console.log("AI confirmed configuration is compatible. Success!");
        return configuration;
      } else {
        console.warn(`Attempt ${attempt} failed: AI reported incompatible components.`);
        lastError = new Error("AI-generated components were reported as incompatible.");
        // Continue to the next attempt
      }

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      lastError = error instanceof Error ? error : new Error(String(error));
      if (lastError.message.includes('JSON')) {
          lastError = new Error("The AI returned an invalid JSON response.");
      }
    }
  }

  throw new Error(`The AI failed to generate a compatible configuration after ${MAX_RETRIES} attempts. Please try adjusting your request. ${lastError ? `Last error: ${lastError.message}` : ''}`);
};