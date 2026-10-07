import { CustomObjectsApi, KubeConfig } from "@kubernetes/client-node";
import { ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from "@/constants/errors";
import type { Entity } from "@/constants/resources";

type Kind = { group: string; version: string; plural: string };

export const KINDS = {
  CLUSTERS: { group: "cluster.x-k8s.io", version: "v1beta2", plural: "clusters" },
  MACHINES: { group: "cluster.x-k8s.io", version: "v1beta2", plural: "machines" },
  OPENSTACK_MACHINES: { group: "infrastructure.cluster.x-k8s.io", version: "v1beta2", plural: "openstackmachines" },
} as const satisfies Record<string, Kind>;

export const NAMESPACE = process.env.CAPI_NAMESPACE ?? "capi-clusters";

const globalForKube = globalThis as unknown as { custom: CustomObjectsApi | undefined };

function createClient() {
  const config = new KubeConfig();
  config.loadFromDefault(); // honors KUBECONFIG
  return config.makeApiClient(CustomObjectsApi);
}

const custom = globalForKube.custom ?? createClient();
if (process.env.NODE_ENV !== "production") globalForKube.custom = custom;

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

type Resource<T> = { metadata: { name: string; creationTimestamp?: string; labels?: Record<string, string> } } & T;

export const kube = {
  async list<T>(entity: Entity, kind: Kind, labelSelector?: string) {
    const result = await call(entity, () =>
      custom.listNamespacedCustomObject({ ...kind, namespace: NAMESPACE, labelSelector }),
    );
    return (result as { items: Resource<T>[] }).items;
  },
  async get<T>(entity: Entity, kind: Kind, name: string) {
    const result = await call(entity, () => custom.getNamespacedCustomObject({ ...kind, namespace: NAMESPACE, name }));
    return result as Resource<T>;
  },
};
