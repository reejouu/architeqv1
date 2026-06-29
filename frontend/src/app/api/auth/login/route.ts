import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body ?? {};

    if (!email || !password) {
        return NextResponse.json({ error: "email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    if (!user.passwordHash) {
        return NextResponse.json(
            { error: "This email uses Google sign-in. Continue with Google instead." },
            { status: 401 },
        );
    }
    if (!(await verifyPassword(password, user.passwordHash))) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } });
    await setSessionCookie({ userId: user.id, email: user.email });

    return NextResponse.json({
        user: { id: user.id, email: user.email, name: user.name, onboardingComplete: user.onboardingComplete },
    });
}
