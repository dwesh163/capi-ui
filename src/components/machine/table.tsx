import { getLocale, getTranslations } from "next-intl/server";
import { Phase } from "@/components/status/phase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { age } from "@/lib/format";
import type { Machine } from "@/types/machine";

export async function MachineTable({ machines }: { machines: Machine[] }) {
  const translations = { machines: await getTranslations("machines") };
  const locale = await getLocale();

  if (machines.length === 0) {
    return <p className="text-muted-foreground p-6 text-sm">{translations.machines("empty")}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{translations.machines("columns.name")}</TableHead>
          <TableHead>{translations.machines("columns.role")}</TableHead>
          <TableHead>{translations.machines("columns.status")}</TableHead>
          <TableHead>{translations.machines("columns.version")}</TableHead>
          <TableHead>{translations.machines("columns.flavor")}</TableHead>
          <TableHead>{translations.machines("columns.ip")}</TableHead>
          <TableHead>{translations.machines("columns.age")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {machines.map((machine) => (
          <TableRow key={machine.name}>
            <TableCell className="font-mono">{machine.name}</TableCell>
            <TableCell className="text-muted-foreground">{translations.machines(`roles.${machine.role}`)}</TableCell>
            <TableCell>
              <Phase phase={machine.phase} tone={machine.state} />
            </TableCell>
            <TableCell className="font-mono">{machine.version}</TableCell>
            <TableCell className="font-mono">{machine.flavor ?? "—"}</TableCell>
            <TableCell className="font-mono">{machine.ip ?? "—"}</TableCell>
            <TableCell className="text-muted-foreground">{age(machine.createdAt, locale)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
