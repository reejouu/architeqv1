import { callGemini } from "../ai/llm.gemini";
import { allocatorSystemPrompt, allocatorUserPrompt } from "../agents/prompts/allocator";
import type { Agent1Output, Agent3Output, Agent4Output } from "@/types/agents";

export async function agent4(
    a1: Agent1Output,
    a3: Agent3Output
): Promise<Agent4Output> {
    console.log("─── Agent 4: Work Allocator ───");

    const allModules = [...a1.modules, ...a3.additions];

    const result = await callGemini<Agent4Output>(
        allocatorSystemPrompt,
        allocatorUserPrompt(allModules)
    );

    console.log(`✅ Allocated ${result.assignments.length} ownership assignments\n`);
    return result;
}