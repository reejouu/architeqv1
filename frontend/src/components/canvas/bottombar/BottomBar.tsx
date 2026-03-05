"use client";

import { useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { useCanvasStore } from "@/store/canvasStore";

const IconBtn = ({
    title,
    onClick,
    children,
    active,
}: {
    title: string;
    onClick?: () => void;
    children: React.ReactNode;
    active?: boolean;
}) => (
    <button
        title={title}
        onClick={onClick}
        style={{
            width: 32,
            height: 32,
            borderRadius: 0,
            border: "2px solid rgba(255,255,255,0.25)",
            background: active ? "#c78caf" : "rgba(255,255,255,0.1)",
            color: active ? "#2c336c" : "#f3f3f2",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 150ms",
            boxShadow: "none"
        }}
        onMouseEnter={(e) => {
            if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.25)";
            (e.currentTarget as HTMLElement).style.transform = "none";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
        onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = active ? "#c78caf" : "rgba(255,255,255,0.1)";
            (e.currentTarget as HTMLElement).style.transform = "none";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
    >
        {children}
    </button>
);

export default function BottomBar() {
    const [locked, setLocked] = useState(false);
    const { nodes, edges } = useCanvasStore();
    const { zoomIn, zoomOut, fitView, getZoom } = useReactFlow();
    const [zoom, setZoom] = useState(100);

    const handleZoomIn = () => { zoomIn({ duration: 200 }); setTimeout(() => setZoom(Math.round(getZoom() * 100)), 210); };
    const handleZoomOut = () => { zoomOut({ duration: 200 }); setTimeout(() => setZoom(Math.round(getZoom() * 100)), 210); };
    const handleFitView = () => { fitView({ padding: 0.2, duration: 400 }); setTimeout(() => setZoom(Math.round(getZoom() * 100)), 450); };

    return (
        <div
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                height: 48,
                zIndex: 100,
                background: "#636798",
                borderTop: "3px solid #2c336c",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px",
            }}
        >
            {/* LEFT — Zoom controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <IconBtn title="Zoom out" onClick={handleZoomOut}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </IconBtn>
                <span
                    style={{ fontSize: 13, fontWeight: 800, color: "#f3f3f2", minWidth: 44, textAlign: "center", cursor: "pointer" }}
                    title="Click to enter zoom %"
                >
                    {zoom}%
                </span>
                <IconBtn title="Zoom in" onClick={handleZoomIn}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </IconBtn>
                <IconBtn title="Fit to view (⌘⇧F)" onClick={handleFitView}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
                </IconBtn>
                <IconBtn title={locked ? "Canvas locked" : "Lock canvas"} onClick={() => setLocked((l) => !l)} active={locked}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        {locked
                            ? <><rect x="3" y="11" width="18" height="11" rx="0" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>
                            : <><rect x="3" y="11" width="18" height="11" rx="0" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></>
                        }
                    </svg>
                </IconBtn>
            </div>


            {/* RIGHT — Node count + status */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#f3f3f2" }}>
                    {nodes.length} node{nodes.length !== 1 ? "s" : ""} · {edges.length} edge{edges.length !== 1 ? "s" : ""}
                </span>
                <div
                    title="Connected · auto-saving"
                    style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981", border: "2px solid rgba(255,255,255,0.3)", cursor: "default" }}
                />
                <IconBtn title="Keyboard shortcuts">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                </IconBtn>
            </div>
        </div>
    );
}
