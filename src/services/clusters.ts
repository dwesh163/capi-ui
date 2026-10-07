import { IDENTITIES } from "@/constants/resources";
import { toneOf } from "@/constants/status";
import { getUser } from "@/lib/auth/server";
import { KINDS, kube } from "@/lib/kubernetes";
import type { Cluster } from "@/types/cluster";

type ClusterSpec = {
  spec?: { controlPlaneEndpoint?: { host?: string; port?: number } };
  status?: {
    phase?: string;
    controlPlane?: { desiredReplicas?: number; readyReplicas?: number; versions?: { version: string }[] };
    workers?: { desiredReplicas?: number; readyReplicas?: number };
  };
};

type ClusterResource = Awaited<ReturnType<typeof kube.get<ClusterSpec>>>;

function toCluster({ metadata, spec, status }: ClusterResource): Cluster {
  const host = spec?.controlPlaneEndpoint?.host;
  const phase = status?.phase ?? "Unknown";
  return {
    name: metadata.name,
    state: toneOf(phase),
    phase,
    version: status?.controlPlane?.versions?.[0]?.version ?? "—",
    endpoint: host ? `${host}:${spec?.controlPlaneEndpoint?.port ?? 6443}` : null,
    controlPlane: {
      desired: status?.controlPlane?.desiredReplicas ?? 0,
      ready: status?.controlPlane?.readyReplicas ?? 0,
    },
    workers: { desired: status?.workers?.desiredReplicas ?? 0, ready: status?.workers?.readyReplicas ?? 0 },
    createdAt: metadata.creationTimestamp ?? null,
  };
}

export const clusters = {
  async list() {
    await getUser();
    const items = await kube.list<ClusterSpec>(IDENTITIES.CLUSTERS, KINDS.CLUSTERS);
    return items.map(toCluster);
  },
  async get(name: string) {
    await getUser();
    return toCluster(await kube.get<ClusterSpec>(IDENTITIES.CLUSTERS, KINDS.CLUSTERS, name));
  },
};
