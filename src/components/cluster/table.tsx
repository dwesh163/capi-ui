import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Phase } from "@/components/status/phase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { age } from "@/lib/format";
import type { Cluster } from "@/types/cluster";

export async function ClusterTable({ clusters }: { clusters: Cluster[] }) {
  const translations = { clusters: await getTranslations("clusters") };
  const locale = await getLocale();

  if (clusters.length === 0) {
    return <p className="text-muted-foreground p-6 text-sm">{translations.clusters("empty")}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{translations.clusters("columns.name")}</TableHead>
          <TableHead>{translations.clusters("columns.status")}</TableHead>
          <TableHead>{translations.clusters("columns.version")}</TableHead>
          <TableHead>{translations.clusters("columns.controlPlane")}</TableHead>
          <TableHead>{translations.clusters("columns.workers")}</TableHead>
          <TableHead>{translations.clusters("columns.age")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clusters.map((cluster) => (
          <TableRow key={cluster.name}>
            <TableCell>
              <Link
                href={`/clusters/${cluster.name}`}
                className="decoration-border hover:decoration-foreground font-mono underline underline-offset-4"
              >
                {cluster.name}
              </Link>
            </TableCell>
            <TableCell>
              <Phase phase={cluster.phase} tone={cluster.state} />
            </TableCell>
            <TableCell className="font-mono">{cluster.version}</TableCell>
            <TableCell className="font-mono">
              {cluster.controlPlane.ready}/{cluster.controlPlane.desired}
            </TableCell>
            <TableCell className="font-mono">
              {cluster.workers.ready}/{cluster.workers.desired}
            </TableCell>
            <TableCell className="text-muted-foreground">{age(cluster.createdAt, locale)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
