"use client";

import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react";

export default function CriticalEdge({
    id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, markerEnd, selected
}: EdgeProps) {
    const edgePath = data?.routedPath as string | undefined;
    const selectedMarker = `url(#critArrowSelected-${id})`;

    const markerDefs = (
        <defs>
            <marker
                id={`critArrowSelected-${id}`}
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
    );

    if (edgePath) {
        return (
            <>
                {markerDefs}
                <BaseEdge
                    id={id}
                    path={edgePath}
                    markerEnd={selected ? selectedMarker : markerEnd}
                    style={{
                        stroke: selected ? "#a8567e" : "#c78caf",
                        strokeWidth: selected ? 4 : 2,
                        strokeOpacity: selected ? 1 : 0.7,
                        strokeLinecap: "round",
                    }}
                />
            </>
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
        <>
            {markerDefs}
            <BaseEdge
                id={id}
                path={fallbackPath}
                markerEnd={selected ? selectedMarker : markerEnd}
                style={{
                    stroke: selected ? "#a8567e" : "#c78caf",
                    strokeWidth: selected ? 4 : 2,
                    strokeOpacity: selected ? 1 : 0.7,
                    strokeDasharray: "8 8",
                    strokeLinecap: "round",
                }}
            />
        </>
    );
}
