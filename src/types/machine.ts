import type { Tone } from "@/constants/status";

export type Machine = {
  name: string;
  role: "controlPlane" | "worker";
  state: Tone;
  phase: string;
  version: string;
  flavor: string | null;
  ip: string | null;
  createdAt: string | null;
};
