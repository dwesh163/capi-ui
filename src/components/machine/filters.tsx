"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLES, STATUSES } from "@/constants/machine";

const ALL = "all";

export function MachineFilters({ shown, total }: { shown: number; total: number }) {
  const translations = { filters: useTranslations("machines.filters") };
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value && value !== ALL) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        type="search"
        defaultValue={params.get("q") ?? ""}
        placeholder={translations.filters("search")}
        aria-label={translations.filters("search")}
        className="h-8 max-w-xs min-w-48 flex-1"
        onChange={(event) => update("q", event.target.value)}
      />
      <Select value={params.get("role") ?? ALL} onValueChange={(value) => update("role", value)}>
        <SelectTrigger size="sm" aria-label={translations.filters("role")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{translations.filters("allRoles")}</SelectItem>
          {ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {translations.filters(`roles.${role}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={params.get("status") ?? ALL} onValueChange={(value) => update("status", value)}>
        <SelectTrigger size="sm" aria-label={translations.filters("status")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{translations.filters("allStatuses")}</SelectItem>
          {STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {translations.filters(`statuses.${status}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-muted-foreground ml-auto font-mono text-xs">
        {translations.filters("count", { shown, total })}
      </span>
    </div>
  );
}
