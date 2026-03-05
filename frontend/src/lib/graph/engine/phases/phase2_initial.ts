import { InternalNode, LayoutConfig, LayerStats } from "../types";
import { enforceMinGap, recenterLayer, clampToCanvas } from "../utils";

export function phase2_initial(
    nodes: InternalNode[],
    config: LayoutConfig,
    stats: LayerStats,
    log: string[],
): void {
    const { layerGap, nodeWidth, nodeHeight, nodeGap, canvasPadding } = config;
    const { layerMap, sortedLayers } = stats;

    let currentY = canvasPadding;

    for (const L of sortedLayers) {
        const layerNodes = layerMap.get(L)!;
        if (layerNodes.length === 0) continue;

        // ── Pressure-aware ordering ───────────────────────────────────────────
        // Sort by routing pressure ascending — low pressure nodes go to center,
        // high pressure nodes go to edges where fewer cross-edges will hit them
        const sorted = [...layerNodes].sort((a, b) => {
            // Primary: column hint (preserve AI ordering intent)
            // Secondary: routing pressure (high pressure → edges of layer)
            return a.column - b.column;
        });

        // Interleave: place lowest-pressure nodes in center, highest at edges
        // This minimizes how many long-range edges pass through node bodies
        const pressureSorted = [...sorted].sort((a, b) =>
            (a.routingPressure ?? 0) - (b.routingPressure ?? 0)
        );
        const ordered = interleaveFromCenter(pressureSorted);

        const nCount = ordered.length;
        const widthNeeded = nCount * nodeWidth + (nCount - 1) * nodeGap;
        const startX = (stats.contentWidth - widthNeeded) / 2;

        let currentX = startX;
        for (const n of ordered) {
            n.x = currentX;
            n.y = currentY;
            currentX += nodeWidth + nodeGap;
        }

        // Sync back to layerMap order (layerMap stores original refs)
        currentY += nodeHeight + layerGap;
    }

    // Overlap safety check
    let hasOverlaps = false;
    for (const L of sortedLayers) {
        const layerNodes = layerMap.get(L)!.slice().sort((a, b) => a.x - b.x);
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

    stats.contentHeight = currentY - layerGap + canvasPadding;
    log.push("Phase 2 complete: Pressure-aware initial positions assigned.");
}

// Places items from center outward: index order [center, center±1, center±2, ...]
// Result: lowest pressure in center, highest pressure at edges
function interleaveFromCenter<T>(items: T[]): T[] {
    if (!items || items.length === 0) return [];

    const result: T[] = new Array(items.length);
    const mid = Math.floor((items.length - 1) / 2);
    let left = mid;
    let right = mid + 1;

    for (let i = 0; i < items.length; i++) {
        if (i % 2 === 0) {
            result[left] = items[i];
            left--;
        } else {
            result[right] = items[i];
            right++;
        }
    }
    return result;
}