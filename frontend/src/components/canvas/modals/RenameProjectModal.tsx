"use client";

import { useState } from "react";

type Props = {
    open: boolean;
    saving: boolean;
    onSave: (name: string) => void;
    onSkip: () => void;
};

export default function RenameProjectModal({ open, saving, onSave, onSkip }: Props) {
    const [name, setName] = useState("");

    if (!open) return null;

    const inputStyle: React.CSSProperties = {
        width: "100%",
        height: 38,
        padding: "0 10px",
        background: "#ffffff",
        border: "2px solid var(--ink)",
        boxShadow: "2px 2px 0px 0px var(--ink)",
        fontSize: 14,
        color: "var(--ink)",
        outline: "none",
        boxSizing: "border-box",
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 2000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={{ position: "absolute", inset: 0, background: "rgba(44,51,108,0.4)" }} />
            <div
                style={{
                    position: "relative",
                    width: 360,
                    background: "var(--cream)",
                    border: "2px solid var(--ink)",
                    boxShadow: "6px 6px 0px 0px var(--ink)",
                    padding: 20,
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "var(--ink)" }}>
                    Name your project
                </h3>
                <p style={{ marginTop: 8, marginBottom: 14, fontSize: 13, color: "var(--ink)", lineHeight: 1.5 }}>
                    Give this architecture a name before saving. You can change it anytime.
                </p>
                <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && name.trim() && onSave(name.trim())}
                    placeholder="e.g. Doctor Booking App"
                    style={inputStyle}
                />
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
                    <button
                        onClick={onSkip}
                        style={{
                            height: 36,
                            padding: "0 14px",
                            border: "none",
                            background: "transparent",
                            color: "var(--ink)",
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        Skip for now
                    </button>
                    <button
                        onClick={() => name.trim() && onSave(name.trim())}
                        disabled={saving || !name.trim()}
                        style={{
                            height: 36,
                            padding: "0 14px",
                            border: "2px solid var(--ink)",
                            background: "var(--accent)",
                            color: "#ffffff",
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: "pointer",
                            opacity: saving || !name.trim() ? 0.6 : 1,
                        }}
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
