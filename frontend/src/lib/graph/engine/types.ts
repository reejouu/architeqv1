export interface InputNode {
    id: string;
    layer: number;
    column: number;
    [key: string]: any;
}

export interface InputEdge {
    from: string;
    to: string;
    synthetic?: boolean;
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
    routingPressure?: number;   // how many long-range edges pass through this node's layer band
    raw: InputNode;
}

export interface InternalEdge {
    from: string;
    to: string;
    waypoints: { x: number; y: number }[];
    exitPoint: { x: number; y: number };
    entryPoint: { x: number; y: number };
    exitOffset?: { dx: number; dy: number };
    entryOffset?: { dx: number; dy: number };
    exitPort: "top" | "bottom" | "left" | "right";
    entryPort: "top" | "bottom" | "left" | "right";
    routingType: "smoothstep" | "orthogonal" | "orthogonal-waypoint";
    parallelOffset: number;
    laneY?: number;   // derived render hint: y of the horizontal mid-run (never persisted)
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
            exitOffset?: { dx: number; dy: number };
            entryOffset?: { dx: number; dy: number };
            exitPort: string;
            entryPort: string;
            waypoints: { x: number; y: number }[];
            parallelOffset: number;
            laneY?: number;   // derived render hint (never persisted)
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
    layerMap: Map<number, InternalNode[]>;
    sortedLayers: number[];
    anchorLayer: number;
    maxNodesInLayer: number;
    contentWidth: number;
    contentHeight: number;
}