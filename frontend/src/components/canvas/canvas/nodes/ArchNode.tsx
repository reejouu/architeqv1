"use client";

import { useEffect, useRef, useState } from "react";
import {
  Handle,
  Position,
  NodeProps,
  NodeToolbar,
  NodeResizer,
  useReactFlow,
} from "@xyflow/react";
import { useCanvasStore } from "@/store/canvasStore";
import { GRAPH_TYPE_CONFIG, STATUS_CONFIG } from "@/lib/graph/graphTransform";
import { NODE_TYPES_CONFIG } from "@/lib/constants/canvasConstants";

const ToolBtn = ({
  title,
  children,
  onClick,
  danger,
}: {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) => (
  <button
    title={title}
    onClick={onClick}
    style={{
      width: 26,
      height: 26,
      borderRadius: 0,
      border: "2px solid #2c336c",
      background: danger ? "#bf979e" : "#ffffff",
      color: "#2c336c",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 150ms",
      boxShadow: "2px 2px 0px 0px #2c336c",
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.background = danger
        ? "#e0b0b8"
        : "#f3f3f2";
      (e.currentTarget as HTMLElement).style.transform =
        "translate(-1px, -1px)";
      (e.currentTarget as HTMLElement).style.boxShadow =
        "3px 3px 0px 0px #2c336c";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.background = danger
        ? "#bf979e"
        : "#ffffff";
      (e.currentTarget as HTMLElement).style.transform = "translate(0, 0)";
      (e.currentTarget as HTMLElement).style.boxShadow =
        "2px 2px 0px 0px #2c336c";
    }}
  >
    {children}
  </button>
);

export default function ArchNode({
  id,
  data,
  selected,
  width,
  height,
}: NodeProps) {
  // Support both old canvasConstants format (data.type) and new AI JSON format (data.nodeType)
  const nodeType = String(
    data.nodeType || data.type || "default",
  ).toLowerCase();
  const config =
    NODE_TYPES_CONFIG[nodeType as keyof typeof NODE_TYPES_CONFIG] ||
    GRAPH_TYPE_CONFIG[nodeType] ||
    GRAPH_TYPE_CONFIG.default;
  const label =
    data.label !== undefined && data.label !== ""
      ? String(data.label)
      : "Unnamed Node";
  const owner = String(data.owner || "");
  const status = String(data.status || "");
  const statusStyle = STATUS_CONFIG[status];

  // Custom styles from Toolbar Excalidraw-like tools
  const customColor = data.nodeColor as string | undefined;
  const fontStyle = data.fontStyle as "normal" | "bold" | "italic" | undefined;
  const fontFamily = data.fontFamily as
    | "inter"
    | "comic"
    | "montserrat"
    | "poppins"
    | undefined;

  // Resolve final color (custom overrides config)
  const baseColor = customColor || config.color;
  const isLightBg =
    baseColor.toLowerCase() === "#f3f3f2" ||
    baseColor.toLowerCase() === "#ffffff";

  const [hovered, setHovered] = useState(false);
  const [pulse, setPulse] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { deleteElements } = useReactFlow();
  const { addNode, nodes, interactionMode, selectedNodeIds } = useCanvasStore();

  // Ambient pulse every 4–6s
  useEffect(() => {
    const delay = 4000 + Math.random() * 2000;
    const tick = () => {
      setPulse(true);
      setTimeout(() => setPulse(false), 800);
    };
    intervalRef.current = setInterval(tick, delay);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleDelete = () => deleteElements({ nodes: [{ id }] });

  const handleDuplicate = () => {
    const thisNode = nodes.find((n) => n.id === id);
    if (!thisNode) return;
    addNode({
      ...thisNode,
      id: `node-${Date.now()}`,
      position: { x: thisNode.position.x + 30, y: thisNode.position.y + 30 },
      selected: false,
    });
  };

  const glowOpacity = pulse ? 0.35 : selected ? 0.3 : hovered ? 0.25 : 0.1;
  const borderColor = selected || hovered ? baseColor : config.borderColor;

  return (
    <>
      {/* ── Resize handles (visible when selected) ── */}
      <NodeResizer
        isVisible={selected}
        minWidth={140}
        minHeight={60}
        lineStyle={{
          border: "none",
          borderRadius: 0,
        }}
        handleStyle={{
          width: 12,
          height: 12,
          borderRadius: 0,
          background: "#c78caf",
          border: "2px solid #2c336c",
          boxShadow: "2px 2px 0px 0px #2c336c",
          zIndex: 10,
        }}
      />

      {/* ── Floating toolbar (NodeToolbar = auto pan/zoom aware) ── */}
      <NodeToolbar
        isVisible={selected && interactionMode !== "drawEdge" && selectedNodeIds.length <= 1}
        position={Position.Top}
        offset={10}
      >
        <div
          style={{
            background: "#c78caf",
            border: "2px solid #2c336c",
            borderRadius: 0,
            padding: "4px 6px",
            display: "flex",
            gap: 4,
            alignItems: "center",
            boxShadow: "3px 3px 0px 0px #2c336c",
          }}
        >
          <ToolBtn
            title="Edit node"
            onClick={() => useCanvasStore.setState({ rightPanelOpen: true })}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </ToolBtn>
          <ToolBtn
            title="Assign owner"
            onClick={() => useCanvasStore.setState({ rightPanelOpen: true })}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </ToolBtn>
          <ToolBtn title="Add connection">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </ToolBtn>
          <div
            style={{
              width: 2,
              height: 20,
              background: "#2c336c",
              margin: "0 2px",
            }}
          />
          <ToolBtn title="Duplicate (⌘D)" onClick={handleDuplicate}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </ToolBtn>
          <ToolBtn title="Delete (⌫)" onClick={handleDelete} danger>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2-2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </ToolBtn>
        </div>
      </NodeToolbar>

      {/* ── Node container (handles transform & position) ── */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: width ? "100%" : 240,
          height: height ? "100%" : undefined,
          minWidth: 140,
          minHeight: 70,
          position: "relative",
          transform:
            selected && interactionMode !== "drawEdge"
              ? "translate(-5px, -5px)"
              : hovered && interactionMode !== "drawEdge"
                ? "translate(-2px, -2px)"
                : "translate(0, 0)",
          transition: "transform 200ms",
        }}
      >
        {/* ── Node Visual Body ── */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 14,
            background: "#ffffff",
            border: `2.5px solid #2c336c`,
            boxShadow:
              selected && interactionMode !== "drawEdge"
                ? "6px 6px 0px 0px #2c336c"
                : hovered
                  ? "4px 4px 0px 0px #2c336c"
                  : "3px 3px 0px 0px #2c336c",
            cursor: "pointer",
            userSelect: "none",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            transition: "box-shadow 200ms",
          }}
        >
          {/* ── Colored header band ── */}
          <div
            style={{
              background: baseColor,
              borderBottom: "3px solid #2c336c",
              padding: "11px 12px 11px 14px",
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              flexShrink: 0,
            }}
          >
            {/* Node label */}
            <span
              style={{
                fontSize: 15,
                fontWeight:
                  fontStyle === "bold"
                    ? 900
                    : fontStyle === "italic"
                      ? 500
                      : 500,
                fontStyle: fontStyle === "italic" ? "italic" : "normal",
                fontFamily:
                  fontFamily === "comic"
                    ? "ComicNeueSansID, sans-serif"
                    : fontFamily === "montserrat"
                      ? "Montserrat, sans-serif"
                      : fontFamily === "poppins"
                        ? "Poppins, sans-serif"
                        : "var(--font-inter)",
                color: isLightBg ? "#2c336c" : "#ffffff",
                flex: 1,
                lineHeight: 1.25,
                wordBreak: "break-word",
                whiteSpace: "normal",
                textShadow: isLightBg ? "none" : "1px 1px 0px rgba(0,0,0,0.25)",
                letterSpacing: fontStyle === "bold" ? "-0.01em" : "0.01em",
                transition: "all 0.2s ease",
              }}
            >
              {label}
            </span>

            {/* Badges (priority + owner) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                alignItems: "flex-end",
                flexShrink: 0,
              }}
            >
              {!!data.priorityScore && (
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 0,
                    background:
                      Number(data.priorityScore) === 1
                        ? "#EF4444"
                        : Number(data.priorityScore) === 2
                          ? "#F59E0B"
                          : "#10B981",
                    border: "2px solid #2c336c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 800,
                    fontFamily:
                      fontFamily === "comic"
                        ? "ComicNeueSansID, sans-serif"
                        : fontFamily === "montserrat"
                          ? "Montserrat, sans-serif"
                          : fontFamily === "poppins"
                            ? "Poppins, sans-serif"
                            : "var(--font-inter)",
                    color: "#ffffff",
                    boxShadow: "2px 2px 0px 0px rgba(0,0,0,0.3)",
                  }}
                  title={`Priority: P${String(data.priorityScore || "")}`}
                >
                  P{String(data.priorityScore || "")}
                </div>
              )}
              {owner && (
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 0,
                    background: "#2c336c",
                    border: "2px solid rgba(255,255,255,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily:
                      fontFamily === "comic"
                        ? "ComicNeueSansID, sans-serif"
                        : fontFamily === "montserrat"
                          ? "Montserrat, sans-serif"
                          : fontFamily === "poppins"
                            ? "Poppins, sans-serif"
                            : "var(--font-inter)",
                    color: "#ffffff",
                    boxShadow: "2px 2px 0px 0px rgba(0,0,0,0.3)",
                  }}
                  title={`Owner: ${owner}`}
                >
                  {owner.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* ── White footer strip: type + status ── */}
          <div
            style={{
              padding: "7px 12px",
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
              flex: 1,
              background: "#f3f3f2",
            }}
          >
            {/* Node type pill */}
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                fontFamily:
                  fontFamily === "comic"
                    ? "ComicNeueSansID, sans-serif"
                    : fontFamily === "montserrat"
                      ? "Montserrat, sans-serif"
                      : fontFamily === "poppins"
                        ? "Poppins, sans-serif"
                        : "var(--font-inter)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: isLightBg ? "#2c336c" : "#ffffff",
                background: baseColor,
                border: "1.5px solid #2c336c",
                borderRadius: 6,
                padding: "3px 9px",
                boxShadow: "2px 2px 0px 0px #2c336c",
              }}
            >
              {nodeType}
            </span>
            {/* Status pill */}
            {status && statusStyle && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily:
                    fontFamily === "comic"
                      ? "ComicNeueSansID, sans-serif"
                      : fontFamily === "montserrat"
                        ? "Montserrat, sans-serif"
                        : fontFamily === "poppins"
                          ? "Poppins, sans-serif"
                          : "var(--font-inter)",
                  color: "#2c336c",
                  background: statusStyle.bg,
                  border: "1.5px solid #2c336c",
                  borderRadius: 6,
                  padding: "3px 9px",
                  boxShadow: "1px 1px 0px 0px #2c336c",
                }}
              >
                {status}
              </span>
            )}
            {/* Owner text */}
            {owner && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily:
                    fontFamily === "comic"
                      ? "ComicNeueSansID, sans-serif"
                      : fontFamily === "montserrat"
                        ? "Montserrat, sans-serif"
                        : fontFamily === "poppins"
                          ? "Poppins, sans-serif"
                          : "var(--font-inter)",
                  color: "#636798",
                  marginLeft: "auto",
                  whiteSpace: "nowrap",
                }}
              >
                {owner}
              </span>
            )}
          </div>
        </div>

        {/* ── 4-Way Handles ── */}
        {/* Top */}
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          style={{
            opacity: 0,
            width: 40,
            height: 40,
            border: "none",
            zIndex: 9,
          }}
        />
        <Handle
          type="source"
          position={Position.Top}
          id="top"
          style={{
            width: 40,
            height: 40,
            background: "transparent",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: baseColor,
              border: "3px solid #2c336c",
              opacity: hovered && interactionMode === "drawEdge" ? 1 : 0,
              transition: "all 150ms",
            }}
          />
        </Handle>

        {/* Right */}
        <Handle
          type="target"
          position={Position.Right}
          id="right"
          style={{
            opacity: 0,
            width: 40,
            height: 40,
            border: "none",
            zIndex: 9,
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          style={{
            width: 40,
            height: 40,
            background: "transparent",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: baseColor,
              border: "3px solid #2c336c",
              opacity: hovered && interactionMode === "drawEdge" ? 1 : 0,
              transition: "all 150ms",
            }}
          />
        </Handle>

        {/* Bottom */}
        <Handle
          type="target"
          position={Position.Bottom}
          id="bottom"
          style={{
            opacity: 0,
            width: 40,
            height: 40,
            border: "none",
            zIndex: 9,
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          style={{
            width: 40,
            height: 40,
            background: "transparent",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: baseColor,
              border: "3px solid #2c336c",
              opacity: hovered && interactionMode === "drawEdge" ? 1 : 0,
              transition: "all 150ms",
            }}
          />
        </Handle>

        {/* Left */}
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          style={{
            opacity: 0,
            width: 40,
            height: 40,
            border: "none",
            zIndex: 9,
          }}
        />
        <Handle
          type="source"
          position={Position.Left}
          id="left"
          style={{
            width: 40,
            height: 40,
            background: "transparent",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: baseColor,
              border: "3px solid #2c336c",
              opacity: hovered && interactionMode === "drawEdge" ? 1 : 0,
              transition: "all 150ms",
            }}
          />
        </Handle>
      </div>
    </>
  );
}
