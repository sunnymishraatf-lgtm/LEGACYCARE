import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { db } from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null;
        }

        const email = credentials.email
          .trim()
          .toLowerCase();

        const user = await db.user.findUnique({
          where: {
            email,
          },
        });

        if (!user?.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },

  events: {
    async signIn({ user }) {
      try {
        if (!user.id) {
          return;
        }

        await db.auditLog.create({
          data: {
            userId: user.id,
            action: "LOGIN",
            resourceType: "SESSION",
            metadata: JSON.stringify({
              method: "credentials",
            }),
          },
        });
      } catch (error) {
        console.error(
          "Failed to create login audit log:",
          error
        );
      }
    },

    async signOut({ token }) {
      try {
        if (!token?.sub) {
          return;
        }

        await db.auditLog.create({
          data: {
            userId: token.sub,
            action: "LOGOUT",
            resourceType: "SESSION",
          },
        });
      } catch (error) {
        console.error(
          "Failed to create logout audit log:",
          error
        );
      }
    },
  },
}