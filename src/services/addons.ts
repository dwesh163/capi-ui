import { IDENTITIES } from "@/constants/resources";
import type { Tone } from "@/constants/status";
import { getUser } from "@/lib/auth/server";
import { CLUSTER_LABEL, KINDS, kube } from "@/lib/kubernetes";
import type { Addon } from "@/types/addon";

type Condition = { type: string; status: string; message?: string };

type ChartProxy = {
  spec?: {
    chartName?: string;
    version?: string;
    repoURL?: string;
    namespace?: string;
    releaseName?: string;
    clusterSelector?: { matchLabels?: Record<string, string> };
  };
};

type ReleaseProxy = {
  status?: { status?: string; revision?: number; conditions?: Condition[] };
};

const CHART_LABEL = "helmreleaseproxy.addons.cluster.x-k8s.io/helmchartproxy-name";

function selects(selector: Record<string, string> | undefined, labels: Record<string, string>) {
  return Object.entries(selector ?? {}).every(([key, value]) => labels[key] === value);
}

function stateOf(status: string | undefined, ready: Condition | undefined): Tone {
  if (status === "deployed") return "ok";
  if (ready?.status === "False" && ready.message) return "crit";
  return "busy";
}

export const addons = {
  async list(cluster: string) {
    await getUser();
    const [charts, releases, resource] = await Promise.all([
      kube.list<ChartProxy>(IDENTITIES.ADDONS, KINDS.HELM_CHART_PROXIES),
      kube.list<ReleaseProxy>(IDENTITIES.ADDONS, KINDS.HELM_RELEASE_PROXIES, `${CLUSTER_LABEL}=${cluster}`),
      kube.get<object>(IDENTITIES.CLUSTERS, KINDS.CLUSTERS, cluster),
    ]);
    const labels = resource.metadata.labels ?? {};
    const byChart = new Map(releases.map((release) => [release.metadata.labels?.[CHART_LABEL], release]));

    return charts
      .filter((chart) => selects(chart.spec?.clusterSelector?.matchLabels, labels))
      .map((chart): Addon => {
        const release = byChart.get(chart.metadata.name);
        const ready = release?.status?.conditions?.find((condition) => condition.type === "Ready");
        return {
          name: chart.spec?.releaseName ?? chart.metadata.name,
          chart: chart.spec?.chartName ?? "—",
          version: chart.spec?.version ?? "—",
          repository: chart.spec?.repoURL ?? "—",
          namespace: chart.spec?.namespace ?? "—",
          state: stateOf(release?.status?.status, ready),
          status: release?.status?.status ?? "pending",
          revision: release?.status?.revision ?? null,
          message: ready?.status === "False" && ready.message ? ready.message : null,
        };
      });
  },
};
