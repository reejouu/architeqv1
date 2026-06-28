import { InternalEdge, InternalNode, LayoutConfig } from "../types";

const edgeKey = (e: InternalEdge) => `${e.from}__${e.to}`;

/** True if a horizontal run at `y` across [x1,x2] clears every non-endpoint node box. */
function horizontalClear(
    y: number, x1: number, x2: number, e: InternalEdge,
    nodes: InternalNode[], config: LayoutConfig,
): boolean {
    return !nodes.some(
        (n) =>
            n.id !== e.from && n.id !== e.to &&
            y >= n.y - 4 && y <= n.y + config.nodeHeight + 4 &&
            x2 >= n.x - 4 && x1 <= n.x + config.nodeWidth + 4,
    );
}

/** True if a vertical run at `x` from ya..yb clears every non-endpoint node box. */
function verticalClear(
    x: number, ya: number, yb: number, e: InternalEdge,
    nodes: InternalNode[], config: LayoutConfig,
): boolean {
    const lo = Math.min(ya, yb), hi = Math.max(ya, yb);
    return !nodes.some(
        (n) =>
            n.id !== e.from && n.id !== e.to &&
            x >= n.x - 4 && x <= n.x + config.nodeWidth + 4 &&
            hi >= n.y - 4 && lo <= n.y + config.nodeHeight + 4,
    );
}

/**
 * Find a lane y near `want` such that the full Manhattan route
 *   exit → (exitX, y) → (entryX, y) → entry
 * crosses no node, and the lane is at least `minSep` from already-used lanes.
 * Returns null if no clean lane is found (caller leaves the edge on default routing).
 */
function findClearLaneY(
    want: number, e: InternalEdge, nodes: InternalNode[], config: LayoutConfig,
    used: number[], step: number,
): number | null {
    const ex = e.exitPoint!.x, ey = e.exitPoint!.y;
    const tx = e.entryPoint!.x, ty = e.entryPoint!.y;
    const x1 = Math.min(ex, tx), x2 = Math.max(ex, tx);
    for (let k = 0; k <= 14; k++) {
        const dirs = k === 0 ? [0] : [k, -k];
        for (const d of dirs) {
            const y = Math.round(want + d * step);
            if (used.some((u) => Math.abs(u - y) < step - 2)) continue;
            if (
                horizontalClear(y, x1, x2, e, nodes, config) &&
                verticalClear(ex, ey, y, e, nodes, config) &&
                verticalClear(tx, y, ty, e, nodes, config)
            ) {
                return y;
            }
        }
    }
    return null;
}

export function phase7_parallel(
    edges: InternalEdge[],
    nodes: InternalNode[],
    config: LayoutConfig,
    log: string[],
): void {
    const PARALLEL_OFFSET = 16; // px between parallel edge lines

    // ── (existing) same source→target pair offset ──────────────────────────────
    const pairMap = new Map<string, InternalEdge[]>();
    for (const edge of edges) {
        const key = `${edge.from}||${edge.to}`;
        const arr = pairMap.get(key) ?? [];
        arr.push(edge);
        pairMap.set(key, arr);
    }
    let parallelCount = 0;
    for (const [, group] of pairMap) {
        if (group.length <= 1) continue;
        parallelCount += group.length;
        const half = (group.length - 1) / 2;
        for (let i = 0; i < group.length; i++) {
            group[i].parallelOffset = (i - half) * PARALLEL_OFFSET;
        }
    }

    // ── (existing) same-source exit-band separation ────────────────────────────
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
        group.sort((a, b) => (a.exitPoint?.x ?? 0) - (b.exitPoint?.x ?? 0));
        for (let i = 0; i < group.length - 1; i++) {
            const a = group[i];
            const b = group[i + 1];
            if (!a.exitPoint || !b.exitPoint) continue;
            if (b.exitPoint.x - a.exitPoint.x < 10) b.exitPoint.x = a.exitPoint.x + 10;
        }
    }

    // ── (NEW) renderer-lane corridor separation — NO waypoints added ────────────
    // Independent edges whose horizontal mid-run sits at the same y render on top of
    // each other and imply a false connection (the "phantom"). Give each a distinct,
    // DERIVED laneY; ArchEdge draws the whole mid-run at that y. laneY is recomputed
    // every layout (never persisted). A lane is only assigned when the full Manhattan
    // route at that y crosses no node — so crossingCount stays 0; edges that can't be
    // placed cleanly keep their existing routing/waypoints.
    //
    // KNOWN LIMITATION: laneY only resolves HORIZONTAL-corridor phantoms (edges sharing
    // the same midY run). VERTICAL-corridor phantoms — where skip edges crossing multiple
    // layers return to the same x-column on their final approach after a phase5 obstacle
    // detour — are NOT addressed here. Visible in testGraph.json (dev asset, phantom=23),
    // crossingCount stays 0. A symmetric laneX mechanism would fix it; out of scope.
    const LANE_GAP = 18;

    const crossLayer = edges.filter(
        (e) => e.exitPoint && e.entryPoint && Math.abs(e.exitPoint.y - e.entryPoint.y) > 1,
    );

    // Natural corridor y per edge; deterministic order (corridor y, then edge id).
    const items = crossLayer
        .map((e) => ({ e, baseY: Math.round((e.exitPoint!.y + e.entryPoint!.y) / 2) }))
        .sort((a, b) =>
            a.baseY - b.baseY ||
            (edgeKey(a.e) < edgeKey(b.e) ? -1 : edgeKey(a.e) > edgeKey(b.e) ? 1 : 0),
        );

    // Proximity clusters — near-coincident corridors form one separation group.
    const clusters: { e: InternalEdge; baseY: number }[][] = [];
    for (const it of items) {
        const last = clusters[clusters.length - 1];
        if (last && it.baseY - last[last.length - 1].baseY <= 28) last.push(it);
        else clusters.push([it]);
    }

    let laned = 0;
    let sharedCorridors = 0;
    for (const group of clusters) {
        if (group.length <= 1) continue; // no overlap risk in this corridor
        sharedCorridors++;

        // Deterministic lane order — stable edge identity, never iteration order.
        group.sort((a, b) =>
            edgeKey(a.e) < edgeKey(b.e) ? -1 : edgeKey(a.e) > edgeKey(b.e) ? 1 : 0,
        );

        const center = Math.round(group.reduce((s, c) => s + c.baseY, 0) / group.length);
        const half = (group.length - 1) / 2;
        const used: number[] = [];

        for (let i = 0; i < group.length; i++) {
            const e = group[i].e;
            const want = center + (i - half) * LANE_GAP;
            const laneY = findClearLaneY(want, e, nodes, config, used, LANE_GAP);
            if (laneY == null) continue; // no clean lane → keep default routing/waypoints
            used.push(laneY);
            e.laneY = laneY;
            e.waypoints = []; // the lane route is node-clear by construction
            laned++;
        }
    }

    if (parallelCount > 0) {
        log.push(`Phase 7: Applied offsets to ${parallelCount} parallel edge(s)`);
    }
    if (laned > 0) {
        log.push(`Phase 7: Lane-separated ${laned} edge(s) across ${sharedCorridors} corridor(s)`);
    }

    log.push("Phase 7 complete.");
}
