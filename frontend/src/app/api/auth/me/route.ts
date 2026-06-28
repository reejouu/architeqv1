import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ user: null }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return NextResponse.json({ user: null }, { status: 401 });

    return NextResponse.json({
        user: { id: user.id, email: user.email, name: user.name, onboardingComplete: user.onboardingComplete },
    });
}
