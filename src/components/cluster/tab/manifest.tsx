import { stringify } from "yaml";
import { ClusterManifest } from "@/components/cluster/manifest";
import { ErrorCard } from "@/components/error";
import { load } from "@/lib/load";
import { clusters } from "@/services/clusters";

export async function ManifestTab({ name }: { name: string }) {
  const { data, error } = await load(clusters.manifest(name), null);
  if (error || !data) return <ErrorCard error={error ?? "unknown"} />;

  return <ClusterManifest yaml={stringify(data)} />;
}
