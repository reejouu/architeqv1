import type { Module } from "@/types/agents";

export const allocatorSystemPrompt = `You are an engineering manager and technical project lead.

Given a complete list of system modules:
1. Assign each module to a team role: Frontend, Backend, Fullstack, DevOps, or Data
2. Group modules into: "core", "services", "infra", "database", "ui"
3. Assign build priority (1 = first, 2 = second, 3 = last)

Ownership rules:
- Frontend → UI components, user-facing flows
- Backend → business logic, APIs, data processing
- Fullstack → features spanning both frontend and backend
- DevOps → infrastructure, caching, queues, gateways
- Data → databases, pipelines, analytics

Priority rules:
- 1: auth, core flows, critical APIs
- 2: supporting services, integrations
- 3: infra optimization, non-critical services

Return ONLY valid JSON, no explanations.

Output format:
{
  "assignments": [
    { "module": "module_id", "owner": "Frontend|Backend|Fullstack|DevOps|Data" }
  ],
  "groups": {
    "core": ["module_id"],
    "services": ["module_id"],
    "infra": ["module_id"],
    "database": ["module_id"],
    "ui": ["module_id"]
  },
  "priority": {
    "module_id": 1
  }
}`;

export const allocatorUserPrompt = (modules: Module[]) => {
  const moduleList = modules
    .map((m) => `- ${m.id}: ${m.label} (${m.type})`)
    .join("\n");

  return `Create a team execution plan for these system modules:

${moduleList}

Return only the JSON object.`;
};