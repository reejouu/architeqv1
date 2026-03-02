import { InternalNode, InternalEdge, LayoutOutput, LayerStats } from "../types";

export function phase8_assemble(
    nodes: InternalNode[],
    edges: InternalEdge[],
    stats: LayerStats,
    log: string[],
): LayoutOutput {
    const { contentWidth, contentHeight } = stats;

    log.push("Phase 8 complete: Final representation assembled.");

    return {
        nodes: nodes.map(n => ({
            id: n.id,
            position: { x: n.x, y: n.y },
            data: { ...n.raw, _layer: n.layer, _column: n.column },
            type: "archNode",
        })),
        edges: edges.map(e => ({
            id: `e-${e.from}-${e.to}-${Math.random().toString(36).slice(2, 7)}`,
            source: e.from,
            target: e.to,
            type: e.routingType,
            data: {
                waypoints: e.waypoints,
                exitPoint: e.exitPoint,
                entryPoint: e.entryPoint,
                parallelOffset: e.parallelOffset,
                isSynthetic: e.synthetic,
            },
            style: e.synthetic ?
                { stroke: "transparent", strokeWidth: 0 } :
                { stroke: "#636798", strokeWidth: 1.5 }
        })).filter(e => !e.data.isSynthetic), // We only needed synthetic edges for layout math
        canvasWidth: contentWidth,
        canvasHeight: contentHeight,
        stats: {
            nodeCount: nodes.length,
            edgeCount: edges.length,
            crossingCount: 0, // Recalculate if needed, but skipped for final assembly speed
            phaseLog: log,
        }
    };
}
