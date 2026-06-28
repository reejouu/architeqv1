import { GoogleGenerativeAI } from "@google/generative-ai";
import { callOpenAI } from "./llm.openai";

let genAI: GoogleGenerativeAI;

export async function callGemini<T>(
    systemPrompt: string,
    userPrompt: string,
    maxTokens: number = 8192
): Promise<T> {
    if (!genAI) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    }

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: systemPrompt,
        generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: 0.2,
            responseMimeType: "application/json",
        },
    });

    try {
        const result = await model.generateContent(userPrompt);
        const raw = result.response.text().trim();
        const jsonText = raw.replace(/^```json\n?|\n?```$/g, "").trim();
        return JSON.parse(jsonText) as T;
    } catch (err: unknown) {
        const status = (err as { status?: number })?.status;
        if (status === 503) {
            console.warn("Gemini 503 — falling back to OpenAI");
            return callOpenAI<T>(systemPrompt, userPrompt, maxTokens);
        }
        throw err;
    }
}