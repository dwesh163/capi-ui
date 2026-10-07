import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { session } from "@/lib/auth/server";

// Reads the session and request data: this segment renders per request.
export const instant = false;

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const current = await session();
  if (!current) redirect("/sign-in");

  return (
    <div className="flex flex-1 flex-col">
      <Header user={current.user} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 pb-16 sm:px-8">{children}</main>
    </div>
  );
}
