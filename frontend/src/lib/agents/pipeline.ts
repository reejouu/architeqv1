import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { agent1 } from "./agent1";
import { agent2 } from "./agent2";
import { agent3 } from "./agent3";
import { agent4 } from "./agent4";
import type { FinalGraph, Module } from "@/types/agents";

// ─── Fix 1: Reassign columns sequentially per layer ───────────
// Prevents any two nodes sharing the same layer + column position
function fixColumnCollisions(nodes: Module[]): Module[] {
    const layerColumnCount: Record<number, number> = {};

    return nodes.map((node) => {
        layerColumnCount[node.layer] = (layerColumnCount[node.layer] || 0) + 1;
        return {
            ...node,
            column: layerColumnCount[node.layer],
        };
    });
}

// ─── Fix 2: Remove duplicate nodes by id ──────────────────────
// Prevents agent3 re-adding nodes that already exist from agent1
function deduplicateNodes(nodes: Module[]): Module[] {
    const seenIds = new Set<string>();
    return nodes.filter((node) => {
        if (seenIds.has(node.id)) {
            console.warn(`⚠️  Duplicate node removed: "${node.id}"`);
            return false;
        }
        seenIds.add(node.id);
        return true;
    });
}

// ─── Fix 3: Fix agent3 additions that have wrong layer ────────
// Agent3 sometimes places additions at layer 0 — correct based on type
function fixAdditionLayers(
    additions: Module[],
    existingNodes: Module[]
): Module[] {
    const maxExistingLayer = Math.max(...existingNodes.map((n) => n.layer));

    return additions.map((node) => {
        // If agent3 placed a service/engine at layer 0, fix it
        if (node.layer === 0 && node.type !== "entry") {
            const correctedLayer =
                node.type === "database"
                    ? maxExistingLayer        // databases always go to the deepest layer
                    : Math.max(2, maxExistingLayer - 1); // services go second-to-last

            console.warn(
                `⚠️  Fixed layer for "${node.id}": layer 0 → layer ${correctedLayer}`
            );
            return { ...node, layer: correctedLayer };
        }
        return node;
    });
}

// ─── Fix 4: Remove edges that reference non-existent nodes ────
function cleanOrphanEdges(
    edges: FinalGraph["edges"],
    nodes: Module[]
): FinalGraph["edges"] {
    const validIds = new Set(nodes.map((n) => n.id));
    return edges.filter((edge) => {
        const valid = validIds.has(edge.from) && validIds.has(edge.to);
        if (!valid) {
            console.warn(
                `⚠️  Removed orphan edge: "${edge.from}" → "${edge.to}"`
            );
        }
        return valid;
    });
}

export async function runPipeline(idea: string, onProgress?: (msg: string) => void): Promise<FinalGraph> {
    if (onProgress) onProgress("Initializing pipeline...");
    console.log("═══════════════════════════════════════════════");
    console.log("  ARCHITEQ — AI Architecture Pipeline (Gemini)");
    console.log("═══════════════════════════════════════════════");
    console.log(`\n💡 Idea: "${idea}"\n`);

    if (onProgress) onProgress("Drafting initial module architecture...");
    const a1 = await agent1(idea);

    if (onProgress) onProgress("Mapping system dependencies...");
    const a2 = await agent2(a1);

    if (onProgress) onProgress("Evaluating risks & architectural additions...");
    const a3 = await agent3(a1, a2);

    if (onProgress) onProgress("Assigning ownership & development priorities...");
    const a4 = await agent4(a1, a3);

    // ─── Post-processing ──────────────────────────────────────
    if (onProgress) onProgress("Finalizing graph layout...");

    // Step 1: Fix agent3 additions that landed on wrong layer
    const correctedAdditions = fixAdditionLayers(a3.additions, a1.modules);

    // Step 2: Merge nodes and remove duplicates
    const mergedNodes = deduplicateNodes([
        ...a1.modules,
        ...correctedAdditions,
    ]);

    // Step 3: Fix any column collisions across all layers
    const layoutNodes = fixColumnCollisions(mergedNodes);

    // Step 4: Merge edges and remove any that reference trimmed/missing nodes
    const mergedEdges = cleanOrphanEdges(
        [...a2.dependencies, ...a3.extra_dependencies],
        layoutNodes
    );

    // Step 5: Hard cap — absolute ceiling
    const MAX_NODES = 18;
    if (layoutNodes.length > MAX_NODES) {
        console.warn(
            `⚠️  Total nodes (${layoutNodes.length}) exceeds limit — trimming to ${MAX_NODES}`
        );
        layoutNodes.splice(MAX_NODES);
    }

    const finalGraph: FinalGraph = {
        idea,
        nodes: layoutNodes,
        edges: mergedEdges,
        risks: a3.risks,
        ownership: a4.assignments,
        groups: a4.groups,
        priority: a4.priority,
    };

    console.log("═══════════════════════════════════════════════");
    console.log("  FINAL GRAPH (React Flow ready)");
    console.log(`  ${finalGraph.nodes.length} nodes · ${finalGraph.edges.length} edges`);
    console.log("═══════════════════════════════════════════════");
    console.log(JSON.stringify(finalGraph, null, 2));

    if (onProgress) onProgress("Graph completion rendered!");
    return finalGraph;
}

// ─── Entry point (for local testing mostly) ───────────────────
// const idea =
//     "Build a note making app that allows users to create, edit, delete, and organize notes";
// runPipeline(idea).catch(console.error);