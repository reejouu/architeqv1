import { GoogleGenAI, type Schema } from "@google/genai";
import { callOpenAI } from "./llm.openai";

let genAI: GoogleGenAI;

/**
 * Calls Gemini and parses the JSON response.
 *
 * Latency-tuned for deterministic structured extraction:
 * - thinkingBudget: 0 disables gemini-2.5-flash's dynamic "thinking" (the
 *   biggest latency cost for this kind of JSON task).
 * - responseMimeType forces raw JSON; an optional responseSchema constrains the
 *   shape further when it can be fully specified.
 * Falls back to OpenAI on a 503 (model overloaded).
 */
export async function callGemini<T>(
    systemPrompt: string,
    userPrompt: string,
    responseSchema?: Schema,
    maxTokens: number = 2048
): Promise<T> {
    if (!genAI) {
        genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    }

    try {
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.2,
                maxOutputTokens: maxTokens,
                responseMimeType: "application/json",
                ...(responseSchema ? { responseSchema } : {}),
                thinkingConfig: { thinkingBudget: 0 },
            },
        });

        const raw = (response.text ?? "").trim();
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
