import { ErrorCard } from "@/components/error";
import { NetworkPanel } from "@/components/network/panel";
import { load } from "@/lib/load";
import { networks } from "@/services/networks";

export async function NetworkTab({ name }: { name: string }) {
  const { data, error } = await load(networks.get(name), null);
  if (error || !data) return <ErrorCard error={error ?? "unknown"} />;

  return <NetworkPanel network={data} />;
}
