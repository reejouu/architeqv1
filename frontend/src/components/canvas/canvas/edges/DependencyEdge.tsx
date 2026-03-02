"use client";

import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react";

export default function DependencyEdge({
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
                    stroke: "#85755e",
                    strokeWidth: 1.5,
                    strokeOpacity: 0.5,
                    strokeDasharray: "4 4",
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
                stroke: "#85755e",
                strokeWidth: 1.5,
                strokeOpacity: 0.5,
                strokeDasharray: "4 4",
                strokeLinecap: "round",
            }}
        />
    );
}
