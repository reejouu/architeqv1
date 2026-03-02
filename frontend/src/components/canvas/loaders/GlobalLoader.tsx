"use client";

import { useCanvasStore } from "@/store/canvasStore";

export default function GlobalLoader() {
    const { isGenerating, generatingMessage } = useCanvasStore();

    if (!isGenerating) return null;

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(243, 243, 242, 0.8)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <div style={{
                background: "#f3f3f2",
                border: "4px solid #2c336c",
                borderRadius: 0,
                padding: "32px 48px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
                boxShadow: "12px 12px 0px 0px #2c336c",
            }}>
                <div className="sand-dial" style={{
                    width: 60,
                    height: 60,
                    border: "4px solid #2c336c",
                    borderTopColor: "#c78caf",
                    borderBottomColor: "#c78caf",
                    borderRadius: "50%",
                    animation: "sandDial 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite",
                    boxShadow: "4px 4px 0px 0px #2c336c",
                }} />

                <h2 style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#2c336c",
                    margin: 0,
                    animation: "pulseText 1.5s infinite"
                }}>
                    {generatingMessage || "Generating Architecture..."}
                </h2>
            </div>

            <style>{`
                @keyframes sandDial {
                    0% { transform: rotate(0deg); border-width: 4px; }
                    50% { transform: rotate(180deg); border-width: 6px; }
                    100% { transform: rotate(360deg); border-width: 4px; }
                }
                @keyframes pulseText {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
            `}</style>
        </div>
    );
}
