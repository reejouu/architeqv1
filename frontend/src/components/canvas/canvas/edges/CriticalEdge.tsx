"use client";

import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react";

export default function CriticalEdge({
    id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, markerEnd
}: EdgeProps) {
    const edgePath = data?.routedPath as string | undefined;

    if (edgePath) {
        return (
            <BaseEdge
                id={id}
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    stroke: "#c78caf",
                    strokeWidth: 2,
                    strokeOpacity: 0.7,
                    strokeLinecap: "round",
                }}
            />
        );
    }

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
                stroke: "#c78caf",
                strokeWidth: 2,
                strokeOpacity: 0.7,
                strokeDasharray: "8 8",
                strokeLinecap: "round",
            }}
        />
    );
}
