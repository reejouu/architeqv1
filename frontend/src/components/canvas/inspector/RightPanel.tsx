"use client";

import { useState } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { NODE_TYPES_CONFIG, NodeType } from "@/lib/constants/canvasConstants";

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
                    height: 48,
                    padding: "0 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 13,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#f3f3f2",
                    background: "#2c336c",
                    borderBottom: "3px solid #2c336c",
                    cursor: "pointer",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#636798")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2c336c")}
            >
                {title}
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
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
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#2c336c", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {label}
        </span>
        {children}
    </div>
);

const inputStyle: React.CSSProperties = {
    height: 36,
    padding: "0 10px",
    background: "#ffffff",
    border: "2px solid #2c336c",
    borderRadius: 0,
    fontSize: 14,
    color: "#2c336c",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "all 150ms",
    boxShadow: "2px 2px 0px 0px #2c336c"
};

const TAG_EXAMPLES = { auth: ["JWT", "bcrypt", "OAuth"], api: ["Node.js", "Express", "REST"], payment: ["Stripe", "Webhooks"], database: ["PostgreSQL", "Redis"], dashboard: ["React", "Chart.js"], notification: ["Firebase", "SNS"], appointment: ["Calendar API"], cache: ["Redis", "Memcached"], queue: ["RabbitMQ", "SQS"] };

export default function RightPanel() {
    const { selectedNodeId, nodes, selectNode, rightPanelOpen } = useCanvasStore();
    const selectedNode = nodes.find((n) => n.id === selectedNodeId);
    const rawType = selectedNode?.data?.type as string;
    const type = (rawType && rawType in NODE_TYPES_CONFIG ? rawType : "api") as NodeType;
    const config = rawType && rawType in NODE_TYPES_CONFIG
        ? NODE_TYPES_CONFIG[rawType as NodeType]
        : {
            label: rawType ? rawType.charAt(0).toUpperCase() + rawType.slice(1) : "Unknown",
            color: "#52525B",
            rgb: "82,82,91",
            icon: "box",
            borderColor: "rgba(82,82,91,0.3)",
            bg: "rgba(82,82,91,0.06)",
        };

    return (
        <div
            style={{
                position: "fixed",
                right: 0,
                top: 64,
                bottom: 48,
                width: 280,
                zIndex: 50,
                background: "#f3f3f2",
                borderLeft: "3px solid #2c336c",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                transform: rightPanelOpen ? "translateX(0)" : "translateX(283px)",
                transition: "transform 300ms cubic-bezier(0.22,1,0.36,1)",
            }}
        >
            {selectedNode && config && (
                <>
                    {/* Panel header */}
                    <div
                        style={{
                            height: 56,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 16px",
                            borderBottom: "3px solid #2c336c",
                            background: "#ddb9ac",
                            flexShrink: 0,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 14, height: 14, borderRadius: 0, border: "2px solid #2c336c", background: config.color, flexShrink: 0 }} />
                            <span style={{ fontSize: 16, fontWeight: 700, color: "#2c336c" }}>
                                {String(selectedNode.data.label || config.label)}
                            </span>
                        </div>
                        <button
                            onClick={() => selectNode(null)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#2c336c", fontSize: 24, fontWeight: "bold", lineHeight: 1, padding: 4 }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#c78caf")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#2c336c")}
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
                                    onFocus={(e) => { e.target.style.boxShadow = "4px 4px 0px 0px #2c336c"; e.target.style.transform = "translate(-2px, -2px)"; }}
                                    onBlur={(e) => { e.target.style.boxShadow = "2px 2px 0px 0px #2c336c"; e.target.style.transform = "translate(0px, 0px)"; }}
                                />
                            </Field>
                            <Field label="Type">
                                <select
                                    style={{ ...inputStyle, appearance: "none", WebkitAppearance: "none", cursor: "pointer" }}
                                    defaultValue={type}
                                    onFocus={(e) => { e.target.style.boxShadow = "4px 4px 0px 0px #2c336c"; e.target.style.transform = "translate(-2px, -2px)"; }}
                                    onBlur={(e) => { e.target.style.boxShadow = "2px 2px 0px 0px #2c336c"; e.target.style.transform = "translate(0px, 0px)"; }}
                                >
                                    {Object.entries(NODE_TYPES_CONFIG).map(([k, v]) => (
                                        <option key={k} value={k} style={{ background: "#ffffff" }}>{v.label}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Description">
                                <textarea
                                    rows={3}
                                    placeholder="Describe this service..."
                                    style={{ ...inputStyle, height: "auto", padding: "8px 10px", resize: "none", lineHeight: 1.5 }}
                                    onFocus={(e) => { e.target.style.boxShadow = "4px 4px 0px 0px #2c336c"; e.target.style.transform = "translate(-2px, -2px)"; }}
                                    onBlur={(e) => { e.target.style.boxShadow = "2px 2px 0px 0px #2c336c"; e.target.style.transform = "translate(0px, 0px)"; }}
                                />
                            </Field>
                        </div>
                    </Section>

                    {/* Section 2 — Ownership */}
                    <Section title="Ownership">
                        <div style={{ padding: "16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 0, background: config.color, border: `2px solid #2c336c`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#2c336c", boxShadow: "2px 2px 0px 0px #2c336c" }}>
                                    {String(selectedNode.data.owner || "PK")}
                                </div>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#2c336c" }}>Primary Owner</div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "#636798" }}>Lead Engineer</div>
                                </div>
                            </div>
                            <button
                                style={{ width: "100%", height: 36, borderRadius: 0, border: "2px dashed #2c336c", background: "#f3f3f2", color: "#2c336c", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 150ms" }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderStyle = "solid";
                                    (e.currentTarget as HTMLElement).style.background = "#bfb3ca";
                                    (e.currentTarget as HTMLElement).style.boxShadow = "2px 2px 0px 0px #2c336c";
                                    (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderStyle = "dashed";
                                    (e.currentTarget as HTMLElement).style.background = "#f3f3f2";
                                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                                    (e.currentTarget as HTMLElement).style.transform = "translate(0px, 0px)";
                                }}
                            >
                                + Assign owner
                            </button>
                        </div>
                    </Section>

                    {/* Section 3 — Tech Stack */}
                    <Section title="Tech Stack">
                        <div style={{ padding: "16px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {(TAG_EXAMPLES[type] || ["Node.js", "REST"]).map((tag) => (
                                <span
                                    key={tag}
                                    style={{ height: 26, padding: "0 10px", borderRadius: 0, background: "#85755e", border: "2px solid #2c336c", color: "#f3f3f2", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", boxShadow: "2px 2px 0px 0px #2c336c" }}
                                >
                                    {tag}
                                </span>
                            ))}
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#2c336c", cursor: "pointer", display: "flex", alignItems: "center", paddingLeft: 4 }}
                                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#c78caf")}
                                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#2c336c")}
                            >
                                + Add tag
                            </span>
                        </div>
                    </Section>

                    {/* Section 4 — Metadata */}
                    <Section title="Metadata">
                        <div style={{ padding: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {[
                                ["Created", "Today"],
                                ["Modified", "Just now"],
                                ["Connections", "3"],
                                ["Upstream", "1"],
                                ["Downstream", "2"],
                                ["Status", "Online"],
                            ].map(([k, v]) => (
                                <div key={k}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "#2c336c", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{k}</div>
                                    {k === "Status" ? (
                                        <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 0, background: "#bfb3ca", color: "#2c336c", border: "2px solid #2c336c", boxShadow: "2px 2px 0px 0px #2c336c", display: "inline-block" }}>{v}</span>
                                    ) : (
                                        <div style={{ fontSize: 13, fontWeight: 600, color: "#636798" }}>{v}</div>
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
