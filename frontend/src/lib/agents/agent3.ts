import { callGemini } from "../ai/llm.gemini";
import { gapSystemPrompt, gapUserPrompt } from "../agents/prompts/gap";
import type { Agent1Output, Agent2Output, Agent3Output } from "@/types/agents";

export async function agent3(
  a1: Agent1Output,
  a2: Agent2Output
): Promise<Agent3Output> {
  console.log("─── Agent 3: Gap & Risk Analyzer ───");

  const result = await callGemini<Agent3Output>(
    gapSystemPrompt,
    gapUserPrompt(a1.modules, a2.dependencies)
  );

  console.log(`✅ Added ${result.additions.length} modules, flagged ${result.risks.length} risks\n`);
  return result;
}