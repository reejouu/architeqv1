import { InternalNode, InternalEdge } from "./types";

/**
 * Counts edge crossings between nodes in the same adjacent layer pairs.
 * Signature accepts both (edges, nodeById, nodeWidth) and (nodes, edges)
 * to stay compatible with existing phase3 callers.
 */
export function countCrossings(
    nodesOrEdges: InternalNode[] | InternalEdge[],
    edgesOrNodeById: InternalEdge[] | Map<string, InternalNode>,
    nodeWidth?: number,
): number {
    let edges: InternalEdge[];
    let nodeById: Map<string, InternalNode>;
    let nw: number;

    // Detect which overload is being used
    if (Array.isArray(edgesOrNodeById)) {
        // New signature: countCrossings(nodes, edges)
        const nodes = nodesOrEdges as InternalNode[];
        edges = edgesOrNodeById as InternalEdge[];
        nodeById = new Map(nodes.map(n => [n.id, n]));
        nw = nodeWidth ?? 160;
    } else {
        // Legacy signature: countCrossings(edges, nodeById, nodeWidth)
        edges = nodesOrEdges as InternalEdge[];
        nodeById = edgesOrNodeById as Map<string, InternalNode>;
        nw = nodeWidth ?? 160;
    }

    let crossings = 0;

    for (let i = 0; i < edges.length; i++) {
        for (let j = i + 1; j < edges.length; j++) {
            const e1 = edges[i];
            const e2 = edges[j];

            const e1Src = nodeById.get(e1.from);
            const e1Tgt = nodeById.get(e1.to);
            const e2Src = nodeById.get(e2.from);
            const e2Tgt = nodeById.get(e2.to);

            if (!e1Src || !e1Tgt || !e2Src || !e2Tgt) continue;

            // Only check edges between the same layer pair
            if (e1Src.layer !== e2Src.layer || e1Tgt.layer !== e2Tgt.layer) continue;

            const e1SrcX = e1Src.x + nw / 2;
            const e1TgtX = e1Tgt.x + nw / 2;
            const e2SrcX = e2Src.x + nw / 2;
            const e2TgtX = e2Tgt.x + nw / 2;

            // Crossing if source order and target order are inverted
            if ((e1SrcX - e2SrcX) * (e1TgtX - e2TgtX) < 0) {
                crossings++;
            }
        }
    }

    return crossings;
}

/**
 * Ensures a minimum horizontal gap between all adjacent nodes in a layer.
 * Nodes must be pre-sorted by x. Modifies positions in-place.
 */
export function enforceMinGap(
    nodes: InternalNode[],
    nodeWidth: number,
    nodeGap: number,
): void {
    if (nodes.length < 2) return;
    nodes.sort((a, b) => a.x - b.x);
    for (let i = 0; i < nodes.length - 1; i++) {
        const cur  = nodes[i];
        const next = nodes[i + 1];
        const required = nodeWidth + nodeGap;
        if (next.x - cur.x < required) {
            next.x = cur.x + required;
        }
    }
}

/**
 * Shifts an entire layer's nodes if they overflow the left canvas border.
 * Expands global canvas width if they overflow the right.
 * Returns the new global contentWidth.
 */
export function clampToCanvas(
    nodes: InternalNode[],
    nodeWidth: number,
    nodeGap: number,
    canvasPadding: number,
    currentContentWidth: number,
): number {
    if (nodes.length === 0) return currentContentWidth;

    nodes.sort((a, b) => a.x - b.x);

    const minX = nodes[0].x;
    if (minX < canvasPadding) {
        const shift = canvasPadding - minX;
        for (const n of nodes) n.x += shift;
    }

    enforceMinGap(nodes, nodeWidth, nodeGap);

    const maxX = nodes[nodes.length - 1].x + nodeWidth;
    if (maxX > currentContentWidth - canvasPadding) {
        return maxX + canvasPadding;
    }

    return currentContentWidth;
}

/**
 * Re-centers a layer's nodes within the global canvas width,
 * preserving their internal relative spacing.
 */
export function recenterLayer(
    nodes: InternalNode[],
    nodeWidth: number,
    nodeGap: number,
    contentWidth: number,
): void {
    if (nodes.length === 0) return;

    nodes.sort((a, b) => a.x - b.x);
    enforceMinGap(nodes, nodeWidth, nodeGap);

    const firstX     = nodes[0].x;
    const lastX      = nodes[nodes.length - 1].x;
    const actualWidth = lastX + nodeWidth - firstX;
    const targetStartX = (contentWidth - actualWidth) / 2;
    const shift = targetStartX - firstX;

    if (Math.abs(shift) > 1) {
        for (const n of nodes) n.x += shift;
    }
}