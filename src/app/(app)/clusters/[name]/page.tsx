import { getTranslations } from "next-intl/server";
import { ClusterFacts } from "@/components/cluster/facts";
import { ClusterHead } from "@/components/cluster/head";
import { ClusterScale } from "@/components/cluster/scale";
import { ClusterPanel } from "@/components/cluster/tab/panel";
import { ClusterTabs } from "@/components/cluster/tabs";
import { EntityNotFound } from "@/components/not-found";
import { toTab } from "@/constants/cluster";
import { IDENTITIES } from "@/constants/resources";
import { load } from "@/lib/load";
import { clusters } from "@/services/clusters";

// Reads the session and request data: this segment renders per request.
export const instant = false;

export default async function ClusterPage({ params, searchParams }: PageProps<"/clusters/[name]">) {
  const [{ name }, query] = await Promise.all([params, searchParams]);
  const tab = toTab(query.tab);
  const translations = { clusters: await getTranslations("clusters") };

  const cluster = await load.optional(clusters.get(name));
  if (!cluster) return <EntityNotFound entity={IDENTITIES.CLUSTERS} backHref="/clusters" />;

  return (
    <div className="flex flex-col gap-6">
      <ClusterHead cluster={cluster} />
      <ClusterFacts cluster={cluster} />
      <section aria-label={translations.clusters("actions")} className="flex flex-wrap items-center gap-x-10 gap-y-3.5">
        <ClusterScale key={cluster.workers.desired} name={cluster.name} workers={cluster.workers.desired} />
      </section>
      <ClusterTabs name={cluster.name} current={tab} />
      <ClusterPanel cluster={cluster} tab={tab} query={query} />
    </div>
  );
}
