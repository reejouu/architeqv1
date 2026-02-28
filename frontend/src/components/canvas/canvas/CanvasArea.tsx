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
    Node,
    Edge,
    useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCanvasStore } from "@/store/canvasStore";
import { NODE_TYPES_CONFIG, NodeType } from "@/lib/canvasConstants";
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
                    border: "1.5px dashed rgba(139,92,246,0.2)",
                    borderRadius: 16,
                    background: "rgba(139,92,246,0.02)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                }}
            >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                    <circle cx="7" cy="10" r="1.5" /><circle cx="12" cy="10" r="1.5" /><circle cx="17" cy="10" r="1.5" />
                    <path d="M7 10h5M12 10h5" strokeDasharray="2 2" />
                </svg>
                <p style={{ fontSize: 16, fontWeight: 500, color: "#52525B", margin: 0 }}>Your canvas is empty</p>
                <p style={{ fontSize: 13, color: "#3A3A52", margin: 0 }}>
                    Drag a node from the left panel, or{" "}
                    <span
                        onClick={onGenerate}
                        style={{ color: "#8B5CF6", cursor: "pointer", pointerEvents: "all", fontWeight: 500 }}
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

    // Sync store → React Flow state safely via useEffect (avoids setState-during-render)
    useEffect(() => { setNodes(storeNodes); }, [storeNodes, setNodes]);
    useEffect(() => { setEdges(storeEdges); }, [storeEdges, setEdges]);

    // Auto-fit view whenever generation completes (fitViewTrigger increments)
    useEffect(() => {
        if (fitViewTrigger === 0) return;
        fitView({ padding: 0.4, duration: 600 });
    }, [fitViewTrigger, fitView]);

    const onConnect = useCallback(
        (connection: Connection) => {
            const newEdge: Edge = { ...connection, type: "archEdge", id: `e-${Date.now()}` } as Edge;
            setEdges((eds) => addEdge(newEdge, eds));
            // defer so getEdges() returns the updated list
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
            // defer so getNodes() returns updated list
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
                    stroke: "rgba(255,255,255,0.2)",
                    strokeWidth: 1.5,
                    strokeDasharray: "4 6",
                }}
                style={{ background: "transparent" }}
                fitView
                fitViewOptions={{ padding: 0.3 }}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={32}
                    size={1}
                    color="rgba(139,92,246,0.1)"
                />
            </ReactFlow>

            {/* Radial glow overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.04) 0%, transparent 100%)",
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            />

            {isEmpty && <EmptyState onGenerate={openGenerateModal} />}
        </div>
    );
}
