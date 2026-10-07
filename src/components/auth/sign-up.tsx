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
import { signUp } from "@/lib/auth/client";
import { buildSignUpSchema, type SignUpValues } from "@/validations/auth";

const FIELDS = [
  { name: "name", type: "text", autoComplete: "name" },
  { name: "email", type: "email", autoComplete: "email" },
  { name: "username", type: "text", autoComplete: "username" },
  { name: "password", type: "password", autoComplete: "new-password" },
] as const;

export function SignUp() {
  const translations = { signUp: useTranslations("signUp") };
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const validationMessages = useValidationMessages();
  const schema = useMemo(() => buildSignUpSchema(validationMessages), [validationMessages]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", username: "", password: "" },
  });

  function onSubmit(values: SignUpValues) {
    startTransition(async () => {
      const { error } = await signUp.email(values);
      if (error) {
        toast.error(translations.signUp("error"));
        return;
      }
      router.push("/");
      router.refresh();
    });
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      {FIELDS.map(({ name, type, autoComplete }) => (
        <div key={name} className="flex flex-col gap-2">
          <Label htmlFor={name}>{translations.signUp(name)}</Label>
          <Input id={name} type={type} autoComplete={autoComplete} aria-invalid={!!errors[name]} {...register(name)} />
          {errors[name] && <p className="text-destructive text-sm">{errors[name].message}</p>}
        </div>
      ))}
      <Button type="submit" disabled={pending}>
        {translations.signUp("submit")}
      </Button>
      <p className="text-muted-foreground text-center text-sm">
        {translations.signUp("hasAccount")}{" "}
        <Link className="text-foreground underline" href="/sign-in">
          {translations.signUp("signIn")}
        </Link>
      </p>
    </form>
  );
}
