"use client";

import { useEffect, useRef, useState } from "react";
import { Handle, Position, NodeProps, NodeToolbar, useReactFlow } from "@xyflow/react";
import { useCanvasStore } from "@/store/canvasStore";
import { GRAPH_TYPE_CONFIG, STATUS_CONFIG } from "@/lib/graph/graphTransform";

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
            width: 32, height: 32, borderRadius: 0, border: "2px solid #2c336c",
            background: danger ? "#bf979e" : "#ffffff", color: "#2c336c",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 150ms",
            boxShadow: "2px 2px 0px 0px #2c336c"
        }}
        onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = danger ? "#e0b0b8" : "#f3f3f2";
            (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
            (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0px 0px #2c336c";
        }}
        onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = danger ? "#bf979e" : "#ffffff";
            (e.currentTarget as HTMLElement).style.transform = "translate(0, 0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "2px 2px 0px 0px #2c336c";
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
            <NodeToolbar isVisible={selected} position={Position.Top} offset={14}>
                <div style={{
                    background: "#c78caf",
                    border: "3px solid #2c336c", borderRadius: 0,
                    padding: "6px 8px", display: "flex", gap: 6, alignItems: "center",
                    boxShadow: "4px 4px 0px 0px #2c336c",
                }}>
                    <ToolBtn title="Edit node">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </ToolBtn>
                    <ToolBtn title="Assign owner">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                            <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                        </svg>
                    </ToolBtn>
                    <ToolBtn title="Add connection">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                    </ToolBtn>
                    <div style={{ width: 3, height: 24, background: "#2c336c", margin: "0 2px" }} />
                    <ToolBtn title="Duplicate (⌘D)" onClick={handleDuplicate}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="9" y="9" width="13" height="13" rx="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                    </ToolBtn>
                    <ToolBtn title="Delete (⌫)" onClick={handleDelete} danger>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2-2H8a2 2 0 0 1-2-2L5 6" />
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
                    borderRadius: 12,
                    background: "#ffffff",
                    border: `3px solid #2c336c`,
                    boxShadow: selected ? "6px 6px 0px 0px #2c336c" : hovered ? "4px 4px 0px 0px #2c336c" : "2px 2px 0px 0px #2c336c",
                    position: "relative",
                    transition: "all 200ms",
                    cursor: "pointer",
                    userSelect: "none",
                    overflow: "hidden",
                    transform: selected ? "translate(-4px, -4px)" : hovered ? "translate(-2px, -2px)" : "translate(0, 0)",
                }}
            >
                {/* Left accent stripe */}
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 8, background: config.color, borderRight: "3px solid #2c336c" }} />

                {/* Main content */}
                <div style={{ padding: "12px 12px 12px 20px" }}>
                    {/* Label row */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#2c336c", flex: 1, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.2 }}>
                            {label}
                        </span>

                        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flexShrink: 0 }}>
                            {/* Priority badge */}


                            {!!data.priorityScore && (
                                <div style={{
                                    width: 24, height: 24, borderRadius: 0,
                                    background: Number(data.priorityScore) === 1 ? "#EF4444" : Number(data.priorityScore) === 2 ? "#F59E0B" : "#10B981",
                                    border: "2px solid #2c336c",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 12, fontWeight: 800, color: "#2c336c",
                                    boxShadow: "2px 2px 0px 0px #2c336c"
                                }} title={`Priority: P${String(data.priorityScore || "")}`}>
                                    P{String(data.priorityScore || "")}
                                </div>
                            )}

                            {/* Owner initials badge */}
                            {owner && (
                                <div style={{
                                    width: 24, height: 24, borderRadius: 0,
                                    background: config.color, border: "2px solid #2c336c",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 10, fontWeight: 700, color: "#2c336c",
                                    boxShadow: "2px 2px 0px 0px #2c336c"
                                }} title={`Owner: ${owner}`}>
                                    {owner.slice(0, 2).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Type + Status row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {/* Node type pill */}
                        <span style={{
                            fontSize: 11, fontWeight: 700, textTransform: "capitalize",
                            color: "#f3f3f2", background: "#636798", border: "2px solid #2c336c",
                            borderRadius: 0, padding: "2px 8px", boxShadow: "1px 1px 0px 0px #2c336c"
                        }}>
                            {nodeType}
                        </span>
                        {/* Status pill */}
                        {status && statusStyle && (
                            <span style={{
                                fontSize: 11, fontWeight: 700,
                                color: "#2c336c", background: statusStyle.bg, border: "2px solid #2c336c",
                                borderRadius: 0, padding: "2px 8px", boxShadow: "1px 1px 0px 0px #2c336c"
                            }}>
                                {status}
                            </span>
                        )}
                        {/* Owner text (small) */}
                        {owner && (
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#2c336c", marginLeft: "auto", whiteSpace: "nowrap" }}>
                                {owner}
                            </span>
                        )}
                    </div>
                </div>

                {/* Selected pulse ring removed in favor of stark border changes. */}
            </div>

            {/* ── 4-Way Handles ── */}
            {/* Top */}
            <Handle type="target" position={Position.Top} id="top" style={{ top: -7, opacity: 0, width: 14, height: 14 }} />
            <Handle type="source" position={Position.Top} id="top" style={{
                width: 14, height: 14, borderRadius: "50%", background: config.color,
                border: "3px solid #2c336c", opacity: hovered ? 1 : 0, transition: "all 150ms", top: -7,
            }} />

            {/* Right */}
            <Handle type="target" position={Position.Right} id="right" style={{ right: -7, opacity: 0, width: 14, height: 14 }} />
            <Handle type="source" position={Position.Right} id="right" style={{
                width: 14, height: 14, borderRadius: "50%", background: config.color,
                border: "3px solid #2c336c", opacity: hovered ? 1 : 0, transition: "all 150ms", right: -7,
            }} />

            {/* Bottom */}
            <Handle type="target" position={Position.Bottom} id="bottom" style={{ bottom: -7, opacity: 0, width: 14, height: 14 }} />
            <Handle type="source" position={Position.Bottom} id="bottom" style={{
                width: 14, height: 14, borderRadius: "50%", background: config.color,
                border: "3px solid #2c336c", opacity: hovered ? 1 : 0, transition: "all 150ms", bottom: -7,
            }} />

            {/* Left */}
            <Handle type="target" position={Position.Left} id="left" style={{ left: -7, opacity: 0, width: 14, height: 14 }} />
            <Handle type="source" position={Position.Left} id="left" style={{
                width: 14, height: 14, borderRadius: "50%", background: config.color,
                border: "3px solid #2c336c", opacity: hovered ? 1 : 0, transition: "all 150ms", left: -7,
            }} />
        </>
    );
}
