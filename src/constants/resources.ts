import { Boxes, type LucideIcon, Server } from "lucide-react";

export const IDENTITIES = {
  CLUSTERS: "clusters",
  MACHINES: "machines",
} as const;

export type Entity = (typeof IDENTITIES)[keyof typeof IDENTITIES];

export const RESOURCES: Record<Entity, { icon: LucideIcon }> = {
  [IDENTITIES.CLUSTERS]: { icon: Boxes },
  [IDENTITIES.MACHINES]: { icon: Server },
};
