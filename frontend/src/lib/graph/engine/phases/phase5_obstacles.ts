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

    // Phase 4 already moved blocking nodes for direct-neighbor edges.
    // Phase 5 handles remaining long-range edges (layer skip > 1) that
    // phase 4 couldn't fix by moving nodes alone.

    let waypointCount = 0;

    for (const edge of edges) {
        // Reset waypoints — phase 4 may have moved nodes, recompute from scratch
        edge.waypoints = [];

        const src = nodeById.get(edge.from);
        const tgt = nodeById.get(edge.to);
        if (!src || !tgt) continue;

        // Build rough path segments for this edge
        const path = computeRoughPath(src, tgt, nodeWidth, nodeHeight);

        // Find ALL blocking nodes along this path
        const blockers: InternalNode[] = [];
        for (const node of nodes) {
            if (node.id === src.id || node.id === tgt.id) continue;

            const box = {
                left:   node.x - 8,
                right:  node.x + nodeWidth + 8,
                top:    node.y - 8,
                bottom: node.y + nodeHeight + 8,
            };

            for (const seg of path) {
                if (segmentHitsBox(seg, box)) {
                    blockers.push(node);
                    break;
                }
            }
        }

        if (blockers.length === 0) continue;

        // Sort blockers top to bottom (by Y position)
        blockers.sort((a, b) => a.y - b.y);

        for (const blocker of blockers) {
            const leftSpace  = blocker.x - canvasPadding;
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

        if (edge.waypoints.length > 0) {
            waypointCount += edge.waypoints.length;
            log.push(`Edge ${edge.from}→${edge.to}: ${edge.waypoints.length} waypoint(s) assigned`);
        }
    }

    // ── Validation: waypoints must not land inside any node ──────────────────
    let waypointFixes = 0;
    for (const edge of edges) {
        for (const wp of edge.waypoints) {
            let attempts = 0;
            while (attempts < 8) {
                const blocker = nodes.find(n => {
                    const halfGap = nodeGap / 2;
                    return (
                        wp.x >= n.x - halfGap &&
                        wp.x <= n.x + nodeWidth + halfGap &&
                        wp.y >= n.y - halfGap &&
                        wp.y <= n.y + nodeHeight + halfGap
                    );
                });

                if (!blocker) break;

                // Shift waypoint right until clear
                wp.x = blocker.x + nodeWidth + nodeGap;
                waypointFixes++;
                attempts++;
            }
        }
    }

    if (waypointFixes > 0) {
        log.push(`Phase 5: Fixed ${waypointFixes} waypoint(s) that landed inside nodes`);
    }

    log.push(`Phase 5 complete: ${waypointCount} total waypoint(s) assigned`);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

interface Segment { x1: number; y1: number; x2: number; y2: number }

function computeRoughPath(
    src: InternalNode,
    tgt: InternalNode,
    nodeWidth: number,
    nodeHeight: number,
): Segment[] {
    const srcCX = src.x + nodeWidth / 2;
    const tgtCX = tgt.x + nodeWidth / 2;
    const srcBY = src.y + nodeHeight;
    const tgtTY = tgt.y;
    const midY  = (srcBY + tgtTY) / 2;

    return [
        { x1: srcCX, y1: srcBY, x2: srcCX, y2: midY },
        { x1: srcCX, y1: midY,  x2: tgtCX, y2: midY },
        { x1: tgtCX, y1: midY,  x2: tgtCX, y2: tgtTY },
    ];
}

function segmentHitsBox(
    seg: Segment,
    box: { left: number; right: number; top: number; bottom: number },
): boolean {
    if (Math.abs(seg.y1 - seg.y2) < 1) {
        const minX = Math.min(seg.x1, seg.x2);
        const maxX = Math.max(seg.x1, seg.x2);
        return seg.y1 >= box.top && seg.y1 <= box.bottom && maxX >= box.left && minX <= box.right;
    }
    if (Math.abs(seg.x1 - seg.x2) < 1) {
        const minY = Math.min(seg.y1, seg.y2);
        const maxY = Math.max(seg.y1, seg.y2);
        return seg.x1 >= box.left && seg.x1 <= box.right && maxY >= box.top && minY <= box.bottom;
    }
    return false;
}