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
                    background: "#f3f3f2",
                    border: "3px solid #2c336c",
                    boxShadow: "6px 6px 0px 0px #2c336c",
                    padding: 20,
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#2c336c" }}>
                    Unsaved changes
                </h3>
                <p style={{ marginTop: 8, marginBottom: 20, fontSize: 13, color: "#2c336c", lineHeight: 1.5 }}>
                    You have changes that haven&apos;t been saved. Save before leaving, or discard them?
                </p>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button
                        onClick={onCancel}
                        style={{
                            height: 36,
                            padding: "0 14px",
                            border: "2px solid #2c336c",
                            background: "transparent",
                            color: "#2c336c",
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
                            border: "2px solid #2c336c",
                            background: "#f7d9e0",
                            color: "#2c336c",
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
                            border: "2px solid #2c336c",
                            background: "#c78caf",
                            color: "#2c336c",
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
