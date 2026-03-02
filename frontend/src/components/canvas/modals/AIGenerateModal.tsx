"use client";

import { useState } from "react";
import { useCanvasStore } from "@/store/canvasStore";

const PlaceholderToggle = ({ label }: { label: string }) => {
    const [active, setActive] = useState(false);
    return (
        <button
            onClick={() => setActive((a) => !a)}
            style={{
                height: 32,
                padding: "0 12px",
                borderRadius: 0,
                border: "2px solid #2c336c",
                background: active ? "#c78caf" : "#ffffff",
                color: "#2c336c",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 150ms",
                boxShadow: active ? "none" : "2px 2px 0px 0px #2c336c",
                transform: active ? "translate(2px, 2px)" : "translate(0, 0)"
            }}
        >
            {label}
        </button>
    );
};

export default function AIGenerateModal() {
    const { isGenerateModalOpen, closeGenerateModal, loadGraph, setIsGenerating } = useCanvasStore();
    const [prompt, setPrompt] = useState("");

    if (!isGenerateModalOpen) return null;

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true, "Connecting to AI...");
        closeGenerateModal();

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) {
                throw new Error("Failed to start generation");
            }

            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) throw new Error("No reader stream");

            let done = false;
            let buffer = "";

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        if (line.startsWith("data: ")) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.type === "progress") {
                                    setIsGenerating(true, data.message);
                                } else if (data.type === "result") {
                                    loadGraph(data.graph);
                                    setIsGenerating(false);
                                    setPrompt("");
                                } else if (data.type === "error") {
                                    console.error("AI Error:", data.message);
                                    setIsGenerating(false);
                                    // Optionally handle error toast here
                                }
                            } catch (e) {
                                console.error("Parse error:", e);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setIsGenerating(false);
            // Optionally handle error toast here
        }
    };


    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(44, 51, 108, 0.4)",
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
                    background: "#f3f3f2",
                    border: "4px solid #2c336c",
                    borderRadius: 0,
                    padding: 32,
                    boxShadow: "12px 12px 0px 0px #2c336c",
                    position: "relative",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#c78caf" stroke="#2c336c" strokeWidth="2.5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#2c336c" }}>Generate Architecture</span>
                    <button
                        onClick={closeGenerateModal}
                        style={{ position: "absolute", top: 20, right: 20, background: "#ffffff", border: "2px solid #2c336c", cursor: "pointer", color: "#2c336c", fontSize: 24, fontWeight: "bold", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0px 0px #2c336c", transition: "all 150ms" }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "#bf979e";
                            (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0px 0px #2c336c";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "#ffffff";
                            (e.currentTarget as HTMLElement).style.transform = "translate(0, 0)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "2px 2px 0px 0px #2c336c";
                        }}
                    >
                        ×
                    </button>
                </div>

                <p style={{ fontSize: 16, fontWeight: 600, color: "#636798", marginBottom: 20 }}>
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
                        height: 120,
                        background: "#ffffff",
                        border: "3px solid #2c336c",
                        borderRadius: 0,
                        padding: "16px",
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#2c336c",
                        lineHeight: 1.6,
                        resize: "none",
                        outline: "none",
                        boxSizing: "border-box",
                        marginBottom: 16,
                        display: "block",
                        transition: "all 150ms",
                        boxShadow: "4px 4px 0px 0px #2c336c"
                    }}
                    onFocus={(e) => {
                        e.target.style.background = "#fffbfa";
                        e.target.style.transform = "translate(-2px, -2px)";
                        e.target.style.boxShadow = "6px 6px 0px 0px #2c336c";
                    }}
                    onBlur={(e) => {
                        e.target.style.background = "#ffffff";
                        e.target.style.transform = "translate(0, 0)";
                        e.target.style.boxShadow = "4px 4px 0px 0px #2c336c";
                    }}
                />

                {/* Toggles */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                    <PlaceholderToggle label="Include DB layer" />
                    <PlaceholderToggle label="Add ownership slots" />
                    <PlaceholderToggle label="Map dependencies" />
                </div>

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                    <button
                        onClick={closeGenerateModal}
                        style={{ height: 44, padding: "0 20px", borderRadius: 0, border: "3px solid #2c336c", background: "#ffffff", color: "#2c336c", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "4px 4px 0px 0px #2c336c", transition: "all 150ms" }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "#f3f3f2";
                            (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0px 0px #2c336c";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "#ffffff";
                            (e.currentTarget as HTMLElement).style.transform = "translate(0, 0)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0px 0px #2c336c";
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={!prompt.trim()}
                        style={{
                            height: 44,
                            padding: "0 24px",
                            borderRadius: 0,
                            border: "3px solid #2c336c",
                            background: !prompt.trim() ? "#bfb3ca" : "#c78caf",
                            color: "#2c336c",
                            fontSize: 15,
                            fontWeight: 800,
                            cursor: !prompt.trim() ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            transition: "all 150ms",
                            boxShadow: !prompt.trim() ? "none" : "4px 4px 0px 0px #2c336c",
                            transform: !prompt.trim() ? "translate(4px, 4px)" : "translate(0, 0)"
                        }}
                    >
                        Generate →
                    </button>
                </div>
            </div>
        </div>
    );
}
