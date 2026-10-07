import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/nav";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";

export async function AppSidebar() {
  const translations = { app: await getTranslations("app") };

  return (
    <Sidebar>
      <SidebarHeader className="h-14 justify-center border-b px-4">
        <Link href="/clusters" className="font-mono text-sm font-medium tracking-tight">
          {translations.app("title")}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <Nav />
      </SidebarContent>
    </Sidebar>
  );
}
