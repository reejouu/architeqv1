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
          width: 380,
          padding: "40px 32px",
          border: "3px solid #2c336c",
          borderRadius: 0,
          background: "#f3f3f2",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          boxShadow: "6px 6px 0px 0px #2c336c",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            background: "#ddb9ac",
            border: "2px solid #2c336c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "3px 3px 0px 0px #2c336c",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2c336c"
            strokeWidth="2"
          >
            <rect x="2" y="3" width="20" height="14" rx="0" />
            <path d="M8 21h8M12 17v4" />
            <circle cx="7" cy="10" r="1.5" />
            <circle cx="12" cy="10" r="1.5" />
            <circle cx="17" cy="10" r="1.5" />
            <path d="M7 10h5M12 10h5" strokeDasharray="2 2" />
          </svg>
        </div>

        {/* Title */}
        <p
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#2c336c",
            margin: 0,
            letterSpacing: "-0.3px",
          }}
        >
          Your canvas is empty
        </p>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#636798",
            margin: 0,
            lineHeight: 1.5,
            maxWidth: 260,
          }}
        >
          Drag a node from the left panel to start building, or let AI do the
          heavy lifting.
        </p>

        {/* CTA Button */}
        <button
          onClick={onGenerate}
          style={{
            pointerEvents: "all",
            padding: "10px 24px",
            fontSize: 14,
            fontWeight: 700,
            color: "#f3f3f2",
            background: "#2c336c",
            border: "2px solid #2c336c",
            cursor: "pointer",
            boxShadow: "3px 3px 0px 0px #2c336c",
            transition: "all 150ms",
            letterSpacing: "0.2px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#c78caf";
            (e.currentTarget as HTMLElement).style.color = "#2c336c";
            (e.currentTarget as HTMLElement).style.transform =
              "translate(-2px, -2px)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "5px 5px 0px 0px #2c336c";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#2c336c";
            (e.currentTarget as HTMLElement).style.color = "#f3f3f2";
            (e.currentTarget as HTMLElement).style.transform =
              "translate(0, 0)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "3px 3px 0px 0px #2c336c";
          }}
        >
          ✨ Generate with AI
        </button>
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
    isGenerateModalOpen,
    triggerSave,
    fitViewTrigger,
    setSelectedEdges,
    isLocked,
  } = useCanvasStore();

  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, getEdges, getNodes, fitView } = useReactFlow();

  // Sync store → React Flow state
  useEffect(() => {
    setNodes((prevNodes) =>
      storeNodes.map((storeNode) => {
        const prev = prevNodes.find((n) => n.id === storeNode.id);
        return {
          ...storeNode,
          measured: prev?.measured ?? storeNode.measured,
          width: prev?.width ?? storeNode.width,
          height: prev?.height ?? storeNode.height,
        };
      }),
    );
  }, [storeNodes, setNodes]);
  useEffect(() => {
    setEdges(storeEdges);
  }, [storeEdges, setEdges]);

  // Auto-fit view whenever generation completes
  useEffect(() => {
    if (fitViewTrigger === 0) return;
    fitView({ padding: 0.4, duration: 600 });
  }, [fitViewTrigger, fitView]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const { edgeStyle } = useCanvasStore.getState();
      const newEdge: Edge = {
        ...connection,
        type: "archEdge",
        id: `e-${Date.now()}`,
        data: { edgeStyle },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#636798" },
      } as Edge;
      setEdges((eds) => addEdge(newEdge, eds));
      setTimeout(() => storeSetEdges(getEdges()), 0);
    },
    [setEdges, storeSetEdges, getEdges],
  );

  const onNodeDragStop = useCallback(() => {
    const timeout = setTimeout(() => triggerSave(), 800);
    return () => clearTimeout(timeout);
  }, [triggerSave]);

  const onNodesDelete = useCallback(() => {
    setTimeout(() => {
      storeSetNodes(getNodes());
      triggerSave();
    }, 0);
  }, [storeSetNodes, getNodes, triggerSave]);

  const onEdgesDelete = useCallback(() => {
    setTimeout(() => {
      storeSetEdges(getEdges());
      triggerSave();
    }, 0);
  }, [storeSetEdges, getEdges, triggerSave]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    // Single click only selects the node (shows floating toolbar), doesn't open right panel
    useCanvasStore.setState({ selectedNodeId: node.id });
  }, []);

  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    // Double click selects AND opens the right panel
    useCanvasStore.setState({ selectedNodeId: node.id, rightPanelOpen: true });
  }, []);

  const onPaneClick = useCallback(() => {
    useCanvasStore.setState({ selectedNodeId: null, rightPanelOpen: false });
    setContextMenu(null);
  }, [setContextMenu]);

  const onContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, type: "canvas" });
    },
    [setContextMenu],
  );

  const onNodeContextMenu = useCallback(
    (e: React.MouseEvent, node: Node) => {
      e.preventDefault();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        type: "node",
        nodeId: node.id,
      });
    },
    [setContextMenu],
  );

  const onEdgeContextMenu = useCallback(
    (e: React.MouseEvent, edge: Edge) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        type: "edge",
        edgeId: edge.id,
      });
    },
    [setContextMenu],
  );

  // Drop handler for dragging from NodePalette
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData(
        "application/architeq-node",
      ) as NodeType;
      if (!type || !NODE_TYPES_CONFIG[type]) return;

      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const config = NODE_TYPES_CONFIG[type];

      // Get current default styles
      const { fontStyle, nodeColor } = useCanvasStore.getState();

      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: "archNode",
        position,
        data: {
          type,
          label: config.label,
          fontStyle,
          nodeColor,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      setTimeout(() => storeSetNodes(getNodes()), 0);
    },
    [screenToFlowPosition, setNodes, storeSetNodes, getNodes],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onSelectionChange = useCallback(
    ({ edges: selectedEdges }: { edges: Edge[] }) => {
      setSelectedEdges(selectedEdges.map((e) => e.id));
    },
    [setSelectedEdges],
  );

  const isEmpty = nodes.length === 0;

  return (
    <div
      ref={reactFlowWrapper}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <ArrowMarkerDefs />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onPaneClick={onPaneClick}
        onContextMenu={onContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onNodeDragStop={onNodeDragStop}
        onSelectionChange={onSelectionChange}
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
          strokeDasharray:
            useCanvasStore.getState().edgeStyle === "dashed" ? "5 5" : "none",
        }}
        connectionLineType={ConnectionLineType.Bezier}
        defaultEdgeOptions={{
          type: "default",
          animated: false,
          style: { stroke: "#636798", strokeWidth: 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#636798" },
        }}
        connectionMode={ConnectionMode.Loose}
        snapToGrid={false}
        panOnDrag={!isLocked}
        zoomOnScroll={!isLocked}
        zoomOnDoubleClick={!isLocked}
        elementsSelectable={true}
        nodesDraggable={!isLocked}
        nodesConnectable={!isLocked}
        edgesFocusable={!isLocked}
        style={{ background: "transparent" }}
        proOptions={{ hideAttribution: true }}
        fitView
        fitViewOptions={{ padding: 0.12 }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.8}
          color="#9b9eb2"
        />
      </ReactFlow>

      {isEmpty && !isGenerateModalOpen && (
        <EmptyState onGenerate={openGenerateModal} />
      )}
    </div>
  );
}
