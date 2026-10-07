import { Download } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { removeCluster } from "@/actions/clusters";
import { DeleteButton } from "@/components/dialog/delete";
import { Phase } from "@/components/status/phase";
import { Button } from "@/components/ui/button";
import type { Cluster } from "@/types/cluster";

export async function ClusterHead({ cluster }: { cluster: Cluster }) {
  const translations = { cluster: await getTranslations("cluster") };

  return (
    <header className="flex flex-wrap items-end justify-between gap-x-5 gap-y-3.5">
      <div>
        <h1 className="flex flex-wrap items-center gap-3.5 text-[clamp(30px,5vw,44px)] leading-none font-semibold tracking-[-0.035em]">
          {cluster.name}
          <span className="font-sans text-sm font-normal tracking-normal">
            <Phase phase={cluster.phase} tone={cluster.state} />
          </span>
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {translations.cluster("subtitle", {
            zones: cluster.failureDomains.length ? cluster.failureDomains.join(", ") : "—",
          })}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          {/* a file download: a route handler, not a client navigation */}
          <a href={`/api/clusters/${cluster.name}/kubeconfig`} download>
            <Download />
            {translations.cluster("kubeconfig")}
          </a>
        </Button>
        <DeleteButton name={cluster.name} redirectTo="/clusters" onDelete={removeCluster.bind(null, cluster.name)} />
      </div>
    </header>
  );
}
