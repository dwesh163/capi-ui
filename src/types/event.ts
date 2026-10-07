export type ClusterEvent = {
  id: string;
  time: string | null;
  type: "Normal" | "Warning";
  reason: string;
  kind: string;
  object: string;
  message: string;
  count: number;
};
