import Link from "next/link";
import { Phase } from "@/components/status/phase";
import { cn } from "@/lib/utils";
import type { Cluster } from "@/types/cluster";

export function ClusterChips({ clusters, current }: { clusters: Cluster[]; current: string }) {
  return (
    <nav className="flex gap-2 overflow-x-auto pb-0.5">
      {clusters.map((cluster) => (
        <Link
          key={cluster.name}
          href={`/clusters/${cluster.name}`}
          aria-current={cluster.name === current ? "page" : undefined}
          className={cn(
            "bg-card hover:bg-accent inline-flex items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-3 font-mono text-sm whitespace-nowrap",
            cluster.name === current && "border-foreground",
          )}
        >
          <Phase phase={cluster.phase} tone={cluster.state} dotOnly />
          {cluster.name}
        </Link>
      ))}
    </nav>
  );
}
