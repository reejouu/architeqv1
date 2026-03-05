// phase4b_nodeEdgeCollision.ts
// This phase is now SUPERSEDED by the collision resolution built into phase4_nudge.ts
// The progressive collision resolver in phase4_nudge handles both:
//   - Spacing overlaps (old phase4_nudge responsibility)
//   - Edge-node collisions (old phase4b responsibility)
// This file is kept as a no-op for backward compatibility with engine/index.ts imports.

import { InternalNode, InternalEdge, LayoutConfig, LayerStats } from "../types";

export function phase4b_nodeEdgeCollision(
    nodes: InternalNode[],
    edges: InternalEdge[],
    config: LayoutConfig,
    stats: LayerStats,
    log: string[],
): void {
    // No-op: collision resolution is now handled in phase4_nudge.ts
    log.push("Phase 4B: skipped (collision resolution handled by Phase 4).");
}