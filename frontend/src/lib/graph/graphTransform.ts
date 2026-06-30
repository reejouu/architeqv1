import type { Node, Edge } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";
import { type InputNode, type InputEdge } from "./engine";
import { computeElkLayout } from "./elkLayout";

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
    core: { color: "#7b6fa8", rgb: "123,111,168", bg: "rgba(123,111,168,0.08)", borderColor: "rgba(123,111,168,0.3)" },
    integration: { color: "#5e8f9e", rgb: "94,143,158", bg: "rgba(94,143,158,0.08)", borderColor: "rgba(94,143,158,0.3)" },
    service: { color: "#6a9f7c", rgb: "106,159,124", bg: "rgba(106,159,124,0.08)", borderColor: "rgba(106,159,124,0.3)" },
    database: { color: "#5d7ea8", rgb: "93,126,168", bg: "rgba(93,126,168,0.08)", borderColor: "rgba(93,126,168,0.3)" },
    frontend: { color: "#b89550", rgb: "184,149,80", bg: "rgba(184,149,80,0.08)", borderColor: "rgba(184,149,80,0.3)" },
    queue: { color: "#a87090", rgb: "168,112,144", bg: "rgba(168,112,144,0.08)", borderColor: "rgba(168,112,144,0.3)" },
    cache: { color: "#c07858", rgb: "192,120,88", bg: "rgba(192,120,88,0.08)", borderColor: "rgba(192,120,88,0.3)" },
    agent: { color: "#8f80b4", rgb: "143,128,180", bg: "rgba(143,128,180,0.08)", borderColor: "rgba(143,128,180,0.3)" },
    engine: { color: "#5e88a6", rgb: "94,136,166", bg: "rgba(94,136,166,0.08)", borderColor: "rgba(94,136,166,0.3)" },
    ai: { color: "#a87aab", rgb: "168,122,171", bg: "rgba(168,122,171,0.08)", borderColor: "rgba(168,122,171,0.3)" },
    ui: { color: "#6a9e8e", rgb: "106,158,142", bg: "rgba(106,158,142,0.08)", borderColor: "rgba(106,158,142,0.3)" },
    state: { color: "#7089b5", rgb: "112,137,181", bg: "rgba(112,137,181,0.08)", borderColor: "rgba(112,137,181,0.3)" },
    infra: { color: "#b06878", rgb: "176,104,120", bg: "rgba(176,104,120,0.08)", borderColor: "rgba(176,104,120,0.3)" },
    input: { color: "#b08840", rgb: "176,136,64", bg: "rgba(176,136,64,0.08)", borderColor: "rgba(176,136,64,0.3)" },
    entry: { color: "#9b6fb5", rgb: "155,111,181", bg: "rgba(155,111,181,0.08)", borderColor: "rgba(155,111,181,0.3)" },
    default: { color: "#7a7a9e", rgb: "122,122,158", bg: "rgba(122,122,158,0.08)", borderColor: "rgba(122,122,158,0.3)" },
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
export async function transformGraph(
    raw: RawGraph,
    direction: "TB" | "LR" = "TB"
): Promise<{ nodes: Node[]; edges: Edge[] }> {

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
        const status = n.status || "";

        return {
            ...n,
            owner,
            group,
            status,
            priorityScore
        };
    });

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

    const layout = await computeElkLayout(inputNodes, inputEdges);

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
        const exitPort = (le.data as any).exitPort || "bottom";
        const entryPort = (le.data as any).entryPort || "top";
        return {
            id: le.id,
            source: le.source,
            target: le.target,
            sourceHandle: exitPort,
            targetHandle: entryPort,
            type: "archEdge",
            style: le.style,
            markerEnd: { type: MarkerType.ArrowClosed, color: "#636798" },
            data: {
                edgeStyle: "dashed",
                exitPoint: le.data.exitPoint,
                entryPoint: le.data.entryPoint,
                waypoints: le.data.waypoints,
                parallelOffset: le.data.parallelOffset,
                exitOffset: le.data.exitOffset,
                entryOffset: le.data.entryOffset,
                exitPort,
                entryPort,
                routingType: le.type,
                laneY: (le.data as any).laneY,
                points: (le.data as any).points,
            },
        };
    });

    return { nodes: rfNodes, edges: rfEdges };
}

