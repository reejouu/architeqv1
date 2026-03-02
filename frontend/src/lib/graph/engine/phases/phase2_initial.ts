import { InternalNode, LayoutConfig, LayerStats } from "../types";
import { enforceMinGap, recenterLayer, clampToCanvas } from "../utils";

export function phase2_initial(
    nodes: InternalNode[],
    config: LayoutConfig,
    stats: LayerStats,
    log: string[]
): void {
    const { layerGap, nodeWidth, nodeHeight, nodeGap, canvasPadding } = config;
    const { layerMap, sortedLayers } = stats;

    // We keep track of the bottom-most Y coordinate used so far
    let currentY = canvasPadding;

    for (const L of sortedLayers) {
        const layerNodes = layerMap.get(L)!;
        if (layerNodes.length === 0) continue;

        // Sort by column hint (1..N) to get initial left-to-right order
        layerNodes.sort((a, b) => a.column - b.column);

        // Calculate total width of this layer's nodes + gaps
        const nCount = layerNodes.length;
        const widthNeeded = (nCount * nodeWidth) + ((nCount - 1) * nodeGap);

        // Center this layer horizontally within the global contentWidth
        const startX = (stats.contentWidth - widthNeeded) / 2;

        let currentX = startX;
        for (const n of layerNodes) {
            n.x = currentX;
            n.y = currentY;
            currentX += nodeWidth + nodeGap;
        }

        // Advance Y for the next layer (height + gap)
        currentY += nodeHeight + layerGap;
    }

    // Verify and log
    let hasOverlaps = false;
    for (const L of sortedLayers) {
        const layerNodes = layerMap.get(L)!;
        for (let i = 0; i < layerNodes.length - 1; i++) {
            if (layerNodes[i + 1].x - layerNodes[i].x < nodeWidth) {
                hasOverlaps = true;
                break;
            }
        }
    }

    if (hasOverlaps) {
        log.push("Phase 2 found overlaps, applying safety spacing...");
        const safeGap = nodeWidth + nodeGap;
        for (const L of sortedLayers) {
            const layerNodes = layerMap.get(L)!;
            if (layerNodes.length === 0) continue;

            enforceMinGap(layerNodes, nodeWidth, safeGap);
            stats.contentWidth = clampToCanvas(layerNodes, nodeWidth, safeGap, canvasPadding, stats.contentWidth);
            recenterLayer(layerNodes, nodeWidth, safeGap, stats.contentWidth);
        }
    }

    stats.contentHeight = currentY - layerGap + canvasPadding; // Update final height
    log.push("Phase 2 complete: Initial Y and centered X assigned.");
}
