import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI;

/**
 * Calls Gemini and parses the JSON response.
 * Drop-in replacement for the Claude llm.ts — same signature.
 */
export async function callGemini<T>(
    systemPrompt: string,
    userPrompt: string,
    maxTokens: number = 8192
): Promise<T> {
    if (!genAI) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    }

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro-latest",
        systemInstruction: systemPrompt,
        generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: 0.2,
            responseMimeType: "application/json", // Gemini returns clean JSON natively
        },
    });

    const result = await model.generateContent(userPrompt);
    const raw = result.response.text().trim();

    // Strip markdown fences just in case
    const jsonText = raw.replace(/^```json\n?|\n?```$/g, "").trim();
    return JSON.parse(jsonText) as T;
}