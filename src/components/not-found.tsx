"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { type Entity, RESOURCES } from "@/constants/resources";

export function EntityNotFound({ entity, backHref }: { entity: Entity; backHref: string }) {
  const translations = { notFound: useTranslations("notFound"), entities: useTranslations("entities") };
  const Icon = RESOURCES[entity].icon;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <Icon className="text-muted-foreground size-8" />
      <p className="text-lg font-medium">
        {translations.notFound("entity", { entity: translations.entities(`${entity}.title.singular`) })}
      </p>
      <Button variant="outline" asChild>
        <Link href={backHref}>
          <ArrowLeft />
          {translations.notFound("back", { entities: translations.entities(`${entity}.plural`) })}
        </Link>
      </Button>
    </div>
  );
}
