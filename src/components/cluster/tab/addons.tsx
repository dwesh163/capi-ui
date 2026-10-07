import { AddonList } from "@/components/addon/table";
import { Frame } from "@/components/cluster/tab/frame";
import { load } from "@/lib/load";
import { addons } from "@/services/addons";

export async function AddonsTab({ name }: { name: string }) {
  const { data, error } = await load(addons.list(name), []);

  return (
    <Frame error={error}>
      <AddonList addons={data} />
    </Frame>
  );
}
