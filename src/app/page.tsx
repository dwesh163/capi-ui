import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SignOut } from "@/components/auth/sign-out";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { session } from "@/lib/auth/server";

export default async function Home() {
  const translations = { home: await getTranslations("home") };
  const current = await session();
  if (!current) redirect("/sign-in");
  const { user } = current;

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{translations.home("greeting", { name: user.name })}</CardTitle>
          <CardDescription>{translations.home("signedInAs", { email: user.email })}</CardDescription>
        </CardHeader>
        <CardContent>
          <SignOut />
        </CardContent>
      </Card>
    </main>
  );
}
