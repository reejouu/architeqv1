"use client";

type Props = {
    open: boolean;
    saving: boolean;
    onSave: () => void;
    onDiscard: () => void;
    onCancel: () => void;
};

export default function LeaveConfirmModal({ open, saving, onSave, onDiscard, onCancel }: Props) {
    if (!open) return null;

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
            <div
                style={{ position: "absolute", inset: 0, background: "rgba(44,51,108,0.4)" }}
                onClick={onCancel}
            />
            <div
                style={{
                    position: "relative",
                    width: 360,
                    background: "var(--white)",
                    border: "2px solid var(--ink)",
                    boxShadow: "6px 6px 0px 0px var(--ink)",
                    padding: 20,
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "var(--ink)" }}>
                    Unsaved changes
                </h3>
                <p style={{ marginTop: 8, marginBottom: 20, fontSize: 13, color: "var(--ink)", lineHeight: 1.5 }}>
                    You have changes that haven&apos;t been saved. Save before leaving, or discard them?
                </p>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button
                        onClick={onCancel}
                        style={{
                            height: 36,
                            padding: "0 14px",
                            border: "2px solid var(--ink)",
                            background: "transparent",
                            color: "var(--ink)",
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDiscard}
                        style={{
                            height: 36,
                            padding: "0 14px",
                            border: "2px solid var(--ink)",
                            background: "#f7d9e0",
                            color: "var(--ink)",
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        Discard
                    </button>
                    <button
                        onClick={onSave}
                        disabled={saving}
                        style={{
                            height: 36,
                            padding: "0 14px",
                            border: "2px solid var(--ink)",
                            background: "var(--accent)",
                            color: "#ffffff",
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: "pointer",
                            opacity: saving ? 0.6 : 1,
                        }}
                    >
                        {saving ? "Saving..." : "Save & leave"}
                    </button>
                </div>
            </div>
        </div>
    );
}
