import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
    const body = await request.json().catch(() => ({}));
    const { email, password, name } = body ?? {};

    if (!email || !password || !name) {
        return NextResponse.json({ error: "email, password and name are required" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        if (!existing.passwordHash) {
            return NextResponse.json(
                { error: "This email is registered via Google. Continue with Google instead." },
                { status: 409 },
            );
        }
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
        data: { email, passwordHash, name },
    });

    await setSessionCookie({ userId: user.id, email: user.email });

    return NextResponse.json({
        user: { id: user.id, email: user.email, name: user.name, onboardingComplete: user.onboardingComplete },
    });
}
