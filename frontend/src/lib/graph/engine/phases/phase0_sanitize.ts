import { InputNode, InputEdge, InternalEdge } from "../types";

export function phase0_sanitize(
    inputNodes: InputNode[],
    inputEdges: InputEdge[],
    log: string[],
): { nodes: InputNode[]; edges: InternalEdge[] } {
    const nodes = inputNodes.map(n => ({ ...n }));
    let edges = inputEdges.map(e => ({ ...e }));

    // STEP 0A — Remove backward edges
    edges = edges.filter(e => {
        const src = nodes.find(n => n.id === e.from);
        const tgt = nodes.find(n => n.id === e.to);
        if (!src || !tgt) return true; // handled in 0D
        if (tgt.layer <= src.layer) {
            log.push(`Removed backward edge: ${e.from}(layer ${src.layer}) → ${e.to}(layer ${tgt.layer})`);
            return false;
        }
        return true;
    });

    // STEP 0B — Remove duplicate edges
    const seen = new Set<string>();
    edges = edges.filter(e => {
        const key = `${e.from}→${e.to}`;
        if (seen.has(key)) {
            log.push(`Removed duplicate edge: ${e.from} → ${e.to}`);
            return false;
        }
        seen.add(key);
        return true;
    });

    // STEP 0C — Remove self-loops
    edges = edges.filter(e => {
        if (e.from === e.to) {
            log.push(`Removed self-loop: ${e.from}`);
            return false;
        }
        return true;
    });

    // STEP 0D — Remove orphan edges
    const nodeIds = new Set(nodes.map(n => n.id));
    edges = edges.filter(e => {
        if (!nodeIds.has(e.from) || !nodeIds.has(e.to)) {
            log.push(`Removed orphan edge: ${e.from} → ${e.to}`);
            return false;
        }
        return true;
    });

    // STEP 0E — Fix duplicate layer+column assignments
    const layerGroups = new Map<number, InputNode[]>();
    for (const n of nodes) {
        const group = layerGroups.get(n.layer) || [];
        group.push(n);
        layerGroups.set(n.layer, group);
    }
    for (const [, group] of layerGroups) {
        group.sort((a, b) => a.column - b.column);
        for (let i = 0; i < group.length; i++) {
            group[i].column = i + 1;
        }
    }

    // STEP 0F — Ensure every node has at least one edge
    const nodesWithEdges = new Set<string>();
    for (const e of edges) {
        nodesWithEdges.add(e.from);
        nodesWithEdges.add(e.to);
    }

    const syntheticEdges: InputEdge[] = [];
    for (const node of nodes) {
        if (nodesWithEdges.has(node.id)) continue;

        // Find nearest layer node whose x-center is closest
        let bestNode: InputNode | null = null;
        let bestDist = Infinity;

        for (const candidate of nodes) {
            if (candidate.id === node.id) continue;
            const layerDist = Math.abs(candidate.layer - node.layer);
            if (layerDist === 0) continue;
            const colDist = Math.abs(candidate.column - node.column);
            const dist = layerDist * 1000 + colDist; // prioritize layer proximity
            if (dist < bestDist) {
                bestDist = dist;
                bestNode = candidate;
            }
        }

        if (bestNode) {
            const fromNode = bestNode.layer < node.layer ? bestNode : node;
            const toNode = bestNode.layer < node.layer ? node : bestNode;
            const synEdge: InputEdge = {
                from: fromNode.id,
                to: toNode.id,
                synthetic: true,
            };
            syntheticEdges.push(synEdge);
            nodesWithEdges.add(node.id);
            nodesWithEdges.add(bestNode.id);
            log.push(`Added synthetic edge: ${fromNode.id} → ${toNode.id} to attach isolated node`);
        }
    }

    const allRawEdges = [...edges, ...syntheticEdges];

    const internalEdges: InternalEdge[] = allRawEdges.map(e => ({
        from: e.from,
        to: e.to,
        waypoints: [],
        exitPoint: { x: 0, y: 0 },
        entryPoint: { x: 0, y: 0 },
        exitPort: "bottom" as const,
        entryPort: "top" as const,
        routingType: "smoothstep",
        parallelOffset: 0,
        synthetic: !!e.synthetic,
        raw: e,
    }));

    return { nodes, edges: internalEdges };
}
