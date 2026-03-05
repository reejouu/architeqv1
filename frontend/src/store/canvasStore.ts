import { create } from "zustand";
import type { Node, Edge } from "@xyflow/react";
import { SAMPLE_NODES, SAMPLE_EDGES } from "@/lib/constants/canvasConstants";
import { transformGraph, type RawGraph } from "@/lib/graph/graphTransform";

type SaveStatus = "idle" | "saving" | "saved";
type ActiveMode = "design" | "review" | "export";

interface ContextMenu {
    x: number;
    y: number;
    type: "canvas" | "node" | "edge";
    nodeId?: string;
    edgeId?: string;
}

interface CanvasState {
    nodes: Node[];
    edges: Edge[];
    selectedNodeId: string | null;
    rightPanelOpen: boolean;
    sidebarOpen: boolean;
    activeMode: ActiveMode;
    saveStatus: SaveStatus;
    isGenerateModalOpen: boolean;
    isGenerating: boolean;
    generatingMessage: string;
    contextMenu: ContextMenu | null;
    projectName: string;
    hasUnsavedChanges: boolean;
    fitViewTrigger: number;
    edgeStyle: "solid" | "dashed";

    // Actions
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    addNode: (node: Node) => void;
    selectNode: (id: string | null) => void;
    setActiveMode: (mode: ActiveMode) => void;
    setSaveStatus: (status: SaveStatus) => void;
    openGenerateModal: () => void;
    closeGenerateModal: () => void;
    setIsGenerating: (isGenerating: boolean, message?: string) => void;
    setContextMenu: (menu: ContextMenu | null) => void;
    setProjectName: (name: string) => void;
    setSidebarOpen: (open: boolean) => void;
    setEdgeStyle: (style: "solid" | "dashed") => void;
    triggerSave: () => void;
    loadGraph: (raw: RawGraph, direction?: "TB" | "LR") => void;
    generateSampleNodes: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
    nodes: [],
    edges: [],
    selectedNodeId: null,
    rightPanelOpen: false,
    sidebarOpen: true,
    activeMode: "design",
    saveStatus: "idle",
    isGenerateModalOpen: false,
    isGenerating: false,
    generatingMessage: "",
    contextMenu: null,
    projectName: "Doctor Booking App",
    hasUnsavedChanges: false,
    fitViewTrigger: 0,
    edgeStyle: "dashed",

    setNodes: (nodes) =>
        set((state) => {
            const hasChanges = JSON.stringify(nodes) !== JSON.stringify(state.nodes);
            const selectedNodeExists = state.selectedNodeId ? nodes.some(n => n.id === state.selectedNodeId) : true;
            return {
                nodes,
                hasUnsavedChanges: state.hasUnsavedChanges || hasChanges,
                ...(!selectedNodeExists ? { selectedNodeId: null, rightPanelOpen: false } : {})
            };
        }),
    setEdges: (edges) => set({ edges, hasUnsavedChanges: true }),

    addNode: (node) =>
        set((state) => ({
            nodes: [...state.nodes, node],
            hasUnsavedChanges: true,
        })),

    selectNode: (id) =>
        set({ selectedNodeId: id, rightPanelOpen: id !== null }),

    setActiveMode: (mode) => set({ activeMode: mode }),

    setSaveStatus: (status) => set({ saveStatus: status }),

    openGenerateModal: () => set({ isGenerateModalOpen: true }),
    closeGenerateModal: () => set({ isGenerateModalOpen: false }),

    setIsGenerating: (isGenerating, message = "") => set({ isGenerating, generatingMessage: message }),

    setContextMenu: (menu) => set({ contextMenu: menu }),

    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    setEdgeStyle: (style) => set({ edgeStyle: style }),

    setProjectName: (name) =>
        set({ projectName: name, hasUnsavedChanges: true }),

    triggerSave: () => {
        set({ saveStatus: "saving", hasUnsavedChanges: false });
        setTimeout(() => {
            set({ saveStatus: "saved" });
            setTimeout(() => set({ saveStatus: "idle" }), 2000);
        }, 800);
    },

    loadGraph: (raw, direction = "TB") => {
        const { nodes, edges } = transformGraph(raw, direction);
        set({
            nodes,
            edges,
            selectedNodeId: null,
            rightPanelOpen: false,
            hasUnsavedChanges: true,
        });
        // Trigger fitView after React Flow processes the new nodes
        setTimeout(() => set(s => ({ fitViewTrigger: s.fitViewTrigger + 1 })), 100);
        get().triggerSave();
    },

    generateSampleNodes: () => {
        set({ nodes: [], edges: [] });
        // Stagger node appearance
        SAMPLE_NODES.forEach((node, i) => {
            setTimeout(() => {
                set((state) => ({ nodes: [...state.nodes, node as Node] }));
            }, i * 150);
        });
        setTimeout(() => {
            set({ edges: SAMPLE_EDGES as Edge[] });
            get().triggerSave();
            // Trigger auto-fit after all nodes + edges are placed
            setTimeout(() => set(s => ({ fitViewTrigger: s.fitViewTrigger + 1 })), 150);
        }, SAMPLE_NODES.length * 150 + 200);
    },
}));
