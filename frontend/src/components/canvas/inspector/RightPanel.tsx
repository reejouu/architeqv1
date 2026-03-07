"use client";

import { useState, useRef, useEffect } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import {
  NODE_TYPES_CONFIG,
  NodeType,
  COLOR_PALETTE,
} from "@/lib/constants/canvasConstants";
import { GRAPH_TYPE_CONFIG, STATUS_CONFIG } from "@/lib/graph/graphTransform";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderBottom: "3px solid #2c336c" }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          height: 40,
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 13,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#2c336c",
          background: "#ddb9ac",
          borderBottom: open ? "3px solid #2c336c" : "none",
          cursor: "pointer",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "#c78caf")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "#ddb9ac")
        }
      >
        {title}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms",
          }}
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </div>
      {open && <div style={{ padding: "12px 0" }}>{children}</div>}
    </div>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: "#2c336c",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
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
  boxShadow: "2px 2px 0px 0px #2c336c",
};

const CustomSelect = ({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          ...inputStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          background: open ? "#ddb9ac" : "#ffffff",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "4px 4px 0px 0px #2c336c";
          e.currentTarget.style.transform = "translate(-2px, -2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "2px 2px 0px 0px #2c336c";
          e.currentTarget.style.transform = "translate(0px, 0px)";
        }}
      >
        <span style={{ fontWeight: 600 }}>
          {options.find((o) => o.value === value)?.label || value}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 4,
            background: "#ffffff",
            border: "2px solid #2c336c",
            boxShadow: "3px 3px 0px 0px #2c336c",
            zIndex: 100,
            maxHeight: 200,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              style={{
                padding: "8px 10px",
                fontSize: 13,
                fontWeight: 600,
                color: "#2c336c",
                cursor: "pointer",
                background: value === opt.value ? "#ddb9ac" : "#ffffff",
                borderBottom: "1px solid rgba(44, 51, 108, 0.1)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#c78caf")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  value === opt.value ? "#ddb9ac" : "#ffffff")
              }
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TAG_EXAMPLES = {
  auth: ["JWT", "bcrypt", "OAuth"],
  api: ["Node.js", "Express", "REST"],
  payment: ["Stripe", "Webhooks"],
  database: ["PostgreSQL", "Redis"],
  dashboard: ["React", "Chart.js"],
  notification: ["Firebase", "SNS"],
  appointment: ["Calendar API"],
  cache: ["Redis", "Memcached"],
  queue: ["RabbitMQ", "SQS"],
};

export default function RightPanel() {
  const {
    selectedNodeId,
    nodes,
    selectNode,
    rightPanelOpen,
    setNodes,
    setNodeColor,
  } = useCanvasStore();
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const rawType = selectedNode?.data?.type as string;

  // Derive exact base color and type to match ArchNode behavior
  const nodeTypeGraphRaw =
    selectedNode?.data?.nodeType ?? selectedNode?.data?.type ?? "default";
  const nodeTypeGraph = String(nodeTypeGraphRaw).toLowerCase();

  const getTypeLabel = (k: string) => {
    if (k in NODE_TYPES_CONFIG)
      return NODE_TYPES_CONFIG[k as keyof typeof NODE_TYPES_CONFIG].label;
    return k.charAt(0).toUpperCase() + k.slice(1);
  };

  const typeOptions = [
    { label: "Core", value: "core" },
    { label: "Service", value: "service" },
    { label: "API Gateway", value: "api" },
    { label: "Database", value: "database" },
    { label: "Frontend", value: "frontend" },
    { label: "Agent", value: "agent" },
    { label: "Custom", value: "custom" },
  ];

  const isCustomType = !typeOptions.find(
    (o) => o.value === nodeTypeGraph && o.value !== "custom",
  );

  const statusOptions = [
    { label: "None", value: "" },
    ...Object.keys(STATUS_CONFIG).map((k) => ({ label: k, value: k })),
  ];

  const config =
    nodeTypeGraph in NODE_TYPES_CONFIG
      ? NODE_TYPES_CONFIG[nodeTypeGraph as NodeType]
      : {
          label: getTypeLabel(nodeTypeGraph),
          color: GRAPH_TYPE_CONFIG[nodeTypeGraph]?.color || "#52525B",
          rgb: GRAPH_TYPE_CONFIG[nodeTypeGraph]?.rgb || "82,82,91",
          icon: "box",
          borderColor:
            GRAPH_TYPE_CONFIG[nodeTypeGraph]?.borderColor ||
            "rgba(82,82,91,0.3)",
          bg: GRAPH_TYPE_CONFIG[nodeTypeGraph]?.bg || "rgba(82,82,91,0.06)",
        };

  const graphConfig =
    GRAPH_TYPE_CONFIG[nodeTypeGraph] || GRAPH_TYPE_CONFIG.default;
  const baseColor =
    (selectedNode?.data?.nodeColor as string) || graphConfig.color;

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 64,
        bottom: 48,
        width: 280,
        zIndex: 50,
        background: "#bfb3ca",
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
              background: "#bfb3ca",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 0,
                  border: "2px solid #2c336c",
                  background: baseColor,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 16, fontWeight: 700, color: "#2c336c" }}>
                {selectedNode.data.label !== undefined &&
                selectedNode.data.label !== ""
                  ? String(selectedNode.data.label)
                  : "Unnamed Node"}
              </span>
            </div>
            <button
              onClick={() => useCanvasStore.setState({ rightPanelOpen: false })}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#2c336c",
                fontSize: 24,
                fontWeight: "bold",
                lineHeight: 1,
                padding: 4,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#636798")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#2c336c")
              }
            >
              ×
            </button>
          </div>

          {/* Section 1 — Details */}
          <Section title="Details">
            <div
              style={{
                padding: "4px 16px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <Field label="Name">
                <input
                  style={inputStyle}
                  value={
                    selectedNode.data.label !== undefined
                      ? String(selectedNode.data.label)
                      : String(config.label)
                  }
                  placeholder="Unnamed Node"
                  onChange={(e) => {
                    setNodes(
                      nodes.map((n) =>
                        n.id === selectedNodeId
                          ? { ...n, data: { ...n.data, label: e.target.value } }
                          : n,
                      ),
                    );
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = "4px 4px 0px 0px #2c336c";
                    e.target.style.transform = "translate(-2px, -2px)";
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = "2px 2px 0px 0px #2c336c";
                    e.target.style.transform = "translate(0px, 0px)";
                  }}
                />
              </Field>
              <Field label="Type">
                <CustomSelect
                  value={isCustomType ? "custom" : nodeTypeGraph}
                  options={typeOptions}
                  onChange={(v) => {
                    const newType = v === "custom" ? "" : v;
                    setNodes(
                      nodes.map((n) =>
                        n.id === selectedNodeId
                          ? {
                              ...n,
                              data: {
                                ...n.data,
                                type: newType,
                                nodeType: newType,
                              },
                            }
                          : n,
                      ),
                    );
                  }}
                />
                {isCustomType && (
                  <input
                    style={{ ...inputStyle, marginTop: 4, height: 32 }}
                    value={
                      nodeTypeGraphRaw === "custom"
                        ? ""
                        : String(nodeTypeGraphRaw)
                    }
                    placeholder="Enter custom type..."
                    onChange={(e) => {
                      setNodes(
                        nodes.map((n) =>
                          n.id === selectedNodeId
                            ? {
                                ...n,
                                data: {
                                  ...n.data,
                                  type: e.target.value,
                                  nodeType: e.target.value,
                                },
                              }
                            : n,
                        ),
                      );
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = "4px 4px 0px 0px #2c336c";
                      e.target.style.transform = "translate(-2px, -2px)";
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = "2px 2px 0px 0px #2c336c";
                      e.target.style.transform = "translate(0px, 0px)";
                    }}
                  />
                )}
              </Field>
              <Field label="Status">
                <CustomSelect
                  value={String(selectedNode.data.status || "")}
                  options={statusOptions}
                  onChange={(v) => {
                    setNodes(
                      nodes.map((n) =>
                        n.id === selectedNodeId
                          ? {
                              ...n,
                              data: { ...n.data, status: v },
                            }
                          : n,
                      ),
                    );
                  }}
                />
              </Field>

              <Field label="Description">
                <textarea
                  rows={3}
                  placeholder="Describe this service..."
                  style={{
                    ...inputStyle,
                    height: "auto",
                    padding: "8px 10px",
                    resize: "none",
                    lineHeight: 1.5,
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = "4px 4px 0px 0px #2c336c";
                    e.target.style.transform = "translate(-2px, -2px)";
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = "2px 2px 0px 0px #2c336c";
                    e.target.style.transform = "translate(0px, 0px)";
                  }}
                />
              </Field>
            </div>
          </Section>

          {/* Section 2 — Ownership */}
          <Section title="Ownership">
            <div style={{ padding: "4px 16px 12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 0,
                    background: baseColor,
                    border: `2px solid #2c336c`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#2c336c",
                    boxShadow: "2px 2px 0px 0px #2c336c",
                  }}
                >
                  {String(selectedNode.data.owner || "PK")}
                </div>
                <div>
                  <div
                    style={{ fontSize: 14, fontWeight: 700, color: "#2c336c" }}
                  >
                    Primary Owner
                  </div>
                  <div
                    style={{ fontSize: 12, fontWeight: 600, color: "#636798" }}
                  >
                    Lead Engineer
                  </div>
                </div>
              </div>
              <button
                style={{
                  width: "100%",
                  height: 36,
                  borderRadius: 0,
                  border: "2px dashed #2c336c",
                  background: "#f3f3f2",
                  color: "#2c336c",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  transition: "all 150ms",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderStyle = "solid";
                  (e.currentTarget as HTMLElement).style.background = "#ddb9ac";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "2px 2px 0px 0px #2c336c";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translate(-2px, -2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderStyle = "dashed";
                  (e.currentTarget as HTMLElement).style.background = "#f3f3f2";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translate(0px, 0px)";
                }}
              >
                + Assign owner
              </button>
            </div>
          </Section>

          {/* Section 3 — Tech Stack */}
          <Section title="Tech Stack">
            <div
              style={{
                padding: "4px 16px 12px",
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {(
                (TAG_EXAMPLES as Record<string, string[]>)[nodeTypeGraph] || [
                  "Node.js",
                  "REST",
                ]
              ).map((tag: string) => (
                <span
                  key={tag}
                  style={{
                    height: 26,
                    padding: "0 10px",
                    borderRadius: 0,
                    background: "#f3f3f2",
                    border: "2px solid #2c336c",
                    color: "#2c336c",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "2px 2px 0px 0px #2c336c",
                  }}
                >
                  {tag}
                </span>
              ))}
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#2c336c",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 4,
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#c78caf")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#2c336c")
                }
              >
                + Add tag
              </span>
            </div>
          </Section>

          {/* Section 4 — Metadata */}
          <Section title="Metadata">
            <div
              style={{
                padding: "4px 16px 12px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {[
                ["Created", "Today"],
                ["Modified", "Just now"],
                ["Connections", "3"],
                ["Upstream", "1"],
                ["Downstream", "2"],
                ["Status", "Online"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#2c336c",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: 4,
                    }}
                  >
                    {k}
                  </div>
                  {k === "Status" ? (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 0,
                        background: "#c78caf",
                        color: "#2c336c",
                        border: "2px solid #2c336c",
                        boxShadow: "2px 2px 0px 0px #2c336c",
                        display: "inline-block",
                      }}
                    >
                      {v}
                    </span>
                  ) : (
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#2c336c",
                      }}
                    >
                      {v}
                    </div>
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
