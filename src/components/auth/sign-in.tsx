"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/client";

export function SignIn({ callbackUrl }: { callbackUrl: string }) {
  const translations = { login: useTranslations("login") };
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    const { error } = await signIn.social({ provider: "github", callbackURL: callbackUrl });
    if (error) {
      setPending(false);
      toast.error(translations.login("error"));
    }
  }

  return (
    <Button className="w-full" disabled={pending} onClick={handleClick}>
      {translations.login("github")}
    </Button>
  );
}
