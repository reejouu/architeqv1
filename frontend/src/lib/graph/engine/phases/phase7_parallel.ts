import { InternalNode, InternalEdge } from "../types";

export function phase7_parallel(edges: InternalEdge[], log: string[]): void {
    // Collect edges grouped by source-target pair (order-independent for undirected grouping)
    const pairMap = new Map<string, InternalEdge[]>();

    for (const edge of edges) {
        const id1 = edge.from;
        const id2 = edge.to;
        // Create a consistent pair key regardless of direction
        const key = id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;

        const group = pairMap.get(key) || [];
        group.push(edge);
        pairMap.set(key, group);
    }

    let parallelCount = 0;

    for (const [, group] of pairMap) {
        if (group.length > 1) {
            parallelCount += group.length;
            // E.g., for 3 edges: -20, 0, +20
            const maxOffset = 30; // Max pixels to deviate from center
            const step = (maxOffset * 2) / (group.length - 1);

            for (let i = 0; i < group.length; i++) {
                const offset = -maxOffset + (i * step);
                group[i].parallelOffset = offset;
            }
        }
    }

    if (parallelCount > 0) {
        log.push(`Applied distinct routing offsets for ${parallelCount} parallel edges.`);
    }
}
