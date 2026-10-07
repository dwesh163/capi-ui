import { Frame } from "@/components/cluster/tab/frame";
import { MachineFilters } from "@/components/machine/filters";
import { MachineTable } from "@/components/machine/table";
import { ROLES, STATUS_TONES, STATUSES } from "@/constants/machine";
import type { Machine } from "@/types/machine";
import type { Query } from "@/types/query";

export function MachinesTab({ machines, error, query }: { machines: Machine[]; error: string | null; query: Query }) {
  const q = typeof query.q === "string" ? query.q.trim().toLowerCase() : "";
  const role = ROLES.find((value) => value === query.role);
  const status = STATUSES.find((value) => value === query.status);
  const shown = machines.filter(
    (machine) =>
      (!q || machine.name.toLowerCase().includes(q) || machine.ip?.includes(q)) &&
      (!role || machine.role === role) &&
      (!status || STATUS_TONES[status].includes(machine.state)),
  );

  return (
    <div className="flex flex-col gap-3">
      <MachineFilters shown={shown.length} total={machines.length} />
      <Frame error={error}>
        <MachineTable machines={shown} />
      </Frame>
    </div>
  );
}
