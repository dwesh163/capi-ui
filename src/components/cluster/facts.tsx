import { getTranslations } from "next-intl/server";
import type { Cluster } from "@/types/cluster";

function Fact({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="min-w-0 py-3.5 pr-4 sm:not-first:border-l sm:not-first:pl-4">
      <dt className="text-muted-foreground font-mono text-[11px] tracking-wider uppercase">{label}</dt>
      <dd className="mt-1 truncate font-mono text-xl font-medium tracking-tight">{value}</dd>
      {note && <small className="text-muted-foreground block truncate text-xs">{note}</small>}
    </div>
  );
}

export async function ClusterFacts({ cluster }: { cluster: Cluster }) {
  const translations = { cluster: await getTranslations("cluster") };
  const ready = (replicas: Cluster["controlPlane"]) => translations.cluster("facts.ready", replicas);

  return (
    <dl className="grid grid-cols-1 border-y sm:grid-cols-2 lg:grid-cols-4">
      <Fact
        label={translations.cluster("facts.kubernetes")}
        value={cluster.version}
        note={translations.cluster("facts.podsCidr", { cidr: cluster.podsCidr ?? "—" })}
      />
      <Fact
        label={translations.cluster("facts.controlPlane")}
        value={`${cluster.controlPlane.ready}/${cluster.controlPlane.desired}`}
        note={ready(cluster.controlPlane)}
      />
      <Fact
        label={translations.cluster("facts.workers")}
        value={`${cluster.workers.ready}/${cluster.workers.desired}`}
        note={ready(cluster.workers)}
      />
      <Fact
        label={translations.cluster("facts.endpoint")}
        value={cluster.endpoint ?? "—"}
        note={translations.cluster("facts.zones", { zones: cluster.failureDomains.join(", ") || "—" })}
      />
    </dl>
  );
}
