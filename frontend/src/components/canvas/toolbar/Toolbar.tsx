"use client";

import { useState } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { COLLABORATORS } from "@/lib/canvasConstants";

const ModeButton = ({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        style={{
            height: 28,
            padding: "0 16px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 150ms ease",
            border: active ? "1px solid rgba(139,92,246,0.35)" : "1px solid transparent",
            background: active ? "rgba(139,92,246,0.2)" : "transparent",
            color: active ? "#C4B5FD" : "#52525B",
        }}
    >
        {label}
    </button>
);

export default function Toolbar() {
    const {
        projectName,
        setProjectName,
        activeMode,
        setActiveMode,
        openGenerateModal,
        saveStatus,
        hasUnsavedChanges,
        triggerSave,
    } = useCanvasStore();

    const [editingName, setEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(projectName);

    const handleNameSave = () => {
        setProjectName(nameInput);
        setEditingName(false);
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: 64,
                zIndex: 100,
                background: "rgba(10,10,15,0.92)",
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(139,92,246,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px",
            }}
        >
            {/* LEFT ZONE */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 280 }}>
                {/* Back button */}
                <a
                    href="/"
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#A1A1AA",
                        cursor: "pointer",
                        transition: "all 150ms",
                        textDecoration: "none",
                        flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                        (e.currentTarget as HTMLElement).style.color = "#F4F4F8";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "#A1A1AA";
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </a>

                {/* Breadcrumb */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, color: "#52525B", fontWeight: 400 }}>Architeq</span>
                    <span style={{ fontSize: 13, color: "#3A3A52" }}>/</span>
                    {editingName ? (
                        <input
                            autoFocus
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            onBlur={handleNameSave}
                            onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                            style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: "#F4F4F8",
                                background: "transparent",
                                border: "none",
                                borderBottom: "1px solid rgba(139,92,246,0.4)",
                                outline: "none",
                                padding: "0 2px",
                                width: Math.max(100, nameInput.length * 8),
                            }}
                        />
                    ) : (
                        <span
                            onClick={() => setEditingName(true)}
                            style={{ fontSize: 13, fontWeight: 500, color: "#F4F4F8", cursor: "text" }}
                        >
                            {projectName}
                        </span>
                    )}

                    {/* Unsaved dot */}
                    {hasUnsavedChanges && (
                        <div
                            title="Unsaved changes"
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "#F59E0B",
                                flexShrink: 0,
                            }}
                        />
                    )}
                </div>
            </div>

            {/* CENTER ZONE — Mode Switcher */}
            <div
                style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(139,92,246,0.15)",
                    borderRadius: 8,
                    padding: 3,
                    display: "flex",
                    gap: 2,
                }}
            >
                {(["design", "review", "export"] as const).map((mode) => (
                    <ModeButton
                        key={mode}
                        label={mode.charAt(0).toUpperCase() + mode.slice(1)}
                        active={activeMode === mode}
                        onClick={() => setActiveMode(mode)}
                    />
                ))}
            </div>

            {/* RIGHT ZONE */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 280, justifyContent: "flex-end" }}>
                {/* Collaborator avatars */}
                <div style={{ display: "flex", alignItems: "center" }}>
                    {COLLABORATORS.map((c, i) => (
                        <div
                            key={c.initials}
                            title={c.name}
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: c.color,
                                border: "2px solid #0A0A0F",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 10,
                                fontWeight: 700,
                                color: "#fff",
                                marginLeft: i === 0 ? 0 : -8,
                                zIndex: COLLABORATORS.length - i,
                                cursor: "default",
                                flexShrink: 0,
                            }}
                        >
                            {c.initials}
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div style={{ width: 1, height: 24, background: "rgba(139,92,246,0.1)", margin: "0 4px" }} />

                {/* Share button */}
                <button
                    style={{
                        height: 32,
                        padding: "0 14px",
                        borderRadius: 999,
                        border: "1px solid rgba(139,92,246,0.25)",
                        background: "transparent",
                        color: "#A1A1AA",
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        transition: "all 150ms",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.25)")}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    Share
                </button>

                {/* Generate button */}
                <button
                    onClick={openGenerateModal}
                    style={{
                        height: 32,
                        padding: "0 14px",
                        borderRadius: 999,
                        border: "none",
                        background: "linear-gradient(135deg, #8B5CF6, #D946EF)",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        transition: "all 150ms",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(139,92,246,0.45)";
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                        (e.currentTarget as HTMLElement).style.transform = "none";
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Generate
                </button>

                {/* Divider */}
                <div style={{ width: 1, height: 24, background: "rgba(139,92,246,0.1)", margin: "0 4px" }} />

                {/* Save status */}
                <button
                    onClick={triggerSave}
                    style={{
                        fontSize: 12,
                        color: "#52525B",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        minWidth: 60,
                    }}
                >
                    {saveStatus === "saving" && (
                        <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                <path d="M12 2a10 10 0 0 1 10 10" />
                            </svg>
                            Saving...
                        </>
                    )}
                    {saveStatus === "saved" && (
                        <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span style={{ color: "#10B981" }}>Saved</span>
                        </>
                    )}
                    {saveStatus === "idle" && "Save"}
                </button>
            </div>
        </div>
    );
}
