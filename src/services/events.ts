import { IDENTITIES } from "@/constants/resources";
import { getUser } from "@/lib/auth/server";
import { kube } from "@/lib/kubernetes";
import type { ClusterEvent } from "@/types/event";

const LIMIT = 100;

export const events = {
  // Cluster API names every machine, config and infrastructure object after its cluster.
  async list(cluster: string) {
    await getUser();
    const items = await kube.events(IDENTITIES.EVENTS);
    return items
      .filter((event) => event.involvedObject.name?.startsWith(cluster))
      .map(
        (event): ClusterEvent => ({
          id: event.metadata?.uid ?? `${event.involvedObject.name}-${event.reason}`,
          time: (event.lastTimestamp ?? event.metadata?.creationTimestamp)?.toISOString() ?? null,
          type: event.type === "Warning" ? "Warning" : "Normal",
          reason: event.reason ?? "",
          kind: event.involvedObject.kind ?? "",
          object: event.involvedObject.name ?? "",
          message: event.message ?? "",
          count: event.count ?? 1,
        }),
      )
      .sort((a, b) => (b.time ?? "").localeCompare(a.time ?? ""))
      .slice(0, LIMIT);
  },
};
