import { callGemini } from "../ai/llm.gemini";
import { extractorSystemPrompt, extractorUserPrompt } from "../agents/prompts/extractor";
import type { Agent1Output } from "@/types/agents";

export async function agent1(idea: string): Promise<Agent1Output> {
  console.log("─── Agent 1: Architecture Extractor ───");

  const result = await callGemini<Agent1Output>(
    extractorSystemPrompt,
    extractorUserPrompt(idea)
  );

  console.log(`✅ Extracted ${result.modules.length} modules\n`);
  return result;
}