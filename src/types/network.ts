export type Network = {
  name: string | null;
  subnets: { name: string; cidr: string }[];
  externalNetwork: string | null;
  apiLoadBalancer: { name: string; ip: string; internalIp: string | null } | null;
  router: { name: string; ips: string[] } | null;
  securityGroups: { name: string; role: "controlPlane" | "worker" }[];
};
