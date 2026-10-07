import { Blocks, Boxes, CalendarClock, Globe, type LucideIcon, Server } from "lucide-react";

export const IDENTITIES = {
  CLUSTERS: "clusters",
  MACHINES: "machines",
  ADDONS: "addons",
  NETWORKS: "networks",
  EVENTS: "events",
} as const;

export type Entity = (typeof IDENTITIES)[keyof typeof IDENTITIES];

export const RESOURCES: Record<Entity, { icon: LucideIcon }> = {
  [IDENTITIES.CLUSTERS]: { icon: Boxes },
  [IDENTITIES.MACHINES]: { icon: Server },
  [IDENTITIES.ADDONS]: { icon: Blocks },
  [IDENTITIES.NETWORKS]: { icon: Globe },
  [IDENTITIES.EVENTS]: { icon: CalendarClock },
};
