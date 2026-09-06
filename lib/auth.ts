import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { builtInDemoAccounts, normalizeDemoEmail } from "./demo-auth";

export const authOptions: NextAuthOptions = {
  // DEMO AUTHENTICATION ONLY: JWT sessions without a database or OAuth service.
  secret: process.env.NEXTAUTH_SECRET || "legacycare-demo-only-session-secret",
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login", error: "/login" },
  providers: [CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      demoLocal: { label: "Demo local account", type: "text" },
      demoName: { label: "Demo name", type: "text" },
      demoRole: { label: "Demo role", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      const email = normalizeDemoEmail(credentials.email);
      const account = builtInDemoAccounts.find((candidate) => normalizeDemoEmail(candidate.email) === email && candidate.password === credentials.password);
      if (!account && credentials.demoLocal !== "true") return null;
      return { id: account?.id || `demo-${email}`, email, name: account?.name || credentials.demoName || "Demo Planner", role: account?.role || (credentials.demoRole === "PROVIDER" ? "PROVIDER" : "PLANNER") };
    },
  })],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = user.role; }
      return token;
    },
    async session({ session, token }) {
      if (session.user) { session.user.id = token.id as string; session.user.role = token.role as string; }
      return session;
    },
  },
};
