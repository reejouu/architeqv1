import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile && typeof (profile as any).sub === "string") {
        (token as any).googleId = (profile as any).sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof (token as any).googleId === "string") {
        (session.user as any).googleId = (token as any).googleId;
      }
      return session;
    },
  },
});


