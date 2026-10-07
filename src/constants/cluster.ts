export const TABS = ["machines", "addons", "network", "conditions", "manifest", "events"] as const;

export type Tab = (typeof TABS)[number];

export const DEFAULT_TAB: Tab = "machines";

export function toTab(value: string | string[] | undefined): Tab {
  return TABS.find((tab) => tab === value) ?? DEFAULT_TAB;
}
