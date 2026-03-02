"use client";

import { useCanvasStore } from "@/store/canvasStore";
import { NODE_TYPES_CONFIG } from "@/lib/constants/canvasConstants";

export default function LayersPanel() {
    const { nodes, selectedNodeId, selectNode } = useCanvasStore();

    return (
        <>
            <div style={{ padding: "14px 16px 10px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#52525B" }}>
                    Layers
                </span>
                <button
                    style={{ background: "transparent", border: "none", cursor: "pointer", color: "#8B5CF6", fontSize: 16, lineHeight: 1 }}
                    title="Add group"
                >
                    +
                </button>
            </div>

            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    padding: "0 0 8px",
                }}
            >
                {nodes.length === 0 && (
                    <div style={{ padding: "8px 16px", fontSize: 12, color: "#3A3A52", fontStyle: "italic" }}>
                        No nodes yet
                    </div>
                )}
                {nodes.map((node) => {
                    const config = NODE_TYPES_CONFIG[node.data.type as keyof typeof NODE_TYPES_CONFIG];
                    const isSelected = node.id === selectedNodeId;
                    return (
                        <div
                            key={node.id}
                            onClick={() => selectNode(isSelected ? null : node.id)}
                            style={{
                                height: 32,
                                padding: "0 12px",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                margin: "1px 8px",
                                borderRadius: 6,
                                cursor: "pointer",
                                fontSize: 12,
                                color: isSelected ? "#C4B5FD" : "#A1A1AA",
                                background: isSelected ? "rgba(139,92,246,0.1)" : "transparent",
                                borderLeft: isSelected ? "2px solid #8B5CF6" : "2px solid transparent",
                                transition: "all 150ms",
                            }}
                            onMouseEnter={(e) => {
                                if (!isSelected) {
                                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                                    (e.currentTarget as HTMLElement).style.color = "#F4F4F8";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isSelected) {
                                    (e.currentTarget as HTMLElement).style.background = "transparent";
                                    (e.currentTarget as HTMLElement).style.color = "#A1A1AA";
                                }
                            }}
                        >
                            <div
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    background: config?.color || "#52525B",
                                    flexShrink: 0,
                                }}
                            />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {String(node.data.label || node.id)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
