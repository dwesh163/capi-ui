"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";
import type { ServiceResponse } from "@/types/response";

// Runs an action, toasts the outcome and hands the result back. The error is always a stable
// code (`errors.*`, or `rules.<rule>` for business rules), never a raw message.
export function useMutation() {
  const translations = { errors: useTranslations("errors"), rules: useTranslations("rules") };
  const [isPending, startTransition] = useTransition();

  function run<T>(
    action: () => Promise<ServiceResponse<T>>,
    { success, onSuccess }: { success?: string; onSuccess?: (data: T | null) => void },
  ) {
    startTransition(async () => {
      const { data, error } = await action();
      if (error) {
        toast.error(
          error.startsWith("rules.") ? translations.rules(error.slice("rules.".length)) : translations.errors(error),
        );
        return;
      }
      if (success) toast.success(success);
      onSuccess?.(data);
    });
  }

  return { run, isPending };
}
