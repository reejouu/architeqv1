import { InputNode, InternalNode, LayoutConfig, LayerStats } from "../types";

export function phase1_layers(
    inputNodes: InputNode[],
    config: LayoutConfig,
    log: string[],
): { internalNodes: InternalNode[]; stats: LayerStats } {
    const { nodeWidth, nodeGap, canvasPadding } = config;

    const layerMap = new Map<number, InternalNode[]>();
    let maxNodes = 0;
    let anchorLayer = 0;

    const internalNodes: InternalNode[] = inputNodes.map(n => {
        const iNode: InternalNode = {
            id: n.id,
            layer: n.layer,
            column: n.column,
            x: 0,
            y: 0,
            raw: n,
        };
        const arr = layerMap.get(n.layer) || [];
        arr.push(iNode);
        layerMap.set(n.layer, arr);
        return iNode;
    });

    const sortedLayers = Array.from(layerMap.keys()).sort((a, b) => a - b);

    for (const L of sortedLayers) {
        const count = layerMap.get(L)!.length;
        if (count > maxNodes) {
            maxNodes = count;
            anchorLayer = L;
        }
    }

    const contentWidth = maxNodes * nodeWidth + (maxNodes - 1) * nodeGap + (canvasPadding * 2);
    // Rough estimate for height calculation, refined in Phase 2
    const contentHeight = sortedLayers.length * 100 + canvasPadding * 2;

    log.push(`Layer analysis: ${sortedLayers.length} layers, anchor L${anchorLayer} with ${maxNodes} nodes`);
    log.push(`Estimated content width: ${contentWidth}px`);

    return {
        internalNodes,
        stats: { layerMap, sortedLayers, anchorLayer, maxNodesInLayer: maxNodes, contentWidth, contentHeight }
    };
}
