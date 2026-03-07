"use client";

import { useState } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { COLLABORATORS } from "@/lib/constants/canvasConstants";
import { useEffect, useRef } from "react";
import ArrowIcon from "../../../../public/icons/arrow/arrow";
import SolidArrowIcon from "../../../../public/icons/arrow/solid-arrow";
import DashedArrowIcon from "../../../../public/icons/arrow/dashed-arrow";
import FontIcon from "../../../../public/icons/font/font";
import BoldIcon from "../../../../public/icons/font/bold";
import ItalicIcon from "../../../../public/icons/font/italics";
import { GRAPH_TYPE_CONFIG } from "@/lib/graph/graphTransform";
import { COLOR_PALETTE } from "@/lib/constants/canvasConstants";

const ToolButton = ({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    title={title}
    onClick={onClick}
    style={{
      width: 32,
      height: 32,
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: active ? "rgba(255,255,255,0.25)" : "transparent",
      border: active
        ? "1px solid rgba(255,255,255,0.4)"
        : "1px solid transparent",
      color: "#f3f3f2",
      cursor: "pointer",
      transition: "all 150ms",
    }}
    onMouseEnter={(e) => {
      if (!active) {
        (e.currentTarget as HTMLElement).style.background =
          "rgba(255,255,255,0.15)";
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }
    }}
  >
    {children}
  </button>
);
export default function Toolbar() {
  const {
    projectName,
    setProjectName,
    openGenerateModal,
    saveStatus,
    hasUnsavedChanges,
    triggerSave,
    isLocked,
    setIsLocked,
    edgeStyle: defaultEdgeStyle,
    setEdgeStyle,
    fontStyle: defaultFontStyle,
    setFontStyle,
    nodeColor: defaultNodeColor,
    setNodeColor,
    selectedNodeId,
    selectedEdgeIds,
    nodes,
    edges,
  } = useCanvasStore();

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId)
    : null;
  const selectedEdge =
    selectedEdgeIds.length === 1
      ? edges.find((e) => e.id === selectedEdgeIds[0])
      : null;

  const fontStyle = selectedNode
    ? (selectedNode.data?.fontStyle as any) || "normal"
    : defaultFontStyle || "normal";
  const edgeStyle = selectedEdge
    ? (selectedEdge.data?.edgeStyle as any) || "solid"
    : defaultEdgeStyle || "solid";

  let nodeColor = defaultNodeColor;
  if (selectedNode) {
    if (selectedNode.data?.nodeColor) {
      nodeColor = selectedNode.data.nodeColor as string;
    } else {
      const nodeType = String(
        selectedNode.data?.nodeType || selectedNode.data?.type || "default",
      ).toLowerCase();
      nodeColor =
        GRAPH_TYPE_CONFIG[nodeType]?.color ||
        GRAPH_TYPE_CONFIG.default?.color ||
        defaultNodeColor;
    }
  }

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(projectName);

  const [arrowMenuOpen, setArrowMenuOpen] = useState(false);
  const [fontMenuOpen, setFontMenuOpen] = useState(false);

  // Refs for click-outside detection
  const arrowRef = useRef<HTMLDivElement>(null);
  const fontRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (arrowRef.current && !arrowRef.current.contains(e.target as Node)) {
        setArrowMenuOpen(false);
      }
      if (fontRef.current && !fontRef.current.contains(e.target as Node)) {
        setFontMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNameSave = () => {
    setProjectName(nameInput);
    setEditingName(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        zIndex: 100,
        background: "#636798",
        borderBottom: "3px solid #2c336c",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}
    >
      {/* LEFT ZONE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          minWidth: 280,
        }}
      >
        {/* Back button */}
        <a
          href="/"
          style={{
            width: 32,
            height: 32,
            borderRadius: 0,
            border: "2px solid transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f3f3f2",
            cursor: "pointer",
            transition: "all 150ms",
            textDecoration: "none",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.15)";
            (e.currentTarget as HTMLElement).style.color = "#f3f3f2";
            (e.currentTarget as HTMLElement).style.border =
              "2px solid rgba(255,255,255,0.3)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
            (e.currentTarget as HTMLElement).style.transform = "none";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#f3f3f2";
            (e.currentTarget as HTMLElement).style.border =
              "2px solid transparent";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
            (e.currentTarget as HTMLElement).style.transform = "none";
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </a>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              fontWeight: 700,
            }}
          >
            Architeq
          </span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
            /
          </span>
          {editingName ? (
            <input
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#2c336c",
                background: "#f3f3f2",
                border: "2px solid #2c336c",
                boxShadow: "2px 2px 0px 0px rgba(0,0,0,0.3)",
                outline: "none",
                padding: "2px 6px",
                width: Math.max(100, nameInput.length * 8 + 12),
              }}
            />
          ) : (
            <span
              onClick={() => setEditingName(true)}
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#f3f3f2",
                cursor: "text",
              }}
            >
              {projectName}
            </span>
          )}

          {/* Unsaved dot */}
          {hasUnsavedChanges && (
            <div
              title="Unsaved changes"
              style={{
                width: 8,
                height: 8,
                borderRadius: 0,
                background: "#c78caf",
                border: "1px solid #2c336c",
                flexShrink: 0,
              }}
            />
          )}
        </div>
      </div>

      {/* CENTER ZONE — Canvas Tools (Excalidraw style) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "4px 12px",
          background: "rgba(0,0,0,0.2)",
          border: "2px solid rgba(255,255,255,0.25)",
          borderRadius: 8,
        }}
      >
        {/* Edge Toggle / Dropdown */}
        <div ref={arrowRef} style={{ position: "relative" }}>
          <ToolButton
            title={`Select Edge Style`}
            active={arrowMenuOpen}
            onClick={() => {
              setArrowMenuOpen(!arrowMenuOpen);
              setFontMenuOpen(false);
            }}
          >
            <div style={{ width: 18, height: 18, fill: "currentColor" }}>
              {edgeStyle === "dashed" ? (
                <DashedArrowIcon />
              ) : (
                <SolidArrowIcon />
              )}
            </div>
          </ToolButton>

          {arrowMenuOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: 8,
                background: "#2c336c",
                border: "2px solid rgba(255,255,255,0.2)",
                borderRadius: 6,
                padding: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                zIndex: 1000,
              }}
            >
              {edgeStyle !== "solid" && (
                <button
                  onClick={() => {
                    setEdgeStyle("solid");
                    setArrowMenuOpen(false);
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 4,
                    border: "none",
                    background: "transparent",
                    color: "#f3f3f2",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Solid Line"
                >
                  <div style={{ width: 18, height: 18, fill: "currentColor" }}>
                    <SolidArrowIcon />
                  </div>
                </button>
              )}
              {edgeStyle !== "dashed" && (
                <button
                  onClick={() => {
                    setEdgeStyle("dashed");
                    setArrowMenuOpen(false);
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 4,
                    border: "none",
                    background: "transparent",
                    color: "#f3f3f2",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Dashed Line"
                >
                  <div style={{ width: 18, height: 18, fill: "currentColor" }}>
                    <DashedArrowIcon />
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Font Style Toggle / Dropdown */}
        <div ref={fontRef} style={{ position: "relative" }}>
          <ToolButton
            title={`Select Font Style`}
            active={fontMenuOpen}
            onClick={() => {
              setFontMenuOpen(!fontMenuOpen);
              setArrowMenuOpen(false);
            }}
          >
            <div style={{ width: 18, height: 18, fill: "currentColor" }}>
              {fontStyle === "bold" ? (
                <BoldIcon />
              ) : fontStyle === "italic" ? (
                <ItalicIcon />
              ) : (
                <FontIcon />
              )}
            </div>
          </ToolButton>

          {fontMenuOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: 8,
                background: "#2c336c",
                border: "2px solid rgba(255,255,255,0.2)",
                borderRadius: 6,
                padding: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                zIndex: 1000,
              }}
            >
              {fontStyle !== "normal" && (
                <button
                  onClick={() => {
                    setFontStyle("normal");
                    setFontMenuOpen(false);
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 4,
                    border: "none",
                    background: "transparent",
                    color: "#f3f3f2",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Normal Text"
                >
                  <div style={{ width: 18, height: 18, fill: "currentColor" }}>
                    <FontIcon />
                  </div>
                </button>
              )}
              {fontStyle !== "bold" && (
                <button
                  onClick={() => {
                    setFontStyle("bold");
                    setFontMenuOpen(false);
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 4,
                    border: "none",
                    background: "transparent",
                    color: "#f3f3f2",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Bold Text"
                >
                  <div style={{ width: 18, height: 18, fill: "currentColor" }}>
                    <BoldIcon />
                  </div>
                </button>
              )}
              {fontStyle !== "italic" && (
                <button
                  onClick={() => {
                    setFontStyle("italic");
                    setFontMenuOpen(false);
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 4,
                    border: "none",
                    background: "transparent",
                    color: "#f3f3f2",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Italic Text"
                >
                  <div style={{ width: 18, height: 18, fill: "currentColor" }}>
                    <ItalicIcon />
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        <div
          style={{
            width: 2,
            height: 24,
            background: "rgba(255,255,255,0.2)",
            margin: "0 4px",
          }}
        />

        <ToolButton
          title={isLocked ? "Unlock canvas" : "Lock canvas"}
          onClick={() => setIsLocked(!isLocked)}
          active={isLocked}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            {isLocked ? (
              <>
                <rect x="3" y="11" width="18" height="11" rx="0" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </>
            ) : (
              <>
                <rect x="3" y="11" width="18" height="11" rx="0" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              </>
            )}
          </svg>
        </ToolButton>

        {/* Separator */}
        <div
          style={{
            width: 2,
            height: 24,
            background: "rgba(255,255,255,0.2)",
            margin: "0 4px",
          }}
        />

        {/* Color Palette */}
        <div style={{ display: "flex", gap: 6 }}>
          {COLOR_PALETTE.map((color) => (
            <div
              key={color}
              onClick={() => setNodeColor(color)}
              title={color}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: color,
                cursor: "pointer",
                border:
                  nodeColor === color
                    ? "3px solid #636798"
                    : "2px solid rgba(255,255,255,0.4)",
                boxShadow: nodeColor === color ? `0 0 0 2px #ffffff` : "none",
                transition: "all 150ms",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            />
          ))}
        </div>
      </div>

      {/* RIGHT ZONE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          minWidth: 280,
          justifyContent: "flex-end",
        }}
      >
        {/* Collaborator avatars */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {COLLABORATORS.map((c, i) => (
            <div
              key={c.initials}
              title={c.name}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: c.color,
                border: "2px solid #3d4270",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                color: "#fff",
                marginLeft: i === 0 ? 0 : -8,
                zIndex: COLLABORATORS.length - i,
                cursor: "default",
                flexShrink: 0,
              }}
            >
              {c.initials}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 24,
            background: "rgba(255,255,255,0.3)",
            margin: "0 8px",
          }}
        />

        {/* Share button */}
        <button
          style={{
            height: 32,
            padding: "0 14px",
            borderRadius: 0,
            border: "2px solid rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.1)",
            color: "#f3f3f2",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "none",
            transition: "all 150ms",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.2)";
            (e.currentTarget as HTMLElement).style.transform = "none";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.1)";
            (e.currentTarget as HTMLElement).style.transform =
              "translate(0, 0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Share
        </button>

        {/* Generate button */}
        <button
          onClick={openGenerateModal}
          style={{
            height: 32,
            padding: "0 14px",
            borderRadius: 0,
            border: "2px solid #2c336c",
            background: "#c78caf",
            color: "#2c336c",
            boxShadow: "3px 3px 0px 0px rgba(0,0,0,0.25)",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 150ms",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#bf979e";
            (e.currentTarget as HTMLElement).style.transform =
              "translate(-1px, -1px)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "5px 5px 0px 0px rgba(0,0,0,0.25)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#c78caf";
            (e.currentTarget as HTMLElement).style.transform =
              "translate(0px, 0px)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "3px 3px 0px 0px rgba(0,0,0,0.25)";
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Generate
        </button>

        {/* Divider */}
        <div
          style={{
            width: 2,
            height: 24,
            background: "#2c336c",
            margin: "0 8px",
          }}
        />

        {/* Save status */}
        <button
          onClick={triggerSave}
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#f3f3f2",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            minWidth: 60,
          }}
        >
          {saveStatus === "saving" && (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="animate-spin"
              >
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Saving...
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ color: "#10B981" }}>Saved</span>
            </>
          )}
          {saveStatus === "idle" && "Save"}
        </button>
      </div>
    </div>
  );
}
