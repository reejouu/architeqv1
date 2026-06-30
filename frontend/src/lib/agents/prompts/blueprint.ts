import { Type, type Schema } from "@google/genai";

// ─── Call A: Blueprint (modules + dependencies in one pass) ───
// Goal: a COMPREHENSIVE, build-ready skeleton — not the bare minimum.
// Populate the layers with the real modules a working version of the product
// would have (up to the caps), and wire the dependencies that actually explain
// how data and users flow through it.

export const blueprintSystemPrompt = `You are a product-focused system architect.

Produce a clean architecture for the product idea: the set of
modules a real working version would have, plus the dependencies that explain how
data and users flow through it. The result is a skeletal framework a developer can
either build from directly or adapt — so be thorough within the bounds, not minimal.

MODULE RULES
- Up to 16 nodes total. Use the budget when the idea justifies it — a real product
  is rarely just 4 boxes. Do NOT pad with filler either.
- Every node is something a user or developer would NAME when describing the product
  (a real feature, surface, or data boundary). One node per distinct responsibility.
- Layers (assign each node a "layer"):
  - 0 → who uses the system (Users, Admin, etc.) — max 2
  - 1 → identity & access (Auth, Profile/Accounts) — max 2
  - 2 → core product features (the main things the product does) — max 5
  - 3 → supporting services that react to / power core features — max 4
  - 4 → databases, one per major data domain — max 4
- "column" = horizontal position within a layer, starting at 1.
- type ∈ "entry" | "core" | "service" | "integration" | "engine" | "database".

NEVER include infrastructure/DevOps nodes — they don't fit this product model:
CI/CD, Docker, Kubernetes, Load Balancer, CDN, API Gateway, Redis, Kafka, RabbitMQ,
message queues, Rate Limiter, WAF, VPC, monitoring, logging, observability.
(A messaging/queue node is allowed only if the product ITSELF is that thing.)

DEPENDENCY RULES (edges that tell the system's story)
- Each edge goes from layer N to layer N+1 ONLY — no skipping layers, no reverse edges, no cycles.
- Entry nodes (layer 0) → exactly 1 edge each, to identity/access (layer 1).
- Every database (layer 4) is written/owned by exactly 1 upstream node.
- Notification-style nodes are leaves (nothing flows out of them).
- Include the meaningful connections that show how the product works — enough to be
  a usable blueprint — but avoid redundant edges (if two same-layer nodes both feed
  the same downstream node, keep only the stronger relationship).
- Every node must appear in at least one edge.

Return ONLY valid JSON, no explanations. Output shape:
{
  "modules": [
    { "id": "snake_case", "label": "Human Name", "type": "core", "layer": 2, "column": 1 }
  ],
  "dependencies": [
    { "from": "module_id", "to": "module_id" }
  ]
}`;

export const blueprintUserPrompt = (idea: string) =>
    `Design a comprehensive, build-ready architecture (modules + dependencies) for this product:

"${idea}"

Populate each layer with the modules a real working version would need (up to the caps),
then connect them with the dependencies that explain how the system works.
Return only the JSON object with "modules" and "dependencies" arrays.`;

export const blueprintSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        modules: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING },
                    type: {
                        type: Type.STRING,
                        enum: ["entry", "core", "service", "integration", "engine", "database"],
                    },
                    layer: { type: Type.INTEGER },
                    column: { type: Type.INTEGER },
                },
                required: ["id", "label", "type", "layer", "column"],
                propertyOrdering: ["id", "label", "type", "layer", "column"],
            },
        },
        dependencies: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    from: { type: Type.STRING },
                    to: { type: Type.STRING },
                },
                required: ["from", "to"],
                propertyOrdering: ["from", "to"],
            },
        },
    },
    required: ["modules", "dependencies"],
    propertyOrdering: ["modules", "dependencies"],
};
