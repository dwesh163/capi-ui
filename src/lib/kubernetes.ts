import { CoreV1Api, CustomObjectsApi, KubeConfig, PatchStrategy, setHeaderOptions } from "@kubernetes/client-node";
import { ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from "@/constants/errors";
import type { Entity } from "@/constants/resources";

type Kind = { group: string; version: string; plural: string };

export const KINDS = {
  CLUSTERS: { group: "cluster.x-k8s.io", version: "v1beta2", plural: "clusters" },
  MACHINES: { group: "cluster.x-k8s.io", version: "v1beta2", plural: "machines" },
  MACHINE_DEPLOYMENTS: { group: "cluster.x-k8s.io", version: "v1beta2", plural: "machinedeployments" },
  OPENSTACK_CLUSTERS: { group: "infrastructure.cluster.x-k8s.io", version: "v1beta2", plural: "openstackclusters" },
  OPENSTACK_MACHINES: { group: "infrastructure.cluster.x-k8s.io", version: "v1beta2", plural: "openstackmachines" },
  HELM_CHART_PROXIES: { group: "addons.cluster.x-k8s.io", version: "v1alpha1", plural: "helmchartproxies" },
  HELM_RELEASE_PROXIES: { group: "addons.cluster.x-k8s.io", version: "v1alpha1", plural: "helmreleaseproxies" },
} as const satisfies Record<string, Kind>;

export const NAMESPACE = process.env.CAPI_NAMESPACE ?? "capi-clusters";
export const CLUSTER_LABEL = "cluster.x-k8s.io/cluster-name";

type Clients = { custom: CustomObjectsApi; core: CoreV1Api };
const globalForKube = globalThis as unknown as { clients: Clients | undefined };

function createClients(): Clients {
  const config = new KubeConfig();
  config.loadFromDefault(); // honors KUBECONFIG
  return { custom: config.makeApiClient(CustomObjectsApi), core: config.makeApiClient(CoreV1Api) };
}

const clients = globalForKube.clients ?? createClients();
if (process.env.NODE_ENV !== "production") globalForKube.clients = clients;

// Maps the Kubernetes API status codes to the named errors, once, so `load.optional` and
// `load.code` see them instead of raw ApiExceptions.
async function call<T>(entity: Entity, request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (error) {
    const status = (error as { code?: number }).code;
    if (status === 404) throw new NotFoundError(entity);
    if (status === 403) throw new ForbiddenError(entity);
    if (status === 401) throw new UnauthorizedError();
    throw new InternalServerError(error instanceof Error ? error.message : "Kubernetes request failed");
  }
}

export type Resource<T> = {
  metadata: { name: string; creationTimestamp?: string; labels?: Record<string, string> };
} & T;

export const kube = {
  async list<T>(entity: Entity, kind: Kind, labelSelector?: string) {
    const result = await call(entity, () =>
      clients.custom.listNamespacedCustomObject({ ...kind, namespace: NAMESPACE, labelSelector }),
    );
    return (result as { items: Resource<T>[] }).items;
  },
  async get<T>(entity: Entity, kind: Kind, name: string) {
    const result = await call(entity, () =>
      clients.custom.getNamespacedCustomObject({ ...kind, namespace: NAMESPACE, name }),
    );
    return result as Resource<T>;
  },
  async scale(entity: Entity, kind: Kind, name: string, replicas: number) {
    await call(entity, () =>
      clients.custom.patchNamespacedCustomObjectScale(
        { ...kind, namespace: NAMESPACE, name, body: { spec: { replicas } } },
        setHeaderOptions("Content-Type", PatchStrategy.MergePatch),
      ),
    );
  },
  async remove(entity: Entity, kind: Kind, name: string) {
    await call(entity, () => clients.custom.deleteNamespacedCustomObject({ ...kind, namespace: NAMESPACE, name }));
  },
  async secret(entity: Entity, name: string) {
    const secret = await call(entity, () => clients.core.readNamespacedSecret({ name, namespace: NAMESPACE }));
    return secret.data ?? {};
  },
  async events(entity: Entity) {
    const result = await call(entity, () => clients.core.listNamespacedEvent({ namespace: NAMESPACE }));
    return result.items;
  },
};
