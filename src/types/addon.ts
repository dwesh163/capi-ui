import type { Tone } from "@/constants/status";

export type Addon = {
  name: string;
  chart: string;
  version: string;
  repository: string;
  namespace: string;
  state: Tone;
  status: string;
  revision: number | null;
  message: string | null;
};
