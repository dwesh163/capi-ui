import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { headers } from "next/headers";
import { UnauthorizedError } from "@/constants/errors";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  emailAndPassword: { enabled: true },
  plugins: [username(), nextCookies()],
});

export async function session() {
  return auth.api.getSession({ headers: await headers() });
}

export async function getUser() {
  const result = await session();
  if (!result?.user) throw new UnauthorizedError();
  return result.user;
}
