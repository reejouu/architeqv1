const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

function getRedirectUri(): string {
    const uri = process.env.GOOGLE_REDIRECT_URI;
    if (!uri) throw new Error("GOOGLE_REDIRECT_URI not set");
    return uri;
}

export function getGoogleAuthUrl(state: string): string {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: getRedirectUri(),
        response_type: "code",
        scope: "openid email profile",
        state,
        prompt: "select_account",
    });
    return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export interface GoogleProfile {
    googleId: string;
    email: string;
    name: string;
}

export async function exchangeGoogleCode(code: string): Promise<GoogleProfile> {
    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: getRedirectUri(),
            grant_type: "authorization_code",
        }),
    });
    if (!tokenRes.ok) throw new Error("Failed to exchange Google code");
    const tokenData = await tokenRes.json();

    const profileRes = await fetch(GOOGLE_USERINFO_URL, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!profileRes.ok) throw new Error("Failed to fetch Google profile");
    const profile = await profileRes.json();

    if (!profile.sub || !profile.email) throw new Error("Incomplete Google profile");

    return { googleId: profile.sub, email: profile.email, name: profile.name ?? profile.email };
}
