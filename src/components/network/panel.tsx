import { getTranslations } from "next-intl/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Network } from "@/types/network";

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 flex flex-wrap items-baseline justify-between gap-3 text-sm font-medium">
        {title}
        {note && <span className="text-muted-foreground text-xs font-normal">{note}</span>}
      </p>
      <div className="bg-card overflow-x-auto rounded-lg border">{children}</div>
    </div>
  );
}

export async function NetworkPanel({ network }: { network: Network }) {
  const translations = { network: await getTranslations("network") };

  return (
    <div className="flex flex-col gap-6">
      <Section title={translations.network("loadBalancer.title")} note={translations.network("loadBalancer.note")}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{translations.network("columns.name")}</TableHead>
              <TableHead>{translations.network("columns.publicIp")}</TableHead>
              <TableHead>{translations.network("columns.internalIp")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {network.apiLoadBalancer ? (
              <TableRow>
                <TableCell className="font-mono">{network.apiLoadBalancer.name}</TableCell>
                <TableCell className="font-mono">{network.apiLoadBalancer.ip}</TableCell>
                <TableCell className="font-mono">{network.apiLoadBalancer.internalIp ?? "—"}</TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground">
                  {translations.network("empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Section>

      <Section title={translations.network("subnets.title")} note={network.name ?? undefined}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{translations.network("columns.name")}</TableHead>
              <TableHead>{translations.network("columns.cidr")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {network.subnets.map((subnet) => (
              <TableRow key={subnet.name}>
                <TableCell className="font-mono">{subnet.name}</TableCell>
                <TableCell className="font-mono">{subnet.cidr}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section title={translations.network("router.title")} note={network.externalNetwork ?? undefined}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{translations.network("columns.name")}</TableHead>
              <TableHead>{translations.network("columns.publicIp")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {network.router && (
              <TableRow>
                <TableCell className="font-mono">{network.router.name}</TableCell>
                <TableCell className="font-mono">{network.router.ips.join(", ") || "—"}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Section>

      <Section title={translations.network("securityGroups.title")}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{translations.network("columns.name")}</TableHead>
              <TableHead>{translations.network("columns.role")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {network.securityGroups.map((group) => (
              <TableRow key={group.name}>
                <TableCell className="font-mono">{group.name}</TableCell>
                <TableCell className="text-muted-foreground">{translations.network(`roles.${group.role}`)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
    </div>
  );
}
