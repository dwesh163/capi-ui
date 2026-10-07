import { getTranslations } from "next-intl/server";
import { StatusDot } from "@/components/status/dot";
import type { Tone } from "@/constants/status";

export async function Phase({ phase, tone }: { phase: string; tone: Tone }) {
  const translations = { status: await getTranslations("status") };
  const label = translations.status.has(`phase.${phase}`) ? translations.status(`phase.${phase}`) : phase;
  return <StatusDot tone={tone} label={label} />;
}
