import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Calls Claude and parses the JSON response.
 * All 4 agents use this — keeping LLM logic in one place.
 */
export async function callClaude<T>(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 1024
): Promise<T> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const raw = (response.content[0] as { text: string }).text.trim();
  const jsonText = raw.replace(/^```json\n?|\n?```$/g, "").trim();

  return JSON.parse(jsonText) as T;
}