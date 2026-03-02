"use client";

import { useState } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { COLLABORATORS } from "@/lib/constants/canvasConstants";

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
            borderRadius: 0,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 150ms ease",
            border: active ? "2px solid #2c336c" : "2px solid transparent",
            background: active ? "#ddb9ac" : "transparent",
            color: active ? "#2c336c" : "#85755e",
            boxShadow: active ? "2px 2px 0px 0px #2c336c" : "none",
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
                background: "#f3f3f2",
                borderBottom: "3px solid #2c336c",
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
                        borderRadius: 0,
                        border: "2px solid transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#636798",
                        cursor: "pointer",
                        transition: "all 150ms",
                        textDecoration: "none",
                        flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#ddb9ac";
                        (e.currentTarget as HTMLElement).style.color = "#2c336c";
                        (e.currentTarget as HTMLElement).style.border = "2px solid #2c336c";
                        (e.currentTarget as HTMLElement).style.boxShadow = "2px 2px 0px 0px #2c336c";
                        (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "#636798";
                        (e.currentTarget as HTMLElement).style.border = "2px solid transparent";
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                        (e.currentTarget as HTMLElement).style.transform = "translate(0px, 0px)";
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </a>

                {/* Breadcrumb */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, color: "#636798", fontWeight: 700 }}>Architeq</span>
                    <span style={{ fontSize: 13, color: "#2c336c" }}>/</span>
                    {editingName ? (
                        <input
                            autoFocus
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            onBlur={handleNameSave}
                            onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                            style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#2c336c",
                                background: "#ffffff",
                                border: "2px solid #2c336c",
                                boxShadow: "2px 2px 0px 0px #2c336c",
                                outline: "none",
                                padding: "2px 6px",
                                width: Math.max(100, nameInput.length * 8 + 12),
                            }}
                        />
                    ) : (
                        <span
                            onClick={() => setEditingName(true)}
                            style={{ fontSize: 13, fontWeight: 700, color: "#2c336c", cursor: "text" }}
                        >
                            {projectName}
                        </span>
                    )}

                    {/* Unsaved dot */}
                    {hasUnsavedChanges && (
                        <div
                            title="Unsaved changes"
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: 0,
                                background: "#bf979e",
                                border: "1px solid #2c336c",
                                flexShrink: 0,
                            }}
                        />
                    )}
                </div>
            </div>

            {/* CENTER ZONE — Mode Switcher */}
            <div
                style={{
                    background: "#ffffff",
                    border: "2px solid #2c336c",
                    borderRadius: 0,
                    boxShadow: "4px 4px 0px 0px #2c336c",
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
                                border: "2px solid #2c336c",
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
                <div style={{ width: 2, height: 24, background: "#2c336c", margin: "0 8px" }} />

                {/* Share button */}
                <button
                    style={{
                        height: 32,
                        padding: "0 14px",
                        borderRadius: 0,
                        border: "2px solid #2c336c",
                        background: "#bfb3ca",
                        color: "#2c336c",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        boxShadow: "4px 4px 0px 0px #2c336c",
                        transition: "all 150ms",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#c78caf";
                        (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0px 0px #2c336c";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#bfb3ca";
                        (e.currentTarget as HTMLElement).style.transform = "translate(0, 0)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0px 0px #2c336c";
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
                        borderRadius: 0,
                        border: "2px solid #2c336c",
                        background: "#c78caf",
                        color: "#2c336c",
                        boxShadow: "4px 4px 0px 0px #2c336c",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        transition: "all 150ms",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#bf979e";
                        (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0px 0px #2c336c";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#c78caf";
                        (e.currentTarget as HTMLElement).style.transform = "translate(0px, 0px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0px 0px #2c336c";
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Generate
                </button>

                {/* Divider */}
                <div style={{ width: 2, height: 24, background: "#2c336c", margin: "0 8px" }} />

                {/* Save status */}
                <button
                    onClick={triggerSave}
                    style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#636798",
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
