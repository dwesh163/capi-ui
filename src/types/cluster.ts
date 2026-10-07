import type { Tone } from "@/constants/status";

export type Replicas = { desired: number; ready: number };

export type Cluster = {
  name: string;
  state: Tone;
  phase: string;
  version: string;
  endpoint: string | null;
  controlPlane: Replicas;
  workers: Replicas;
  createdAt: string | null;
};
