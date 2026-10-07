import { Frame } from "@/components/cluster/tab/frame";
import { EventLog } from "@/components/event/log";
import { load } from "@/lib/load";
import { events } from "@/services/events";

export async function EventsTab({ name }: { name: string }) {
  const { data, error } = await load(events.list(name), []);

  return (
    <Frame error={error}>
      <EventLog events={data} />
    </Frame>
  );
}
