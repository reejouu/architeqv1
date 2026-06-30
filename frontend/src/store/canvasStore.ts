import { create } from "zustand";
import type { Node, Edge } from "@xyflow/react";
import { liveblocks } from "@liveblocks/zustand";
import type { WithLiveblocks } from "@liveblocks/zustand";
import { SAMPLE_NODES, SAMPLE_EDGES, type NodeType } from "@/lib/constants/canvasConstants";
import { transformGraph, type RawGraph } from "@/lib/graph/graphTransform";
import { liveblocksClient } from "@/lib/liveblocks/liveblocksClient";

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
    // Which single node (if any) currently shows its floating NodeToolbar —
    // distinct from selection: single click selects, double click reveals
    // the toolbar, triple click additionally opens the right panel.
    toolbarOpenNodeId: string | null;
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
    projectId: string | null;
    lastSavedAt: Date | null;
    hasUnsavedChanges: boolean;
    fitViewTrigger: number;
    edgeStyle: "solid" | "dashed";
    fontStyle: "normal" | "bold" | "italic";
    fontFamily: "inter" | "comic" | "montserrat" | "poppins";
    nodeColor: string;
    selectedEdgeIds: string[];
    interactionMode: "select" | "drawEdge";
    // Transient nudge shown when the user repeatedly clicks a node while in
    // arrow mode, where clicks don't open the edit toolbar.
    arrowModeHint: boolean;
    // Custom pointer-driven palette drag (not native HTML5 DnD — that drags in
    // an OS-level cursor decoration on Windows we can't suppress). Set on
    // mousedown over a sidebar card, cleared on mouseup wherever it lands.
    draggedPaletteType: NodeType | null;

    // Collaboration cursor (broadcast via Liveblocks presence)
    cursor: { x: number; y: number } | null;
    setCursor: (pos: { x: number; y: number } | null) => void;

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
    setDraggedPaletteType: (type: NodeType | null) => void;
    updateEdgeData: (edgeId: string, data: any) => void;
    triggerSave: () => Promise<boolean>;
    loadGraph: (raw: RawGraph, direction?: "TB" | "LR") => Promise<void>;
    generateSampleNodes: () => void;
    setProjectId: (id: string | null) => void;
    hydrateFromSave: (nodes: Node[], edges: Edge[], markUnsaved?: boolean) => void;
    hydrateProjectMeta: (title: string) => void;
    renameProject: (title: string) => Promise<boolean>;
}

export const useCanvasStore = create<WithLiveblocks<CanvasState>>()(
  liveblocks(
    (set, get) => ({
    nodes: [],
    edges: [],
    selectedNodeId: null,
    selectedNodeIds: [],
    toolbarOpenNodeId: null,
    rightPanelOpen: false,
    sidebarOpen: true,
    activeMode: "design",
    saveStatus: "idle",
    isLocked: false,
    isGenerateModalOpen: false,
    isGenerating: false,
    generatingMessage: "",
    contextMenu: null,
    projectName: "Untitled Project",
    projectId: null,
    lastSavedAt: null,
    hasUnsavedChanges: false,
    fitViewTrigger: 0,
    edgeStyle: "solid",
    fontStyle: "normal",
    fontFamily: "inter",
    nodeColor: "#ffffff",
    selectedEdgeIds: [],
    interactionMode: "select",
    arrowModeHint: false,
    draggedPaletteType: null,
    cursor: null,
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

    setDraggedPaletteType: (type) => set({ draggedPaletteType: type }),

    setCursor: (pos) => set({ cursor: pos }),

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

    setProjectId: (id) => set({ projectId: id }),

    hydrateProjectMeta: (title) => set({ projectName: title }),

    renameProject: async (title) => {
        const { projectId } = get();
        if (!projectId) return false;
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title }),
            });
            if (!res.ok) return false;
            set({ projectName: title });
            return true;
        } catch {
            return false;
        }
    },

    hydrateFromSave: (nodes, edges, markUnsaved = false) => {
        set({
            nodes,
            edges,
            selectedNodeId: null,
            rightPanelOpen: false,
            hasUnsavedChanges: markUnsaved,
        });
    },

    triggerSave: async () => {
        const { projectId, nodes, edges } = get();
        if (!projectId) return false;

        set({ saveStatus: "saving", hasUnsavedChanges: false });
        try {
            const res = await fetch(`/api/projects/${projectId}/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nodes, edges }),
            });
            if (!res.ok) throw new Error("Save failed");
            set({ saveStatus: "saved", lastSavedAt: new Date() });
            setTimeout(() => set({ saveStatus: "idle" }), 2000);
            return true;
        } catch {
            set({ saveStatus: "idle", hasUnsavedChanges: true });
            return false;
        }
    },

    loadGraph: async (raw, direction = "TB") => {
        const { nodes, edges } = await transformGraph(raw, direction);
        set({
            nodes,
            edges,
            selectedNodeId: null,
            rightPanelOpen: false,
            hasUnsavedChanges: true,
        });
        // Trigger fitView after React Flow processes the new nodes
        setTimeout(() => set(s => ({ fitViewTrigger: s.fitViewTrigger + 1 })), 100);
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
            // Trigger auto-fit after all nodes + edges are placed
            setTimeout(() => set(s => ({ fitViewTrigger: s.fitViewTrigger + 1 })), 150);
        }, SAMPLE_NODES.length * 150 + 200);
    },
  }),
  {
    client: liveblocksClient,
    storageMapping: { nodes: true, edges: true },
    presenceMapping: { cursor: true },
  }),
);
