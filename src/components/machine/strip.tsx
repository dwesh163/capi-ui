import { getTranslations } from "next-intl/server";
import type { Tone } from "@/constants/status";
import { cn } from "@/lib/utils";
import type { Machine } from "@/types/machine";

const TONES: Record<Tone, string> = {
  ok: "bg-ok",
  busy: "bg-muted-foreground animate-pulse motion-reduce:animate-none",
  warn: "bg-warn",
  crit: "bg-crit",
  idle: "bg-border",
};

function Group({ label, machines }: { label: string; machines: Machine[] }) {
  return (
    <li className="flex items-center gap-3">
      <span className="text-muted-foreground w-28 text-sm">{label}</span>
      <ul className="flex flex-wrap gap-1.5">
        {machines.map((machine) => (
          <li key={machine.name}>
            <span
              role="img"
              aria-label={`${machine.name}: ${machine.phase}`}
              title={`${machine.name} · ${machine.phase}`}
              className={cn("block size-4 rounded-[3px]", TONES[machine.state])}
            />
          </li>
        ))}
      </ul>
    </li>
  );
}

// The cluster at a glance: one square per machine, coloured by state.
export async function MachineStrip({ machines }: { machines: Machine[] }) {
  const translations = { machines: await getTranslations("machines") };
  if (machines.length === 0) return null;

  return (
    <ul className="flex flex-col gap-2.5" aria-label={translations.machines("strip")}>
      <Group
        label={translations.machines("roles.controlPlane")}
        machines={machines.filter((machine) => machine.role === "controlPlane")}
      />
      <Group
        label={translations.machines("roles.worker")}
        machines={machines.filter((machine) => machine.role === "worker")}
      />
    </ul>
  );
}
