"use client";

import React, { useEffect, useState } from "react";
import { NODE_TYPES_CONFIG, NodeType } from "@/lib/constants/canvasConstants";
import { NODE_ICONS as ICONS } from "@/lib/constants/nodeIcons";
import { useCanvasStore } from "@/store/canvasStore";

function timeAgo(date: Date | null): string {
    if (!date) return "Not saved yet";
    const diffMs = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 200ms ease" }}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

interface VersionEntry {
    id: string;
    versionNumber: number;
    createdAt: string;
}

export default function LeftSidebar() {
    const [paletteOpen, setPaletteOpen] = useState(false);
    const [projectOpen, setProjectOpen] = useState(true);
    const [editingName, setEditingName] = useState(false);
    const [nameInput, setNameInput] = useState("");
    const [versions, setVersions] = useState<VersionEntry[]>([]);
    const [confirmDeleteVersion, setConfirmDeleteVersion] = useState<number | null>(null);
    const [busyVersion, setBusyVersion] = useState<number | null>(null);
    // Only one version mutation (delete) may be in flight at a time — the
    // version numbers the panel sends are only valid relative to the server's
    // current state, so firing a second delete before the first round-trip
    // completes would send a now-stale number and 404, or race the renumbering.
    const [versionMutationPending, setVersionMutationPending] = useState(false);
    const {
        sidebarOpen,
        setSidebarOpen,
        projectId,
        projectName,
        renameProject,
        lastSavedAt,
        hydrateFromSave,
        setDraggedPaletteType,
    } = useCanvasStore();

    const refreshVersions = () => {
        if (!projectId) return;
        fetch(`/api/projects/${projectId}/versions`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => setVersions(data?.versions ?? []))
            .catch(() => {});
    };

    useEffect(() => {
        refreshVersions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId, lastSavedAt]);

    const handleNameSave = () => {
        setEditingName(false);
        const trimmed = nameInput.trim();
        if (trimmed && trimmed !== projectName) renameProject(trimmed);
    };

    const handleRestore = async (versionNumber: number) => {
        if (!projectId) return;
        setBusyVersion(versionNumber);
        try {
            const res = await fetch(`/api/projects/${projectId}/restore/${versionNumber}`);
            if (!res.ok) return;
            const graph = await res.json();
            hydrateFromSave(graph.nodes ?? [], graph.edges ?? [], true);
        } finally {
            setBusyVersion(null);
        }
    };

    const handleDelete = async (versionNumber: number) => {
        if (!projectId || versionMutationPending) return;
        setVersionMutationPending(true);

        // Optimistically remove the row and renumber the rest immediately —
        // don't make the user wait on the round-trip to see it disappear.
        const previousVersions = versions;
        setVersions((prev) =>
            prev
                .filter((v) => v.versionNumber !== versionNumber)
                .map((v) => (v.versionNumber > versionNumber ? { ...v, versionNumber: v.versionNumber - 1 } : v)),
        );
        setConfirmDeleteVersion(null);

        try {
            const res = await fetch(`/api/projects/${projectId}/versions/${versionNumber}`, { method: "DELETE" });
            if (!res.ok) setVersions(previousVersions);
        } catch {
            setVersions(previousVersions);
        } finally {
            setVersionMutationPending(false);
        }
    };

    // Custom pointer-driven drag (not native HTML5 DnD — that always shows an
    // OS-level cursor decoration on Windows that no web API can suppress).
    // The rest of the gesture (cursor-following pill, drop detection, node
    // creation) is handled centrally in CanvasPage.tsx, which sits inside the
    // ReactFlowProvider and owns the canvas viewport bounds.
    //
    // A plain click is a mousedown immediately followed by mouseup — we don't
    // want that to start a drag (and show the pill). Only commit to "this is
    // a drag" once the cursor has actually moved past a small threshold.
    const DRAG_THRESHOLD_PX = 4;

    const handlePointerDown = (e: React.MouseEvent, type: NodeType) => {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;
            if (Math.hypot(dx, dy) >= DRAG_THRESHOLD_PX) {
                setDraggedPaletteType(type);
                cleanup();
            }
        };

        const handleMouseUp = () => cleanup();

        function cleanup() {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    const sidebarWidth = sidebarOpen ? 304 : 48;

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
                            onMouseDown={e => handlePointerDown(e, type)}
                            title={config.label}
                            style={{
                                width: 34, height: 34, borderRadius: 0, margin: "6px auto",
                                border: "2px solid #2c336c",
                                background: `#ddb9ac`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: config.color, cursor: "grab", transition: "all 150ms",
                                boxShadow: "2px 2px 0px 0px #2c336c", userSelect: "none",
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
                                        onMouseDown={e => handlePointerDown(e, type)}
                                        title={config.label}
                                        style={{
                                            height: 32,
                                            borderRadius: 6,
                                            border: "1.5px solid #2c336c",
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

                    {/* PROJECT section */}
                    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                        {/* Section header */}
                        <div
                            onClick={() => setProjectOpen(o => !o)}
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
                            <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2c336c" }}>
                                Project
                            </span>
                            <span style={{ color: "#2c336c" }}>
                                <ChevronIcon open={projectOpen} />
                            </span>
                        </div>

                        {projectOpen && (
                            <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                                <div style={{ padding: "10px 10px 0" }}>
                                    {/* Name card */}
                                    {editingName ? (
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <input
                                                autoFocus
                                                value={nameInput}
                                                onChange={(e) => setNameInput(e.target.value)}
                                                onBlur={handleNameSave}
                                                onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                                                style={{
                                                    flex: 1, minWidth: 0, fontSize: 13, fontWeight: 800, color: "#2c336c",
                                                    background: "#ffffff", border: "2px solid #2c336c",
                                                    boxShadow: "2px 2px 0px 0px #2c336c", outline: "none",
                                                    padding: "8px 10px", boxSizing: "border-box",
                                                }}
                                            />
                                            <button
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    handleNameSave();
                                                }}
                                                style={{
                                                    height: 35,
                                                    padding: "0 10px",
                                                    border: "2px solid #2c336c",
                                                    background: "#c78caf",
                                                    color: "#2c336c",
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    cursor: "pointer",
                                                    boxShadow: "2px 2px 0px 0px rgba(0,0,0,0.3)",
                                                }}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => { setNameInput(projectName); setEditingName(true); }}
                                            style={{
                                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                                border: "1.5px solid #2c336c", boxShadow: "2px 2px 0px 0px #2c336c",
                                                background: "#f3f3f2", padding: "8px 10px", cursor: "pointer",
                                                transition: "all 150ms",
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
                                            <span style={{ fontSize: 13, fontWeight: 800, color: "#2c336c", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {projectName}
                                            </span>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2c336c" strokeWidth="2.5" style={{ flexShrink: 0, opacity: 0.55, marginLeft: 6 }}>
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Last saved + version count stat strip */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                                        <div style={{ border: "1.5px solid #2c336c", boxShadow: "2px 2px 0px 0px #2c336c", background: "#f3f3f2", padding: "6px 8px" }}>
                                            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(44,51,108,0.55)" }}>
                                                Last saved
                                            </div>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: "#2c336c", marginTop: 2 }}>
                                                {timeAgo(lastSavedAt)}
                                            </div>
                                        </div>
                                        <div style={{ border: "1.5px solid #2c336c", boxShadow: "2px 2px 0px 0px #2c336c", background: "#f3f3f2", padding: "6px 8px" }}>
                                            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(44,51,108,0.55)" }}>
                                                Versions
                                            </div>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: "#2c336c", marginTop: 2 }}>
                                                {versions.length}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(0,0,0,0.4)", margin: "12px 0 6px" }}>
                                        History
                                    </div>
                                </div>

                                {/* Version list — one bordered card containing compact rows.
                                    Fixed height for 4 rows; scrolls internally beyond that. */}
                                <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "0 10px 10px" }}>
                                    <div
                                        style={{
                                            border: "1.5px solid #2c336c",
                                            boxShadow: "2px 2px 0px 0px #2c336c",
                                            background: "#f3f3f2",
                                            padding: "2px 10px",
                                            maxHeight: 34 * 4,
                                            overflowY: "auto",
                                        }}
                                    >
                                    {versions.length === 0 && (
                                        <div style={{ padding: "10px 4px", fontSize: 12, color: "rgba(44,51,108,0.6)", fontWeight: 600 }}>
                                            No saved versions yet
                                        </div>
                                    )}
                                    {versions.map((v, i) => {
                                        const isConfirming = confirmDeleteVersion === v.versionNumber;
                                        const isBusy = busyVersion === v.versionNumber;
                                        return (
                                            <div
                                                key={v.id}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    gap: 6,
                                                    height: 34,
                                                    padding: "0 2px",
                                                    borderBottom: i === versions.length - 1 ? "none" : "1px solid rgba(44,51,108,0.15)",
                                                }}
                                            >
                                                <div style={{ minWidth: 0, overflow: "hidden" }}>
                                                    <span style={{ fontSize: 12, fontWeight: 800, color: "#2c336c" }}>
                                                        Version {v.versionNumber}
                                                    </span>
                                                    <span style={{ fontSize: 10, color: "rgba(44,51,108,0.55)", fontWeight: 600, marginLeft: 6 }}>
                                                        {new Date(v.createdAt).toLocaleString(undefined, {
                                                            month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                                                        })}
                                                    </span>
                                                </div>
                                                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                                                    {isConfirming ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleDelete(v.versionNumber)}
                                                                disabled={versionMutationPending}
                                                                style={{
                                                                    height: 22, padding: "0 6px", fontSize: 10, fontWeight: 800,
                                                                    border: "2px solid #2c336c", background: "#e0707a",
                                                                    color: "#2c336c", cursor: versionMutationPending ? "default" : "pointer",
                                                                    opacity: versionMutationPending ? 0.6 : 1,
                                                                }}
                                                            >
                                                                {versionMutationPending ? "..." : "Confirm"}
                                                            </button>
                                                            <button
                                                                onClick={() => setConfirmDeleteVersion(null)}
                                                                disabled={versionMutationPending}
                                                                style={{
                                                                    height: 22, padding: "0 6px", fontSize: 10, fontWeight: 800,
                                                                    border: "2px solid #2c336c", background: "#ffffff",
                                                                    color: "#2c336c", cursor: versionMutationPending ? "default" : "pointer",
                                                                    opacity: versionMutationPending ? 0.6 : 1,
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleRestore(v.versionNumber)}
                                                                disabled={isBusy || versionMutationPending}
                                                                title="Restore onto canvas"
                                                                style={{
                                                                    width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
                                                                    border: "2px solid #2c336c", background: "#c78caf",
                                                                    color: "#2c336c", cursor: isBusy || versionMutationPending ? "default" : "pointer", flexShrink: 0,
                                                                    opacity: versionMutationPending && !isBusy ? 0.6 : 1,
                                                                }}
                                                            >
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={isBusy ? "animate-spin" : ""}>
                                                                    <polyline points="1 4 1 10 7 10" />
                                                                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => setConfirmDeleteVersion(v.versionNumber)}
                                                                disabled={versionMutationPending}
                                                                title="Delete version"
                                                                style={{
                                                                    width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
                                                                    border: "2px solid #2c336c", background: "#ffffff",
                                                                    color: "#2c336c", cursor: versionMutationPending ? "default" : "pointer", flexShrink: 0,
                                                                    opacity: versionMutationPending ? 0.6 : 1,
                                                                }}
                                                            >
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                                    <polyline points="3 6 5 6 21 6" />
                                                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                                    <path d="M10 11v6M14 11v6" />
                                                                </svg>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
