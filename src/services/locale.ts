"use server";
import { cookies, headers } from "next/headers";
import { defaultLocale, type Locale, locales } from "@/i18n/config";

const COOKIE_NAME = "locale";

function getPreferredLocale(acceptLanguage: string): Locale | null {
  const candidates = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of candidates) {
    const short = tag.split("-")[0] as Locale;
    if (locales.includes(short)) return short;
  }
  return null;
}

export async function getUserLocale() {
  const cookieLocale = (await cookies()).get(COOKIE_NAME)?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) return cookieLocale as Locale;

  const acceptLanguage = (await headers()).get("accept-language");
  if (acceptLanguage) {
    const preferred = getPreferredLocale(acceptLanguage);
    if (preferred) return preferred;
  }
  return defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale);
}
