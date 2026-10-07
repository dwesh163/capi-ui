import { IDENTITIES } from "@/constants/resources";
import { toneOf } from "@/constants/status";
import { getUser } from "@/lib/auth/server";
import { KINDS, kube } from "@/lib/kubernetes";
import type { Machine } from "@/types/machine";

const CLUSTER_LABEL = "cluster.x-k8s.io/cluster-name";
const CONTROL_PLANE_LABEL = "cluster.x-k8s.io/control-plane";

type MachineSpec = {
  spec?: { version?: string; infrastructureRef?: { name?: string } };
  status?: { phase?: string; addresses?: { type: string; address: string }[] };
};

type OpenStackMachineSpec = { spec?: { flavor?: { filter?: { name?: string } } } };

export const machines = {
  async list(cluster: string) {
    await getUser();
    const selector = `${CLUSTER_LABEL}=${cluster}`;
    const [items, infrastructure] = await Promise.all([
      kube.list<MachineSpec>(IDENTITIES.MACHINES, KINDS.MACHINES, selector),
      kube.list<OpenStackMachineSpec>(IDENTITIES.MACHINES, KINDS.OPENSTACK_MACHINES, selector),
    ]);
    const flavors = new Map(
      infrastructure.map((item) => [item.metadata.name, item.spec?.flavor?.filter?.name ?? null]),
    );

    return items.map(({ metadata, spec, status }): Machine => {
      const phase = status?.phase ?? "Unknown";
      return {
        name: metadata.name,
        role: CONTROL_PLANE_LABEL in (metadata.labels ?? {}) ? "controlPlane" : "worker",
        state: toneOf(phase),
        phase,
        version: spec?.version ?? "—",
        flavor: flavors.get(spec?.infrastructureRef?.name ?? "") ?? null,
        ip: status?.addresses?.find((address) => address.type === "InternalIP")?.address ?? null,
        createdAt: metadata.creationTimestamp ?? null,
      };
    });
  },
};
