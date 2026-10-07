import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/layout/theme";
import { UserMenu } from "@/components/layout/user";
import { SidebarTrigger } from "@/components/ui/sidebar";

export async function Header({ user }: { user: { name: string; email: string } }) {
  const translations = { nav: await getTranslations("nav") };

  return (
    <header className="bg-background/80 sticky top-0 z-10 flex h-14 items-center gap-2 border-b px-4 backdrop-blur">
      <SidebarTrigger aria-label={translations.nav("toggle")} />
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <UserMenu name={user.name} email={user.email} />
      </div>
    </header>
  );
}
