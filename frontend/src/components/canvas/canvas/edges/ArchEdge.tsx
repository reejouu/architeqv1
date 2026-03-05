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
    const entryOffset = data?.entryOffset as { dx: number; dy: number } | undefined;
    const edgeStyle = data?.edgeStyle as string | undefined;

    const strokeColor = selected ? "#2c336c" : "#636798";
    const strokeWidth = selected ? 3 : 2;
    const strokeDasharray = edgeStyle === "dashed" ? "6 6" : undefined;

    // ── Primary path: construct points dynamically relative to node positions ──
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
            <BaseEdge
                id={id}
                path={path}
                markerEnd={markerEnd}
                style={{
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                    strokeOpacity: 1,
                    strokeLinecap: "round",
                    strokeDasharray: strokeDasharray,
                    fill: "none",
                }}
            />
        );
    }

    // ── Fallback: React Flow smoothstep (when engine points unavailable) ──────
    const lane = (data?.lane as number) ?? 0;
    const [fallbackPath] = getSmoothStepPath({
        sourceX, sourceY, sourcePosition,
        targetX, targetY, targetPosition,
        borderRadius: 8,
        offset: 40 + lane * 14,
    });

    return (
        <BaseEdge
            id={id}
            path={fallbackPath}
            markerEnd={markerEnd}
            style={{
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeOpacity: 1,
                strokeDasharray: strokeDasharray,
                strokeLinecap: "round",
                fill: "none",
            }}
        />
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
