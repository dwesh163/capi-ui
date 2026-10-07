import { getTranslations } from "next-intl/server";
import { ClusterFacts } from "@/components/cluster/facts";
import { ErrorCard } from "@/components/error";
import { MachineTable } from "@/components/machine/table";
import { EntityNotFound } from "@/components/not-found";
import { Phase } from "@/components/status/phase";
import { IDENTITIES } from "@/constants/resources";
import { load } from "@/lib/load";
import { clusters } from "@/services/clusters";
import { machines } from "@/services/machines";

export default async function ClusterPage({ params }: PageProps<"/clusters/[name]">) {
  const { name } = await params;
  const translations = { machines: await getTranslations("machines"), entities: await getTranslations("entities") };

  const cluster = await load.optional(clusters.get(name));
  if (!cluster) return <EntityNotFound entity={IDENTITIES.CLUSTERS} backHref="/clusters" />;

  const { data: items, error: machinesError } = await load(machines.list(name), []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="font-mono text-3xl font-semibold tracking-tight">{cluster.name}</h1>
        <Phase phase={cluster.phase} tone={cluster.state} />
      </div>
      <ClusterFacts cluster={cluster} />
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">
          {translations.entities("machines.title.plural")}
          <span className="text-muted-foreground ml-2 font-mono text-xs">{items.length}</span>
        </h2>
        {machinesError && <ErrorCard error={machinesError} />}
        <div className="bg-card overflow-x-auto rounded-lg border">
          <MachineTable machines={items} />
        </div>
      </section>
    </div>
  );
}
