import { InternalNode, InternalEdge, LayoutConfig, LayerStats } from "../types";
import { recenterLayer, clampToCanvas } from "../utils";

export function phase4b_nodeEdgeCollision(
    nodes: InternalNode[],
    edges: InternalEdge[],
    stats: LayerStats,
    config: LayoutConfig,
    log: string[],
): void {
    const { nodeWidth, nodeHeight, nodeGap, canvasPadding } = config;
    const { layerMap, sortedLayers } = stats;
    let { contentWidth } = stats;

    // A clearance margin to keep edges slightly away from node borders
    // We add 40px to account for handle fan-out and parallel edge offsets
    const CLEARANCE = 20;
    const EDGE_BUNDLE_RADIUS = 40;

    const nodeById = new Map<string, InternalNode>();
    for (const n of nodes) nodeById.set(n.id, n);

    for (const L of sortedLayers) {
        const layerNodes = layerMap.get(L)!;
        if (layerNodes.length === 0) continue;

        // 1. Calculate forbidden X intervals for this layer
        // A forbidden interval defines where a node's LEFT edge (n.x) CANNOT be
        const forbidden: { A: number, B: number }[] = [];

        for (const e of edges) {
            const src = nodeById.get(e.from);
            const tgt = nodeById.get(e.to);
            if (!src || !tgt) continue;

            // Only consider edges spanning across Layer L
            if (src.layer < L && tgt.layer > L) {
                const srcCenter = src.x + nodeWidth / 2;
                const tgtCenter = tgt.x + nodeWidth / 2;

                const startY = src.y + nodeHeight;
                const endY = tgt.y;
                const midY = (startY + endY) / 2;

                const layerTop = layerNodes[0].y;
                const layerBottom = layerTop + nodeHeight;

                let edgeLeft = 0;
                let edgeRight = 0;

                if (midY >= layerBottom) {
                    edgeLeft = srcCenter;
                    edgeRight = srcCenter;
                } else if (midY <= layerTop) {
                    edgeLeft = tgtCenter;
                    edgeRight = tgtCenter;
                } else {
                    edgeLeft = Math.min(srcCenter, tgtCenter);
                    edgeRight = Math.max(srcCenter, tgtCenter);
                }

                // Add padding for parallel edge boundaries
                edgeLeft -= EDGE_BUNDLE_RADIUS;
                edgeRight += EDGE_BUNDLE_RADIUS;

                // Forbidden interval for n.x
                forbidden.push({
                    A: edgeLeft - nodeWidth - CLEARANCE,
                    B: edgeRight + CLEARANCE,
                });
            }
        }

        if (forbidden.length === 0) continue; // No spanning edges to dodge

        // 2. Iterative spring model to resolve collisions and overlaps concurrently
        let layerChanged = true;
        let iter = 0;
        const maxIters = 20;

        while (layerChanged && iter < maxIters) {
            layerChanged = false;
            iter++;

            // Step A: Push nodes out of forbidden zones
            for (const n of layerNodes) {
                for (const { A, B } of forbidden) {
                    if (n.x > A && n.x < B) {
                        layerChanged = true;
                        // Push to whichever side is closer
                        if (n.x - A < B - n.x) {
                            n.x = A;
                        } else {
                            n.x = B;
                        }
                    }
                }
            }

            // Step B: Push overlapping nodes apart symmetrically
            layerNodes.sort((a, b) => a.x - b.x);
            for (let i = 0; i < layerNodes.length - 1; i++) {
                const required = nodeWidth + nodeGap;
                const diff = layerNodes[i + 1].x - layerNodes[i].x;
                if (diff < required) {
                    layerChanged = true;
                    // Move them apart symmetrically from their midpoint
                    const midpoint = (layerNodes[i].x + layerNodes[i + 1].x) / 2;
                    layerNodes[i].x = midpoint - required / 2;
                    layerNodes[i + 1].x = midpoint + required / 2;
                }
            }
        }

        if (iter > 1) {
            log.push(`L${L}: Node-edge collisions resolved in ${iter} iter(s).`);
            // Recenter and clamp layer since we've broken the original alignment
            recenterLayer(layerNodes, nodeWidth, nodeGap, contentWidth);
            contentWidth = clampToCanvas(layerNodes, nodeWidth, nodeGap, canvasPadding, contentWidth);
        }
    }

    stats.contentWidth = contentWidth;
}
