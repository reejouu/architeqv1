import { create } from "zustand";
import type { Node, Edge } from "@xyflow/react";
import { SAMPLE_NODES, SAMPLE_EDGES } from "@/lib/constants/canvasConstants";
import { transformGraph, type RawGraph } from "@/lib/graph/graphTransform";
import { liveblocks, WithLiveblocks } from "@liveblocks/zustand";
import { liveblocksClient } from "@/lib/liveblocks-client";

type SaveStatus = "idle" | "saving" | "saved";
type ActiveMode = "design" | "review" | "export";

interface ContextMenu {
    x: number;
    y: number;
    type: "canvas" | "node" | "edge";
    nodeId?: string;
    edgeId?: string;
}

interface HistoryState {
    past: { nodes: Node[]; edges: Edge[] }[];
    future: { nodes: Node[]; edges: Edge[] }[];
}

interface CanvasState {
    nodes: Node[];
    edges: Edge[];
    selectedNodeId: string | null;
    selectedNodeIds: string[];
    rightPanelOpen: boolean;
    sidebarOpen: boolean;
    activeMode: ActiveMode;
    saveStatus: SaveStatus;
    isLocked: boolean;
    isGenerateModalOpen: boolean;
    isGenerating: boolean;
    generatingMessage: string;
    contextMenu: ContextMenu | null;
    projectName: string;
    hasUnsavedChanges: boolean;
    fitViewTrigger: number;
    edgeStyle: "solid" | "dashed";
    fontStyle: "normal" | "bold" | "italic";
    fontFamily: "inter" | "comic" | "montserrat" | "poppins";
    nodeColor: string;
    selectedEdgeIds: string[];
    interactionMode: "select" | "drawEdge";
    
    // History
    history: HistoryState;
    pushHistory: () => void;
    undo: () => void;
    redo: () => void;

    // Actions
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    addNode: (node: Node) => void;
    selectNode: (id: string | null) => void;
    setActiveMode: (mode: ActiveMode) => void;
    setSaveStatus: (status: SaveStatus) => void;
    setIsLocked: (locked: boolean) => void;
    openGenerateModal: () => void;
    closeGenerateModal: () => void;
    setIsGenerating: (isGenerating: boolean, message?: string) => void;
    setContextMenu: (menu: ContextMenu | null) => void;
    setProjectName: (name: string) => void;
    setSidebarOpen: (open: boolean) => void;
    setEdgeStyle: (style: "solid" | "dashed") => void;
    setFontStyle: (style: "normal" | "bold" | "italic") => void;
    setFontFamily: (family: "inter" | "comic" | "montserrat" | "poppins") => void;
    setNodeColor: (color: string) => void;
    setSelectedNodeIds: (ids: string[]) => void;
    setSelectedEdges: (ids: string[]) => void;
    setInteractionMode: (mode: "select" | "drawEdge") => void;
    updateEdgeData: (edgeId: string, data: any) => void;
    triggerSave: () => void;
    loadGraph: (raw: RawGraph, direction?: "TB" | "LR") => void;
    generateSampleNodes: () => void;
}

export const useCanvasStore = create<WithLiveblocks<CanvasState>>()( 
    liveblocks(
        (set, get) => ({
    nodes: [],
    edges: [],
    selectedNodeId: null,
    selectedNodeIds: [],
    rightPanelOpen: false,
    sidebarOpen: true,
    activeMode: "design",
    saveStatus: "idle",
    isLocked: false,
    isGenerateModalOpen: false,
    isGenerating: false,
    generatingMessage: "",
    contextMenu: null,
    projectName: "Doctor Booking App",
    hasUnsavedChanges: false,
    fitViewTrigger: 0,
    edgeStyle: "solid",
    fontStyle: "normal",
    fontFamily: "inter",
    nodeColor: "#ffffff",
    selectedEdgeIds: [],
    interactionMode: "select",
    history: { past: [], future: [] },

    pushHistory: () =>
        set((state) => {
            const lastPast = state.history.past[state.history.past.length - 1];
            // Don't push if the state hasn't changed at all
            if (
                lastPast &&
                JSON.stringify(lastPast.nodes) === JSON.stringify(state.nodes) &&
                JSON.stringify(lastPast.edges) === JSON.stringify(state.edges)
            ) {
                return state;
            }

            const newPast = [
                ...state.history.past,
                { nodes: state.nodes, edges: state.edges },
            ].slice(-50); // Keep max 50 items to prevent memory bloat

            return {
                history: {
                    past: newPast,
                    future: [],
                },
            };
        }),

    undo: () =>
        set((state) => {
            if (state.history.past.length === 0) return state;

            const previous = state.history.past[state.history.past.length - 1];
            const newPast = state.history.past.slice(0, -1);

            return {
                nodes: previous.nodes,
                edges: previous.edges,
                history: {
                    past: newPast,
                    future: [{ nodes: state.nodes, edges: state.edges }, ...state.history.future],
                },
                hasUnsavedChanges: true,
            };
        }),

    redo: () =>
        set((state) => {
            if (state.history.future.length === 0) return state;

            const next = state.history.future[0];
            const newFuture = state.history.future.slice(1);

            return {
                nodes: next.nodes,
                edges: next.edges,
                history: {
                    past: [...state.history.past, { nodes: state.nodes, edges: state.edges }],
                    future: newFuture,
                },
                hasUnsavedChanges: true,
            };
        }),

    setInteractionMode: (mode) => set({ interactionMode: mode }),

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

    addNode: (node) => {
        get().pushHistory();
        set((state) => ({
            nodes: [...state.nodes, node],
            hasUnsavedChanges: true,
        }));
    },

    selectNode: (id) =>
        set({ selectedNodeId: id, selectedNodeIds: id ? [id] : [] }),

    setIsLocked: (locked) => set({ isLocked: locked }),

    setActiveMode: (mode) => set({ activeMode: mode }),


    setSaveStatus: (status) => set({ saveStatus: status }),

    openGenerateModal: () => set({ isGenerateModalOpen: true }),
    closeGenerateModal: () => set({ isGenerateModalOpen: false }),

    setIsGenerating: (isGenerating, message = "") => set({ isGenerating, generatingMessage: message }),

    setContextMenu: (menu) => set({ contextMenu: menu }),

    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    setEdgeStyle: (style) => {
        get().pushHistory();
        set((state) => {
            const edges = state.edges.map(e => 
                state.selectedEdgeIds.includes(e.id) ? { ...e, data: { ...e.data, edgeStyle: style } } : e
            );
            return { edgeStyle: style, edges, hasUnsavedChanges: true };
        });
    },

    setFontStyle: (style) => {
        get().pushHistory();
        set((state) => {
            const ids = state.selectedNodeIds.length > 0 ? state.selectedNodeIds : state.selectedNodeId ? [state.selectedNodeId] : [];
            const nodes = state.nodes.map(n => 
                ids.includes(n.id) ? { ...n, data: { ...n.data, fontStyle: style } } : n
            );
            return { fontStyle: style, nodes, hasUnsavedChanges: true };
        });
    },

    setFontFamily: (family) => {
        get().pushHistory();
        set((state) => {
            const ids = state.selectedNodeIds.length > 0 ? state.selectedNodeIds : state.selectedNodeId ? [state.selectedNodeId] : [];
            const nodes = state.nodes.map(n => 
                ids.includes(n.id) ? { ...n, data: { ...n.data, fontFamily: family } } : n
            );
            return { fontFamily: family, nodes, hasUnsavedChanges: true };
        });
    },

    setNodeColor: (color) => {
        get().pushHistory();
        set((state) => {
            const ids = state.selectedNodeIds.length > 0 ? state.selectedNodeIds : state.selectedNodeId ? [state.selectedNodeId] : [];
            const nodes = state.nodes.map(n => 
                ids.includes(n.id) ? { ...n, data: { ...n.data, nodeColor: color } } : n
            );
            return { nodeColor: color, nodes, hasUnsavedChanges: true };
        });
    },
    
    setSelectedNodeIds: (ids) => set({ selectedNodeIds: ids, selectedNodeId: ids.length === 1 ? ids[0] : ids.length === 0 ? null : get().selectedNodeId }),

    setSelectedEdges: (ids) => set({ selectedEdgeIds: ids }),

    setProjectName: (name) =>
        set({ projectName: name, hasUnsavedChanges: true }),

    updateEdgeData: (edgeId, data) => set((state) => ({
        edges: state.edges.map((e) =>
            e.id === edgeId ? { ...e, data: { ...e.data, ...data } } : e
        ),
        hasUnsavedChanges: true,
    })),

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
    }),
    {
        client: liveblocksClient as any,
        storageMapping: { nodes: true, edges: true },
    }
  )
);
