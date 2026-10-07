import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { session } from "@/lib/auth/server";
import { load } from "@/lib/load";
import { clusters } from "@/services/clusters";

// Reads the session and request data: this segment renders per request.
export const instant = false;

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const current = await session();
  if (!current) redirect("/sign-in");

  // Chrome only: a failure here must not take the page down, the page reads its own data.
  const { data: items } = await load(clusters.list(), []);

  return (
    <div className="flex flex-1 flex-col">
      <Header user={current.user} clusters={items.map((cluster) => cluster.name)} />
      <main className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col gap-6 px-4 pt-8 pb-20 sm:px-8">
        {children}
      </main>
    </div>
  );
}
