"use client";

import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react";

/**
 * ArchEdge — Excalidraw-style orthogonal edge with:
 *   - Dashed stroke with arrowhead
 *   - Uses pre-computed SVG path from edgePaths store if available
 *   - Falls back to getSmoothStepPath otherwise
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
}: EdgeProps) {
    // Check if we have a pre-computed path from the routing engine
    const edgePath = data?.routedPath as string | undefined;

    if (edgePath) {
        // Use the pre-computed orthogonal path
        return (
            <BaseEdge
                id={id}
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    stroke: "#0000",
                    strokeWidth: 2,
                    strokeOpacity: 1,
                    strokeLinecap: "round",
                }}
            />
        );
    }

    // Fallback: standard smooth step path
    const lane = (data?.lane as number) || 0;
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
                stroke: "#636798",
                strokeWidth: 1.5,
                strokeOpacity: 0.6,
                strokeDasharray: "6 6",
                strokeLinecap: "round",
            }}
        />
    );
}
