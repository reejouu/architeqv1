"use client";

import { Node } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import { useCanvasStore } from "@/store/canvasStore";

const ToolBtn = ({
    title,
    children,
    onClick,
    danger,
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
            width: 28,
            height: 28,
            borderRadius: 6,
            border: "none",
            background: "transparent",
            color: danger ? "#A1A1AA" : "#A1A1AA",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 150ms",
        }}
        onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = danger
                ? "rgba(239,68,68,0.1)"
                : "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLElement).style.color = danger ? "#EF4444" : "#F4F4F8";
        }}
        onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#A1A1AA";
        }}
    >
        {children}
    </button>
);

export default function FloatingToolbar({ node }: { node: Node }) {
    const { deleteElements } = useReactFlow();
    const { addNode, nodes, setNodes } = useCanvasStore();

    const position = {
        x: node.position.x + (node.measured?.width || 160) / 2,
        y: node.position.y - 52,
    };

    const handleDelete = () => {
        deleteElements({ nodes: [{ id: node.id }] });
    };

    const handleDuplicate = () => {
        const newNode = {
            ...node,
            id: `node-${Date.now()}`,
            position: { x: node.position.x + 30, y: node.position.y + 30 },
            selected: false,
        };
        addNode(newNode);
    };

    return (
        <div
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                transform: "translateX(-50%)",
                zIndex: 10,
                background: "rgba(15,15,26,0.92)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(139,92,246,0.3)",
                borderRadius: 8,
                padding: 4,
                display: "flex",
                gap: 2,
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                pointerEvents: "all",
            }}
        >
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

            {/* Separator */}
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.06)", margin: "4px 2px" }} />

            <ToolBtn title="Duplicate (⌘D)" onClick={handleDuplicate}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
            </ToolBtn>
            <ToolBtn title="Delete (Backspace)" onClick={handleDelete} danger>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
            </ToolBtn>
        </div>
    );
}
