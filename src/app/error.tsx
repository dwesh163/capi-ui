"use client";
import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { Entity } from "@/constants/resources";
import { cn } from "@/lib/utils";

export default function AppError({
  error,
  reset,
  fullScreen = true,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  fullScreen?: boolean;
  entity?: Entity;
}) {
  const translations = { error: useTranslations("error") };

  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center",
        fullScreen && "min-h-svh",
      )}
    >
      <TriangleAlert className="text-destructive size-8" />
      <p className="text-lg font-medium">{translations.error("title")}</p>
      {error.digest && <p className="text-muted-foreground font-mono text-xs">{error.digest}</p>}
      <Button variant="outline" onClick={reset}>
        {translations.error("retry")}
      </Button>
    </div>
  );
}
