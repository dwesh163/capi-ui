"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useValidationMessages } from "@/hooks/validation";
import { signIn } from "@/lib/auth/client";
import { buildSignInSchema, type SignInValues } from "@/validations/auth";

export function SignIn({ callbackUrl }: { callbackUrl: string }) {
  const translations = { signIn: useTranslations("signIn") };
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const validationMessages = useValidationMessages();
  const schema = useMemo(() => buildSignInSchema(validationMessages), [validationMessages]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({ resolver: zodResolver(schema), defaultValues: { username: "", password: "" } });

  function onSubmit(values: SignInValues) {
    startTransition(async () => {
      const { error } = await signIn.username(values);
      if (error) {
        toast.error(translations.signIn("error"));
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    });
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">{translations.signIn("username")}</Label>
        <Input id="username" autoComplete="username" aria-invalid={!!errors.username} {...register("username")} />
        {errors.username && <p className="text-destructive text-sm">{errors.username.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{translations.signIn("password")}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
      </div>
      <Button type="submit" disabled={pending}>
        {translations.signIn("submit")}
      </Button>
      <p className="text-muted-foreground text-center text-sm">
        {translations.signIn("noAccount")}{" "}
        <Link className="text-foreground underline" href="/sign-up">
          {translations.signIn("signUp")}
        </Link>
      </p>
    </form>
  );
}
