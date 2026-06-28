import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getProjectIfOwner, saveVersion } from "@/lib/repositories/projectRepository";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const project = await getProjectIfOwner(id, session.userId);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await request.json().catch(() => null);
    if (!body?.nodes || !body?.edges) {
        return NextResponse.json({ error: "nodes and edges are required" }, { status: 400 });
    }

    const version = await saveVersion(id, { nodes: body.nodes, edges: body.edges, risks: body.risks });
    return NextResponse.json({ versionNumber: version.versionNumber, createdAt: version.createdAt });
}
