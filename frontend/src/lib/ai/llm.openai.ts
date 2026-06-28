import OpenAI from "openai";

let openai: OpenAI;

export async function callOpenAI<T>(
    systemPrompt: string,
    userPrompt: string,
    maxTokens: number = 8192
): Promise<T> {
    if (!openai) {
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: maxTokens,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
    });

    const raw = completion.choices[0].message.content ?? "";
    return JSON.parse(raw) as T;
}
