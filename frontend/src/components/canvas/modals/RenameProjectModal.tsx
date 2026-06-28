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
        border: "2px solid #2c336c",
        boxShadow: "2px 2px 0px 0px #2c336c",
        fontSize: 14,
        color: "#2c336c",
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
                    background: "#f3f3f2",
                    border: "3px solid #2c336c",
                    boxShadow: "6px 6px 0px 0px #2c336c",
                    padding: 20,
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#2c336c" }}>
                    Name your project
                </h3>
                <p style={{ marginTop: 8, marginBottom: 14, fontSize: 13, color: "#2c336c", lineHeight: 1.5 }}>
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
                            color: "#636798",
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
                            border: "2px solid #2c336c",
                            background: "#c78caf",
                            color: "#2c336c",
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
