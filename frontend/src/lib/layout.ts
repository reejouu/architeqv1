import dagre from "dagre";
import type { Node, Edge } from "@xyflow/react";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 72;

// ─── 1. Column + Layer layout ─────────────────────────────────────────────────
// Used when nodes have BOTH explicit `layer` (y-rank) AND `column` (x-position).
// x = column * COLUMN_STEP
// y = layer  * LAYER_STEP

const COLUMN_WIDTH = 340;  // px between columns
const LAYER_HEIGHT = 180;  // px between layers (rows)
const NODE_VERTICAL_GAP = 90; // px between nodes in the same layer+column
const HORIZONTAL_SPREAD = 40; // px fan-out for siblings sharing layer+column

/**
 * Positions nodes using explicit `layer`, `column`, and optionally `order` fields.
 * - x = column × COLUMN_WIDTH + order × HORIZONTAL_SPREAD
 * - y = layer × LAYER_HEIGHT + order × NODE_VERTICAL_GAP
 *
 * Multiple nodes can share the same layer+column; `order` stacks and fans them.
 */
export function getColumnLayeredElements(
    nodes: Node[],
    edges: Edge[]
): { nodes: Node[]; edges: Edge[] } {
    const layoutedNodes = nodes.map((node) => {
        const d = node.data;
        const col = typeof d.column === "number" ? d.column : 0;
        const lay = typeof d.layer === "number" ? d.layer : 0;
        const ord = typeof d.order === "number" ? d.order : 0;

        return {
            ...node,
            position: {
                x: col * COLUMN_WIDTH + ord * HORIZONTAL_SPREAD,
                y: lay * LAYER_HEIGHT + ord * NODE_VERTICAL_GAP,
            },
        };
    });
    return { nodes: layoutedNodes, edges };
}

// ─── 2. Layer-only layout ─────────────────────────────────────────────────────
// Used when nodes have `layer` but no `column`.
// Nodes in the same layer are spread evenly and centered.

const SIBLING_GAP = 260;  // px between siblings in the same layer
const LAYER_GAP = 180;  // px between rows

/**
 * Positions nodes using only their `layer` field.
 * Siblings in the same layer are spread evenly centered on the canvas.
 */
export function getLayeredElements(
    nodes: Node[],
    edges: Edge[]
): { nodes: Node[]; edges: Edge[] } {
    const byLayer: Record<number, Node[]> = {};
    for (const node of nodes) {
        const layer = typeof node.data.layer === "number" ? node.data.layer : 0;
        (byLayer[layer] = byLayer[layer] || []).push(node);
    }

    const maxCount = Math.max(...Object.values(byLayer).map(arr => arr.length));
    const totalWidth = maxCount * SIBLING_GAP;

    const layoutedNodes = nodes.map((node) => {
        const layer = typeof node.data.layer === "number" ? node.data.layer : 0;
        const siblings = byLayer[layer];
        const idx = siblings.indexOf(node);
        const rowWidth = siblings.length * SIBLING_GAP;
        const offsetX = (totalWidth - rowWidth) / 2;
        return {
            ...node,
            position: { x: offsetX + idx * SIBLING_GAP, y: layer * LAYER_GAP },
        };
    });

    return { nodes: layoutedNodes, edges };
}

// ─── 3. Dagre auto-layout ─────────────────────────────────────────────────────
// Fallback when nodes have NO explicit layer/column metadata.
// Dagre infers hierarchy from the edge graph.

/**
 * Positions nodes using Dagre's automatic graph ranking.
 * Fallback when no explicit spatial metadata is present.
 */
export function getLayoutedElements(
    nodes: Node[],
    edges: Edge[],
    direction: "TB" | "LR" = "TB"
): { nodes: Node[]; edges: Edge[] } {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: direction, nodesep: 60, ranksep: 80 });

    nodes.forEach((n) => g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT }));
    edges.forEach((e) => g.setEdge(e.source, e.target));

    dagre.layout(g);

    return {
        nodes: nodes.map((node) => {
            const { x, y } = g.node(node.id);
            return { ...node, position: { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 } };
        }),
        edges,
    };
}
