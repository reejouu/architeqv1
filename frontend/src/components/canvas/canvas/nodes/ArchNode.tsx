"use client";

import { useEffect, useRef, useState } from "react";
import { Handle, Position, NodeProps, NodeToolbar, useReactFlow } from "@xyflow/react";
import { useCanvasStore } from "@/store/canvasStore";
import { GRAPH_TYPE_CONFIG, STATUS_CONFIG } from "@/lib/graphTransform";

const ToolBtn = ({
    title, children, onClick, danger,
}: {
    title: string;
    children: React.ReactNode;
    onClick?: () => void;
    danger?: boolean;
}) => (
    <button
        title={title}
        onClick={onClick}
        style={{
            width: 30, height: 30, borderRadius: 7, border: "none",
            background: "transparent", color: "#A1A1AA",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 150ms",
        }}
        onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = danger ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLElement).style.color = danger ? "#F87171" : "#F4F4F8";
        }}
        onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#A1A1AA";
        }}
    >
        {children}
    </button>
);

export default function ArchNode({ id, data, selected }: NodeProps) {
    // Support both old canvasConstants format (data.type) and new AI JSON format (data.nodeType)
    const nodeType = String(data.nodeType || data.type || "default").toLowerCase();
    const config = GRAPH_TYPE_CONFIG[nodeType] || GRAPH_TYPE_CONFIG.default;
    const label = String(data.label || id);
    const owner = String(data.owner || "");
    const status = String(data.status || "");
    const statusStyle = STATUS_CONFIG[status];

    const [hovered, setHovered] = useState(false);
    const [pulse, setPulse] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const { deleteElements } = useReactFlow();
    const { addNode, nodes } = useCanvasStore();

    // Ambient pulse every 4–6s
    useEffect(() => {
        const delay = 4000 + Math.random() * 2000;
        const tick = () => {
            setPulse(true);
            setTimeout(() => setPulse(false), 800);
        };
        intervalRef.current = setInterval(tick, delay);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    const handleDelete = () => deleteElements({ nodes: [{ id }] });

    const handleDuplicate = () => {
        const thisNode = nodes.find(n => n.id === id);
        if (!thisNode) return;
        addNode({
            ...thisNode,
            id: `node-${Date.now()}`,
            position: { x: thisNode.position.x + 30, y: thisNode.position.y + 30 },
            selected: false,
        });
    };

    const glowOpacity = pulse ? 0.35 : selected ? 0.3 : hovered ? 0.25 : 0.1;
    const borderColor = (selected || hovered) ? config.color : config.borderColor;

    return (
        <>
            {/* ── Floating toolbar (NodeToolbar = auto pan/zoom aware) ── */}
            <NodeToolbar isVisible={selected} position={Position.Top} offset={10}>
                <div style={{
                    background: "rgba(12,12,22,0.95)", backdropFilter: "blur(20px)",
                    border: "1px solid rgba(139,92,246,0.35)", borderRadius: 10,
                    padding: "3px 4px", display: "flex", gap: 2, alignItems: "center",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                }}>
                    <ToolBtn title="Edit node">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </ToolBtn>
                    <ToolBtn title="Assign owner">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                            <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                        </svg>
                    </ToolBtn>
                    <ToolBtn title="Add connection">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                    </ToolBtn>
                    <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)", margin: "0 2px" }} />
                    <ToolBtn title="Duplicate (⌘D)" onClick={handleDuplicate}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                    </ToolBtn>
                    <ToolBtn title="Delete (⌫)" onClick={handleDelete} danger>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                    </ToolBtn>
                </div>
            </NodeToolbar>

            {/* ── Node body ── */}
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    minWidth: 160,
                    width: 240,
                    borderRadius: 10,
                    background: "rgba(12,12,22,0.96)",
                    border: `1.5px solid ${borderColor}`,
                    boxShadow: `0 0 18px rgba(${config.rgb},${glowOpacity}), inset 0 0 12px rgba(${config.rgb},0.04)${selected ? `, 0 0 0 2px rgba(${config.rgb},0.25)` : ""}`,
                    position: "relative",
                    transition: "box-shadow 200ms, border-color 200ms",
                    cursor: "pointer",
                    userSelect: "none",
                    overflow: "hidden",
                }}
            >
                {/* Left accent stripe */}
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: config.color, borderRadius: "10px 0 0 10px" }} />

                {/* Main content */}
                <div style={{ padding: "10px 12px 10px 18px" }}>
                    {/* Label row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#F4F4F8", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {label}
                        </span>
                        {/* Owner initials badge */}
                        {owner && (
                            <div style={{
                                width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                                background: config.color, border: "2px solid rgba(12,12,22,0.9)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 8, fontWeight: 700, color: "#fff",
                            }}>
                                {owner.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* Type + Status row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {/* Node type pill */}
                        <span style={{
                            fontSize: 10, fontWeight: 500, textTransform: "capitalize",
                            color: config.color, background: `rgba(${config.rgb},0.12)`,
                            borderRadius: 4, padding: "1px 6px",
                        }}>
                            {nodeType}
                        </span>
                        {/* Status pill */}
                        {status && statusStyle && (
                            <span style={{
                                fontSize: 10, fontWeight: 500,
                                color: statusStyle.color, background: statusStyle.bg,
                                borderRadius: 4, padding: "1px 6px",
                            }}>
                                {status}
                            </span>
                        )}
                        {/* Owner text (small) */}
                        {owner && (
                            <span style={{ fontSize: 10, color: "#52525B", marginLeft: "auto", whiteSpace: "nowrap" }}>
                                {owner}
                            </span>
                        )}
                    </div>
                </div>

                {/* Selected pulse ring */}
                {selected && (
                    <div style={{
                        position: "absolute", inset: -4, borderRadius: 14,
                        border: `1px solid rgba(${config.rgb},0.4)`,
                        animation: "nodeRing 1.5s ease-out infinite",
                        pointerEvents: "none",
                    }} />
                )}

                <style>{`
                    @keyframes nodeRing {
                        from { transform: scale(1); opacity: 0.4; }
                        to   { transform: scale(1.12); opacity: 0; }
                    }
                `}</style>
            </div>

            {/* ── 4-Way Handles ── */}
            {/* Top */}
            <Handle type="target" position={Position.Top} id="top" style={{ top: -5, opacity: 0 }} />
            <Handle type="source" position={Position.Top} id="top" style={{
                width: 10, height: 10, borderRadius: "50%", background: config.color,
                border: "2px solid #0A0A0F", opacity: hovered ? 1 : 0, transition: "opacity 150ms", top: -5,
            }} />

            {/* Right */}
            <Handle type="target" position={Position.Right} id="right" style={{ right: -5, opacity: 0 }} />
            <Handle type="source" position={Position.Right} id="right" style={{
                width: 10, height: 10, borderRadius: "50%", background: config.color,
                border: "2px solid #0A0A0F", opacity: hovered ? 1 : 0, transition: "opacity 150ms", right: -5,
            }} />

            {/* Bottom */}
            <Handle type="target" position={Position.Bottom} id="bottom" style={{ bottom: -5, opacity: 0 }} />
            <Handle type="source" position={Position.Bottom} id="bottom" style={{
                width: 10, height: 10, borderRadius: "50%", background: config.color,
                border: "2px solid #0A0A0F", opacity: hovered ? 1 : 0, transition: "opacity 150ms", bottom: -5,
            }} />

            {/* Left */}
            <Handle type="target" position={Position.Left} id="left" style={{ left: -5, opacity: 0 }} />
            <Handle type="source" position={Position.Left} id="left" style={{
                width: 10, height: 10, borderRadius: "50%", background: config.color,
                border: "2px solid #0A0A0F", opacity: hovered ? 1 : 0, transition: "opacity 150ms", left: -5,
            }} />
        </>
    );
}
