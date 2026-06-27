import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

// AUTH TEMPORARILY DISABLED — ngrok/oauth callback was failing and blocking local access.
// Re-enable by uncommenting the session check below.
const AUTH_DISABLED = true;

export async function middleware(request: NextRequest) {
  if (AUTH_DISABLED) {
    return NextResponse.next();
  }

  const session = await auth();
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("modal", "login");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/canvas/:path*", "/project/:path*", "/settings/:path*"],
};
