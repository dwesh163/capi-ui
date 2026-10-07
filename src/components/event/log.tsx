import { getLocale, getTranslations } from "next-intl/server";
import { age } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ClusterEvent } from "@/types/event";

export async function EventLog({ events }: { events: ClusterEvent[] }) {
  const translations = { events: await getTranslations("events") };
  const locale = await getLocale();

  if (events.length === 0) {
    return <p className="text-muted-foreground p-6 text-sm">{translations.events("empty")}</p>;
  }

  return (
    <ul>
      {events.map((event) => (
        <li
          key={event.id}
          className="grid grid-cols-[64px_minmax(0,1fr)] gap-x-4 border-b px-4 py-2.5 text-sm last:border-b-0 sm:grid-cols-[64px_150px_minmax(0,1fr)]"
        >
          <time className="text-muted-foreground font-mono text-xs">{age(event.time, locale)}</time>
          <span
            className={cn(
              "text-muted-foreground hidden truncate font-mono text-xs sm:block",
              event.type === "Warning" && "text-warn",
            )}
          >
            {event.reason}
          </span>
          <span className="min-w-0 break-words">
            <span className="bg-muted rounded px-1.5 py-px font-mono text-xs">{event.object}</span> {event.message}
            {event.count > 1 && <span className="text-muted-foreground font-mono text-xs"> ×{event.count}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
