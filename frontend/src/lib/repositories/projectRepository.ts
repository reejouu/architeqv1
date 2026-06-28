import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface SavedNode {
    id: string;
    type?: string;
    position: { x: number; y: number };
    data?: Record<string, any>;
}

export interface SavedEdge {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
    type?: string;
    style?: Record<string, any>;
    markerEnd?: any;
    data?: Record<string, any>;
}

export interface SavedRisk {
    nodeKey?: string | null;
    severity?: string | null;
    description: string;
}

export interface GraphPayload {
    nodes: SavedNode[];
    edges: SavedEdge[];
    risks?: SavedRisk[];
}

export async function getOrCreateUserProject(userId: string) {
    const existing = await prisma.project.findFirst({ where: { ownerId: userId } });
    if (existing) return existing;
    return prisma.project.create({ data: { ownerId: userId } });
}

export async function getProjectIfOwner(projectId: string, userId: string) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.ownerId !== userId) return null;
    return project;
}

export async function updateProjectTitle(projectId: string, title: string) {
    return prisma.project.update({ where: { id: projectId }, data: { title } });
}

const TRANSACTION_OPTIONS = { timeout: 20000, maxWait: 10000 };

// Locks the Project row for the duration of the transaction so two concurrent
// mutations (e.g. two version deletes, or a delete racing a save) against the
// same project can't interleave their reads/writes — the second one just waits.
async function lockProject(tx: Prisma.TransactionClient, projectId: string) {
    await tx.$executeRaw`SELECT 1 FROM "Project" WHERE id = ${projectId} FOR UPDATE`;
}

export async function saveVersion(projectId: string, graph: GraphPayload) {
    return prisma.$transaction(async (tx) => {
        await lockProject(tx, projectId);

        const last = await tx.version.findFirst({
            where: { projectId },
            orderBy: { versionNumber: "desc" },
        });
        const versionNumber = (last?.versionNumber ?? 0) + 1;

        const version = await tx.version.create({
            data: { projectId, versionNumber },
        });

        if (graph.nodes.length > 0) {
            await tx.node.createMany({
                data: graph.nodes.map((n) => {
                    const { label, ...metadata } = n.data ?? {};
                    return {
                        versionId: version.id,
                        nodeKey: n.id,
                        label: label ?? "",
                        type: n.type ?? "archNode",
                        x: n.position.x,
                        y: n.position.y,
                        metadata,
                    };
                }),
            });
        }

        if (graph.edges.length > 0) {
            await tx.edge.createMany({
                data: graph.edges.map((e) => ({
                    versionId: version.id,
                    edgeKey: e.id,
                    source: e.source,
                    target: e.target,
                    metadata: {
                        sourceHandle: e.sourceHandle ?? null,
                        targetHandle: e.targetHandle ?? null,
                        type: e.type ?? null,
                        style: e.style ?? null,
                        markerEnd: e.markerEnd ?? null,
                        data: e.data ?? null,
                    },
                })),
            });
        }

        if (graph.risks && graph.risks.length > 0) {
            await tx.risk.createMany({
                data: graph.risks.map((r) => ({
                    versionId: version.id,
                    nodeKey: r.nodeKey ?? null,
                    severity: r.severity ?? null,
                    description: r.description,
                })),
            });
        }

        await tx.project.update({ where: { id: projectId }, data: { updatedAt: new Date() } });

        return version;
    }, TRANSACTION_OPTIONS);
}

export async function loadLatestVersion(projectId: string): Promise<GraphPayload | null> {
    const version = await prisma.version.findFirst({
        where: { projectId },
        orderBy: { versionNumber: "desc" },
        include: { nodes: true, edges: true, risks: true },
    });
    if (!version) return null;

    return reassembleGraph(version);
}

export async function listVersions(projectId: string) {
    return prisma.version.findMany({
        where: { projectId },
        orderBy: { versionNumber: "desc" },
        select: { id: true, versionNumber: true, createdAt: true },
    });
}

// Deletes a version and shifts every later version's number down by one,
// so version numbers stay contiguous (1..N) with no gaps.
export async function deleteVersion(projectId: string, versionNumber: number): Promise<boolean> {
    return prisma.$transaction(async (tx) => {
        await lockProject(tx, projectId);

        const target = await tx.version.findUnique({
            where: { projectId_versionNumber: { projectId, versionNumber } },
        });
        if (!target) return false;

        await tx.version.delete({ where: { id: target.id } });

        const later = await tx.version.findMany({
            where: { projectId, versionNumber: { gt: versionNumber } },
            orderBy: { versionNumber: "asc" },
            select: { id: true, versionNumber: true },
        });
        for (const v of later) {
            await tx.version.update({ where: { id: v.id }, data: { versionNumber: v.versionNumber - 1 } });
        }

        return true;
    }, TRANSACTION_OPTIONS);
}

// Read-only: loads a past version's graph for previewing on the canvas.
// Does NOT write anything — restoring only becomes permanent if the user
// then clicks Save, which creates a new version off this content.
export async function loadVersion(projectId: string, versionNumber: number): Promise<GraphPayload | null> {
    const version = await prisma.version.findUnique({
        where: { projectId_versionNumber: { projectId, versionNumber } },
        include: { nodes: true, edges: true, risks: true },
    });
    if (!version) return null;

    return reassembleGraph(version);
}

function reassembleGraph(version: {
    nodes: { nodeKey: string; label: string; type: string; x: number; y: number; metadata: any }[];
    edges: { edgeKey: string; source: string; target: string; metadata: any }[];
}): GraphPayload {
    const nodes: SavedNode[] = version.nodes.map((n) => ({
        id: n.nodeKey,
        type: n.type,
        position: { x: n.x, y: n.y },
        data: { label: n.label, ...n.metadata },
    }));

    const edges: SavedEdge[] = version.edges.map((e) => ({
        id: e.edgeKey,
        source: e.source,
        target: e.target,
        sourceHandle: e.metadata?.sourceHandle ?? undefined,
        targetHandle: e.metadata?.targetHandle ?? undefined,
        type: e.metadata?.type ?? undefined,
        style: e.metadata?.style ?? undefined,
        markerEnd: e.metadata?.markerEnd ?? undefined,
        data: e.metadata?.data ?? undefined,
    }));

    return { nodes, edges };
}
