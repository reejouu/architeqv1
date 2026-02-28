"use client";

import { EdgeProps, getSmoothStepPath } from "@xyflow/react";
import { NODE_TYPES_CONFIG, NodeType } from "@/lib/canvasConstants";

export default function CriticalEdge({
    id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data,
}: EdgeProps) {
    const lane = (data?.lane as number) || 0;
    const [edgePath] = getSmoothStepPath({
        sourceX, sourceY, sourcePosition,
        targetX, targetY, targetPosition,
        borderRadius: 16,
        offset: 40 + lane * 14,
    });
    const sourceType = (data?.sourceType as NodeType) || "api";
    const targetType = (data?.targetType as NodeType) || "database";
    const srcConfig = NODE_TYPES_CONFIG[sourceType] || NODE_TYPES_CONFIG.api;
    const tgtConfig = NODE_TYPES_CONFIG[targetType] || NODE_TYPES_CONFIG.database;
    const gradId = `critical-grad-${id}`;
    const pathId = `critical-path-${id}`;

    return (
        <>
            <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={srcConfig.color} />
                    <stop offset="100%" stopColor={tgtConfig.color} />
                </linearGradient>
            </defs>

            {/* Glow trail */}
            <path
                d={edgePath}
                fill="none"
                stroke={srcConfig.color}
                strokeWidth={5}
                strokeOpacity={0.15}
                filter="blur(3px)"
            />

            {/* Main path */}
            <path
                d={edgePath}
                fill="none"
                stroke={`url(#${gradId})`}
                strokeWidth={2.5}
            />

            {/* Animated dot */}
            <path id={pathId} d={edgePath} fill="none" stroke="none" />
            <circle r="6" fill={srcConfig.color} fillOpacity={0.9}>
                <animateMotion dur="1.6s" repeatCount="indefinite" rotate="auto">
                    <mpath href={`#${pathId}`} />
                </animateMotion>
            </circle>
        </>
    );
}
