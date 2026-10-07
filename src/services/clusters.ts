import { RuleError } from "@/constants/errors";
import { IDENTITIES } from "@/constants/resources";
import { toneOf } from "@/constants/status";
import { getUser } from "@/lib/auth/server";
import { CLUSTER_LABEL, KINDS, kube } from "@/lib/kubernetes";
import type { Cluster } from "@/types/cluster";

type ClusterSpec = {
  spec?: {
    controlPlaneEndpoint?: { host?: string; port?: number };
    clusterNetwork?: { pods?: { cidrBlocks?: string[] } };
  };
  status?: {
    phase?: string;
    conditions?: { type: string; status: string; reason?: string; message?: string }[];
    failureDomains?: { name: string }[];
    controlPlane?: { desiredReplicas?: number; readyReplicas?: number; versions?: { version: string }[] };
    workers?: { desiredReplicas?: number; readyReplicas?: number };
  };
};

type ClusterResource = Awaited<ReturnType<typeof kube.get<ClusterSpec>>>;

// Conditions where "False" is the healthy value.
const INVERTED = new Set(["Paused", "Deleting", "RollingOut", "Remediating", "ScalingUp", "ScalingDown"]);

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
    podsCidr: spec?.clusterNetwork?.pods?.cidrBlocks?.[0] ?? null,
    failureDomains: (status?.failureDomains ?? []).map((domain) => domain.name),
    conditions: (status?.conditions ?? []).map((condition) => ({
      type: condition.type,
      ok: INVERTED.has(condition.type) ? condition.status === "False" : condition.status === "True",
      reason: condition.reason ?? "",
      message: condition.message ?? "",
    })),
    createdAt: metadata.creationTimestamp ?? null,
  };
}

const MAX_WORKERS = 20;

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
  // The raw Cluster resource, for the manifest tab.
  async manifest(name: string) {
    await getUser();
    const { metadata, spec, status } = await kube.get<{ spec?: unknown; status?: unknown }>(
      IDENTITIES.CLUSTERS,
      KINDS.CLUSTERS,
      name,
    );
    const { managedFields: _managedFields, ...rest } = metadata as typeof metadata & { managedFields?: unknown };
    return { metadata: rest, spec, status } as object;
  },
  async scale(name: string, replicas: number) {
    await getUser();
    if (!Number.isInteger(replicas) || replicas < 0 || replicas > MAX_WORKERS) throw new RuleError("scaleBounds");
    const [deployment] = await kube.list<object>(
      IDENTITIES.CLUSTERS,
      KINDS.MACHINE_DEPLOYMENTS,
      `${CLUSTER_LABEL}=${name}`,
    );
    await kube.scale(IDENTITIES.CLUSTERS, KINDS.MACHINE_DEPLOYMENTS, deployment.metadata.name, replicas);
  },
  async remove(name: string) {
    await getUser();
    await kube.remove(IDENTITIES.CLUSTERS, KINDS.CLUSTERS, name);
  },
  async kubeconfig(name: string) {
    await getUser();
    const data = await kube.secret(IDENTITIES.CLUSTERS, `${name}-kubeconfig`);
    if (!data.value) throw new RuleError("kubeconfigNotReady");
    return Buffer.from(data.value, "base64").toString("utf8");
  },
};
