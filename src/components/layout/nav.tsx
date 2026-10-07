"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type Entity, IDENTITIES, RESOURCES } from "@/constants/resources";

const ITEMS: { entity: Entity; href: string }[] = [{ entity: IDENTITIES.CLUSTERS, href: "/clusters" }];

export function Nav() {
  const translations = { nav: useTranslations("nav") };
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {ITEMS.map(({ entity, href }) => {
            const Icon = RESOURCES[entity].icon;
            return (
              <SidebarMenuItem key={entity}>
                <SidebarMenuButton asChild isActive={pathname === href || pathname.startsWith(`${href}/`)}>
                  <Link href={href}>
                    <Icon />
                    <span>{translations.nav(entity)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
