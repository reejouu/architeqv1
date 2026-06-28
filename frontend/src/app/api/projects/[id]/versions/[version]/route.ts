import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getProjectIfOwner, deleteVersion } from "@/lib/repositories/projectRepository";

export async function DELETE(
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

    const deleted = await deleteVersion(id, versionNumber);
    if (!deleted) return NextResponse.json({ error: "Version not found" }, { status: 404 });

    return NextResponse.json({ success: true });
}
