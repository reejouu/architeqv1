import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getOrCreateUserProject } from "@/lib/repositories/projectRepository";

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const project = await getOrCreateUserProject(session.userId);
    return NextResponse.json({ project });
}
