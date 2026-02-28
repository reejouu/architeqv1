"use client";

import React, { useState } from "react";
import { NODE_TYPES_CONFIG, NodeType } from "@/lib/canvasConstants";
import { useCanvasStore } from "@/store/canvasStore";

const ICONS: Record<string, React.ReactElement> = {
    shield: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    zap: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    "credit-card": <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
    database: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>,
    "layout-dashboard": <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>,
    bell: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
    calendar: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    layers: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
    list: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>,
};

const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 200ms ease" }}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

export default function LeftSidebar() {
    const [paletteOpen, setPaletteOpen] = useState(true);
    const [layersOpen, setLayersOpen] = useState(true);
    const { nodes, selectedNodeId, selectNode, sidebarOpen, setSidebarOpen } = useCanvasStore();

    const handleDragStart = (e: React.DragEvent, type: NodeType) => {
        e.dataTransfer.setData("application/architeq-node", type);
        e.dataTransfer.effectAllowed = "move";
    };

    const sidebarWidth = sidebarOpen ? 220 : 48;

    return (
        <div
            style={{
                position: "fixed",
                left: 0,
                top: 64,
                bottom: 48,
                width: sidebarWidth,
                zIndex: 50,
                background: "rgba(10,10,15,0.92)",
                backdropFilter: "blur(20px)",
                borderRight: "1px solid rgba(139,92,246,0.12)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transition: "width 250ms cubic-bezier(0.22,1,0.36,1)",
            }}
        >
            {/* ── Collapse toggle ── */}
            <div style={{
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: sidebarOpen ? "space-between" : "center",
                padding: sidebarOpen ? "0 14px 0 16px" : "0",
                borderBottom: "1px solid rgba(139,92,246,0.08)",
                flexShrink: 0,
            }}>
                {sidebarOpen && (
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: "#8B5CF6", textTransform: "uppercase" }}>
                        Components
                    </span>
                )}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    style={{
                        width: 28, height: 28, borderRadius: 7,
                        border: "1px solid rgba(139,92,246,0.2)",
                        background: "rgba(139,92,246,0.06)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "#8B5CF6", flexShrink: 0,
                        transition: "background 150ms, border-color 150ms",
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.15)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.5)";
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.06)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.2)";
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        style={{ transform: sidebarOpen ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 250ms ease" }}>
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
            </div>

            {/* ── Collapsed icon rail ── */}
            {!sidebarOpen && (
                <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "8px 0" }}>
                    {(Object.entries(NODE_TYPES_CONFIG) as [NodeType, typeof NODE_TYPES_CONFIG[NodeType]][]).map(([type, config]) => (
                        <div
                            key={type}
                            draggable
                            onDragStart={e => handleDragStart(e, type)}
                            title={config.label}
                            style={{
                                width: 32, height: 32, borderRadius: 8, margin: "4px auto",
                                border: `1px solid rgba(${config.rgb},0.2)`,
                                background: `rgba(${config.rgb},0.06)`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: config.color, cursor: "grab", transition: "all 150ms",
                            }}
                            onMouseEnter={e => {
                                const el = e.currentTarget;
                                el.style.background = `rgba(${config.rgb},0.18)`;
                                el.style.borderColor = config.color;
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget;
                                el.style.background = `rgba(${config.rgb},0.06)`;
                                el.style.borderColor = `rgba(${config.rgb},0.2)`;
                            }}
                        >
                            {ICONS[config.icon]}
                        </div>
                    ))}
                </div>
            )}

            {/* ── Expanded content ── */}
            {sidebarOpen && (
                <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column" }}>

                    {/* NODE PALETTE section */}
                    <div style={{ flexShrink: 0 }}>
                        {/* Section header */}
                        <div
                            onClick={() => setPaletteOpen(o => !o)}
                            style={{
                                height: 36, padding: "0 14px",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                cursor: "pointer", userSelect: "none",
                                borderBottom: "1px solid rgba(139,92,246,0.07)",
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                        >
                            <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#52525B" }}>
                                Node Types
                            </span>
                            <span style={{ color: "#52525B" }}>
                                <ChevronIcon open={paletteOpen} />
                            </span>
                        </div>

                        {/* Node cards — single column, no overflow */}
                        {paletteOpen && (
                            <div style={{ padding: "6px 10px 2px" }}>
                                {(Object.entries(NODE_TYPES_CONFIG) as [NodeType, typeof NODE_TYPES_CONFIG[NodeType]][]).map(([type, config]) => (
                                    <div
                                        key={type}
                                        draggable
                                        onDragStart={e => handleDragStart(e, type)}
                                        style={{
                                            height: 34,
                                            borderRadius: 7,
                                            border: `1px solid rgba(${config.rgb},0.2)`,
                                            background: `rgba(${config.rgb},0.05)`,
                                            display: "flex", alignItems: "center", gap: 9,
                                            padding: "0 10px", marginBottom: 4,
                                            cursor: "grab", userSelect: "none",
                                            transition: "border-color 150ms, background 150ms",
                                            width: "100%", boxSizing: "border-box",
                                        }}
                                        onMouseEnter={e => {
                                            const el = e.currentTarget;
                                            el.style.borderColor = config.color;
                                            el.style.background = `rgba(${config.rgb},0.12)`;
                                        }}
                                        onMouseLeave={e => {
                                            const el = e.currentTarget;
                                            el.style.borderColor = `rgba(${config.rgb},0.2)`;
                                            el.style.background = `rgba(${config.rgb},0.05)`;
                                        }}
                                    >
                                        {/* Color dot */}
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: config.color, flexShrink: 0 }} />
                                        {/* Icon */}
                                        <span style={{ color: config.color, flexShrink: 0, lineHeight: 0 }}>
                                            {ICONS[config.icon]}
                                        </span>
                                        {/* Label */}
                                        <span style={{ fontSize: 12, fontWeight: 500, color: "#E4E4F0", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {config.label}
                                        </span>
                                        {/* Drag handle hint */}
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" style={{ flexShrink: 0 }}>
                                            <circle cx="9" cy="7" r="1" fill="currentColor" /><circle cx="15" cy="7" r="1" fill="currentColor" />
                                            <circle cx="9" cy="12" r="1" fill="currentColor" /><circle cx="15" cy="12" r="1" fill="currentColor" />
                                            <circle cx="9" cy="17" r="1" fill="currentColor" /><circle cx="15" cy="17" r="1" fill="currentColor" />
                                        </svg>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: "rgba(139,92,246,0.08)", margin: "4px 0", flexShrink: 0 }} />

                    {/* LAYERS section */}
                    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                        {/* Section header */}
                        <div
                            onClick={() => setLayersOpen(o => !o)}
                            style={{
                                height: 36, padding: "0 14px",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                cursor: "pointer", userSelect: "none",
                                borderBottom: "1px solid rgba(139,92,246,0.07)",
                                flexShrink: 0,
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#52525B" }}>
                                    Layers
                                </span>
                                {nodes.length > 0 && (
                                    <span style={{
                                        fontSize: 9, fontWeight: 700, background: "rgba(139,92,246,0.2)",
                                        color: "#8B5CF6", borderRadius: 4, padding: "1px 5px",
                                    }}>{nodes.length}</span>
                                )}
                            </div>
                            <span style={{ color: "#52525B" }}>
                                <ChevronIcon open={layersOpen} />
                            </span>
                        </div>

                        {layersOpen && (
                            <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "4px 0 8px" }}>
                                {nodes.length === 0 && (
                                    <div style={{ padding: "12px 16px", fontSize: 12, color: "#3A3A52", fontStyle: "italic", textAlign: "center" }}>
                                        No nodes yet
                                    </div>
                                )}
                                {nodes.map(node => {
                                    const config = NODE_TYPES_CONFIG[node.data.type as keyof typeof NODE_TYPES_CONFIG];
                                    const isSelected = node.id === selectedNodeId;
                                    return (
                                        <div
                                            key={node.id}
                                            onClick={() => selectNode(isSelected ? null : node.id)}
                                            style={{
                                                height: 30, padding: "0 12px",
                                                display: "flex", alignItems: "center", gap: 8,
                                                margin: "1px 8px", borderRadius: 6,
                                                cursor: "pointer", fontSize: 12,
                                                color: isSelected ? "#C4B5FD" : "#A1A1AA",
                                                background: isSelected ? "rgba(139,92,246,0.12)" : "transparent",
                                                borderLeft: `2px solid ${isSelected ? "#8B5CF6" : "transparent"}`,
                                                transition: "all 150ms",
                                            }}
                                            onMouseEnter={e => {
                                                if (!isSelected) {
                                                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                                                    (e.currentTarget as HTMLElement).style.color = "#F4F4F8";
                                                }
                                            }}
                                            onMouseLeave={e => {
                                                if (!isSelected) {
                                                    (e.currentTarget as HTMLElement).style.background = "transparent";
                                                    (e.currentTarget as HTMLElement).style.color = "#A1A1AA";
                                                }
                                            }}
                                        >
                                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: config?.color || "#52525B", flexShrink: 0 }} />
                                            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {String(node.data.label || node.id)}
                                            </span>
                                            {isSelected && (
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
