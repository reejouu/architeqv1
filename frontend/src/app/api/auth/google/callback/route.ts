import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { exchangeGoogleCode } from "@/lib/auth/google";
import { setSessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const STATE_COOKIE = "google_oauth_state";

export async function GET(request: NextRequest) {
    const url = request.nextUrl;
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const expectedState = request.cookies.get(STATE_COOKIE)?.value;

    const loginError = (reason: string) => {
        const response = NextResponse.redirect(new URL(`/?modal=login&error=${reason}`, url));
        response.cookies.delete(STATE_COOKIE);
        return response;
    };

    if (!code || !state || !expectedState || state !== expectedState) {
        return loginError("google_state_mismatch");
    }

    let profile;
    try {
        profile = await exchangeGoogleCode(code);
    } catch {
        return loginError("google_auth_failed");
    }

    let user = await prisma.user.findUnique({ where: { googleId: profile.googleId } });

    if (!user) {
        const existingByEmail = await prisma.user.findUnique({ where: { email: profile.email } });
        if (existingByEmail) {
            if (existingByEmail.passwordHash) {
                // Flows stay separate — never silently link a password account to Google.
                return loginError("google_email_taken");
            }
            user = existingByEmail;
        } else {
            user = await prisma.user.create({
                data: {
                    googleId: profile.googleId,
                    email: profile.email,
                    name: profile.name,
                    passwordHash: null,
                },
            });
        }
    }

    await setSessionCookie({ userId: user.id, email: user.email });

    const destination = user.onboardingComplete ? "/canvas" : "/?modal=onboarding";
    const response = NextResponse.redirect(new URL(destination, url));
    response.cookies.delete(STATE_COOKIE);
    return response;
}
