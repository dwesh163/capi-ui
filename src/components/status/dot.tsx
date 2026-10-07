import type { Tone } from "@/constants/status";
import { cn } from "@/lib/utils";

const TONES: Record<Tone, string> = {
  ok: "bg-ok",
  busy: "bg-muted-foreground animate-pulse motion-reduce:animate-none",
  warn: "bg-warn",
  crit: "bg-crit",
  idle: "bg-muted-foreground/60",
};

export function StatusDot({
  tone,
  label,
  dotOnly,
  className,
}: {
  tone: Tone;
  label: string;
  dotOnly?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 whitespace-nowrap text-sm", className)}>
      <span aria-hidden className={cn("size-[7px] shrink-0 rounded-full", TONES[tone])} />
      {dotOnly ? <span className="sr-only">{label}</span> : label}
    </span>
  );
}
