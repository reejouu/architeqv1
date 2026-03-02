import { InternalNode, LayoutConfig, LayerStats } from "../types";
import { enforceMinGap, recenterLayer, clampToCanvas } from "../utils";

export function phase4_nudge(
    nodes: InternalNode[],
    stats: LayerStats,
    config: LayoutConfig,
    log: string[],
): void {
    const { nodeWidth, nodeGap, canvasPadding, maxNudgePasses } = config;
    const { layerMap, sortedLayers } = stats;

    let { contentWidth } = stats;

    let hasOverlaps = true;
    let passes = 0;

    log.push("Starting Phase 4: Nudge overlap resolution...");

    while (hasOverlaps && passes < maxNudgePasses) {
        hasOverlaps = false;
        passes++;

        for (const L of sortedLayers) {
            const layerNodes = layerMap.get(L)!;
            if (layerNodes.length < 2) continue;

            layerNodes.sort((a, b) => a.x - b.x);

            let layerChanged = false;

            for (let i = 0; i < layerNodes.length - 1; i++) {
                const current = layerNodes[i];
                const next = layerNodes[i + 1];

                const requiredGap = nodeWidth + nodeGap;

                if (next.x - current.x < requiredGap) {
                    hasOverlaps = true;
                    layerChanged = true;

                    // Compute overlap amount
                    const overlap = requiredGap - (next.x - current.x);

                    // Distribute the needed shift between the two nodes
                    const shiftLeft = overlap / 2;
                    const shiftRight = overlap / 2;

                    current.x -= shiftLeft;
                    next.x += shiftRight;
                }
            }

            if (layerChanged) {
                // We must strictly re-enforce after pushing to fix precision float overlap
                enforceMinGap(layerNodes, nodeWidth, nodeGap);

                // Check canvas bounds to ensure we didn't push off-screen
                contentWidth = clampToCanvas(layerNodes, nodeWidth, nodeGap, canvasPadding, contentWidth);

                // Optional: Recenter immediately so barycenter's general centering isn't lost
                recenterLayer(layerNodes, nodeWidth, nodeGap, contentWidth);
            }
        }
    }

    if (passes >= maxNudgePasses) {
        log.push(`⚠️ WARNING: Phase 4 max passes (${maxNudgePasses}) reached. Nodes may still overlap.`);
    } else {
        log.push(`Phase 4 complete. Resolved all initial node overlaps in ${passes} passes.`);
    }

    // UPDATE SAFETY LOOP: Ensure absolute minimum gap one last time
    let finalValidationPasses = 0;
    while (finalValidationPasses < 5) {
        let validationChanged = false;
        for (const L of sortedLayers) {
            const layerNodes = layerMap.get(L)!;
            if (layerNodes.length < 2) continue;

            for (let i = 0; i < layerNodes.length - 1; i++) {
                if (layerNodes[i + 1].x - layerNodes[i].x < nodeWidth) { // Severe overlap
                    validationChanged = true;
                    // Force the fix by increasing global nodeGap locally for this iteration
                    enforceMinGap(layerNodes, nodeWidth, nodeGap * 1.5);
                    contentWidth = clampToCanvas(layerNodes, nodeWidth, nodeGap * 1.5, canvasPadding, contentWidth);
                    recenterLayer(layerNodes, nodeWidth, nodeGap, contentWidth);
                }
            }
        }
        if (!validationChanged) break;
        finalValidationPasses++;
    }

    if (finalValidationPasses > 0) {
        log.push(`Phase 4 required ${finalValidationPasses} validation loop(s) to fix stubborn overlaps.`);
    }

    stats.contentWidth = contentWidth;
}
