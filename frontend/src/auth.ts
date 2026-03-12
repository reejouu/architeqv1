import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    jwt({ token, profile, trigger, session }) {
      if (profile && typeof token.hasRenamed === 'undefined') {
        token.name = (profile.given_name as string) || (profile.name as string) || token.name;
      }
      if (trigger === "update" && session?.name) {
         token.name = session.name;
         token.hasRenamed = true;
      }
      return token;
    },
    session({ session, token }) {
      if (token?.name && session.user) {
        session.user.name = token.name as string;
      }
      return session;
    }
  }
})
