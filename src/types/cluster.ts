import type { Tone } from "@/constants/status";

export type Condition = { type: string; ok: boolean; reason: string; message: string };

export type Replicas = { desired: number; ready: number };

export type Cluster = {
  name: string;
  state: Tone;
  phase: string;
  version: string;
  endpoint: string | null;
  controlPlane: Replicas;
  workers: Replicas;
  podsCidr: string | null;
  failureDomains: string[];
  conditions: Condition[];
  createdAt: string | null;
};
