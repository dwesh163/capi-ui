import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const translations = { notFound: await getTranslations("notFound") };

  return (
    <main className="flex min-h-svh flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-lg font-medium">{translations.notFound("title")}</p>
      <p className="text-muted-foreground">{translations.notFound("description")}</p>
      <Button variant="outline" asChild>
        <Link href="/">{translations.notFound("home")}</Link>
      </Button>
    </main>
  );
}
