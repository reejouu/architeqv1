import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY || "sk_prod_placeholder_change_me",
});

export async function POST(request: NextRequest) {
  // Get current user session from NextAuth
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  // Generate a random color for the user's cursor
  const colors = [
    "#ef4444", "#3b82f6", "#22c55e", "#eab308", 
    "#a855f7", "#ec4899", "#f97316", "#06b6d4"
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];

  // Create a Liveblocks session for this user
  const user = {
    id: session.user.email || `user_${Math.random()}`,
    info: {
      name: session.user.name || "Anonymous User",
      color,
      avatar: session.user.image ?? undefined,
    },
  };

  try {
    const liveblocksSession = liveblocks.prepareSession(user.id, {
      userInfo: user.info,
    });

    // Provide full access to all rooms (or dynamically parse body.room if preferred)
    liveblocksSession.allow("*", liveblocksSession.FULL_ACCESS);

    const { status, body } = await liveblocksSession.authorize();

    return new NextResponse(body, { status });
  } catch (err) {
    console.error("Liveblocks Auth Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
