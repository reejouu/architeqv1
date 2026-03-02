import { InputNode, InputEdge, LayoutConfig, LayoutOutput } from "./types";
import { DEFAULT_CONFIG } from "./constants";

// Imports for the individual layout phases
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

// Re-export types so consumers just import from "engine"
export type { InputNode, InputEdge, LayoutOutput, LayoutConfig };

/**
 * Main Orchestrator: Computes the 8-phase hierarchical graph layout.
 *
 * @param inputNodes The raw list of nodes with their predefined layer/column
 * @param inputEdges The raw list of edges
 * @param partialConfig Optional config overrides
 * @returns Serialized LayoutOutput ready for standard mapping
 */
export function computeLayout(
    inputNodes: InputNode[],
    inputEdges: InputEdge[],
    partialConfig: Partial<LayoutConfig> = {}
): LayoutOutput {
    const config = { ...DEFAULT_CONFIG, ...partialConfig };
    const log: string[] = ["--- Layout Computation Started ---"];

    if (inputNodes.length === 0) {
        log.push("Empty graph provided.");
        return { nodes: [], edges: [], canvasWidth: 0, canvasHeight: 0, stats: { nodeCount: 0, edgeCount: 0, crossingCount: 0, phaseLog: log } };
    }

    // 0. Sanitize
    const start0 = performance.now();
    const { nodes: safeNodes, edges: internalEdges } = phase0_sanitize(inputNodes, inputEdges, log);
    log.push(`Phase 0 (Sanitize) took ${(performance.now() - start0).toFixed(1)}ms`);

    // 1. Layer Analysis
    const start1 = performance.now();
    const { internalNodes, stats } = phase1_layers(safeNodes, config, log);
    log.push(`Phase 1 (Layers) took ${(performance.now() - start1).toFixed(1)}ms`);

    // 2. Initial Positioning
    const start2 = performance.now();
    phase2_initial(internalNodes, config, stats, log);
    log.push(`Phase 2 (Initial) took ${(performance.now() - start2).toFixed(1)}ms`);

    // 3. Barycenter (Crossing Reduction)
    const start3 = performance.now();
    phase3_barycenter(internalNodes, internalEdges, stats, config, log);
    log.push(`Phase 3 (Barycenter) took ${(performance.now() - start3).toFixed(1)}ms`);

    // 4. Overlap Elimination
    const start4 = performance.now();
    phase4_nudge(internalNodes, stats, config, log);
    log.push(`Phase 4 (Nudge) took ${(performance.now() - start4).toFixed(1)}ms`);

    // 4B. Collision Avoidance (Nodes vs. Edges)
    const start4b = performance.now();
    phase4b_nodeEdgeCollision(internalNodes, internalEdges, stats, config, log);
    log.push(`Phase 4B (Collision) took ${(performance.now() - start4b).toFixed(1)}ms`);

    // 5. Obstacles and Waypoints
    const start5 = performance.now();
    phase5_obstacles(internalNodes, internalEdges, config, stats, log);
    log.push(`Phase 5 (Obstacles) took ${(performance.now() - start5).toFixed(1)}ms`);

    // 6. Handle Assignment
    const start6 = performance.now();
    phase6_handles(internalNodes, internalEdges, config, log);
    log.push(`Phase 6 (Handles) took ${(performance.now() - start6).toFixed(1)}ms`);

    // 7. Parallel Edges
    const start7 = performance.now();
    phase7_parallel(internalEdges, log);
    log.push(`Phase 7 (Parallel) took ${(performance.now() - start7).toFixed(1)}ms`);

    // 8. Assemble Output
    const start8 = performance.now();
    const startTotal = performance.now(); // Calculate full layout duration
    const output = phase8_assemble(internalNodes, internalEdges, stats, log);
    log.push(`Phase 8 (Assemble) took ${(performance.now() - start8).toFixed(1)}ms`);
    log.push(`--- Layout Complete in ${(performance.now() - startTotal).toFixed(1)}ms ---`);

    return output;
}
