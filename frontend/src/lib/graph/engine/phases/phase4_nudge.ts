import { InternalNode, InternalEdge, LayoutConfig, LayerStats } from "../types";
import { enforceMinGap, recenterLayer, clampToCanvas } from "../utils";

export function phase4_nudge(
    nodes: InternalNode[],
    edges: InternalEdge[],
    stats: LayerStats,
    config: LayoutConfig,
    log: string[],
): void {
    const { nodeWidth, nodeGap, canvasPadding, maxNudgePasses } = config;
    const { layerMap, sortedLayers } = stats;
    let { contentWidth } = stats;

    // ── Pass 1: Standard spacing nudge ───────────────────────────────────────
    let hasOverlaps = true;
    let passes = 0;

    while (hasOverlaps && passes < maxNudgePasses) {
        hasOverlaps = false;
        passes++;

        for (const L of sortedLayers) {
            const layerNodes = layerMap.get(L)!;
            if (layerNodes.length < 2) continue;

            layerNodes.sort((a, b) => a.x - b.x);
            let layerChanged = false;

            for (let i = 0; i < layerNodes.length - 1; i++) {
                const cur = layerNodes[i];
                const nxt = layerNodes[i + 1];
                const required = nodeWidth + nodeGap;
                const actual = nxt.x - cur.x;

                if (actual < required) {
                    hasOverlaps = true;
                    layerChanged = true;
                    const overlap = required - actual;
                    cur.x -= overlap / 2;
                    nxt.x += overlap / 2;
                }
            }

            if (layerChanged) {
                enforceMinGap(layerNodes, nodeWidth, nodeGap);
                contentWidth = clampToCanvas(layerNodes, nodeWidth, nodeGap, canvasPadding, contentWidth);
                recenterLayer(layerNodes, nodeWidth, nodeGap, contentWidth);
            }
        }
    }

    if (passes >= maxNudgePasses) {
        log.push(`⚠️ Phase 4 spacing: max passes (${maxNudgePasses}) reached`);
    } else {
        log.push(`Phase 4 spacing: resolved in ${passes} passes`);
    }

    // ── Pass 2: Progressive collision resolution ──────────────────────────────
    // Detect edges whose rough path passes through non-source/target nodes.
    // Move the blocking node instead of adding a waypoint.
    const nodeById = new Map<string, InternalNode>();
    for (const n of nodes) nodeById.set(n.id, n);

    const EDGE_MARGIN = 16; // px clearance around node boundary for edge routing

    let collisionPasses = 0;
    const MAX_COLLISION_PASSES = 15;

    while (collisionPasses < MAX_COLLISION_PASSES) {
        const collisions = findEdgeNodeCollisions(nodes, edges, nodeById, nodeWidth, config.nodeHeight, EDGE_MARGIN);

        if (collisions.length === 0) break;
        collisionPasses++;

        log.push(`Phase 4 collision pass ${collisionPasses}: ${collisions.length} edge-node collision(s)`);

        // Group by blocking node — move the most-colliding node first
        const byBlocker = new Map<string, number>();
        for (const c of collisions) {
            byBlocker.set(c.blockingNodeId, (byBlocker.get(c.blockingNodeId) ?? 0) + 1);
        }

        const sortedBlockers = Array.from(byBlocker.entries())
            .sort((a, b) => b[1] - a[1]);

        let anyMoved = false;

        for (const [blockerId] of sortedBlockers) {
            const blocker = nodeById.get(blockerId);
            if (!blocker) continue;

            const move = findBestMove(blocker, nodes, edges, nodeById, nodeWidth, config.nodeHeight, nodeGap, canvasPadding, contentWidth, EDGE_MARGIN);

            if (move !== null) {
                blocker.x += move;
                anyMoved = true;

                // Re-nudge this layer after moving
                const layerNodes = layerMap.get(blocker.layer)!;
                enforceMinGap(layerNodes, nodeWidth, nodeGap);
                contentWidth = clampToCanvas(layerNodes, nodeWidth, nodeGap, canvasPadding, contentWidth);
                recenterLayer(layerNodes, nodeWidth, nodeGap, contentWidth);
            }
        }

        if (!anyMoved) break; // stuck — no valid moves found
    }

    if (collisionPasses > 0) {
        log.push(`Phase 4 collision resolution: ${collisionPasses} passes`);
    }

    // ── Pass 3: Global rebalance after all moves ──────────────────────────────
    globalRebalance(nodes, layerMap, sortedLayers, nodeWidth, nodeGap, contentWidth);

    // ── Final validation ──────────────────────────────────────────────────────
    let validPasses = 0;
    while (validPasses < 5) {
        let changed = false;
        for (const L of sortedLayers) {
            const layerNodes = layerMap.get(L)!;
            if (layerNodes.length < 2) continue;
            layerNodes.sort((a, b) => a.x - b.x);
            for (let i = 0; i < layerNodes.length - 1; i++) {
                if (layerNodes[i + 1].x - layerNodes[i].x < nodeWidth) {
                    changed = true;
                    enforceMinGap(layerNodes, nodeWidth, nodeGap * 1.5);
                    contentWidth = clampToCanvas(layerNodes, nodeWidth, nodeGap * 1.5, canvasPadding, contentWidth);
                    recenterLayer(layerNodes, nodeWidth, nodeGap, contentWidth);
                }
            }
        }
        if (!changed) break;
        validPasses++;
    }

    stats.contentWidth = contentWidth;
    log.push("Phase 4 complete.");
}

// ── Collision detection ───────────────────────────────────────────────────────

interface CollisionEvent {
    edgeFrom: string;
    edgeTo: string;
    blockingNodeId: string;
}

function findEdgeNodeCollisions(
    nodes: InternalNode[],
    edges: InternalEdge[],
    nodeById: Map<string, InternalNode>,
    nodeWidth: number,
    nodeHeight: number,
    margin: number,
): CollisionEvent[] {
    const result: CollisionEvent[] = [];

    for (const edge of edges) {
        const src = nodeById.get(edge.from);
        const tgt = nodeById.get(edge.to);
        if (!src || !tgt) continue;

        const path = computeRoughPath(src, tgt, nodeWidth, nodeHeight);

        for (const node of nodes) {
            if (node.id === edge.from || node.id === edge.to) continue;

            const box = {
                left:   node.x - margin,
                right:  node.x + nodeWidth + margin,
                top:    node.y - margin,
                bottom: node.y + nodeHeight + margin,
            };

            let hits = false;
            for (const seg of path) {
                if (segmentHitsBox(seg, box)) {
                    hits = true;
                    break;
                }
            }

            if (hits) {
                result.push({ edgeFrom: edge.from, edgeTo: edge.to, blockingNodeId: node.id });
            }
        }
    }

    return result;
}

interface Segment { x1: number; y1: number; x2: number; y2: number }

function computeRoughPath(
    src: InternalNode,
    tgt: InternalNode,
    nodeWidth: number,
    nodeHeight: number,
): Segment[] {
    const srcCX = src.x + nodeWidth / 2;
    const tgtCX = tgt.x + nodeWidth / 2;
    const srcBY = src.y + nodeHeight;
    const tgtTY = tgt.y;
    const midY  = (srcBY + tgtTY) / 2;

    return [
        { x1: srcCX, y1: srcBY, x2: srcCX, y2: midY },
        { x1: srcCX, y1: midY,  x2: tgtCX, y2: midY },
        { x1: tgtCX, y1: midY,  x2: tgtCX, y2: tgtTY },
    ];
}

function segmentHitsBox(seg: Segment, box: { left: number; right: number; top: number; bottom: number }): boolean {
    // Horizontal segment
    if (Math.abs(seg.y1 - seg.y2) < 1) {
        const minX = Math.min(seg.x1, seg.x2);
        const maxX = Math.max(seg.x1, seg.x2);
        return seg.y1 >= box.top && seg.y1 <= box.bottom && maxX >= box.left && minX <= box.right;
    }
    // Vertical segment
    if (Math.abs(seg.x1 - seg.x2) < 1) {
        const minY = Math.min(seg.y1, seg.y2);
        const maxY = Math.max(seg.y1, seg.y2);
        return seg.x1 >= box.left && seg.x1 <= box.right && maxY >= box.top && minY <= box.bottom;
    }
    return false;
}

// ── Best move finder ─────────────────────────────────────────────────────────

function findBestMove(
    blocker: InternalNode,
    allNodes: InternalNode[],
    edges: InternalEdge[],
    nodeById: Map<string, InternalNode>,
    nodeWidth: number,
    nodeHeight: number,
    nodeGap: number,
    canvasPadding: number,
    canvasWidth: number,
    margin: number,
): number | null {
    const layerNodes = allNodes.filter(n => n.layer === blocker.layer);
    const steps = [nodeGap + nodeWidth * 0.5, nodeGap + nodeWidth, nodeGap + nodeWidth * 1.5];
    const directions = [-1, 1];

    let bestDelta: number | null = null;
    let bestCollisions = Infinity;

    for (const dir of directions) {
        for (const step of steps) {
            const delta = dir * step;
            const newX = blocker.x + delta;

            // Canvas bounds check
            if (newX < canvasPadding || newX + nodeWidth > canvasWidth - canvasPadding) continue;

            // Overlap with sibling nodes check
            const wouldOverlap = layerNodes.some(n => {
                if (n.id === blocker.id) return false;
                return Math.abs(n.x - newX) < nodeWidth + nodeGap;
            });
            if (wouldOverlap) continue;

            // Temporarily apply and score
            const original = blocker.x;
            blocker.x = newX;

            const collisions = findEdgeNodeCollisions(allNodes, edges, nodeById, nodeWidth, nodeHeight, margin);
            const score = collisions.length;

            blocker.x = original;

            if (score < bestCollisions) {
                bestCollisions = score;
                bestDelta = delta;
            }

            // Early exit if perfect
            if (score === 0) break;
        }
        if (bestCollisions === 0) break;
    }

    // Only apply if it actually improves things
    const currentCollisions = findEdgeNodeCollisions(allNodes, edges, nodeById, nodeWidth, nodeHeight, margin).length;
    if (bestDelta !== null && bestCollisions < currentCollisions) {
        return bestDelta;
    }

    return null;
}

// ── Global rebalance ─────────────────────────────────────────────────────────

function globalRebalance(
    nodes: InternalNode[],
    layerMap: Map<number, InternalNode[]>,
    sortedLayers: number[],
    nodeWidth: number,
    nodeGap: number,
    canvasWidth: number,
): void {
    // Find the widest layer (anchor)
    let maxSpan = 0;
    let anchorLayer = sortedLayers[0];

    for (const L of sortedLayers) {
        const ln = layerMap.get(L)!;
        if (ln.length === 0) continue;
        const minX = Math.min(...ln.map(n => n.x));
        const maxX = Math.max(...ln.map(n => n.x + nodeWidth));
        const span = maxX - minX;
        if (span > maxSpan) { maxSpan = span; anchorLayer = L; }
    }

    // Calculate anchor center
    const anchorNodes = layerMap.get(anchorLayer)!;
    const anchorMin = Math.min(...anchorNodes.map(n => n.x));
    const anchorMax = Math.max(...anchorNodes.map(n => n.x + nodeWidth));
    const anchorCX = (anchorMin + anchorMax) / 2;

    // Align all other layers to anchor center
    for (const L of sortedLayers) {
        if (L === anchorLayer) continue;
        const ln = layerMap.get(L)!;
        if (ln.length === 0) continue;

        const lMin = Math.min(...ln.map(n => n.x));
        const lMax = Math.max(...ln.map(n => n.x + nodeWidth));
        const lCX  = (lMin + lMax) / 2;
        const shift = anchorCX - lCX;

        if (Math.abs(shift) > 4) {
            ln.forEach(n => { n.x += shift; });
        }
    }
}