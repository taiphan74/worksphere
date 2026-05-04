"use client";

import { Bell, CalendarDays, Plus, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useWorkspaceUiStore } from "@/features/workspace";
import { cn } from "@/lib/utils";
import { glass, glassSurface } from "@/styles/glass";

import { WorkspaceSwitcher } from "./workspace-switcher";

type WorkspaceHeaderProps = {
  workspaceSlug: string;
};

export function WorkspaceHeader({ workspaceSlug }: WorkspaceHeaderProps) {
  const openCommandPalette = useWorkspaceUiStore((state) => state.openCommandPalette);
  const openWorkspacePanel = useWorkspaceUiStore((state) => state.openWorkspacePanel);
  const t = useTranslations("workspace.header");

  return (
    <header className={cn("w-full rounded-[24px] px-4 py-4 sm:px-5 lg:px-6", glassSurface)}>
      <div className="relative z-10 flex flex-wrap items-center gap-3 lg:flex-nowrap lg:gap-6">
        <div className="flex min-w-0 shrink-0 items-center gap-3">
          <SidebarTrigger />
          <WorkspaceSwitcher workspaceSlug={workspaceSlug} />
        </div>

        <div className="order-3 w-full min-w-0 lg:order-none lg:flex-1">
          <button
            type="button"
            className={cn(
              glass,
              "flex h-10 w-full items-center gap-3 rounded-2xl border-white/20 bg-white/10 px-4 text-left shadow-[0_10px_28px_rgba(82,99,132,0.12),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all hover:bg-white/22 lg:h-11",
            )}
            onClick={openCommandPalette}
            aria-label={t("searchAriaLabel")}
          >
            <span className="min-w-0 flex-1 truncate text-sm text-neutral-700">
              {t("searchPlaceholder")}
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="hidden rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-neutral-600 sm:inline-flex">
                Ctrl K
              </span>
              <span className="flex size-7 items-center justify-center rounded-xl">
                <Search className="size-4 text-neutral-600" />
              </span>
            </span>
          </button>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="glass"
            size="icon-sm"
            className="rounded-xl"
            aria-label={t("notificationsAriaLabel")}
          >
            <Bell className="size-4" />
          </Button>
          <Button
            type="button"
            variant="glass"
            size="icon-sm"
            className="rounded-xl"
            aria-label={t("calendarAriaLabel")}
          >
            <CalendarDays className="size-4" />
          </Button>
          <Button
            type="button"
            variant="glass"
            size="icon-sm"
            className="rounded-xl"
            aria-label={t("quickActionAriaLabel")}
            onClick={openWorkspacePanel}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
