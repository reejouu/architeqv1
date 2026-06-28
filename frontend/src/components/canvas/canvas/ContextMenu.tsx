"use client";

import { useCanvasStore } from "@/store/canvasStore";
import { useReactFlow, type Node } from "@xyflow/react";

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
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 12,
            fontWeight: 700,
            color: danger ? "#bf3d4a" : "#2c336c",
            cursor: "pointer",
            transition: "background 100ms",
        }}
        onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = danger ? "#e0707a" : "#ddb9ac";
        }}
        onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
    >
        <span style={{ flexShrink: 0, display: "flex" }}>{icon}</span>
        <span style={{ flex: 1 }}>{label}</span>
        {shortcut && <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(44,51,108,0.55)" }}>{shortcut}</span>}
    </div>
);

const Separator = () => (
    <div style={{ height: 2, background: "#2c336c", opacity: 0.15, margin: "4px 0" }} />
);

export default function ContextMenu() {
    const { contextMenu, setContextMenu, selectNode } = useCanvasStore();
    const { fitView, zoomTo, deleteElements, screenToFlowPosition } = useReactFlow();

    if (!contextMenu) return null;

    const handleAddNode = () => {
        const position = screenToFlowPosition({ x: contextMenu.x, y: contextMenu.y });
        const newNode: Node = {
            id: `node-${Date.now()}`,
            type: "archNode",
            position,
            data: { type: "custom", label: "Custom" },
        };
        useCanvasStore.getState().addNode(newNode);
        setContextMenu(null);
    };

    const handleDeleteElement = () => {
        if (contextMenu.nodeId) {
            deleteElements({ nodes: [{ id: contextMenu.nodeId }] });
        } else if (contextMenu.edgeId) {
            deleteElements({ edges: [{ id: contextMenu.edgeId }] });
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
                background: "#f3f3f2",
                border: "2px solid #2c336c",
                padding: 4,
                boxShadow: "4px 4px 0px 0px #2c336c",
                zIndex: 300,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {contextMenu.type === "canvas" ? (
                <>
                    <MenuItem
                        label="Add Node"
                        shortcut="⌘K"
                        onClick={handleAddNode}
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
                    {contextMenu.type === "node" && (
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
                        </>
                    )}
                    <MenuItem
                        label="Delete"
                        shortcut="Del"
                        danger
                        onClick={handleDeleteElement}
                        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>}
                    />
                </>
            )}
        </div>
    );
}
