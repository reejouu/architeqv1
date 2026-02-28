"use client";

import { useState } from "react";
import { useCanvasStore } from "@/store/canvasStore";

const PlaceholderToggle = ({ label }: { label: string }) => {
    const [active, setActive] = useState(false);
    return (
        <button
            onClick={() => setActive((a) => !a)}
            style={{
                height: 28,
                padding: "0 12px",
                borderRadius: 999,
                border: `1px solid ${active ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.2)"}`,
                background: active ? "rgba(139,92,246,0.2)" : "transparent",
                color: active ? "#C4B5FD" : "#52525B",
                fontSize: 12,
                cursor: "pointer",
                transition: "all 150ms",
            }}
        >
            {label}
        </button>
    );
};

export default function AIGenerateModal() {
    const { isGenerateModalOpen, closeGenerateModal, loadGraph } = useCanvasStore();
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isGenerateModalOpen) return null;

    const handleGenerate = () => {
        if (!prompt.trim()) return;
        setLoading(true);

        // ── Placeholder: simulate AI agent response ──────────────────────────
        // Replace this with a real fetch/API call to your AI agent.
        // Your agent should return a RawGraph JSON matching the schema below.
        setTimeout(() => {
            setLoading(false);
            loadGraph({
                nodes: [
                    { id: "auth", label: "User Authentication", type: "core", owner: "Frontend", status: "Not Started" },
                    { id: "booking", label: "Booking Engine", type: "core", owner: "Backend", status: "In Progress" },
                    { id: "payment", label: "Payment Service", type: "integration", owner: "Backend", status: "Not Started" },
                    { id: "notification", label: "Notification System", type: "service", owner: "Fullstack", status: "Not Started" },
                    { id: "userdb", label: "User DB", type: "database", owner: "Backend", status: "Not Started" },
                ],
                edges: [
                    { from: "auth", to: "booking" },
                    { from: "auth", to: "userdb" },
                    { from: "booking", to: "payment" },
                    { from: "booking", to: "notification" },
                ],
            });
            closeGenerateModal();
            setPrompt("");
        }, 1500);
        // ── End placeholder ──────────────────────────────────────────────────
    };


    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
                zIndex: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            onClick={closeGenerateModal}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: 560,
                    background: "rgba(12,12,22,0.97)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    borderRadius: 16,
                    padding: 32,
                    boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.08)",
                    position: "relative",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#gen-grad)" strokeWidth="2">
                        <defs>
                            <linearGradient id="gen-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#8B5CF6" />
                                <stop offset="100%" stopColor="#D946EF" />
                            </linearGradient>
                        </defs>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span style={{ fontSize: 18, fontWeight: 600, color: "#F4F4F8" }}>Generate Architecture</span>
                    <button
                        onClick={closeGenerateModal}
                        style={{ position: "absolute", top: 20, right: 20, background: "transparent", border: "none", cursor: "pointer", color: "#52525B", fontSize: 20 }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#F4F4F8")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#52525B")}
                    >
                        ×
                    </button>
                </div>

                <p style={{ fontSize: 14, color: "#A1A1AA", marginBottom: 20 }}>
                    Describe your system in plain English.
                </p>

                {/* Textarea */}
                <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Build a SaaS for booking doctors with auth, payments, and notifications"
                    style={{
                        width: "100%",
                        height: 100,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(139,92,246,0.25)",
                        borderRadius: 10,
                        padding: "14px 16px",
                        fontSize: 14,
                        color: "#F4F4F8",
                        lineHeight: 1.6,
                        resize: "none",
                        outline: "none",
                        boxSizing: "border-box",
                        marginBottom: 16,
                        display: "block",
                        transition: "border-color 150ms, box-shadow 150ms",
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = "rgba(139,92,246,0.55)";
                        e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = "rgba(139,92,246,0.25)";
                        e.target.style.boxShadow = "none";
                    }}
                />

                {/* Toggles */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                    <PlaceholderToggle label="Include DB layer" />
                    <PlaceholderToggle label="Add ownership slots" />
                    <PlaceholderToggle label="Map dependencies" />
                </div>

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button
                        onClick={closeGenerateModal}
                        style={{ height: 40, padding: "0 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#A1A1AA", fontSize: 14, cursor: "pointer" }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !prompt.trim()}
                        style={{
                            height: 40,
                            padding: "0 20px",
                            borderRadius: 8,
                            border: "none",
                            background: loading || !prompt.trim() ? "rgba(139,92,246,0.3)" : "linear-gradient(135deg, #8B5CF6, #D946EF)",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            transition: "all 150ms",
                        }}
                    >
                        {loading ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                                    <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
                                    <path d="M12 2a10 10 0 0 1 10 10" />
                                </svg>
                                Generating...
                            </>
                        ) : (
                            "Generate →"
                        )}
                    </button>
                </div>

                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );
}
