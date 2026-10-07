import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/layout/theme";
import { UserMenu } from "@/components/layout/user";

export async function Header({ user }: { user: { name: string; email: string } }) {
  const translations = { app: await getTranslations("app") };

  return (
    <header className="bg-background/80 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-4 sm:px-8">
        <Link href="/clusters" className="font-mono text-sm font-medium tracking-tight">
          {translations.app("title")}
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <UserMenu name={user.name} email={user.email} />
        </div>
      </div>
    </header>
  );
}
