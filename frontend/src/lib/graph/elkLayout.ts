import ELK from "elkjs/lib/elk.bundled.js";
import type { InputNode, InputEdge, LayoutOutput } from "./engine";

const NODE_W = 240;
const NODE_H = 72;

const elk = new ELK();

/**
 * ELK.js-based hierarchical layout (replaces the hand-rolled 8-phase engine).
 *
 * Uses ELK's `layered` algorithm with ORTHOGONAL edge routing. The AI's `layer`
 * field is honored via ELK partitioning so the entry→auth→core→service→db banding
 * is preserved. ELK returns node positions AND fully-routed orthogonal edge paths
 * (sections with bend points) that avoid node boxes — these are passed through to
 * ArchEdge as `data.points`.
 */
export async function computeElkLayout(
    nodes: InputNode[],
    edges: InputEdge[],
): Promise<LayoutOutput> {
    if (nodes.length === 0) {
        return {
            nodes: [],
            edges: [],
            canvasWidth: 0,
            canvasHeight: 0,
            stats: { nodeCount: 0, edgeCount: 0, crossingCount: 0, phaseLog: ["ELK: empty graph"] },
        };
    }

    const ids = new Set(nodes.map((n) => n.id));
    const validEdges = edges.filter((e) => ids.has(e.from) && ids.has(e.to));

    const elkGraph = {
        id: "root",
        layoutOptions: {
            "elk.algorithm": "layered",
            "elk.direction": "DOWN",
            "elk.edgeRouting": "ORTHOGONAL",
            "elk.partitioning.activate": "true",
            "elk.layered.spacing.nodeNodeBetweenLayers": "90",
            "elk.spacing.nodeNode": "60",
            "elk.layered.spacing.edgeNodeBetweenLayers": "30",
            "elk.spacing.edgeEdge": "18",
            "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
            "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
        },
        children: nodes.map((n) => ({
            id: n.id,
            width: NODE_W,
            height: NODE_H,
            layoutOptions: { "elk.partitioning.partition": String(n.layer ?? 0) },
        })),
        edges: validEdges.map((e, i) => ({
            id: `e${i}-${e.from}-${e.to}`,
            sources: [e.from],
            targets: [e.to],
        })),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await elk.layout(elkGraph as any);

    const nodeById = new Map(nodes.map((n) => [n.id, n]));
    const posById = new Map<string, { x: number; y: number }>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const c of res.children ?? []) posById.set(c.id, { x: c.x ?? 0, y: c.y ?? 0 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const outNodes = (res.children ?? []).map((c: any) => ({
        id: c.id as string,
        position: { x: c.x ?? 0, y: c.y ?? 0 },
        data: { ...(nodeById.get(c.id) ?? {}) },
        type: "archNode" as const,
    }));

    // ── Edge endpoints: distribute & CENTER each node's connections along its
    //    border (single edge → centered; multiple → evenly spread as a centered
    //    group, never stacked), keep ELK's interior bends for node-avoiding
    //    routing, and align the approach segments so they stay orthogonal.
    const W = NODE_W, H = NODE_H;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type RawEdge = { e: any; src: string; tgt: string; interior: { x: number; y: number }[]; down: boolean; exitX: number; exitY: number; entryX: number; entryY: number };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raws: RawEdge[] = (res.edges ?? []).map((e: any) => {
        const sec = e.sections?.[0];
        const pts: { x: number; y: number }[] = sec ? [sec.startPoint, ...(sec.bendPoints ?? []), sec.endPoint] : [];
        const sp = posById.get(e.sources[0]);
        const tp = posById.get(e.targets[0]);
        return {
            e, src: e.sources[0], tgt: e.targets[0],
            interior: pts.length > 2 ? pts.slice(1, -1).map((p) => ({ ...p })) : [],
            down: (tp?.y ?? 0) >= (sp?.y ?? 0),
            exitX: 0, exitY: 0, entryX: 0, entryY: 0,
        };
    });

    // centered, evenly-spaced offsets for `count` connections on one border
    const offsets = (count: number) => {
        const gap = Math.min(48, (W - 32) / (count + 1));
        const total = (count - 1) * gap;
        return (i: number) => -total / 2 + i * gap;
    };

    // exits: per source, spread along bottom border, ordered by target x (fewer crossings)
    const bySrc = new Map<string, RawEdge[]>();
    for (const r of raws) { const a = bySrc.get(r.src) ?? []; a.push(r); bySrc.set(r.src, a); }
    for (const [src, list] of bySrc) {
        const sp = posById.get(src); if (!sp) continue;
        list.sort((a, b) => (posById.get(a.tgt)?.x ?? 0) - (posById.get(b.tgt)?.x ?? 0));
        const off = offsets(list.length);
        list.forEach((r, i) => { r.exitX = sp.x + W / 2 + off(i); r.exitY = r.down ? sp.y + H : sp.y; });
    }
    // entries: per target, spread along top border, ordered by source x
    const byTgt = new Map<string, RawEdge[]>();
    for (const r of raws) { const a = byTgt.get(r.tgt) ?? []; a.push(r); byTgt.set(r.tgt, a); }
    for (const [tgt, list] of byTgt) {
        const tp = posById.get(tgt); if (!tp) continue;
        list.sort((a, b) => (posById.get(a.src)?.x ?? 0) - (posById.get(b.src)?.x ?? 0));
        const off = offsets(list.length);
        list.forEach((r, i) => { r.entryX = tp.x + W / 2 + off(i); r.entryY = r.down ? tp.y : tp.y + H; });
    }

    const outEdges = raws.map((r) => {
        const S = { x: r.exitX, y: r.exitY };
        const T = { x: r.entryX, y: r.entryY };
        let pts: { x: number; y: number }[];
        if (Math.abs(S.x - T.x) < 1) {
            pts = [S, T]; // straight vertical
        } else if (r.interior.length >= 2) {
            // align the first/last turn to the new exit/entry x → keeps approach orthogonal
            r.interior[0].x = S.x;
            r.interior[r.interior.length - 1].x = T.x;
            pts = [S, ...r.interior, T];
        } else {
            const midY = Math.round((S.y + T.y) / 2);
            pts = [S, { x: S.x, y: midY }, { x: T.x, y: midY }, T];
        }
        return {
            id: r.e.id as string,
            source: r.src,
            target: r.tgt,
            type: "elk",
            data: {
                points: pts,
                exitPoint: S,
                entryPoint: T,
                exitPort: "bottom",
                entryPort: "top",
                waypoints: [],
                parallelOffset: 0,
            },
            style: { stroke: "#636798", strokeWidth: 1.5 },
        };
    });

    return {
        nodes: outNodes,
        edges: outEdges as LayoutOutput["edges"],
        canvasWidth: res.width ?? 0,
        canvasHeight: res.height ?? 0,
        stats: {
            nodeCount: outNodes.length,
            edgeCount: outEdges.length,
            crossingCount: 0,
            phaseLog: [`ELK layout: ${outNodes.length} nodes, ${outEdges.length} edges`],
        },
    };
}
