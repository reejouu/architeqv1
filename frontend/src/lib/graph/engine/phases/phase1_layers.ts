import { InputNode, InputEdge, InternalNode, LayoutConfig, LayerStats } from "../types";

export function phase1_layers(
    inputNodes: InputNode[],
    config: LayoutConfig,
    log: string[],
    inputEdges?: InputEdge[], // optional — used for routing pressure analysis
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
            routingPressure: 0,
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

    // ── Routing Pressure Analysis ─────────────────────────────────────────────
    // For each node N, count how many edges travel THROUGH its layer band
    // (i.e., edge source.layer < N.layer < edge target.layer)
    // High pressure nodes should be placed at layer edges, not center
    if (inputEdges && inputEdges.length > 0) {
        const nodeLayerMap = new Map<string, number>();
        for (const n of internalNodes) nodeLayerMap.set(n.id, n.layer);

        for (const node of internalNodes) {
            let pressure = 0;
            for (const edge of inputEdges) {
                const srcLayer = nodeLayerMap.get(edge.from);
                const tgtLayer = nodeLayerMap.get(edge.to);
                if (srcLayer === undefined || tgtLayer === undefined) continue;

                // Edge travels through this node's layer band
                if (srcLayer < node.layer && tgtLayer > node.layer) {
                    pressure++;
                }
            }
            node.routingPressure = pressure;
        }

        const pressured = internalNodes.filter(n => (n.routingPressure || 0) > 0);
        if (pressured.length > 0) {
            log.push(`Routing pressure: ${pressured.length} nodes have long-range edges passing through their layer`);
        }
    }

    const contentWidth = maxNodes * nodeWidth + (maxNodes - 1) * nodeGap + canvasPadding * 2;
    const contentHeight = sortedLayers.length * 100 + canvasPadding * 2;

    log.push(`Layer analysis: ${sortedLayers.length} layers, anchor L${anchorLayer} with ${maxNodes} nodes`);
    log.push(`Estimated content width: ${contentWidth}px`);

    return {
        internalNodes,
        stats: {
            layerMap,
            sortedLayers,
            anchorLayer,
            maxNodesInLayer: maxNodes,
            contentWidth,
            contentHeight,
        },
    };
}