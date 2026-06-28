"use client";

import { cloneElement, useEffect, useRef, useState, type ReactElement } from "react";
import type { Node } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import { useCanvasStore } from "@/store/canvasStore";
import { NODE_TYPES_CONFIG } from "@/lib/constants/canvasConstants";
import { NODE_ICONS } from "@/lib/constants/nodeIcons";
import Toolbar from "@/components/canvas/toolbar/Toolbar";
import LeftSidebar from "@/components/canvas/sidebar/LeftSidebar";
import CanvasArea from "@/components/canvas/canvas/CanvasArea";
import RightPanel from "@/components/canvas/inspector/RightPanel";
import BottomBar from "@/components/canvas/bottombar/BottomBar";
import AIGenerateModal from "@/components/canvas/modals/AIGenerateModal";
import GlobalLoader from "@/components/canvas/loaders/GlobalLoader";
import ContextMenu from "@/components/canvas/canvas/ContextMenu";
import testGraph from "@/data/testGraph.json";

export default function CanvasPage() {
    const {
        contextMenu,
        setContextMenu,
        rightPanelOpen,
        sidebarOpen,
        loadGraph,
        setProjectId,
        hydrateFromSave,
        hydrateProjectMeta,
        draggedPaletteType,
        setDraggedPaletteType,
    } = useCanvasStore();

    const { screenToFlowPosition } = useReactFlow();
    const canvasViewportRef = useRef<HTMLDivElement>(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    // Custom pointer-driven drag for the sidebar's node palette (see
    // LeftSidebar.tsx — native HTML5 drag-and-drop always shows an OS-level
    // cursor decoration that no web API can suppress, so this never touches
    // the native DnD machinery). Centralized here because this component sits
    // inside the ReactFlowProvider and owns the canvas viewport's bounds, so
    // it can both track the cursor for the preview pill and resolve the drop
    // in one place, instead of splitting it across sidebar/canvas listeners.
    useEffect(() => {
        if (!draggedPaletteType) return;

        const handleMouseMove = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });

        const handleMouseUp = (e: MouseEvent) => {
            const type = draggedPaletteType;
            setDraggedPaletteType(null);

            const config = type ? NODE_TYPES_CONFIG[type] : null;
            const wrapperEl = canvasViewportRef.current;
            if (!config || !wrapperEl) return;

            const rect = wrapperEl.getBoundingClientRect();
            const isOverCanvas =
                e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
            if (!isOverCanvas) return;

            const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
            const { fontStyle } = useCanvasStore.getState();
            const newNode: Node = {
                id: `node-${Date.now()}`,
                type: "archNode",
                position,
                data: { type, label: config.label, fontStyle },
            };
            useCanvasStore.getState().addNode(newNode);
        };

        // Capture phase: React Flow's pane stops propagation on its own mouse
        // handlers, which would otherwise swallow this before it bubbles to
        // window when the drop lands inside the pane.
        window.addEventListener("mousemove", handleMouseMove, true);
        window.addEventListener("mouseup", handleMouseUp, true);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove, true);
            window.removeEventListener("mouseup", handleMouseUp, true);
        };
    }, [draggedPaletteType, setDraggedPaletteType, screenToFlowPosition]);

    // Dismiss context menu on click anywhere
    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [setContextMenu]);

    // Warn on browser-level navigation (refresh, close tab, URL bar) with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!useCanvasStore.getState().hasUnsavedChanges) return;
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    // Resolve the user's project and hydrate the canvas from its latest saved version, if any.
    // Skip this when joining a shared room — room storage provides nodes/edges instead.
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.has("room")) return; // Joiner — room storage will hydrate

        let cancelled = false;

        fetch("/api/projects/me")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (cancelled || !data?.project) return;
                setProjectId(data.project.id);
                hydrateProjectMeta(data.project.title);
                return fetch(`/api/projects/${data.project.id}/load`).then((res) => (res.ok ? res.json() : null));
            })
            .then((graph) => {
                if (cancelled || !graph) return;
                if (graph.nodes?.length > 0) {
                    hydrateFromSave(graph.nodes, graph.edges ?? []);
                }
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, [setProjectId, hydrateFromSave, hydrateProjectMeta]);

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                overflow: "hidden",
                background: "var(--neo-bg, #f3f3f2)",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <Toolbar />
            <LeftSidebar />
            <RightPanel />
            <BottomBar />

            {/* Canvas viewport — sits between the fixed sidebars */}
            <div
                ref={canvasViewportRef}
                style={{
                    position: "fixed",
                    top: 64,
                    bottom: 48,
                    left: sidebarOpen ? 304 : 48,
                    right: rightPanelOpen ? 280 : 0,
                    transition: "left 250ms cubic-bezier(0.22,1,0.36,1), right 300ms cubic-bezier(0.22,1,0.36,1)",
                    overflow: "hidden",
                }}
            >
                <CanvasArea />
            </div>

            {/* ── Dev: Load test graph from /src/data/testGraph.json ── */}
            <button
                onClick={() => loadGraph(testGraph)}
                title="Load testGraph.json"
                style={{
                    position: "fixed",
                    bottom: 60,
                    right: 16,
                    zIndex: 100,
                    height: 38,
                    padding: "0 18px",
                    border: "2px solid #2c336c",
                    background: "#c78caf",
                    color: "#2c336c",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "4px 4px 0px 0px #2c336c",
                    fontFamily: "'Inter', sans-serif",
                    transition: "all 150ms",
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "#bf979e";
                    (e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0px 0px #2c336c";
                    (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "#c78caf";
                    (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0px 0px #2c336c";
                    (e.currentTarget as HTMLElement).style.transform = "translate(0px, 0px)";
                }}
            >
                ⚡ Load Test Graph
            </button>

            {/* Modals & overlays */}
            <AIGenerateModal />
            <GlobalLoader />
            {contextMenu && <ContextMenu />}

            {/* Drag preview pill — matches the sidebar node-type card's own
                styling exactly (see LeftSidebar.tsx's palette grid item) */}
            {draggedPaletteType && (
                <div
                    style={{
                        position: "fixed",
                        left: cursorPos.x,
                        top: cursorPos.y,
                        transform: "translate(-50%, -50%)",
                        zIndex: 9999,
                        pointerEvents: "none",
                        height: 32,
                        borderRadius: 6,
                        border: "1.5px solid #2c336c",
                        background: "#f3f3f2",
                        boxShadow: "2px 2px 0px 0px #2c336c",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "0 6px",
                        whiteSpace: "nowrap",
                    }}
                >
                    <span style={{ color: NODE_TYPES_CONFIG[draggedPaletteType].color, flexShrink: 0, display: "flex", alignItems: "center" }}>
                        {cloneElement(NODE_ICONS[NODE_TYPES_CONFIG[draggedPaletteType].icon] as ReactElement<any>, { width: 12, height: 12, strokeWidth: 2.5 })}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#2c336c" }}>
                        {NODE_TYPES_CONFIG[draggedPaletteType].label}
                    </span>
                </div>
            )}
        </div>
    );
}
