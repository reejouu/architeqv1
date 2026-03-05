"use client";

import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react";

export default function DependencyEdge({
    id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, markerEnd, selected
}: EdgeProps) {
    const edgePath = data?.routedPath as string | undefined;

    if (edgePath) {
        return (
            <BaseEdge
                id={id}
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    stroke: selected ? "#2c336c" : "#85755e",
                    strokeWidth: selected ? 3 : 1.5,
                    strokeOpacity: selected ? 1 : 0.5,
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
                stroke: selected ? "#2c336c" : "#85755e",
                strokeWidth: selected ? 3 : 1.5,
                strokeOpacity: selected ? 1 : 0.5,
                strokeDasharray: "4 4",
                strokeLinecap: "round",
            }}
        />
    );
}
