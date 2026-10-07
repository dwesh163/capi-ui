import { getTranslations } from "next-intl/server";
import { StatusDot } from "@/components/status/dot";
import type { Condition } from "@/types/cluster";

export async function ClusterConditions({ conditions }: { conditions: Condition[] }) {
  const translations = { conditions: await getTranslations("conditions") };

  return (
    <ul>
      {conditions.map((condition) => (
        <li
          key={condition.type}
          className="flex flex-wrap items-center gap-x-5 gap-y-1 border-b px-4 py-2.5 last:border-b-0"
        >
          <span className="min-w-0 flex-[1_1_240px] font-mono text-sm">{condition.type}</span>
          <span className="text-muted-foreground flex-[1_1_200px] font-mono text-xs">{condition.reason || "—"}</span>
          <StatusDot
            tone={condition.ok ? "ok" : "crit"}
            label={translations.conditions(condition.ok ? "ok" : "failing")}
          />
        </li>
      ))}
    </ul>
  );
}
