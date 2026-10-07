import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ClusterSwitcher } from "@/components/cluster/switcher";
import { ThemeToggle } from "@/components/layout/theme";
import { UserMenu } from "@/components/layout/user";

export async function Header({ user, clusters }: { user: { name: string; email: string }; clusters: string[] }) {
  const translations = { app: await getTranslations("app") };

  return (
    <header className="bg-background/80 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex h-12 w-full max-w-[1120px] items-center gap-1 px-4 sm:px-8">
        <Link href="/clusters" className="mr-2 font-mono text-sm font-medium tracking-tight">
          {translations.app("title")}
        </Link>
        <ClusterSwitcher names={clusters} />
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <UserMenu name={user.name} email={user.email} />
        </div>
      </div>
    </header>
  );
}
