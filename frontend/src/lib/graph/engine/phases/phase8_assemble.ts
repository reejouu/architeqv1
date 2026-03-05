import { InternalNode, InternalEdge, LayoutOutput, LayerStats } from "../types";

export function phase8_assemble(
    nodes: InternalNode[],
    edges: InternalEdge[],
    stats: LayerStats,
    log: string[],
): LayoutOutput {
    const { contentWidth, contentHeight } = stats;

    // ── Final collision sweep before output ──────────────────────────────────
    // One last check — log any remaining edge-node collisions so they're visible
    // in diagnostics even if we couldn't fix them
    const nodeById = new Map<string, InternalNode>();
    for (const n of nodes) nodeById.set(n.id, n);

    let remainingCollisions = 0;
    for (const edge of edges) {
        if (edge.synthetic) continue;
        const src = nodeById.get(edge.from);
        const tgt = nodeById.get(edge.to);
        if (!src || !tgt) continue;

        // Compute final path including waypoints
        const path = buildFinalPath(src, tgt, edge.waypoints ?? [], 160, 44);

        for (const node of nodes) {
            if (node.id === edge.from || node.id === edge.to) continue;
            const box = { left: node.x - 8, right: node.x + 160 + 8, top: node.y - 8, bottom: node.y + 44 + 8 };
            for (const seg of path) {
                if (segHitsBox(seg, box)) {
                    remainingCollisions++;
                    break;
                }
            }
        }
    }

    if (remainingCollisions > 0) {
        log.push(`⚠️ Phase 8: ${remainingCollisions} edge-node collision(s) remain after all phases`);
    } else {
        log.push("Phase 8: Zero edge-node collisions — graph is clean ✅");
    }

    // ── Recalculate actual canvas bounds from final node positions ────────────
    const allX = nodes.map(n => n.x + 160); // node right edge
    const allY = nodes.map(n => n.y + 44);  // node bottom edge
    const actualWidth = Math.max(...allX) + 80;
    const actualHeight = Math.max(...allY) + 80;

    log.push("Phase 8 complete: Final representation assembled.");

    return {
        nodes: nodes.map(n => ({
            id: n.id,
            position: { x: n.x, y: n.y },
            data: { ...n.raw, _layer: n.layer, _column: n.column },
            type: "archNode",
        })),
        edges: edges
            .filter(e => !e.synthetic)
            .map(e => ({
                id: `e-${e.from}-${e.to}-${Math.random().toString(36).slice(2, 7)}`,
                source: e.from,
                target: e.to,
                type: e.routingType ?? "smoothstep",
                data: {
                    waypoints: e.waypoints ?? [],
                    exitPoint: e.exitPoint,
                    entryPoint: e.entryPoint,
                    exitOffset: e.exitOffset,
                    entryOffset: e.entryOffset,
                    exitPort: e.exitPort,
                    entryPort: e.entryPort,
                    parallelOffset: e.parallelOffset ?? 0,
                },
                style: { stroke: "#636798", strokeWidth: 1.5 },
            })),
        canvasWidth: Math.max(contentWidth, actualWidth),
        canvasHeight: Math.max(contentHeight, actualHeight),
        stats: {
            nodeCount: nodes.length,
            edgeCount: edges.filter(e => !e.synthetic).length,
            crossingCount: remainingCollisions,
            phaseLog: log,
        },
    };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

interface Seg { x1: number; y1: number; x2: number; y2: number }
interface Pt { x: number; y: number }

function buildFinalPath(
    src: InternalNode,
    tgt: InternalNode,
    waypoints: Pt[],
    nodeWidth: number,
    nodeHeight: number,
): Seg[] {
    const allPoints: Pt[] = [
        { x: src.x + nodeWidth / 2, y: src.y + nodeHeight },
        ...waypoints,
        { x: tgt.x + nodeWidth / 2, y: tgt.y },
    ];

    const segs: Seg[] = [];
    for (let i = 0; i < allPoints.length - 1; i++) {
        segs.push({ x1: allPoints[i].x, y1: allPoints[i].y, x2: allPoints[i + 1].x, y2: allPoints[i + 1].y });
    }
    return segs;
}

function segHitsBox(seg: Seg, box: { left: number; right: number; top: number; bottom: number }): boolean {
    if (Math.abs(seg.y1 - seg.y2) < 1) {
        const minX = Math.min(seg.x1, seg.x2), maxX = Math.max(seg.x1, seg.x2);
        return seg.y1 >= box.top && seg.y1 <= box.bottom && maxX >= box.left && minX <= box.right;
    }
    if (Math.abs(seg.x1 - seg.x2) < 1) {
        const minY = Math.min(seg.y1, seg.y2), maxY = Math.max(seg.y1, seg.y2);
        return seg.x1 >= box.left && seg.x1 <= box.right && maxY >= box.top && minY <= box.bottom;
    }
    return false;
}