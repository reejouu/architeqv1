import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";

const ROLES = ["Founder", "Product Manager", "Engineer", "Designer", "Other"] as const;
const TEAM_SIZES = ["Just me", "2-10", "11-50", "50+"] as const;
const INTENTS = ["Personal project", "Startup", "Client work", "Enterprise"] as const;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const googleId = (session.user as any).googleId as string | undefined;
  if (!googleId) {
    return NextResponse.json({ error: "Missing googleId" }, { status: 400 });
  }

  const body = await request.json();
  const { role, teamSize, intent } = body ?? {};

  if (!ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  if (!TEAM_SIZES.includes(teamSize)) {
    return NextResponse.json({ error: "Invalid team size" }, { status: 400 });
  }
  if (intent && !INTENTS.includes(intent)) {
    return NextResponse.json({ error: "Invalid intent" }, { status: 400 });
  }

  await connectDB();

  await User.updateOne(
    { googleId },
    {
      $set: {
        role,
        teamSize,
        ...(intent ? { intent } : {}),
        onboardingComplete: true,
        lastActiveAt: new Date(),
      },
    },
    { upsert: false },
  );

  return NextResponse.json({ success: true });
}

