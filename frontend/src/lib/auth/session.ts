import { cookies } from "next/headers";
import { SESSION_COOKIE, signSessionToken, verifySessionToken, type SessionPayload } from "./jwt";

export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return verifySessionToken(token);
}

export async function setSessionCookie(payload: SessionPayload) {
    const token = await signSessionToken(payload);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });
}

export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}
