import { InternalEdge } from "../types";

export function phase7_parallel(edges: InternalEdge[], log: string[]): void {
    const PARALLEL_OFFSET = 16; // px between parallel edge lines

    // Group by source-target layer pair (same directional flow)
    const pairMap = new Map<string, InternalEdge[]>();

    for (const edge of edges) {
        // Use directional key — A→B and B→A are different
        const key = `${edge.from}||${edge.to}`;
        const arr = pairMap.get(key) ?? [];
        arr.push(edge);
        pairMap.set(key, arr);
    }

    let parallelCount = 0;

    for (const [, group] of pairMap) {
        if (group.length <= 1) continue;

        parallelCount += group.length;

        // Distribute offsets symmetrically around center: -N*step, ..., 0, ..., +N*step
        const half = (group.length - 1) / 2;
        for (let i = 0; i < group.length; i++) {
            group[i].parallelOffset = (i - half) * PARALLEL_OFFSET;
        }
    }

    // Also detect edges that share the same source-node bottom band or
    // target-node top band and are within 8px of each other — separate them
    const byExitX = new Map<string, InternalEdge[]>();
    for (const edge of edges) {
        if (!edge.exitPoint) continue;
        const key = `${edge.from}:${Math.round(edge.exitPoint.y)}`;
        const arr = byExitX.get(key) ?? [];
        arr.push(edge);
        byExitX.set(key, arr);
    }

    for (const [, group] of byExitX) {
        if (group.length <= 1) continue;
        // Sort by exit X
        group.sort((a, b) => (a.exitPoint?.x ?? 0) - (b.exitPoint?.x ?? 0));
        // Ensure minimum 10px separation
        for (let i = 0; i < group.length - 1; i++) {
            const a = group[i];
            const b = group[i + 1];
            if (!a.exitPoint || !b.exitPoint) continue;
            const gap = b.exitPoint.x - a.exitPoint.x;
            if (gap < 10) {
                b.exitPoint.x = a.exitPoint.x + 10;
            }
        }
    }

    if (parallelCount > 0) {
        log.push(`Phase 7: Applied offsets to ${parallelCount} parallel edge(s)`);
    }

    log.push("Phase 7 complete.");
}