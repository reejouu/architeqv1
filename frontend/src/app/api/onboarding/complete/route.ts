import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const ROLES = ["Founder", "Product Manager", "Engineer", "Designer", "Other"] as const;
const TEAM_SIZES = ["Just me", "2-10", "11-50", "50+"] as const;
const INTENTS = ["Personal project", "Startup", "Client work", "Enterprise"] as const;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      role,
      teamSize,
      ...(intent ? { intent } : {}),
      onboardingComplete: true,
      lastActiveAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}

