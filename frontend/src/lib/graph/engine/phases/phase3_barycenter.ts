import { InternalNode, InternalEdge, LayoutConfig, LayerStats } from "../types";
import { enforceMinGap, recenterLayer, clampToCanvas, countCrossings } from "../utils";

export function phase3_barycenter(
    nodes: InternalNode[],
    edges: InternalEdge[],
    config: LayoutConfig,
    stats: LayerStats,
    log: string[],
): void {
    const { nodeWidth, nodeGap, canvasPadding, maxBarycenterPasses } = config;
    const { layerMap, sortedLayers } = stats;

    const nodeById = new Map<string, InternalNode>();
    for (const n of nodes) nodeById.set(n.id, n);

    // ── Build adjacency for barycenter calculation ────────────────────────────
    const upstreamNeighbors = new Map<string, string[]>();   // node → nodes in layer above
    const downstreamNeighbors = new Map<string, string[]>(); // node → nodes in layer below

    for (const n of nodes) {
        upstreamNeighbors.set(n.id, []);
        downstreamNeighbors.set(n.id, []);
    }

    for (const e of edges) {
        const src = nodeById.get(e.from);
        const tgt = nodeById.get(e.to);
        if (!src || !tgt) continue;

        if (tgt.layer === src.layer + 1) {
            downstreamNeighbors.get(src.id)!.push(tgt.id);
            upstreamNeighbors.get(tgt.id)!.push(src.id);
        }
    }

    // ── Snapshot helpers ──────────────────────────────────────────────────────
    const captureX = (ns: InternalNode[]): Map<string, number> =>
        new Map(ns.map(n => [n.id, n.x]));

    const restoreX = (ns: InternalNode[], snap: Map<string, number>) => {
        ns.forEach(n => { const v = snap.get(n.id); if (v !== undefined) n.x = v; });
    };

    let bestCrossings = countCrossings(nodes, edges);
    let bestSnap = captureX(nodes);

    log.push(`Phase 3 start: ${bestCrossings} crossings`);

    for (let pass = 0; pass < maxBarycenterPasses; pass++) {
        // Alternate top-down / bottom-up
        const layerOrder = pass % 2 === 0
            ? [...sortedLayers]
            : [...sortedLayers].reverse();

        for (const L of layerOrder) {
            const layerNodes = layerMap.get(L)!;
            if (layerNodes.length <= 1) continue;

            // ── Step A: Try every adjacent swap ──────────────────────────────
            const sorted = [...layerNodes].sort((a, b) => a.x - b.x);
            for (let i = 0; i < sorted.length - 1; i++) {
                const a = sorted[i];
                const b = sorted[i + 1];

                const beforeCrossings = countCrossings(nodes, edges);
                swapX(a, b);
                const afterCrossings = countCrossings(nodes, edges);

                if (afterCrossings >= beforeCrossings) {
                    swapX(a, b); // revert
                }
            }

            // ── Step B: Barycenter pull ───────────────────────────────────────
            const isTopDown = pass % 2 === 0;
            const neighborMap = isTopDown ? upstreamNeighbors : downstreamNeighbors;

            const targets = new Map<string, number>();
            for (const n of layerNodes) {
                const neighbors = neighborMap.get(n.id) ?? [];
                if (neighbors.length === 0) {
                    targets.set(n.id, n.x);
                    continue;
                }
                const avgX = neighbors.reduce((sum, nid) => {
                    const nb = nodeById.get(nid);
                    return sum + (nb ? nb.x + nodeWidth / 2 : 0);
                }, 0) / neighbors.length;

                targets.set(n.id, avgX - nodeWidth / 2);
            }

            // Apply barycenter targets
            for (const n of layerNodes) {
                const target = targets.get(n.id);
                if (target !== undefined) {
                    // Lerp toward target (don't jump all the way — smoother convergence)
                    n.x = n.x * 0.4 + target * 0.6;
                }
            }

            // Re-enforce spacing after barycenter pull
            enforceMinGap(layerNodes, nodeWidth, nodeGap);
            stats.contentWidth = clampToCanvas(layerNodes, nodeWidth, nodeGap, canvasPadding, stats.contentWidth);
            recenterLayer(layerNodes, nodeWidth, nodeGap, stats.contentWidth);
        }

        // ── Score this pass ───────────────────────────────────────────────────
        const newCrossings = countCrossings(nodes, edges);
        if (newCrossings < bestCrossings) {
            bestCrossings = newCrossings;
            bestSnap = captureX(nodes);
            log.push(`Phase 3 pass ${pass + 1}: improved to ${newCrossings} crossings`);
        } else {
            log.push(`Phase 3 pass ${pass + 1}: no improvement (${newCrossings}), reverting to best`);
            restoreX(nodes, bestSnap);
            break; // converged
        }

        if (bestCrossings === 0) {
            log.push("Phase 3: zero crossings achieved early");
            break;
        }
    }

    // Always end with best known positions
    restoreX(nodes, bestSnap);
    log.push(`Phase 3 complete: ${bestCrossings} crossings`);
}

function swapX(a: InternalNode, b: InternalNode): void {
    const tmp = a.x;
    a.x = b.x;
    b.x = tmp;
}