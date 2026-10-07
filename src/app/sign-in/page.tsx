import { getTranslations } from "next-intl/server";
import { SignIn } from "@/components/auth/sign-in";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const translations = { login: await getTranslations("login") };
  const { callbackUrl } = await searchParams;
  // Only same-origin paths: never redirect to an arbitrary URL after sign-in.
  const target = typeof callbackUrl === "string" && /^\/(?!\/)/.test(callbackUrl) ? callbackUrl : "/";

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{translations.login("title")}</CardTitle>
          <CardDescription>{translations.login("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <SignIn callbackUrl={target} />
        </CardContent>
      </Card>
    </main>
  );
}
