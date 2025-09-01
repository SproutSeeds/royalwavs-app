import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "./db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token?.sub || session.user?.id,
      },
    }),
    jwt: ({ token, account }) => {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
}