"use client";

import { useEffect } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import Toolbar from "@/components/canvas/toolbar/Toolbar";
import LeftSidebar from "@/components/canvas/sidebar/LeftSidebar";
import CanvasArea from "@/components/canvas/canvas/CanvasArea";
import RightPanel from "@/components/canvas/inspector/RightPanel";
import BottomBar from "@/components/canvas/bottombar/BottomBar";
import AIGenerateModal from "@/components/canvas/modals/AIGenerateModal";
import ContextMenu from "@/components/canvas/canvas/ContextMenu";
import testGraph from "@/data/testGraph.json";

export default function CanvasPage() {
    const { contextMenu, setContextMenu, rightPanelOpen, sidebarOpen, loadGraph } = useCanvasStore();

    // Dismiss context menu on click anywhere
    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [setContextMenu]);

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                overflow: "hidden",
                background: "#0A0A0F",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <Toolbar />
            <LeftSidebar />
            <RightPanel />
            <BottomBar />

            {/* Canvas viewport — sits between the fixed sidebars */}
            <div
                style={{
                    position: "fixed",
                    top: 64,
                    bottom: 48,
                    left: sidebarOpen ? 220 : 48,
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
                    height: 32,
                    padding: "0 14px",
                    borderRadius: 8,
                    border: "1px solid rgba(139,92,246,0.4)",
                    background: "rgba(139,92,246,0.12)",
                    color: "#C4B5FD",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    transition: "all 150ms",
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.25)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.7)";
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.12)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.4)";
                }}
            >
                ⚡ Load Test Graph
            </button>

            {/* Modals & overlays */}
            <AIGenerateModal />
            {contextMenu && <ContextMenu />}
        </div>
    );
}
