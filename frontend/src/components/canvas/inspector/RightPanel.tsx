"use client";

import { useState } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { NODE_TYPES_CONFIG, NodeType } from "@/lib/canvasConstants";

const Section = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => {
    const [open, setOpen] = useState(true);
    return (
        <div>
            <div
                onClick={() => setOpen((o) => !o)}
                style={{
                    height: 36,
                    padding: "0 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#52525B",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    cursor: "pointer",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#A1A1AA")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#52525B")}
            >
                {title}
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms" }}
                >
                    <polyline points="18 15 12 9 6 15" />
                </svg>
            </div>
            {open && children}
        </div>
    );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 10, color: "#52525B", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {label}
        </span>
        {children}
    </div>
);

const inputStyle: React.CSSProperties = {
    height: 32,
    padding: "0 10px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 6,
    fontSize: 13,
    color: "#F4F4F8",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 150ms",
};

const TAG_EXAMPLES = { auth: ["JWT", "bcrypt", "OAuth"], api: ["Node.js", "Express", "REST"], payment: ["Stripe", "Webhooks"], database: ["PostgreSQL", "Redis"], dashboard: ["React", "Chart.js"], notification: ["Firebase", "SNS"], appointment: ["Calendar API"], cache: ["Redis", "Memcached"], queue: ["RabbitMQ", "SQS"] };

export default function RightPanel() {
    const { selectedNodeId, nodes, selectNode, rightPanelOpen } = useCanvasStore();
    const selectedNode = nodes.find((n) => n.id === selectedNodeId);
    const type = selectedNode?.data?.type as NodeType;
    const config = type ? NODE_TYPES_CONFIG[type] : null;

    return (
        <div
            style={{
                position: "fixed",
                right: 0,
                top: 64,
                bottom: 48,
                width: 280,
                zIndex: 50,
                background: "rgba(10,10,15,0.92)",
                backdropFilter: "blur(20px)",
                borderLeft: "1px solid rgba(139,92,246,0.12)",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                transform: rightPanelOpen ? "translateX(0)" : "translateX(280px)",
                transition: "transform 300ms cubic-bezier(0.22,1,0.36,1)",
            }}
        >
            {selectedNode && config && (
                <>
                    {/* Panel header */}
                    <div
                        style={{
                            height: 52,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 16px",
                            borderBottom: "1px solid rgba(139,92,246,0.1)",
                            flexShrink: 0,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: config.color, flexShrink: 0 }} />
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#F4F4F8" }}>
                                {String(selectedNode.data.label || config.label)}
                            </span>
                        </div>
                        <button
                            onClick={() => selectNode(null)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#52525B", fontSize: 18, lineHeight: 1, padding: 4 }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#F4F4F8")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#52525B")}
                        >
                            ×
                        </button>
                    </div>

                    {/* Section 1 — Details */}
                    <Section title="Details">
                        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                            <Field label="Name">
                                <input
                                    style={inputStyle}
                                    defaultValue={String(selectedNode.data.label || config.label)}
                                    onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
                                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                                />
                            </Field>
                            <Field label="Type">
                                <select
                                    style={{ ...inputStyle, appearance: "none", WebkitAppearance: "none" }}
                                    defaultValue={type}
                                    onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
                                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                                >
                                    {Object.entries(NODE_TYPES_CONFIG).map(([k, v]) => (
                                        <option key={k} value={k} style={{ background: "#141428" }}>{v.label}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Description">
                                <textarea
                                    rows={3}
                                    placeholder="Describe this service..."
                                    style={{ ...inputStyle, height: "auto", padding: "8px 10px", resize: "none", lineHeight: 1.5 }}
                                    onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
                                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                                />
                            </Field>
                        </div>
                    </Section>

                    {/* Section 2 — Ownership */}
                    <Section title="Ownership">
                        <div style={{ padding: "12px 16px" }}>
                            <div style={{ height: 36, display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: config.color, border: `2px solid rgba(${config.rgb},0.4)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
                                    {String(selectedNode.data.owner || "PK")}
                                </div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 500, color: "#F4F4F8" }}>Primary Owner</div>
                                    <div style={{ fontSize: 11, color: "#52525B" }}>Lead Engineer</div>
                                </div>
                            </div>
                            <button
                                style={{ width: "100%", height: 32, borderRadius: 6, border: "1px dashed rgba(139,92,246,0.3)", background: "transparent", color: "#8B5CF6", fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 150ms" }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.6)";
                                    (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.06)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.3)";
                                    (e.currentTarget as HTMLElement).style.background = "transparent";
                                }}
                            >
                                + Assign owner
                            </button>
                        </div>
                    </Section>

                    {/* Section 3 — Tech Stack */}
                    <Section title="Tech Stack">
                        <div style={{ padding: "12px 16px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {(TAG_EXAMPLES[type] || ["Node.js", "REST"]).map((tag) => (
                                <span
                                    key={tag}
                                    style={{ height: 24, padding: "0 10px", borderRadius: 4, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#A1A1AA", fontSize: 11, display: "flex", alignItems: "center" }}
                                >
                                    {tag}
                                </span>
                            ))}
                            <span style={{ fontSize: 12, color: "#52525B", cursor: "pointer", display: "flex", alignItems: "center" }}
                                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#8B5CF6")}
                                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#52525B")}
                            >
                                + Add tag
                            </span>
                        </div>
                    </Section>

                    {/* Section 4 — Metadata */}
                    <Section title="Metadata">
                        <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            {[
                                ["Created", "Today"],
                                ["Modified", "Just now"],
                                ["Connections", "3"],
                                ["Upstream", "1"],
                                ["Downstream", "2"],
                                ["Status", "Online"],
                            ].map(([k, v]) => (
                                <div key={k}>
                                    <div style={{ fontSize: 10, color: "#52525B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{k}</div>
                                    {k === "Status" ? (
                                        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "rgba(16,185,129,0.15)", color: "#10B981", border: "1px solid rgba(16,185,129,0.3)" }}>{v}</span>
                                    ) : (
                                        <div style={{ fontSize: 12, color: "#A1A1AA" }}>{v}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Section>
                </>
            )}
        </div>
    );
}
