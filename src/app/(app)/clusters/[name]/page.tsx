import { getTranslations } from "next-intl/server";
import { stringify } from "yaml";
import { AddonList } from "@/components/addon/table";
import { ClusterChips } from "@/components/cluster/chips";
import { ClusterConditions } from "@/components/cluster/conditions";
import { ClusterFacts } from "@/components/cluster/facts";
import { ClusterHead } from "@/components/cluster/head";
import { ClusterManifest } from "@/components/cluster/manifest";
import { ClusterScale } from "@/components/cluster/scale";
import { ClusterTabs } from "@/components/cluster/tabs";
import { ErrorCard } from "@/components/error";
import { EventLog } from "@/components/event/log";
import { MachineTable } from "@/components/machine/table";
import { NetworkPanel } from "@/components/network/panel";
import { EntityNotFound } from "@/components/not-found";
import { type Tab, toTab } from "@/constants/cluster";
import { IDENTITIES } from "@/constants/resources";
import { load } from "@/lib/load";
import { addons } from "@/services/addons";
import { clusters } from "@/services/clusters";
import { events } from "@/services/events";
import { machines } from "@/services/machines";
import { networks } from "@/services/networks";

// Reads the session and request data: this segment renders per request.
export const instant = false;

async function TabPanel({
  name,
  tab,
  conditions,
}: {
  name: string;
  tab: Tab;
  conditions: Parameters<typeof ClusterConditions>[0]["conditions"];
}) {
  if (tab === "conditions")
    return (
      <Box>
        <ClusterConditions conditions={conditions} />
      </Box>
    );

  if (tab === "manifest") {
    const { data: manifest, error } = await load(clusters.manifest(name), null);
    if (error || !manifest) return <ErrorCard error={error ?? "unknown"} />;
    return <ClusterManifest yaml={stringify(manifest)} />;
  }

  if (tab === "addons") {
    const { data, error } = await load(addons.list(name), []);
    return (
      <Panel error={error}>
        <AddonList addons={data} />
      </Panel>
    );
  }

  if (tab === "network") {
    const { data, error } = await load(networks.get(name), null);
    if (error || !data) return <ErrorCard error={error ?? "unknown"} />;
    return <NetworkPanel network={data} />;
  }

  if (tab === "events") {
    const { data, error } = await load(events.list(name), []);
    return (
      <Panel error={error}>
        <EventLog events={data} />
      </Panel>
    );
  }

  const { data, error } = await load(machines.list(name), []);
  return (
    <Panel error={error}>
      <MachineTable machines={data} />
    </Panel>
  );
}

function Box({ children }: { children: React.ReactNode }) {
  return <div className="bg-card overflow-x-auto rounded-lg border">{children}</div>;
}

function Panel({ error, children }: { error: string | null; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      {error && <ErrorCard error={error} />}
      <Box>{children}</Box>
    </div>
  );
}

export default async function ClusterPage({ params, searchParams }: PageProps<"/clusters/[name]">) {
  const [{ name }, query] = await Promise.all([params, searchParams]);
  const tab = toTab(query.tab);
  const translations = { clusters: await getTranslations("clusters") };

  const cluster = await load.optional(clusters.get(name));
  if (!cluster) return <EntityNotFound entity={IDENTITIES.CLUSTERS} backHref="/clusters" />;

  const { data: all, error: clustersError } = await load(clusters.list(), []);

  return (
    <div className="flex flex-col gap-6">
      {clustersError ? <ErrorCard error={clustersError} /> : <ClusterChips clusters={all} current={cluster.name} />}
      <ClusterHead cluster={cluster} />
      <ClusterFacts cluster={cluster} />
      <section aria-label={translations.clusters("actions")} className="flex flex-wrap items-center gap-x-10 gap-y-3.5">
        <ClusterScale key={cluster.workers.desired} name={cluster.name} workers={cluster.workers.desired} />
      </section>
      <ClusterTabs name={cluster.name} current={tab} />
      <TabPanel name={cluster.name} tab={tab} conditions={cluster.conditions} />
    </div>
  );
}
