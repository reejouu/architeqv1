import { NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/auth/google";

const STATE_COOKIE = "google_oauth_state";

export async function GET() {
    const state = crypto.randomUUID();
    const response = NextResponse.redirect(getGoogleAuthUrl(state));
    response.cookies.set(STATE_COOKIE, state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 5,
    });
    return response;
}
