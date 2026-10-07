import { getTranslations } from "next-intl/server";
import { SignUp } from "@/components/auth/sign-up";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SignUpPage() {
  const translations = { signUp: await getTranslations("signUp") };

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{translations.signUp("title")}</CardTitle>
          <CardDescription>{translations.signUp("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUp />
        </CardContent>
      </Card>
    </main>
  );
}
