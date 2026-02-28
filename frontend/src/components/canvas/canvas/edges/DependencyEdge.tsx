"use client";

import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react";

export default function DependencyEdge({
    id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data
}: EdgeProps) {
    const lane = (data?.lane as number) || 0;
    const [edgePath] = getSmoothStepPath({
        sourceX, sourceY, sourcePosition,
        targetX, targetY, targetPosition,
        borderRadius: 16,
        offset: 40 + lane * 14,
    });
    return (
        <BaseEdge
            id={id}
            path={edgePath}
            style={{
                stroke: "rgba(161,161,170,0.3)",
                strokeWidth: 1,
                strokeDasharray: "4 8",
            }}
        />
    );
}
