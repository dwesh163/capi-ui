import { TriangleAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

export async function ErrorCard({ error, className }: { error: string; className?: string }) {
  const translations = { errors: await getTranslations("errors") };

  return (
    <div
      role="alert"
      className={cn(
        "border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
        className,
      )}
    >
      <TriangleAlert className="size-4 shrink-0" />
      {translations.errors(error)}
    </div>
  );
}
