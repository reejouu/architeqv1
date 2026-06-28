"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCanvasStore } from "@/store/canvasStore";
import { useEffect, useRef } from "react";
import ArrowIcon from "../../../../public/icons/arrow/arrow";
import SolidArrowIcon from "../../../../public/icons/arrow/solid-arrow";
import DashedArrowIcon from "../../../../public/icons/arrow/dashed-arrow";

import FontIcon from "../../../../public/icons/font/font";
import BoldIcon from "../../../../public/icons/font/bold";
import ItalicIcon from "../../../../public/icons/font/italics";
import { GRAPH_TYPE_CONFIG } from "@/lib/graph/graphTransform";
import { COLOR_PALETTE } from "@/lib/constants/canvasConstants";
import LeaveConfirmModal from "../modals/LeaveConfirmModal";
import RenameProjectModal from "../modals/RenameProjectModal";
import UserMenu from "./UserMenu";

const DEFAULT_PROJECT_NAME = "Untitled Project";

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

function SelectIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
      <path d="m13 13 6 6" />
    </svg>
  );
}

export default function Toolbar() {
  const router = useRouter();
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [leaveSaving, setLeaveSaving] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameSaving, setRenameSaving] = useState(false);

  const {
    projectName,
    renameProject,
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
    fontFamily: defaultFontFamily,
    setFontFamily,
    nodeColor: defaultNodeColor,
    setNodeColor,
    selectedNodeId,
    selectedEdgeIds,
    nodes,
    edges,
    interactionMode,
    setInteractionMode,
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
  const fontFamily = selectedNode
    ? (selectedNode.data?.fontFamily as any) || "inter"
    : defaultFontFamily || "inter";
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
  const [nameHovered, setNameHovered] = useState(false);

  const [arrowMenuOpen, setArrowMenuOpen] = useState(false);
  const [fontFamilyMenuOpen, setFontFamilyMenuOpen] = useState(false);

  // Refs for click-outside detection
  const arrowRef = useRef<HTMLDivElement>(null);
  const fontFamilyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (arrowRef.current && !arrowRef.current.contains(e.target as Node)) {
        setArrowMenuOpen(false);
      }
      if (
        fontFamilyRef.current &&
        !fontFamilyRef.current.contains(e.target as Node)
      ) {
        setFontFamilyMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNameSave = () => {
    setEditingName(false);
    const trimmed = nameInput.trim();
    if (trimmed && trimmed !== projectName) renameProject(trimmed);
  };

  const handleSaveClick = () => {
    if (projectName === DEFAULT_PROJECT_NAME) {
      setRenameModalOpen(true);
    } else {
      triggerSave();
    }
  };

  const handleRenameModalSave = async (name: string) => {
    setRenameSaving(true);
    await renameProject(name);
    await triggerSave();
    setRenameSaving(false);
    setRenameModalOpen(false);
  };

  const handleRenameModalSkip = () => {
    setRenameModalOpen(false);
    triggerSave();
  };

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setLeaveConfirmOpen(true);
    } else {
      router.push("/");
    }
  };

  const handleSaveAndLeave = async () => {
    setLeaveSaving(true);
    await triggerSave();
    setLeaveSaving(false);
    setLeaveConfirmOpen(false);
    router.push("/");
  };

  const handleDiscardAndLeave = () => {
    setLeaveConfirmOpen(false);
    router.push("/");
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
        <button
          onClick={handleBackClick}
          style={{
            width: 32,
            height: 32,
            borderRadius: 0,
            border: "2px solid transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f3f3f2",
            background: "transparent",
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
        </button>

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
            <div
              onMouseEnter={() => setNameHovered(true)}
              onMouseLeave={() => setNameHovered(false)}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <span
                onClick={() => {
                  setNameInput(projectName);
                  setEditingName(true);
                }}
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#f3f3f2",
                  cursor: "text",
                }}
              >
                {projectName}
              </span>
              <button
                onClick={() => {
                  setNameInput(projectName);
                  setEditingName(true);
                }}
                title="Rename project"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.6)",
                  opacity: nameHovered ? 1 : 0,
                  transition: "opacity 150ms",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>
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

      {/* CENTER ZONE — Canvas Tools, grouped into two clusters */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Cluster A — Tools */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "4px 10px",
            background: "rgba(0,0,0,0.2)",
            border: "2px solid rgba(255,255,255,0.25)",
            borderRadius: 8,
          }}
        >
          {/* Select Tool */}
          <ToolButton
            title="Select (V)"
            active={interactionMode === "select"}
            onClick={() => {
              setInteractionMode("select");
              setArrowMenuOpen(false);
              setFontFamilyMenuOpen(false);
            }}
          >
            <div style={{ width: 18, height: 18, fill: "none" }}>
              <SelectIcon />
            </div>
          </ToolButton>

          {/* Edge Toggle / Dropdown */}
          <div ref={arrowRef} style={{ position: "relative" }}>
            <ToolButton
              title={`Select Edge Style`}
              active={interactionMode === "drawEdge" || arrowMenuOpen}
              onClick={() => {
                if (interactionMode === "drawEdge") {
                  setArrowMenuOpen(!arrowMenuOpen);
                } else {
                  setInteractionMode("drawEdge");
                }
                setFontFamilyMenuOpen(false);
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
                  background: "#f3f3f2",
                  border: "2px solid #2c336c",
                  borderRadius: 0,
                  padding: 4,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  boxShadow: "4px 4px 0px 0px #2c336c",
                  zIndex: 1000,
                  minWidth: 100,
                }}
              >
                {(["solid", "dashed"] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => {
                      setEdgeStyle(style);
                      setArrowMenuOpen(false);
                    }}
                    className="toolbar-dropdown-btn"
                    data-active={edgeStyle === style}
                    style={{
                      height: 32,
                      padding: "0 10px",
                      borderRadius: 0,
                      border: edgeStyle === style ? "2px solid #2c336c" : "2px solid transparent",
                      background: edgeStyle === style ? "#2c336c" : "transparent",
                      color: edgeStyle === style ? "#f3f3f2" : "#2c336c",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      whiteSpace: "nowrap",
                      fontWeight: 700,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                    title={style === "solid" ? "Solid Line" : "Dashed Line"}
                  >
                    <div style={{ width: 16, height: 16, fill: "currentColor", flexShrink: 0 }}>
                      {style === "dashed" ? <DashedArrowIcon /> : <SolidArrowIcon />}
                    </div>
                    {style === "solid" ? "Solid" : "Dashed"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lock Toggle */}
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
        </div>

        {/* Cluster B — Style */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "4px 10px",
            background: "rgba(0,0,0,0.2)",
            border: "2px solid rgba(255,255,255,0.25)",
            borderRadius: 8,
          }}
        >
          {/* Font Family Toggle / Dropdown */}
          <div ref={fontFamilyRef} style={{ position: "relative" }}>
            <ToolButton
              title={`Select Font Family`}
              active={fontFamilyMenuOpen}
              onClick={() => {
                setFontFamilyMenuOpen(!fontFamilyMenuOpen);

                setArrowMenuOpen(false);
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  lineHeight: 1,
                  fontWeight: 700,
                  fontFamily:
                    fontFamily === "comic"
                      ? "ComicNeueSansID, sans-serif"
                      : fontFamily === "montserrat"
                        ? "Montserrat, sans-serif"
                        : fontFamily === "poppins"
                          ? "Poppins, sans-serif"
                          : "var(--font-inter)",
                }}
              >
                Aa
              </div>
            </ToolButton>

            {fontFamilyMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: 8,
                  background: "#f3f3f2",
                  border: "2px solid #2c336c",
                  borderRadius: 0,
                  padding: 4,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  boxShadow: "4px 4px 0px 0px #2c336c",
                  zIndex: 1000,
                  minWidth: 120,
                }}
              >
                {([
                  { id: "inter", label: "Inter", family: "var(--font-inter)" },
                  { id: "comic", label: "Comic", family: "ComicNeueSansID, sans-serif" },
                  { id: "montserrat", label: "Montserrat", family: "Montserrat, sans-serif" },
                  { id: "poppins", label: "Poppins", family: "Poppins, sans-serif" },
                ] as const).map(({ id, label, family }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setFontFamily(id);
                      setFontFamilyMenuOpen(false);
                    }}
                    className="toolbar-dropdown-btn"
                    data-active={fontFamily === id}
                    style={{
                      height: 34,
                      padding: "0 10px",
                      borderRadius: 0,
                      border: fontFamily === id ? "2px solid #2c336c" : "2px solid transparent",
                      background: fontFamily === id ? "#2c336c" : "transparent",
                      color: fontFamily === id ? "#f3f3f2" : "#2c336c",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      whiteSpace: "nowrap",
                      fontFamily: family,
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: "0.02em",
                    }}
                    title={label}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bold Toggle */}
          <ToolButton
            title="Bold Text"
            active={fontStyle === "bold"}
            onClick={() => {
              setFontStyle(fontStyle === "bold" ? "normal" : "bold");
              setFontFamilyMenuOpen(false);
              setArrowMenuOpen(false);
            }}
          >
            <div style={{ width: 16, height: 16, fill: "currentColor" }}>
              <BoldIcon />
            </div>
          </ToolButton>

          {/* Italic Toggle */}
          <ToolButton
            title="Italic Text"
            active={fontStyle === "italic"}
            onClick={() => {
              setFontStyle(fontStyle === "italic" ? "normal" : "italic");
              setFontFamilyMenuOpen(false);
              setArrowMenuOpen(false);
            }}
          >
            <div style={{ width: 16, height: 16, fill: "currentColor" }}>
              <ItalicIcon />
            </div>
          </ToolButton>

          <div
            style={{
              width: 2,
              height: 24,
              background: "rgba(255,255,255,0.2)",
              margin: "0 2px",
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
        {/* Primary actions */}
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

        <button
          onClick={handleSaveClick}
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

        <UserMenu />
      </div>

      <LeaveConfirmModal
        open={leaveConfirmOpen}
        saving={leaveSaving}
        onSave={handleSaveAndLeave}
        onDiscard={handleDiscardAndLeave}
        onCancel={() => setLeaveConfirmOpen(false)}
      />

      <RenameProjectModal
        open={renameModalOpen}
        saving={renameSaving}
        onSave={handleRenameModalSave}
        onSkip={handleRenameModalSkip}
      />
    </div>
  );
}
