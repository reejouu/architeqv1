import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getProjectIfOwner, loadVersion } from "@/lib/repositories/projectRepository";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string; version: string }> },
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, version } = await params;
    const project = await getProjectIfOwner(id, session.userId);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const versionNumber = Number(version);
    if (!Number.isInteger(versionNumber)) {
        return NextResponse.json({ error: "Invalid version" }, { status: 400 });
    }

    const graph = await loadVersion(id, versionNumber);
    if (!graph) return NextResponse.json({ error: "Version not found" }, { status: 404 });

    return NextResponse.json(graph);
}
