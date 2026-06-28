import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getProjectIfOwner, listVersions } from "@/lib/repositories/projectRepository";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const project = await getProjectIfOwner(id, session.userId);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const versions = await listVersions(id);
    return NextResponse.json({ versions });
}
