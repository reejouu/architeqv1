import { callGemini } from "../ai/llm.gemini";
import { dependencySystemPrompt, dependencyUserPrompt } from "../agents/prompts/dependency";
import type { Agent1Output, Agent2Output } from "@/types/agents";

export async function agent2(input: Agent1Output): Promise<Agent2Output> {
  console.log("─── Agent 2: Dependency Mapper ───");

  const result = await callGemini<Agent2Output>(
    dependencySystemPrompt,
    dependencyUserPrompt(input.modules)
  );

  console.log(`✅ Mapped ${result.dependencies.length} dependencies\n`);
  return result;
}