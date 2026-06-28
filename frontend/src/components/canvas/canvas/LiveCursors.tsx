"use client";

import { useReactFlow } from "@xyflow/react";
import { useCanvasStore } from "@/store/canvasStore";

/**
 * Renders other users' cursors as an overlay on the canvas.
 *
 * Each cursor is an SVG arrow + name pill positioned in screen space.
 * Cursors are stored in flow coordinates and converted back via
 * flowToScreenPosition so they track pan/zoom correctly.
 *
 * @param viewportOffset — the { top, left } pixel offset of the canvas
 *   viewport from the window origin (toolbar height, sidebar width).
 */
export default function LiveCursors({
    viewportOffset,
}: {
    viewportOffset: { top: number; left: number };
}) {
    const others = useCanvasStore((s) => s.liveblocks.others);
    const { flowToScreenPosition } = useReactFlow();

    return (
        <>
            {others.map((user) => {
                const cursor = user.presence?.cursor as { x: number; y: number } | null | undefined;
                if (!cursor) return null;

                const info = user.info as
                    | { name: string; color: string }
                    | undefined;
                if (!info) return null;

                // Convert flow coordinates → screen coordinates, then subtract
                // the viewport offset so the position is relative to the canvas div
                const screen = flowToScreenPosition({
                    x: cursor.x,
                    y: cursor.y,
                });
                const x = screen.x - viewportOffset.left;
                const y = screen.y - viewportOffset.top;

                return (
                    <div
                        key={user.connectionId}
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            transform: `translate(${x}px, ${y}px)`,
                            pointerEvents: "none",
                            zIndex: 1000,
                            transition: "transform 120ms linear",
                        }}
                    >
                        {/* Cursor arrow */}
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 16 16"
                            fill="none"
                            style={{ display: "block" }}
                        >
                            <path
                                d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19807e-06L11.7841 12.2687H8.37696L8.23956 12.3005L7.94576 12.3673L5.65376 12.3673Z"
                                fill={info.color}
                                stroke="#2c336c"
                                strokeWidth="1"
                            />
                        </svg>

                        {/* Name pill */}
                        <div
                            style={{
                                position: "absolute",
                                left: 14,
                                top: 14,
                                background: info.color,
                                color: "#fff",
                                fontSize: 10,
                                fontWeight: 700,
                                padding: "2px 6px",
                                borderRadius: 4,
                                whiteSpace: "nowrap",
                                border: "1px solid rgba(0,0,0,0.15)",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                lineHeight: "14px",
                                letterSpacing: "0.02em",
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            {info.name}
                        </div>
                    </div>
                );
            })}
        </>
    );
}
