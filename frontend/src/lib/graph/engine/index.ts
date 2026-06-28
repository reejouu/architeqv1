import { InputNode, InputEdge, LayoutConfig, LayoutOutput } from "./types";
import { DEFAULT_CONFIG } from "./constants";

import { phase0_sanitize } from "./phases/phase0_sanitize";
import { phase1_layers } from "./phases/phase1_layers";
import { phase2_initial } from "./phases/phase2_initial";
import { phase3_barycenter } from "./phases/phase3_barycenter";
import { phase4_nudge } from "./phases/phase4_nudge";
import { phase4b_nodeEdgeCollision } from "./phases/phase4b_nodeEdgeCollision";
import { phase5_obstacles } from "./phases/phase5_obstacles";
import { phase6_handles } from "./phases/phase6_handles";
import { phase7_parallel } from "./phases/phase7_parallel";
import { phase8_assemble } from "./phases/phase8_assemble";

export type { InputNode, InputEdge, LayoutOutput, LayoutConfig };

/**
 * Main Orchestrator: Computes the 8-phase hierarchical graph layout.
 *
 * @param inputNodes  Raw nodes with predefined layer/column from AI
 * @param inputEdges  Raw edges from AI
 * @param partialConfig  Optional config overrides (nodeWidth, layerGap, etc.)
 * @returns  LayoutOutput ready for React Flow
 */
export function computeLayout(
    inputNodes: InputNode[],
    inputEdges: InputEdge[],
    partialConfig: Partial<LayoutConfig> = {},
): LayoutOutput {
    const config = { ...DEFAULT_CONFIG, ...partialConfig };
    const log: string[] = ["--- Layout Computation Started ---"];
    const totalStart = performance.now();

    if (inputNodes.length === 0) {
        log.push("Empty graph provided.");
        return {
            nodes: [],
            edges: [],
            canvasWidth: 0,
            canvasHeight: 0,
            stats: { nodeCount: 0, edgeCount: 0, crossingCount: 0, phaseLog: log },
        };
    }

    // ── Phase 0: Sanitize ────────────────────────────────────────────────────
    const t0 = performance.now();
    const { nodes: safeNodes, edges: internalEdges } = phase0_sanitize(inputNodes, inputEdges, log);
    log.push(`Phase 0 (Sanitize): ${(performance.now() - t0).toFixed(1)}ms`);

    // ── Phase 1: Layer analysis + routing pressure ───────────────────────────
    // Pass inputEdges so phase1 can compute routingPressure per node.
    // Routing pressure = how many long-range edges pass through each node's layer band.
    // High-pressure nodes are placed at layer edges in phase2 to reduce collisions.
    const t1 = performance.now();
    const { internalNodes, stats } = phase1_layers(safeNodes, config, log, inputEdges);
    log.push(`Phase 1 (Layers): ${(performance.now() - t1).toFixed(1)}ms`);

    // ── Phase 2: Pressure-aware initial placement ────────────────────────────
    const t2 = performance.now();
    phase2_initial(internalNodes, config, stats, log);
    log.push(`Phase 2 (Initial): ${(performance.now() - t2).toFixed(1)}ms`);

    // ── Phase 3: Crossing reduction (score-gated barycenter + swaps) ─────────
    const t3 = performance.now();
    phase3_barycenter(internalNodes, internalEdges, config, stats, log);
    log.push(`Phase 3 (Barycenter): ${(performance.now() - t3).toFixed(1)}ms`);

    // ── Phase 4: Overlap nudge + progressive collision resolution ────────────
    // This phase now handles BOTH spacing overlaps AND edge-node collisions.
    // It moves blocking nodes to eliminate collisions instead of adding waypoints.
    const t4 = performance.now();
    phase4_nudge(internalNodes, internalEdges, stats, config, log);
    log.push(`Phase 4 (Nudge + Collision): ${(performance.now() - t4).toFixed(1)}ms`);

    // ── Phase 4B: No-op (collision resolution now in phase 4) ────────────────
    const t4b = performance.now();
    phase4b_nodeEdgeCollision(internalNodes, internalEdges, config, stats, log);
    log.push(`Phase 4B (no-op): ${(performance.now() - t4b).toFixed(1)}ms`);

    // ── Phase 5: Waypoints for remaining long-range edge obstacles ───────────
    // Resets all waypoints first (phase4 moved nodes, old waypoints are stale),
    // then recomputes from scratch on final node positions.
    const t5 = performance.now();
    phase5_obstacles(internalNodes, internalEdges, config, stats, log);
    log.push(`Phase 5 (Obstacles): ${(performance.now() - t5).toFixed(1)}ms`);

    // ── Phase 6: Handle assignment + routing types ───────────────────────────
    const t6 = performance.now();
    phase6_handles(internalNodes, internalEdges, config, log);
    log.push(`Phase 6 (Handles): ${(performance.now() - t6).toFixed(1)}ms`);

    // ── Phase 7: Parallel edge separation ────────────────────────────────────
    const t7 = performance.now();
    phase7_parallel(internalEdges, internalNodes, config, log);
    log.push(`Phase 7 (Parallel): ${(performance.now() - t7).toFixed(1)}ms`);

    // ── Phase 8: Assemble + final collision diagnostic ───────────────────────
    const t8 = performance.now();
    const output = phase8_assemble(internalNodes, internalEdges, stats, log);
    log.push(`Phase 8 (Assemble): ${(performance.now() - t8).toFixed(1)}ms`);

    log.push(`--- Layout Complete: ${(performance.now() - totalStart).toFixed(1)}ms total ---`);

    return output;
}