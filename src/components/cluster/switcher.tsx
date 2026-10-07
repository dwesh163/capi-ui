"use client";
import { ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Names only: the switcher is header chrome, not a status display.
export function ClusterSwitcher({ names }: { names: string[] }) {
  const { name } = useParams<{ name?: string }>();
  if (!name || names.length < 2) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="font-mono">
          {name}
          <ChevronsUpDown className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {names.map((cluster) => (
          <DropdownMenuItem key={cluster} asChild className="font-mono">
            <Link href={`/clusters/${cluster}`}>{cluster}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
