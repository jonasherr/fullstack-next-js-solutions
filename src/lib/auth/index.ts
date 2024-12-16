import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { verify } from "@node-rs/argon2";
import { db } from "../db";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      (session.user.id as string) = token.id as string;

      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  providers: [
    Credentials({
      name: "E-Mail",
      credentials: {
        email: { label: "E-Mail", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const parsedCredentials = CredentialsSchema.parse(credentials);

          const user = await db.query.usersTable.findFirst({
            where: (users, { eq }) => eq(users.email, parsedCredentials.email),
          });
          if (!user) {
            throw new Error("User not found.");
          }

          const { password, id, ...userWithoutPasswordAndId } = user;
          const isPasswordMatch = await verify(
            password,
            parsedCredentials.password,
          );
          if (!isPasswordMatch) {
            throw new Error("User not found.");
          }

          return { id: id.toString(), ...userWithoutPasswordAndId };
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
  ],
});
