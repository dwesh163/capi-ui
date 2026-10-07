import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { TABS, type Tab } from "@/constants/cluster";
import { cn } from "@/lib/utils";

export async function ClusterTabs({ name, current }: { name: string; current: Tab }) {
  const translations = { tabs: await getTranslations("cluster.tabs") };

  return (
    <nav className="mt-2 flex gap-5 overflow-x-auto border-b" aria-label={translations.tabs("label")}>
      {TABS.map((tab) => (
        <Link
          key={tab}
          href={`/clusters/${name}?tab=${tab}`}
          aria-current={tab === current ? "page" : undefined}
          className={cn(
            "text-muted-foreground hover:text-foreground -mb-px border-b-2 border-transparent pb-2.5 text-sm font-medium whitespace-nowrap",
            tab === current && "text-foreground border-foreground",
          )}
        >
          {translations.tabs(tab)}
        </Link>
      ))}
    </nav>
  );
}
