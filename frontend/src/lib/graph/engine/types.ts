export interface InputNode {
    id: string;
    layer: number;
    column: number;
    [key: string]: any;
}

export interface InputEdge {
    from: string;
    to: string;
    [key: string]: any;
}

export interface LayoutConfig {
    nodeWidth: number;
    nodeHeight: number;
    layerGap: number;
    nodeGap: number;
    canvasPadding: number;
    maxBarycenterPasses: number;
    maxNudgePasses: number;
}

export interface InternalNode {
    id: string;
    layer: number;
    column: number;
    x: number;
    y: number;
    raw: InputNode;
}

export interface InternalEdge {
    from: string;
    to: string;
    waypoints: { x: number; y: number }[];
    exitPoint: { x: number; y: number };
    entryPoint: { x: number; y: number };
    routingType: "smoothstep" | "orthogonal" | "orthogonal-waypoint";
    parallelOffset: number;
    synthetic: boolean;
    raw: InputEdge;
}

export interface LayoutOutput {
    nodes: {
        id: string;
        position: { x: number; y: number };
        data: Record<string, any>;
        type: "archNode";
    }[];
    edges: {
        id: string;
        source: string;
        target: string;
        type: string;
        data: {
            exitPoint: { x: number; y: number };
            entryPoint: { x: number; y: number };
            waypoints: { x: number; y: number }[];
            parallelOffset: number;
        };
        style: { stroke: string; strokeWidth: number };
    }[];
    canvasWidth: number;
    canvasHeight: number;
    stats: {
        nodeCount: number;
        edgeCount: number;
        crossingCount: number;
        phaseLog: string[];
    };
}

export interface LayerStats {
    layerMap: Map<number, InternalNode[]>; // layer -> nodes
    sortedLayers: number[];                // distinct layers sorted asc
    anchorLayer: number;                   // layer with the most nodes
    maxNodesInLayer: number;
    contentWidth: number;                  // bounding box width
    contentHeight: number;                 // bounding box height
}
