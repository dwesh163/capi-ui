import { getTranslations } from "next-intl/server";
import { ClusterFacts } from "@/components/cluster/facts";
import { ClusterHead } from "@/components/cluster/head";
import { ClusterScale } from "@/components/cluster/scale";
import { ClusterPanel } from "@/components/cluster/tab/panel";
import { ClusterTabs } from "@/components/cluster/tabs";
import { MachineStrip } from "@/components/machine/strip";
import { EntityNotFound } from "@/components/not-found";
import { toTab } from "@/constants/cluster";
import { IDENTITIES } from "@/constants/resources";
import { load } from "@/lib/load";
import { clusters } from "@/services/clusters";
import { machines } from "@/services/machines";

// Reads the session and request data: this segment renders per request.
export const instant = false;

export default async function ClusterPage({ params, searchParams }: PageProps<"/clusters/[name]">) {
  const [{ name }, query] = await Promise.all([params, searchParams]);
  const tab = toTab(query.tab);
  const translations = { clusters: await getTranslations("clusters") };

  const cluster = await load.optional(clusters.get(name));
  if (!cluster) return <EntityNotFound entity={IDENTITIES.CLUSTERS} backHref="/clusters" />;

  const { data: items, error: machinesError } = await load(machines.list(name), []);

  return (
    <div className="flex flex-col gap-6">
      <ClusterHead cluster={cluster} />
      <MachineStrip machines={items} />
      <ClusterFacts cluster={cluster} />
      <section aria-label={translations.clusters("actions")} className="flex flex-wrap items-center gap-x-10 gap-y-3.5">
        <ClusterScale key={cluster.workers.desired} name={cluster.name} workers={cluster.workers.desired} />
      </section>
      <ClusterTabs name={cluster.name} current={tab} />
      <ClusterPanel cluster={cluster} machines={items} machinesError={machinesError} tab={tab} query={query} />
    </div>
  );
}
