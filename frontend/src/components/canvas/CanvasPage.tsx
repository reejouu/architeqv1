"use client";

import { useEffect } from "react";
import { useCanvasStore } from "@/store/canvasStore";
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
        </div>
    );
}
