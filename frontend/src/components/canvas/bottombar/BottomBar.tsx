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
            width: 28,
            height: 28,
            borderRadius: 6,
            border: "none",
            background: active ? "rgba(245,158,11,0.12)" : "transparent",
            color: active ? "#F59E0B" : "#A1A1AA",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 150ms",
        }}
        onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = active ? "#F59E0B" : "#F4F4F8"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = active ? "rgba(245,158,11,0.12)" : "transparent"; (e.currentTarget as HTMLElement).style.color = active ? "#F59E0B" : "#A1A1AA"; }}
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
                background: "rgba(10,10,15,0.92)",
                backdropFilter: "blur(20px)",
                borderTop: "1px solid rgba(139,92,246,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px",
            }}
        >
            {/* LEFT — Zoom controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <IconBtn title="Zoom out" onClick={handleZoomOut}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </IconBtn>
                <span
                    style={{ fontSize: 12, fontWeight: 500, color: "#A1A1AA", minWidth: 44, textAlign: "center", cursor: "pointer" }}
                    title="Click to enter zoom %"
                >
                    {zoom}%
                </span>
                <IconBtn title="Zoom in" onClick={handleZoomIn}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </IconBtn>
                <IconBtn title="Fit to view (⌘⇧F)" onClick={handleFitView}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
                </IconBtn>
                <IconBtn title={locked ? "Canvas locked" : "Lock canvas"} onClick={() => setLocked((l) => !l)} active={locked}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {locked
                            ? <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>
                            : <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></>
                        }
                    </svg>
                </IconBtn>
            </div>

            {/* CENTER — Inline minimap */}
            <div
                style={{
                    width: 160,
                    height: 32,
                    background: "rgba(20,20,40,0.8)",
                    border: "1px solid rgba(139,92,246,0.15)",
                    borderRadius: 6,
                    overflow: "hidden",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <span style={{ fontSize: 10, color: "#3A3A52" }}>minimap</span>
                {/* Viewport rect indicator */}
                <div
                    style={{
                        position: "absolute",
                        top: "20%",
                        left: "20%",
                        width: "60%",
                        height: "60%",
                        border: "1px solid rgba(139,92,246,0.4)",
                        background: "rgba(139,92,246,0.1)",
                        borderRadius: 2,
                    }}
                />
            </div>

            {/* RIGHT — Node count + status */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: "#52525B" }}>
                    {nodes.length} node{nodes.length !== 1 ? "s" : ""} · {edges.length} edge{edges.length !== 1 ? "s" : ""}
                </span>
                <div
                    title="Connected · auto-saving"
                    style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", cursor: "default" }}
                />
                <IconBtn title="Keyboard shortcuts">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                </IconBtn>
            </div>
        </div>
    );
}
