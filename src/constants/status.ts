export type Tone = "ok" | "busy" | "warn" | "crit" | "idle";

// Cluster and Machine `status.phase` values from Cluster API, mapped to the console's status dot.
export const PHASE_TONES: Record<string, Tone> = {
  Running: "ok",
  Provisioned: "ok",
  Provisioning: "busy",
  Pending: "busy",
  Scaling: "busy",
  Deleting: "busy",
  Deleted: "idle",
  Failed: "crit",
  Unknown: "warn",
};

export function toneOf(phase: string | undefined): Tone {
  return (phase && PHASE_TONES[phase]) || "warn";
}
