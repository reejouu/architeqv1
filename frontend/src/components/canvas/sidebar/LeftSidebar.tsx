"use client";

import React, { useState } from "react";
import { NODE_TYPES_CONFIG, NodeType } from "@/lib/constants/canvasConstants";
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

    const sidebarWidth = sidebarOpen ? 260 : 48;

    return (
        <div
            style={{
                position: "fixed",
                left: 0,
                top: 64,
                bottom: 48,
                width: sidebarWidth,
                zIndex: 50,
                background: "#bfb3ca",
                borderRight: "3px solid #2c336c",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transition: "width 250ms cubic-bezier(0.22,1,0.36,1)",
            }}
        >
            {/* ── Collapse toggle ── */}
            <div style={{
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: sidebarOpen ? "space-between" : "center",
                padding: sidebarOpen ? "0 14px 0 16px" : "0",
                borderBottom: "3px solid #2c336c",
                flexShrink: 0,
            }}>
                {sidebarOpen && (
                    <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: "#2c336c", textTransform: "uppercase" }}>
                        Components
                    </span>
                )}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    style={{
                        width: 28, height: 28, borderRadius: 0,
                        border: "2px solid #2c336c",
                        background: "#ddb9ac",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "#2c336c", flexShrink: 0,
                        boxShadow: "2px 2px 0px 0px #2c336c",
                        transition: "all 150ms",
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = "#c78caf";
                        (e.currentTarget as HTMLElement).style.transform = "none";
                        (e.currentTarget as HTMLElement).style.boxShadow = "2px 2px 0px 0px #2c336c";
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = "#ddb9ac";
                        (e.currentTarget as HTMLElement).style.transform = "none";
                        (e.currentTarget as HTMLElement).style.boxShadow = "2px 2px 0px 0px #2c336c";
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
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
                                width: 34, height: 34, borderRadius: 0, margin: "6px auto",
                                border: `2px solid #2c336c`,
                                background: `#ddb9ac`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: config.color, cursor: "grab", transition: "all 150ms",
                                boxShadow: "2px 2px 0px 0px #2c336c"
                            }}
                            onMouseEnter={e => {
                                const el = e.currentTarget;
                                el.style.background = "#c78caf";
                                el.style.transform = "translate(-2px, -2px)";
                                el.style.boxShadow = "4px 4px 0px 0px #2c336c";
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget;
                                el.style.background = "#ddb9ac";
                                el.style.transform = "translate(0px, 0px)";
                                el.style.boxShadow = "2px 2px 0px 0px #2c336c";
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
                                height: 40, padding: "0 14px",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                cursor: "pointer", userSelect: "none",
                                borderBottom: "3px solid #2c336c",
                                background: "#ddb9ac"
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#c78caf"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#ddb9ac"}
                        >
                            <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2c336c" }}>
                                Node Types
                            </span>
                            <span style={{ color: "#2c336c" }}>
                                <ChevronIcon open={paletteOpen} />
                            </span>
                        </div>

                        {/* Node cards — 2 column grid */}
                        {paletteOpen && (
                            <div style={{
                                padding: "10px",
                                borderBottom: "3px solid #2c336c",
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "8px"
                            }}>
                                {(Object.entries(NODE_TYPES_CONFIG) as [NodeType, typeof NODE_TYPES_CONFIG[NodeType]][]).map(([type, config]) => (
                                    <div
                                        key={type}
                                        draggable
                                        onDragStart={e => handleDragStart(e, type)}
                                        title={config.label}
                                        style={{
                                            height: 32,
                                            borderRadius: 6,
                                            border: `1.5px solid #2c336c`,
                                            background: `#f3f3f2`,
                                            boxShadow: "2px 2px 0px 0px #2c336c",
                                            display: "flex", alignItems: "center", gap: 6,
                                            padding: "0 6px",
                                            cursor: "grab", userSelect: "none",
                                            transition: "all 150ms",
                                            width: "100%", boxSizing: "border-box",
                                        }}
                                        onMouseEnter={e => {
                                            const el = e.currentTarget;
                                            el.style.transform = "translate(-2px, -2px)";
                                            el.style.boxShadow = "4px 4px 0px 0px #2c336c";
                                            el.style.background = "#ddb9ac";
                                        }}
                                        onMouseLeave={e => {
                                            const el = e.currentTarget;
                                            el.style.transform = "translate(0px, 0px)";
                                            el.style.boxShadow = "2px 2px 0px 0px #2c336c";
                                            el.style.background = "#f3f3f2";
                                        }}
                                    >
                                        {/* Icon (colored by node type) */}
                                        <span style={{ color: config.color, flexShrink: 0, display: "flex", alignItems: "center" }}>
                                            {React.cloneElement(ICONS[config.icon] as React.ReactElement<any>, { width: 12, height: 12, strokeWidth: 2.5 })}
                                        </span>
                                        {/* Label */}
                                        <span style={{ fontSize: 11, fontWeight: 800, color: "#2c336c", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {config.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Divider element removed initially, relying on border bottom of palette container */}

                    {/* LAYERS section */}
                    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                        {/* Section header */}
                        <div
                            onClick={() => setLayersOpen(o => !o)}
                            style={{
                                height: 40, padding: "0 14px",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                cursor: "pointer", userSelect: "none",
                                borderBottom: "3px solid #2c336c",
                                background: "#ddb9ac",
                                flexShrink: 0,
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#c78caf"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#ddb9ac"}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2c336c" }}>
                                    Layers
                                </span>
                                {nodes.length > 0 && (
                                    <span style={{
                                        fontSize: 11, fontWeight: 700, background: "#3d4270",
                                        border: "2px solid #4a5090",
                                        color: "#c8cbe8", borderRadius: 0, padding: "2px 6px",
                                    }}>{nodes.length}</span>
                                )}
                            </div>
                            <span style={{ color: "#2c336c" }}>
                                <ChevronIcon open={layersOpen} />
                            </span>
                        </div>

                        {layersOpen && (
                            <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "10px 0 8px" }}>
                                {nodes.length === 0 && (
                                    <div style={{ padding: "12px 16px", fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 700, textAlign: "center" }}>
                                        No nodes yet
                                    </div>
                                )}
                                {nodes.map(node => {
                                    const rawType = node.data.type as string;
                                    const isUnknown = !(rawType in NODE_TYPES_CONFIG);
                                    const config = isUnknown ? null : NODE_TYPES_CONFIG[rawType as NodeType];
                                    const isSelected = node.id === selectedNodeId;
                                    return (
                                        <div
                                            key={node.id}
                                            onClick={() => selectNode(isSelected ? null : node.id)}
                                            style={{
                                                height: 38, padding: "0 12px",
                                                display: "flex", alignItems: "center", gap: 8,
                                                margin: "0 10px 8px", borderRadius: 0,
                                                border: "2px solid #2c336c",
                                                boxShadow: isSelected ? "4px 4px 0px 0px #2c336c" : "2px 2px 0px 0px #2c336c",
                                                cursor: "pointer", fontSize: 13, fontWeight: 700,
                                                color: "#2c336c",
                                                background: isSelected ? "#c78caf" : "#f3f3f2",
                                                transition: "all 150ms",
                                                transform: isSelected ? "translate(-2px, -2px)" : "translate(0, 0)",
                                            }}
                                            onMouseEnter={e => {
                                                if (!isSelected) {
                                                    (e.currentTarget as HTMLElement).style.background = "#ddb9ac";
                                                    (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
                                                    (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0px 0px #2c336c";
                                                }
                                            }}
                                            onMouseLeave={e => {
                                                if (!isSelected) {
                                                    (e.currentTarget as HTMLElement).style.background = "#f3f3f2";
                                                    (e.currentTarget as HTMLElement).style.transform = "translate(0px, 0px)";
                                                    (e.currentTarget as HTMLElement).style.boxShadow = "2px 2px 0px 0px #2c336c";
                                                }
                                            }}
                                        >
                                            <div style={{ width: 8, height: 8, borderRadius: 0, border: "2px solid #4a5090", background: config?.color || "#52525B", flexShrink: 0 }} />
                                            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {String(node.data.label || node.id)}
                                            </span>
                                            {isSelected && (
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6c73b8" strokeWidth="3">
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
