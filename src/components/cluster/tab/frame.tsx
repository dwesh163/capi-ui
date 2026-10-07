import type { ReactNode } from "react";
import { ErrorCard } from "@/components/error";

export function Box({ children }: { children: ReactNode }) {
  return <div className="bg-card overflow-x-auto rounded-lg border">{children}</div>;
}

// A bordered panel, with the load error (if any) shown above it instead of an empty table.
export function Frame({ error, children }: { error: string | null; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      {error && <ErrorCard error={error} />}
      <Box>{children}</Box>
    </div>
  );
}
