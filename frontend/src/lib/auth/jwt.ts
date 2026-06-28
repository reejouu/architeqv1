import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "session";

export interface SessionPayload {
    userId: string;
    email: string;
}

function getSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not set");
    return new TextEncoder().encode(secret);
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, getSecret());
        if (typeof payload.userId !== "string" || typeof payload.email !== "string") return null;
        return { userId: payload.userId, email: payload.email };
    } catch {
        return null;
    }
}
