"use client";

import { useCallback, useEffect, useRef } from "react";
import {
    ReactFlow,
    Background,
    BackgroundVariant,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    ConnectionMode,
    ConnectionLineType,
    Node,
    Edge,
    useReactFlow,
    MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCanvasStore } from "@/store/canvasStore";
import { NODE_TYPES_CONFIG, NodeType } from "@/lib/constants/canvasConstants";
import ArchNode from "./nodes/ArchNode";
import ArchEdge from "./edges/ArchEdge";
import DependencyEdge from "./edges/DependencyEdge";
import CriticalEdge from "./edges/CriticalEdge";

const nodeTypes = { archNode: ArchNode };
const edgeTypes = {
    archEdge: ArchEdge,
    dependencyEdge: DependencyEdge,
    criticalEdge: CriticalEdge,
};

// Custom SVG arrow marker
function ArrowMarkerDefs() {
    return (
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
            <defs>
                <marker
                    id="archArrow"
                    viewBox="0 0 10 10"
                    refX="10"
                    refY="5"
                    markerWidth="8"
                    markerHeight="8"
                    orient="auto-start-reverse"
                >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#636798" />
                </marker>
                <marker
                    id="archArrowBlack"
                    viewBox="0 0 10 10"
                    refX="10"
                    refY="5"
                    markerWidth="8"
                    markerHeight="8"
                    orient="auto-start-reverse"
                >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#2c336c" />
                </marker>
            </defs>
        </svg>
    );
}

function EmptyState({ onGenerate }: { onGenerate: () => void }) {
    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                pointerEvents: "none",
                zIndex: 5,
            }}
        >
            <div
                style={{
                    width: 320,
                    height: 200,
                    border: "3px solid #2c336c",
                    borderRadius: 0,
                    background: "#ddb9ac",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    boxShadow: "4px 4px 0px 0px #2c336c"
                }}
            >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2c336c" strokeWidth="2.5">
                    <rect x="2" y="3" width="20" height="14" rx="0" />
                    <path d="M8 21h8M12 17v4" />
                    <circle cx="7" cy="10" r="1.5" /><circle cx="12" cy="10" r="1.5" /><circle cx="17" cy="10" r="1.5" />
                    <path d="M7 10h5M12 10h5" strokeDasharray="2 2" />
                </svg>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#2c336c", margin: 0 }}>Your canvas is empty</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#2c336c", margin: 0 }}>
                    Drag a node from the left panel, or{" "}
                    <span
                        onClick={onGenerate}
                        style={{ color: "#f3f3f2", background: "#2c336c", padding: "2px 6px", cursor: "pointer", pointerEvents: "all", fontWeight: 700, display: "inline-block", border: "2px solid #2c336c" }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "#c78caf";
                            (e.currentTarget as HTMLElement).style.color = "#2c336c";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "#2c336c";
                            (e.currentTarget as HTMLElement).style.color = "#f3f3f2";
                        }}
                    >
                        generate with AI →
                    </span>
                </p>
            </div>
        </div>
    );
}

export default function CanvasArea() {
    const {
        nodes: storeNodes,
        edges: storeEdges,
        setNodes: storeSetNodes,
        setEdges: storeSetEdges,
        selectNode,
        setContextMenu,
        openGenerateModal,
        triggerSave,
        fitViewTrigger,
    } = useCanvasStore();

    const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { screenToFlowPosition, getEdges, getNodes, fitView } = useReactFlow();

    // Sync store → React Flow state
    useEffect(() => { setNodes(storeNodes); }, [storeNodes, setNodes]);
    useEffect(() => { setEdges(storeEdges); }, [storeEdges, setEdges]);

    // Auto-fit view whenever generation completes
    useEffect(() => {
        if (fitViewTrigger === 0) return;
        fitView({ padding: 0.4, duration: 600 });
    }, [fitViewTrigger, fitView]);

    const onConnect = useCallback(
        (connection: Connection) => {
            const newEdge: Edge = {
                ...connection,
                type: "archEdge",
                id: `e-${Date.now()}`,
                markerEnd: { type: MarkerType.ArrowClosed, color: "#636798" }
            } as Edge;
            setEdges((eds) => addEdge(newEdge, eds));
            setTimeout(() => storeSetEdges(getEdges()), 0);
        },
        [setEdges, storeSetEdges, getEdges]
    );

    const onNodeDragStop = useCallback(() => {
        const timeout = setTimeout(() => triggerSave(), 800);
        return () => clearTimeout(timeout);
    }, [triggerSave]);

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        selectNode(node.id);
    }, [selectNode]);

    const onPaneClick = useCallback(() => {
        selectNode(null);
        setContextMenu(null);
    }, [selectNode, setContextMenu]);

    const onContextMenu = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            setContextMenu({ x: e.clientX, y: e.clientY, type: "canvas" });
        },
        [setContextMenu]
    );

    const onNodeContextMenu = useCallback(
        (e: React.MouseEvent, node: Node) => {
            e.preventDefault();
            setContextMenu({ x: e.clientX, y: e.clientY, type: "node", nodeId: node.id });
        },
        [setContextMenu]
    );

    // Drop handler for dragging from NodePalette
    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const type = e.dataTransfer.getData("application/architeq-node") as NodeType;
            if (!type || !NODE_TYPES_CONFIG[type]) return;

            const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
            const config = NODE_TYPES_CONFIG[type];
            const newNode: Node = {
                id: `node-${Date.now()}`,
                type: "archNode",
                position,
                data: { type, label: config.label },
            };
            setNodes((nds) => [...nds, newNode]);
            setTimeout(() => storeSetNodes(getNodes()), 0);
        },
        [screenToFlowPosition, setNodes, storeSetNodes, getNodes]
    );

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }, []);

    const isEmpty = nodes.length === 0;

    return (
        <div ref={reactFlowWrapper} style={{ width: "100%", height: "100%", position: "relative" }}>
            <ArrowMarkerDefs />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onContextMenu={onContextMenu}
                onNodeContextMenu={onNodeContextMenu}
                onNodeDragStop={onNodeDragStop}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                deleteKeyCode="Backspace"
                selectionKeyCode="Shift"
                multiSelectionKeyCode="Meta"
                connectionLineStyle={{
                    stroke: "#636798",
                    strokeWidth: 1.5,
                    strokeLinecap: "round",
                }}
                connectionLineType={ConnectionLineType.SmoothStep}
                defaultEdgeOptions={{
                    type: "smoothstep",
                    animated: false,
                    style: { stroke: "#636798", strokeWidth: 1.5 },
                    markerEnd: { type: MarkerType.ArrowClosed, color: "#636798" },
                }}
                connectionMode={ConnectionMode.Loose}
                snapToGrid={false}
                style={{ background: "transparent" }}
                fitView
                fitViewOptions={{ padding: 0.12 }}
            >
                <Background
                    variant={BackgroundVariant.Lines}
                    gap={40}
                    lineWidth={1}
                    color="rgba(44, 51, 108, 0.2)"
                />
            </ReactFlow>

            {isEmpty && <EmptyState onGenerate={openGenerateModal} />}
        </div>
    );
}
