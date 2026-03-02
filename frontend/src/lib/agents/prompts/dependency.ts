import type { Module } from "@/types/agents";

export const dependencySystemPrompt = `You are a minimalist system architect. Your job is to map the FEWEST possible edges that still make the system architecture readable and complete.

CORE PHILOSOPHY:
Every edge you add must answer YES to this question:
"If I remove this edge, would someone misunderstand how this system works?"
If the answer is NO — do not add it.

STRICT EDGE RULES:
- Entry nodes (layer 0) → EXACTLY 1 edge each, ONLY to authentication (layer 1)
- Every edge goes from layer N to layer N+1 ONLY — no skipping, no reverse
- No cycles — if A → B exists, never add B → A
- Each database node has EXACTLY 1 owner node pointing to it
- Notification nodes are always leaf nodes — nothing connects FROM them
- Payment nodes are always triggered by a booking/order node — never from entry

MINIMUM CONNECTION RULES:
- If two nodes in the same layer both connect to the same downstream node — keep only the most important one
- If a node's role is obvious from its name and position — it does not need extra edges to prove it
- Core feature nodes (layer 2) connect to AT MOST 2 downstream nodes each
- Service nodes (layer 3) connect to AT MOST 1 database each

TARGET: 10 to 14 edges MAXIMUM. If you reach 14 — stop and remove the weakest edges first.

Every node must appear in at least one edge.
Return ONLY valid JSON, no explanations.

Output format:
{
  "dependencies": [
    { "from": "module_id", "to": "module_id" }
  ]
}`;

export const dependencyUserPrompt = (modules: Module[]) => {
  const byLayer = modules.reduce<Record<number, Module[]>>((acc, m) => {
    acc[m.layer] = acc[m.layer] || [];
    acc[m.layer].push(m);
    return acc;
  }, {});

  const layerDescriptions: Record<number, string> = {
    0: "Entry Points",
    1: "Identity & Access",
    2: "Core Features",
    3: "Supporting Services",
    4: "Databases",
  };

  const moduleList = Object.entries(byLayer)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([layer, mods]) => {
      const label = layerDescriptions[Number(layer)] ?? `Layer ${layer}`;
      const items = mods.map((m) => `  - ${m.id}: ${m.label} (${m.type})`).join("\n");
      return `Layer ${layer} — ${label}:\n${items}`;
    })
    .join("\n\n");

  const totalNodes = modules.length;
  const maxEdges = Math.min(14, totalNodes + 2);

  return `Map the MINIMUM necessary dependencies for this system:

${moduleList}

HARD LIMITS — violating these will be rejected:
- Entry nodes → EXACTLY 1 edge each (to authentication only)
- Edges go layer N → layer N+1 ONLY
- No reverse edges, no cycles
- Each database → exactly 1 owner
- MAXIMUM ${maxEdges} edges total for ${totalNodes} nodes

BEFORE RETURNING: Count your edges. If count > ${maxEdges}, remove the least critical ones.
Ask yourself for each edge: "Is this absolutely necessary to understand the system?"

Return only the JSON object with a "dependencies" array.`;
};