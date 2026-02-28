"use client";

import React from "react";
import { NODE_TYPES_CONFIG, NodeType } from "@/lib/canvasConstants";

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

export default function NodePalette() {
    const handleDragStart = (e: React.DragEvent, type: NodeType) => {
        e.dataTransfer.setData("application/architeq-node", type);
        e.dataTransfer.effectAllowed = "move";
    };

    return (
        <>
            <div style={{ padding: "16px 16px 10px", flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#52525B" }}>
                    Node Types
                </span>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 6,
                    padding: "0 10px 12px",
                    overflowY: "auto",
                    overflowX: "hidden",
                }}
            >
                {(Object.entries(NODE_TYPES_CONFIG) as [NodeType, typeof NODE_TYPES_CONFIG[NodeType]][]).map(([type, config]) => (
                    <div
                        key={type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, type)}
                        style={{
                            height: 40,
                            borderRadius: 8,
                            border: `1px solid ${config.borderColor}`,
                            background: config.bg,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "0 10px",
                            cursor: "grab",
                            transition: "border-color 150ms, background 150ms, transform 150ms",
                            userSelect: "none",
                        }}
                        onMouseEnter={(e) => {
                            const el = e.currentTarget;
                            el.style.borderColor = config.color;
                            el.style.background = `rgba(${config.rgb},0.12)`;
                            el.style.transform = "scale(1.02)";
                        }}
                        onMouseLeave={(e) => {
                            const el = e.currentTarget;
                            el.style.borderColor = config.borderColor;
                            el.style.background = config.bg;
                            el.style.transform = "scale(1)";
                        }}
                    >
                        <div
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: config.color,
                                flexShrink: 0,
                            }}
                        />
                        <span style={{ color: config.color }}>{ICONS[config.icon]}</span>
                        <span style={{ fontSize: 11, fontWeight: 500, color: "#F4F4F8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {config.label}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}
