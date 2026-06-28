import { NextRequest, NextResponse } from "next/server";
import { Liveblocks } from "@liveblocks/node";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

// Cursor-color palette — each user gets one at random per session
const CURSOR_COLORS = [
    "#E57373", "#F06292", "#BA68C8", "#9575CD",
    "#7986CB", "#64B5F6", "#4FC3F7", "#4DD0E1",
    "#4DB6AC", "#81C784", "#AED581", "#FFD54F",
    "#FFB74D", "#FF8A65", "#A1887F", "#90A4AE",
];

export async function POST(req: NextRequest) {
    // Authenticate using the project's existing JWT session
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user details for cursor labels
    const user = await prisma.user.findUnique({
        where: { id: session.userId },
    });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const color = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];

    // Create a Liveblocks session for this user
    const liveblocksSession = liveblocks.prepareSession(user.id, {
        userInfo: {
            name: user.name || user.email,
            email: user.email,
            color,
        },
    });

    // Allow full access to all rooms (room-level auth can be added later)
    liveblocksSession.allow("*", liveblocksSession.FULL_ACCESS);

    const { status, body } = await liveblocksSession.authorize();
    return new NextResponse(body, { status });
}
