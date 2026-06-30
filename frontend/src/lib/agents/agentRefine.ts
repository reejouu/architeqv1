import { callGemini } from "../ai/llm.gemini";
import { refineSystemPrompt, refineUserPrompt } from "../agents/prompts/refine";
import type { BlueprintOutput, RefineOutput } from "@/types/agents";

// Call B — completes the blueprint: gap/risk additions + ownership/priority,
// allocating every module (existing + additions) in a single LLM pass.
// No responseSchema: the "priority" map has dynamic module-id keys that
// Gemini's responseSchema can't express, so we rely on responseMimeType JSON.
export async function agentRefine(blueprint: BlueprintOutput): Promise<RefineOutput> {
    console.log("─── Refine: Gaps, Risks & Work Allocation ───");

    const result = await callGemini<RefineOutput>(
        refineSystemPrompt,
        refineUserPrompt(blueprint.modules, blueprint.dependencies)
    );

    console.log(
        `✅ +${result.additions.length} modules, ${result.risks.length} risks, ${result.assignments.length} assignments\n`
    );
    return result;
}
