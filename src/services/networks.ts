import { IDENTITIES } from "@/constants/resources";
import { getUser } from "@/lib/auth/server";
import { CLUSTER_LABEL, KINDS, kube } from "@/lib/kubernetes";
import type { Network } from "@/types/network";

type Subnet = { name: string; cidr: string };

type OpenStackClusterSpec = {
  status?: {
    network?: { name?: string; subnets?: Subnet[] };
    externalNetwork?: { name?: string };
    apiServerManagedLoadBalancer?: { name: string; ip: string; internalIP?: string };
    router?: { name: string; ips?: string[] };
    controlPlaneSecurityGroup?: { name: string };
    workerSecurityGroup?: { name: string };
  };
};

export const networks = {
  async get(cluster: string): Promise<Network> {
    await getUser();
    const [openstack] = await kube.list<OpenStackClusterSpec>(
      IDENTITIES.NETWORKS,
      KINDS.OPENSTACK_CLUSTERS,
      `${CLUSTER_LABEL}=${cluster}`,
    );
    const status = openstack?.status;
    const loadBalancer = status?.apiServerManagedLoadBalancer;

    return {
      name: status?.network?.name ?? null,
      subnets: (status?.network?.subnets ?? []).map(({ name, cidr }) => ({ name, cidr })),
      externalNetwork: status?.externalNetwork?.name ?? null,
      apiLoadBalancer: loadBalancer
        ? { name: loadBalancer.name, ip: loadBalancer.ip, internalIp: loadBalancer.internalIP ?? null }
        : null,
      router: status?.router ? { name: status.router.name, ips: status.router.ips ?? [] } : null,
      securityGroups: [
        status?.controlPlaneSecurityGroup && {
          name: status.controlPlaneSecurityGroup.name,
          role: "controlPlane" as const,
        },
        status?.workerSecurityGroup && { name: status.workerSecurityGroup.name, role: "worker" as const },
      ].filter((group) => !!group),
    };
  },
};
