// ─── Module Types ────────────────────────────────────────────

export type ModuleType =
  | "entry"      // ✅ add — user-facing entry points
  | "core"
  | "service"
  | "integration"
  | "engine"     // ✅ add — analytics, AI engines
  | "database"
  | "infra";     // keep but agents should rarely use it

export interface Module {
  id: string;
  label: string;
  type: ModuleType;
  layer: number;   // ✅ add — 0=entry, 1=core, 2=services, 3=engines, 4=databases
  column: number;  // ✅ add — horizontal position within layer, starts at 1
}

// ─── Dependency Types ─────────────────────────────────────────

export type DependencyType = "user_flow" | "data_flow" | "service_call";

export interface Dependency {
  from: string;
  to: string;
  type?: DependencyType; // ✅ make optional — edge type is visual decoration, not critical
}

// ─── Agent Output Types ───────────────────────────────────────

export interface Agent1Output {
  modules: Module[];
}

export interface Agent2Output {
  dependencies: Dependency[];
}

export interface Agent3Output {
  additions: Module[];
  extra_dependencies: Dependency[];
  risks: string[];
}

export type OwnerRole = "Frontend" | "Backend" | "Fullstack" | "DevOps" | "Data";

export interface Assignment {
  module: string;
  owner: OwnerRole;
}

export interface Agent4Output {
  assignments: Assignment[];
  groups: {
    core: string[];
    services: string[];
    infra: string[];
    database: string[];
    ui: string[];
  };
  priority: Record<string, number>;
}

// ─── Final Graph (React Flow ready) ──────────────────────────

export interface FinalGraph {
  idea: string;
  nodes: Module[];
  edges: Dependency[];
  risks: string[];
  ownership: Assignment[];
  groups: Agent4Output["groups"];
  priority: Agent4Output["priority"];
}