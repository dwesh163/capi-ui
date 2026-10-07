import { getTranslations } from "next-intl/server";
import { ClusterTable } from "@/components/cluster/table";
import { clusters as clustersApi } from "@/services/clusters";

// Reads the session and request data: this segment renders per request.
export const instant = false;

export default async function ClustersPage() {
  const translations = { clusters: await getTranslations("clusters"), entities: await getTranslations("entities") };
  const clusters = await clustersApi.list();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{translations.entities("clusters.title.plural")}</h1>
        <p className="text-muted-foreground mt-1.5">{translations.clusters("description")}</p>
      </div>
      <div className="bg-card overflow-x-auto rounded-lg border">
        <ClusterTable clusters={clusters} />
      </div>
      <p className="text-muted-foreground font-mono text-xs">
        {translations.clusters("count", { count: clusters.length })}
      </p>
    </div>
  );
}
