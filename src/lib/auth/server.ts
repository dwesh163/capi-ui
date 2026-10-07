import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";

const SESSION_SECONDS = 60 * 60 * 24 * 7;

// No `database`: the session lives in an encrypted (JWE) cookie, the OAuth account in an encrypted account cookie.
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  session: {
    expiresIn: SESSION_SECONDS,
    cookieCache: { enabled: true, strategy: "jwe", maxAge: SESSION_SECONDS, refreshCache: true },
  },
  account: { storeAccountCookie: true, storeStateStrategy: "cookie" },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()],
});

export async function session() {
  return auth.api.getSession({ headers: await headers() });
}

export async function getUser() {
  const result = await session();
  if (!result?.user) throw new Error("User not authenticated");
  return result.user;
}
