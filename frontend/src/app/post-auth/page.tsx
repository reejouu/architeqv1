import { auth } from "@/auth";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { redirect } from "next/navigation";

export default async function PostAuthPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/?modal=login");
  }

  await connectDB();

  const googleId = (session.user as any).googleId as string | undefined;
  if (!googleId) {
    redirect("/?modal=login");
  }

  const existing = await User.findOne({ googleId }).lean();

  if (!existing) {
    await User.create({
      googleId,
      email: session.user.email,
      name: session.user.name ?? "Unknown",
      avatar: session.user.image,
      onboardingComplete: false,
      lastActiveAt: new Date(),
    });
    redirect("/?modal=onboarding");
  }

  await User.updateOne(
    { googleId },
    {
      $set: {
        email: session.user.email,
        name: session.user.name ?? existing.name,
        avatar: session.user.image,
        lastActiveAt: new Date(),
      },
    },
  );

  if (!existing.onboardingComplete) {
    redirect("/?modal=onboarding");
  }

  redirect("/canvas");
}
