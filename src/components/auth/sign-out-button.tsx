"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/client";

export function SignOutButton() {
  const translations = { home: useTranslations("home") };
  const router = useRouter();

  return (
    <Button variant="outline" onClick={() => signOut({ fetchOptions: { onSuccess: () => router.refresh() } })}>
      {translations.home("signOut")}
    </Button>
  );
}
