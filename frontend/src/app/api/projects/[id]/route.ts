import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getProjectIfOwner, updateProjectTitle } from "@/lib/repositories/projectRepository";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const project = await getProjectIfOwner(id, session.userId);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await request.json().catch(() => null);
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    if (!title) {
        return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const updated = await updateProjectTitle(id, title);
    return NextResponse.json({ project: updated });
}
