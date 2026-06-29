import { callGemini } from "../ai/llm.gemini";
import {
    blueprintSystemPrompt,
    blueprintUserPrompt,
    blueprintSchema,
} from "../agents/prompts/blueprint";
import type { BlueprintOutput } from "@/types/agents";

// Call A — extracts modules AND their dependencies in a single LLM pass.
export async function agentBlueprint(idea: string): Promise<BlueprintOutput> {
    console.log("─── Blueprint: Modules + Dependencies ───");

    const result = await callGemini<BlueprintOutput>(
        blueprintSystemPrompt,
        blueprintUserPrompt(idea),
        blueprintSchema
    );

    console.log(
        `✅ ${result.modules.length} modules, ${result.dependencies.length} dependencies\n`
    );
    return result;
}
