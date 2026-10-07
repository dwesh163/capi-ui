import { AddonsTab } from "@/components/cluster/tab/addons";
import { ConditionsTab } from "@/components/cluster/tab/conditions";
import { EventsTab } from "@/components/cluster/tab/events";
import { MachinesTab } from "@/components/cluster/tab/machines";
import { ManifestTab } from "@/components/cluster/tab/manifest";
import { NetworkTab } from "@/components/cluster/tab/network";
import type { Tab } from "@/constants/cluster";
import type { Cluster } from "@/types/cluster";
import type { Query } from "@/types/query";

// Picks the panel for the selected tab; each panel loads only its own data.
export function ClusterPanel({ cluster, tab, query }: { cluster: Cluster; tab: Tab; query: Query }) {
  switch (tab) {
    case "addons":
      return <AddonsTab name={cluster.name} />;
    case "network":
      return <NetworkTab name={cluster.name} />;
    case "conditions":
      return <ConditionsTab conditions={cluster.conditions} />;
    case "manifest":
      return <ManifestTab name={cluster.name} />;
    case "events":
      return <EventsTab name={cluster.name} />;
    default:
      return <MachinesTab name={cluster.name} query={query} />;
  }
}
