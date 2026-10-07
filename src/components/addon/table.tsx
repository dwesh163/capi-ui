import { getTranslations } from "next-intl/server";
import { StatusDot } from "@/components/status/dot";
import type { Addon } from "@/types/addon";

export async function AddonList({ addons }: { addons: Addon[] }) {
  const translations = { addons: await getTranslations("addons") };

  if (addons.length === 0) {
    return <p className="text-muted-foreground p-6 text-sm">{translations.addons("empty")}</p>;
  }

  return (
    <ul>
      {addons.map((addon) => (
        <li
          key={addon.name}
          className="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-b px-4 py-3 last:border-b-0"
        >
          <div className="min-w-0 flex-[1_1_280px]">
            <b className="font-medium">{addon.name}</b>
            <p className="text-muted-foreground text-sm">
              {translations.addons("namespace", { namespace: addon.namespace })}
              {addon.message && <span className="text-destructive block break-words">{addon.message}</span>}
            </p>
          </div>
          <span className="text-muted-foreground flex-[1_1_200px] font-mono text-xs break-words">
            {addon.chart}@{addon.version}
          </span>
          <span className="w-28">
            <StatusDot
              tone={addon.state}
              label={
                translations.addons.has(`status.${addon.status}`)
                  ? translations.addons(`status.${addon.status}`)
                  : addon.status
              }
            />
          </span>
          <span className="text-muted-foreground w-20 text-right font-mono text-xs">
            {addon.revision === null ? "—" : `rev ${addon.revision}`}
          </span>
        </li>
      ))}
    </ul>
  );
}
