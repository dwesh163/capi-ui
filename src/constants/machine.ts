import type { Tone } from "./status";

export const ROLES = ["controlPlane", "worker"] as const;
export const STATUSES = ["ok", "moving", "bad"] as const;

export type RoleFilter = (typeof ROLES)[number];
export type StatusFilter = (typeof STATUSES)[number];

export const STATUS_TONES: Record<StatusFilter, Tone[]> = {
  ok: ["ok"],
  moving: ["busy"],
  bad: ["warn", "crit", "idle"],
};
