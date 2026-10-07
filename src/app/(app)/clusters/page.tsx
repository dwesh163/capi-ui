import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { clusters as clustersApi } from "@/services/clusters";

// Reads the session and request data: this segment renders per request.
export const instant = false;

export default async function ClustersPage() {
  const translations = { clusters: await getTranslations("clusters") };
  const clusters = await clustersApi.list();
  if (clusters.length > 0) redirect(`/clusters/${clusters[0].name}`);

  return <p className="text-muted-foreground py-24 text-center text-sm">{translations.clusters("empty")}</p>;
}
