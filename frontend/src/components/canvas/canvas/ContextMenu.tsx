"use client";

import { useCanvasStore } from "@/store/canvasStore";
import { useReactFlow } from "@xyflow/react";

const MenuItem = ({
    label,
    shortcut,
    onClick,
    danger,
    icon,
}: {
    label: string;
    shortcut?: string;
    onClick?: () => void;
    danger?: boolean;
    icon: React.ReactNode;
}) => (
    <div
        onClick={onClick}
        style={{
            height: 32,
            padding: "0 10px",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
            color: danger ? "#EF4444" : "#A1A1AA",
            cursor: "pointer",
            transition: "background 100ms, color 100ms",
        }}
        onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = danger
                ? "rgba(239,68,68,0.1)"
                : "rgba(139,92,246,0.12)";
            if (!danger) (e.currentTarget as HTMLElement).style.color = "#F4F4F8";
        }}
        onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = danger ? "#EF4444" : "#A1A1AA";
        }}
    >
        <span style={{ flexShrink: 0 }}>{icon}</span>
        <span style={{ flex: 1 }}>{label}</span>
        {shortcut && <span style={{ fontSize: 11, color: "#52525B" }}>{shortcut}</span>}
    </div>
);

const Separator = () => (
    <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
);

export default function ContextMenu() {
    const { contextMenu, setContextMenu, selectNode } = useCanvasStore();
    const { fitView, zoomTo, deleteElements } = useReactFlow();

    if (!contextMenu) return null;

    const handleDeleteNode = () => {
        if (contextMenu.nodeId) {
            deleteElements({ nodes: [{ id: contextMenu.nodeId }] });
        }
        setContextMenu(null);
    };

    const handleFitView = () => {
        fitView({ padding: 0.2, duration: 400 });
        setContextMenu(null);
    };

    const handleZoom100 = () => {
        zoomTo(1, { duration: 300 });
        setContextMenu(null);
    };

    return (
        <div
            style={{
                position: "fixed",
                left: contextMenu.x,
                top: contextMenu.y,
                width: 200,
                background: "rgba(15,15,26,0.96)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(139,92,246,0.25)",
                borderRadius: 10,
                padding: 6,
                boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.08)",
                zIndex: 300,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {contextMenu.type === "canvas" ? (
                <>
                    <MenuItem
                        label="Add Node"
                        shortcut="⌘K"
                        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>}
                    />
                    <MenuItem
                        label="Paste"
                        shortcut="⌘V"
                        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg>}
                    />
                    <MenuItem
                        label="Select All"
                        shortcut="⌘A"
                        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>}
                    />
                    <Separator />
                    <MenuItem
                        label="Fit View"
                        shortcut="⌘⇧F"
                        onClick={handleFitView}
                        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /></svg>}
                    />
                    <MenuItem
                        label="Zoom to 100%"
                        shortcut="⌘0"
                        onClick={handleZoom100}
                        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>}
                    />
                </>
            ) : (
                <>
                    <MenuItem
                        label="Edit Node"
                        shortcut="Enter"
                        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>}
                    />
                    <MenuItem
                        label="Assign Owner"
                        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
                    />
                    <MenuItem
                        label="Add Connection"
                        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>}
                    />
                    <MenuItem
                        label="Duplicate"
                        shortcut="⌘D"
                        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>}
                    />
                    <Separator />
                    <MenuItem
                        label="Delete"
                        shortcut="Del"
                        danger
                        onClick={handleDeleteNode}
                        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>}
                    />
                </>
            )}
        </div>
    );
}
