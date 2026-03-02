import dagre from "dagre";
import type { Node, Edge } from "@xyflow/react";

const NODE_WIDTH = 240;
const NODE_HEIGHT = 72;


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
    g.setGraph({
        rankdir: direction,
        ranksep: 120,
        nodesep: 80,
        edgesep: 40,
        marginx: 40,
        marginy: 40,
    });

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
