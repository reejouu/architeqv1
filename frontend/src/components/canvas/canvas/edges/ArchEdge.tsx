"use client";

import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react";

/**
 * ArchEdge — reads pre-computed exit/entry points from the layout engine.
 *
 * The engine stores:
 *   edge.data.exitPoint   = { x, y } — exact pixel position on source node boundary
 *   edge.data.entryPoint  = { x, y } — exact pixel position on target node boundary
 *   edge.data.waypoints   = [{ x, y }, ...] — intermediate routing points
 *   edge.data.parallelOffset = number — horizontal shift for parallel edges
 *
 * These are used to build an orthogonal SVG path directly,
 * bypassing React Flow's handle system entirely.
 */
export default function ArchEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  selected,
}: EdgeProps) {
  const exit = data?.exitPoint as { x: number; y: number } | undefined;
  const entry = data?.entryPoint as { x: number; y: number } | undefined;
  const waypoints = (data?.waypoints as { x: number; y: number }[]) ?? [];
  const offset = (data?.parallelOffset as number) ?? 0;
  const exitPort = data?.exitPort as string | undefined;
  const entryPort = data?.entryPort as string | undefined;
  const routingType = data?.routingType as string | undefined;

  const exitOffset = data?.exitOffset as { dx: number; dy: number } | undefined;
  const entryOffset = data?.entryOffset as
    | { dx: number; dy: number }
    | undefined;
  const edgeStyle = data?.edgeStyle as string | undefined;

  const strokeColor = selected ? "#a8567e" : "#636798";
  const strokeWidth = selected ? 3 : 2;
  const strokeDasharray = edgeStyle === "dashed" ? "6 6" : undefined;

  const laneY = data?.laneY as number | undefined;

  // ── 0. ELK route (preferred): draw the orthogonal polyline ELK computed.
  //        ELK points share the canvas/flow coordinate space, so they render directly.
  const elkPoints = data?.points as { x: number; y: number }[] | undefined;
  if (elkPoints && elkPoints.length >= 2) {
    // Anchor the endpoints to React Flow's LIVE handle positions (which always track
    // the actual rendered node) plus the per-edge offset, so arrows can never land in
    // blank space even if the precomputed absolute coords drift. ELK's interior bends
    // (re-aligned to the anchored x) still shape the route.
    const sx = sourceX + (exitOffset?.dx ?? 0);
    const tx = targetX + (entryOffset?.dx ?? 0);
    const interior = elkPoints.slice(1, -1).map((p) => ({ ...p }));
    if (interior.length) {
      interior[0].x = sx;
      interior[interior.length - 1].x = tx;
    }
    const anchored = [{ x: sx, y: sourceY }, ...interior, { x: tx, y: targetY }];
    const path = buildOrthogonalPath(anchored, 8);
    return (
      <>
        <defs>
          <marker
            id={`archArrowSelected-${id}`}
            viewBox="-10 -10 20 20"
            refX="0"
            refY="0"
            markerWidth="12.5"
            markerHeight="12.5"
            markerUnits="strokeWidth"
            orient="auto-start-reverse"
          >
            <polyline
              strokeLinecap="round"
              strokeLinejoin="round"
              points="-5,-4 0,0 -5,4 -5,-4"
              style={{ stroke: "#a8567e", fill: "#a8567e", strokeWidth: 1 }}
            />
          </marker>
        </defs>
        <BaseEdge
          id={id}
          path={path}
          markerEnd={selected ? `url(#archArrowSelected-${id})` : markerEnd}
          style={{
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            strokeOpacity: 1,
            strokeLinecap: "round",
            strokeDasharray: strokeDasharray,
            fill: "none",
          }}
        />
      </>
    );
  }

  // ── 1b. Renderer-lane path: draw the whole mid-run at a derived corridor y so
  //         independent edges in the same corridor never overlap (no waypoints added).
  if (laneY != null) {
    const sx = sourceX + (exitOffset?.dx ?? 0) + offset;
    const sy = sourceY + (exitOffset?.dy ?? 0);
    const tx = targetX + (entryOffset?.dx ?? 0) + offset;
    const ty = targetY + (entryOffset?.dy ?? 0);
    const path = buildOrthogonalPath(
      [
        { x: sx, y: sy },
        { x: sx, y: laneY },
        { x: tx, y: laneY },
        { x: tx, y: ty },
      ],
      8,
    );
    return (
      <>
        <defs>
          <marker
            id={`archArrowSelected-${id}`}
            viewBox="-10 -10 20 20"
            refX="0"
            refY="0"
            markerWidth="12.5"
            markerHeight="12.5"
            markerUnits="strokeWidth"
            orient="auto-start-reverse"
          >
            <polyline
              strokeLinecap="round"
              strokeLinejoin="round"
              points="-5,-4 0,0 -5,4 -5,-4"
              style={{ stroke: "#a8567e", fill: "#a8567e", strokeWidth: 1 }}
            />
          </marker>
        </defs>
        <BaseEdge
          id={id}
          path={path}
          markerEnd={selected ? `url(#archArrowSelected-${id})` : markerEnd}
          style={{
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            strokeOpacity: 1,
            strokeLinecap: "round",
            strokeDasharray: strokeDasharray,
            fill: "none",
          }}
        />
      </>
    );
  }

  // ── 2. Primary Orthogonal path (Engine routed) ─────────────────────────────
  if (exitOffset && entryOffset && routingType !== "smoothstep") {
    // Calculate the absolute handle positions based on live node coords + layout engine offsets
    const liveExitX = sourceX + exitOffset.dx;
    const liveExitY = sourceY + exitOffset.dy;

    const liveEntryX = targetX + entryOffset.dx;
    const liveEntryY = targetY + entryOffset.dy;

    const allPoints = [
      { x: liveExitX + offset, y: liveExitY },
      ...waypoints,
      { x: liveEntryX + offset, y: liveEntryY },
    ];

    let cornerRadius = 8;
    if (waypoints.length > 0) {
      cornerRadius = 2;
    } else if (exitPort === "bottom" && entryPort === "top") {
      cornerRadius = 4;
    } else if (exitPort === "right" || exitPort === "left") {
      cornerRadius = 12;
    }

    const path = buildOrthogonalPath(allPoints, cornerRadius);

    return (
      <>
        <defs>
          <marker
            id={`archArrowSelected-${id}`}
            viewBox="-10 -10 20 20"
            refX="0"
            refY="0"
            markerWidth="12.5"
            markerHeight="12.5"
            markerUnits="strokeWidth"
            orient="auto-start-reverse"
          >
            <polyline
              strokeLinecap="round"
              strokeLinejoin="round"
              points="-5,-4 0,0 -5,4 -5,-4"
              style={{ stroke: "#a8567e", fill: "#a8567e", strokeWidth: 1 }}
            />
          </marker>
        </defs>
        <BaseEdge
          id={id}
          path={path}
          markerEnd={selected ? `url(#archArrowSelected-${id})` : markerEnd}
          style={{
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            strokeOpacity: 1,
            strokeLinecap: "round",
            strokeDasharray: strokeDasharray,
            fill: "none",
          }}
        />
      </>
    );
  }

  // ── 3. Fallback: React Flow smoothstep (when engine points unavailable) ────
  const lane = (data?.lane as number) ?? 0;
  const [fallbackPath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
    offset: 40 + lane * 14,
  });

  return (
    <>
      <defs>
        <marker
          id={`archArrowSelected-${id}`}
          viewBox="-10 -10 20 20"
          refX="0"
          refY="0"
          markerWidth="12.5"
          markerHeight="12.5"
          markerUnits="strokeWidth"
          orient="auto-start-reverse"
        >
          <polyline
            strokeLinecap="round"
            strokeLinejoin="round"
            points="-5,-4 0,0 -5,4 -5,-4"
            style={{ stroke: "#a8567e", fill: "#a8567e", strokeWidth: 1 }}
          />
        </marker>
      </defs>
      <BaseEdge
        id={id}
        path={fallbackPath}
        markerEnd={selected ? `url(#archArrowSelected-${id})` : markerEnd}
        style={{
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeOpacity: 1,
          strokeDasharray: strokeDasharray,
          strokeLinecap: "round",
          fill: "none",
        }}
      />
    </>
  );
}

// ── Orthogonal path builder ───────────────────────────────────────────────────

function buildOrthogonalPath(
  pts: { x: number; y: number }[],
  cornerRadius: number,
): string {
  if (pts.length < 2) return "";

  let d = `M ${f(pts[0].x)} ${f(pts[0].y)}`;

  for (let i = 0; i < pts.length - 1; i++) {
    d += segment(pts[i], pts[i + 1], cornerRadius);
  }

  return d;
}

function segment(
  from: { x: number; y: number },
  to: { x: number; y: number },
  r: number,
): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  // Pure vertical or horizontal — no bend needed
  if (Math.abs(dx) < 1) return ` L ${f(to.x)} ${f(to.y)}`;
  if (Math.abs(dy) < 1) return ` L ${f(to.x)} ${f(to.y)}`;

  // Route: vertical first → horizontal → vertical
  const midY = (from.y + to.y) / 2;
  const cr = Math.min(r, Math.abs(dy) / 2 - 1, Math.abs(dx) / 2 - 1);
  const sx = dx > 0 ? 1 : -1;
  const sy = dy > 0 ? 1 : -1;

  return (
    ` L ${f(from.x)} ${f(midY - sy * cr)}` +
    ` Q ${f(from.x)} ${f(midY)} ${f(from.x + sx * cr)} ${f(midY)}` +
    ` L ${f(to.x - sx * cr)} ${f(midY)}` +
    ` Q ${f(to.x)} ${f(midY)} ${f(to.x)} ${f(midY + sy * cr)}` +
    ` L ${f(to.x)} ${f(to.y)}`
  );
}

// Round to 2 decimal places to keep SVG path strings clean
function f(n: number): string {
  return Math.round(n * 100) / 100 + "";
}
