import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { AppSidebar } from "@/components/layout/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { session } from "@/lib/auth/server";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const current = await session();
  if (!current) redirect("/sign-in");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header user={current.user} />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
