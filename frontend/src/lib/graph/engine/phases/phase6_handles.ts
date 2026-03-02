import { InternalNode, InternalEdge, LayoutConfig } from "../types";

export function phase6_handles(
    nodes: InternalNode[],
    edges: InternalEdge[],
    config: LayoutConfig,
    log: string[],
): void {
    const { nodeWidth, nodeHeight } = config;
    const nodeById = new Map<string, InternalNode>();
    for (const n of nodes) nodeById.set(n.id, n);

    // STEP 6A — Group edges by source node
    const bySource = new Map<string, InternalEdge[]>();
    for (const e of edges) {
        const group = bySource.get(e.from) || [];
        group.push(e);
        bySource.set(e.from, group);
    }

    for (const [srcId, group] of bySource) {
        const src = nodeById.get(srcId);
        if (!src) continue;

        // Sort by target x position (left to right)
        group.sort((a, b) => {
            const ta = nodeById.get(a.to);
            const tb = nodeById.get(b.to);
            return (ta?.x ?? 0) - (tb?.x ?? 0);
        });

        const usableWidth = nodeWidth - 40;
        if (group.length === 1) {
            group[0].exitPoint = { x: src.x + nodeWidth / 2, y: src.y + nodeHeight };
        } else {
            const spacing = usableWidth / (group.length - 1);
            for (let i = 0; i < group.length; i++) {
                group[i].exitPoint = {
                    x: src.x + 20 + i * spacing,
                    y: src.y + nodeHeight,
                };
            }
        }
    }

    // STEP 6B — Group edges by target node
    const byTarget = new Map<string, InternalEdge[]>();
    for (const e of edges) {
        const group = byTarget.get(e.to) || [];
        group.push(e);
        byTarget.set(e.to, group);
    }

    for (const [tgtId, group] of byTarget) {
        const tgt = nodeById.get(tgtId);
        if (!tgt) continue;

        // Sort by source x position (left to right)
        group.sort((a, b) => {
            const sa = nodeById.get(a.from);
            const sb = nodeById.get(b.from);
            return (sa?.x ?? 0) - (sb?.x ?? 0);
        });

        const usableWidth = nodeWidth - 40;
        if (group.length === 1) {
            group[0].entryPoint = { x: tgt.x + nodeWidth / 2, y: tgt.y };
        } else {
            const spacing = usableWidth / (group.length - 1);
            for (let i = 0; i < group.length; i++) {
                group[i].entryPoint = {
                    x: tgt.x + 20 + i * spacing,
                    y: tgt.y,
                };
            }
        }
    }

    // STEP 6C — Routing styles
    for (const edge of edges) {
        if (edge.waypoints.length > 0) {
            edge.routingType = "orthogonal-waypoint";
        } else {
            const src = nodeById.get(edge.from);
            const tgt = nodeById.get(edge.to);
            if (!src || !tgt) continue;
            // if directly above, vertical routing is best
            if (Math.abs(src.x - tgt.x) < 20) {
                edge.routingType = "orthogonal";
            } else {
                edge.routingType = "smoothstep";
            }
        }
    }
}
