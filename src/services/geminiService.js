import { GoogleGenAI } from '@google/genai';

// Initialize the SDK.
// NOTE: In a real production app, you should NEVER expose your API key in the frontend.
// It should be routed through a secure backend to prevent theft.
// For this frontend MVP, it expects VITE_GEMINI_API_KEY in the environment.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let ai;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
}

export const scanReceipt = async (base64Image, mimeType) => {
    if (!ai) {
        throw new Error("Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
    }

    const prompt = `
    Analyze this receipt image and extract the following information.
    Respond ONLY with a valid JSON object matching this exact structure:
    {
      "amount": "Total amount as a number (e.g. 45.50)",
      "merchant": "Name of the store or merchant",
      "category": "Choose ONE of: Groceries, Dining Out, Utilities, Entertainment, Home, Other",
      "date": "Date of transaction in YYYY-MM-DD format",
      "items": [
        {
          "name": "Name of the item",
          "price": "Price of the item as a number"
        }
      ]
    }
    If you cannot find a piece of information, guess the most likely value or leave it empty. Ensure items array contains all identifiable purchased items.
  `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                prompt,
                {
                    inlineData: {
                        data: base64Image,
                        mimeType
                    }
                }
            ],
            config: {
                responseMimeType: "application/json",
            }
        });

        const text = response.text;
        return JSON.parse(text);
    } catch (error) {
        console.error("Error scanning receipt:", error);
        throw error;
    }
};
