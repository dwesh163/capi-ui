"use client";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { scaleCluster } from "@/actions/clusters";
import { Button } from "@/components/ui/button";
import { useMutation } from "@/hooks/mutation";

export function ClusterScale({ name, workers }: { name: string; workers: number }) {
  const translations = { scale: useTranslations("cluster.scale") };
  const router = useRouter();
  const mutation = useMutation();
  const [desired, setDesired] = useState(workers);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="text-muted-foreground min-w-16 text-sm">{translations.scale("label")}</span>
      <div className="bg-card inline-flex items-center rounded-md border">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={translations.scale("remove")}
          disabled={desired <= 0}
          onClick={() => setDesired(desired - 1)}
        >
          <Minus />
        </Button>
        <output className="min-w-8 text-center font-mono font-medium" aria-live="polite">
          {desired}
        </output>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={translations.scale("add")}
          onClick={() => setDesired(desired + 1)}
        >
          <Plus />
        </Button>
      </div>
      <Button
        disabled={desired === workers || mutation.isPending}
        onClick={() =>
          mutation.run(() => scaleCluster(name, desired), {
            success: translations.scale("success", { count: desired }),
            onSuccess: () => router.refresh(),
          })
        }
      >
        {translations.scale("apply")}
      </Button>
    </div>
  );
}
