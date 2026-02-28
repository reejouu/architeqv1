"use client";

import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react";
import { NODE_TYPES_CONFIG, NodeType } from "@/lib/canvasConstants";

export default function ArchEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
}: EdgeProps) {
    const lane = (data?.lane as number) || 0;
    const [edgePath] = getSmoothStepPath({
        sourceX, sourceY, sourcePosition,
        targetX, targetY, targetPosition,
        borderRadius: 16,
        offset: 40 + lane * 14,
    });
    const sourceType = (data?.sourceType as NodeType) || "api";
    const config = NODE_TYPES_CONFIG[sourceType] || NODE_TYPES_CONFIG.api;
    const pathId = `arch-edge-path-${id}`;

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                style={{
                    stroke: `rgba(${config.rgb},0.4)`,
                    strokeWidth: 1.5,
                }}
            />
            {/* Animated dot following the path */}
            <path id={pathId} d={edgePath} fill="none" stroke="none" />
            <circle r="4" fill={config.color} fillOpacity={0.8}>
                <animateMotion dur="2.4s" repeatCount="indefinite" rotate="auto">
                    <mpath href={`#${pathId}`} />
                </animateMotion>
            </circle>
        </>
    );
}
