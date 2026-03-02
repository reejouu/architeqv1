import type { Node, Edge } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";
import { getLayoutedElements } from "./layout";
import { computeLayout, type InputNode, type InputEdge } from "./engine";

// ─── AI Agent JSON schema ─────────────────────────────────────────────────────

export interface RawNode {
    id: string;
    label: string;
    type: string;        // e.g. "core" | "integration" | "service" | "agent" | "ui"
    owner?: string;
    status?: string;     // "Not Started" | "In Progress" | "Done" | "Blocked"
    description?: string;
    layer?: number;      // y-rank  (0 = entry, higher = deeper)
    column?: number;     // x-rank  (used with layer for 2D positioning)
    order?: number;      // position within the same layer+column (0 = top)
    group?: string;      // cluster name e.g. "agents" | "ui" | "infra" | "core"
    category?: string;   // "entry" | "gateway" | "core" | "service" | "database"
    handles?: string[];  // e.g. ["top", "right", "bottom", "left"]
}

export interface RawEdge {
    from: string;
    to: string;
    label?: string;
    type?: "default" | "dependency" | "critical";
    lane?: number;       // for offsetting multiple edges from same node
    sourceHandle?: string; // e.g. "right", "bottom"
    targetHandle?: string; // e.g. "left", "top"
}

export interface RawGraph {
    idea?: string;
    nodes: RawNode[];
    edges: RawEdge[];
    risks?: string[];
    ownership?: Array<{ module: string, owner: string }>;
    groups?: Record<string, string[]>;
    priority?: Record<string, number>;
}

// ─── Type → visual style mapping ─────────────────────────────────────────────

export const GRAPH_TYPE_CONFIG: Record<string, {
    color: string;
    rgb: string;
    bg: string;
    borderColor: string;
}> = {
    core: { color: "#8B5CF6", rgb: "139,92,246", bg: "rgba(139,92,246,0.06)", borderColor: "rgba(139,92,246,0.25)" },
    integration: { color: "#06B6D4", rgb: "6,182,212", bg: "rgba(6,182,212,0.06)", borderColor: "rgba(6,182,212,0.25)" },
    service: { color: "#10B981", rgb: "16,185,129", bg: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.25)" },
    database: { color: "#3B82F6", rgb: "59,130,246", bg: "rgba(59,130,246,0.06)", borderColor: "rgba(59,130,246,0.25)" },
    frontend: { color: "#F59E0B", rgb: "245,158,11", bg: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.25)" },
    queue: { color: "#EC4899", rgb: "236,72,153", bg: "rgba(236,72,153,0.06)", borderColor: "rgba(236,72,153,0.25)" },
    cache: { color: "#F97316", rgb: "249,115,22", bg: "rgba(249,115,22,0.06)", borderColor: "rgba(249,115,22,0.25)" },
    agent: { color: "#A78BFA", rgb: "167,139,250", bg: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.25)" },
    engine: { color: "#38BDF8", rgb: "56,189,248", bg: "rgba(56,189,248,0.06)", borderColor: "rgba(56,189,248,0.25)" },
    ai: { color: "#E879F9", rgb: "232,121,249", bg: "rgba(232,121,249,0.06)", borderColor: "rgba(232,121,249,0.25)" },
    ui: { color: "#34D399", rgb: "52,211,153", bg: "rgba(52,211,153,0.06)", borderColor: "rgba(52,211,153,0.25)" },
    state: { color: "#60A5FA", rgb: "96,165,250", bg: "rgba(96,165,250,0.06)", borderColor: "rgba(96,165,250,0.25)" },
    infra: { color: "#F87171", rgb: "248,113,113", bg: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.25)" },
    input: { color: "#FBBF24", rgb: "251,191,36", bg: "rgba(251,191,36,0.06)", borderColor: "rgba(251,191,36,0.25)" },
    entry: { color: "#C084FC", rgb: "192,132,252", bg: "rgba(192,132,252,0.06)", borderColor: "rgba(192,132,252,0.25)" },
    default: { color: "#71717A", rgb: "113,113,122", bg: "rgba(113,113,122,0.06)", borderColor: "rgba(113,113,122,0.25)" },
};

export const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
    "Not Started": { color: "#71717A", bg: "rgba(113,113,122,0.15)" },
    "In Progress": { color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
    "Done": { color: "#10B981", bg: "rgba(16,185,129,0.15)" },
    "Blocked": { color: "#EF4444", bg: "rgba(239,68,68,0.15)" },
};


// ─── Transform ────────────────────────────────────────────────────────────────

/**
 * Converts raw AI agent JSON → laid-out React Flow nodes + edges.
 *
 * When nodes have layer+column data, uses the advanced position engine
 * with barycenter crossing reduction and fan-out edge separation.
 *
 * Falls back to Dagre for nodes without spatial metadata.
 */
export function transformGraph(
    raw: RawGraph,
    direction: "TB" | "LR" = "TB"
): { nodes: Node[]; edges: Edge[] } {

    // ── Pre-process raw nodes to inject global data ──
    const enrichedNodes = raw.nodes.map(n => {
        // Map ownership
        const ownerShipEntry = raw.ownership?.find(o => o.module === n.id);
        const owner = ownerShipEntry ? ownerShipEntry.owner : n.owner;

        // Map group
        let group = n.group;
        if (!group && raw.groups) {
            for (const [groupName, groupNodes] of Object.entries(raw.groups)) {
                if (groupNodes.includes(n.id)) {
                    group = groupName;
                    break;
                }
            }
        }

        // Map priority (you can store this in order if order is missing, or a new field)
        const priorityScore = raw.priority?.[n.id];
        const status = n.status || (priorityScore === 1 ? "In Progress" : "Not Started");

        return {
            ...n,
            owner,
            group,
            status,
            priorityScore
        };
    });

    const hasLayers = enrichedNodes.every(n => typeof n.layer === "number");

    // ── Fast path: use position engine when layer data is available ──
    if (hasLayers) {
        const inputNodes: InputNode[] = enrichedNodes.map(n => ({
            id: n.id,
            label: n.label,
            type: (n.type || "default").toLowerCase(),
            layer: n.layer ?? 0,
            column: n.column ?? 0,
            owner: n.owner,
            status: n.status,
            description: n.description,
            group: n.group,
            category: n.category,
            handles: n.handles,
            order: n.order,
        }));

        const inputEdges: InputEdge[] = raw.edges.map(e => ({
            from: e.from,
            to: e.to,
            label: e.label,
            type: e.type,
            lane: e.lane,
        }));

        const layout = computeLayout(inputNodes, inputEdges);

        // Convert to React Flow format
        const rfNodes: Node[] = layout.nodes.map(n => ({
            id: n.id,
            type: "archNode",
            position: n.position,
            data: {
                label: n.data.label || "",
                nodeType: n.data.type || "default",
                owner: n.data.owner || "",
                status: n.data.status || "",
                description: n.data.description || "",
                layer: n.data.layer,
                column: n.data.column,
                order: n.data.order,
                group: n.data.group || "",
                category: n.data.category || "",
                handles: n.data.handles || ["top", "right", "bottom", "left"],
                priorityScore: (n as any).priorityScore, // if needed by ArchNode
            },
        }));

        const rfEdges: Edge[] = layout.edges.map(le => {
            return {
                id: le.id,
                source: le.source,
                target: le.target,
                sourceHandle: "bottom",
                targetHandle: "top",
                type: le.type === "smoothstep" ? "smoothstep" : "smoothstep",
                style: le.style,
                markerEnd: { type: MarkerType.ArrowClosed, color: "#636798" },
                pathOptions: {
                    offset: 20 + Math.abs(le.data.parallelOffset || 0),
                    borderRadius: 12,
                },
                data: {
                    exitPoint: le.data.exitPoint,
                    entryPoint: le.data.entryPoint,
                    waypoints: le.data.waypoints,
                    parallelOffset: le.data.parallelOffset,
                },
            };
        });

        return { nodes: rfNodes, edges: rfEdges };
    }

    // ── Fallback: Dagre layout for nodes without layer/column ──
    const rfNodes: Node[] = enrichedNodes.map((n) => ({
        id: n.id,
        type: "archNode",
        position: { x: 0, y: 0 },
        data: {
            label: n.label,
            nodeType: (n.type || "default").toLowerCase(),
            owner: n.owner || "",
            status: n.status || "",
            description: n.description || "",
            layer: typeof n.layer === "number" ? n.layer : undefined,
            column: typeof n.column === "number" ? n.column : undefined,
            order: typeof n.order === "number" ? n.order : undefined,
            group: n.group || "",
            category: n.category || "",
            handles: n.handles || ["top", "right", "bottom", "left"],
            priorityScore: (n as any).priorityScore,
        },
    }));

    const rfEdges: Edge[] = raw.edges.map((e, i) => ({
        id: `e${i}-${e.from}-${e.to}`,
        source: e.from,
        target: e.to,
        type: "smoothstep",
        label: e.label,
        style: { stroke: "#636798", strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#636798" },
        data: {
            lane: typeof e.lane === "number" ? e.lane : 0,
        },
    }));

    return getLayoutedElements(rfNodes, rfEdges, direction);
}

