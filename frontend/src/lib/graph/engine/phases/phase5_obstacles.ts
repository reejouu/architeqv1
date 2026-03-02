import { InternalNode, InternalEdge, LayoutConfig, LayerStats } from "../types";

export function phase5_obstacles(
    nodes: InternalNode[],
    edges: InternalEdge[],
    config: LayoutConfig,
    stats: LayerStats,
    log: string[],
): void {
    const { nodeWidth, nodeHeight, nodeGap, canvasPadding } = config;
    const { contentWidth } = stats;

    const nodeById = new Map<string, InternalNode>();
    for (const n of nodes) nodeById.set(n.id, n);

    for (const edge of edges) {
        const src = nodeById.get(edge.from);
        const tgt = nodeById.get(edge.to);
        if (!src || !tgt) continue;

        // STEP 5A — Skip direct neighbor edges
        const layerDiff = tgt.layer - src.layer;
        if (layerDiff === 1) continue;

        // STEP 5B — Find blocking nodes
        const edgeMidX = (src.x + tgt.x) / 2 + nodeWidth / 2;
        const edgeStartY = src.y + nodeHeight;
        const edgeEndY = tgt.y;

        const blockingNodes: InternalNode[] = [];
        for (const n of nodes) {
            if (n.id === src.id || n.id === tgt.id) continue;
            if (n.y > edgeStartY && n.y + nodeHeight < edgeEndY) {
                if (n.x < edgeMidX + nodeWidth && n.x + nodeWidth > edgeMidX) {
                    blockingNodes.push(n);
                }
            }
        }

        if (blockingNodes.length === 0) continue;

        // STEP 5C — Assign waypoints
        blockingNodes.sort((a, b) => a.y - b.y);
        for (const blocker of blockingNodes) {
            const leftSpace = blocker.x - canvasPadding;
            const rightSpace = contentWidth - (blocker.x + nodeWidth) - canvasPadding;

            let waypointX: number;
            if (leftSpace >= rightSpace) {
                waypointX = blocker.x - nodeGap - nodeWidth / 2;
            } else {
                waypointX = blocker.x + nodeWidth + nodeGap + nodeWidth / 2;
            }
            const waypointY = blocker.y + nodeHeight / 2;
            edge.waypoints.push({ x: waypointX, y: waypointY });
        }
        log.push(`Edge ${edge.from}→${edge.to}: ${edge.waypoints.length} waypoint(s)`);
    }

    // VALIDATION GATE 5 — ensure waypoints don't overlap nodes
    for (const edge of edges) {
        for (const wp of edge.waypoints) {
            for (const n of nodes) {
                const halfGap = nodeGap / 2;
                const left = n.x - halfGap;
                const right = n.x + nodeWidth + halfGap;
                const top = n.y - halfGap;
                const bottom = n.y + nodeHeight + halfGap;
                if (wp.x >= left && wp.x <= right && wp.y >= top && wp.y <= bottom) {
                    // Shift waypoint until clear
                    wp.x = right + nodeGap;
                }
            }
        }
    }
}
