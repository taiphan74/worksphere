"use client";

import { Bell, CalendarDays, Plus, Search } from "lucide-react";
import { useState } from "react";

import { BrandBadge } from "@/components/brand/brand-badge";
import { Button } from "@/components/ui/button";
import { WorkspaceCommandPalette } from "@/components/workspace/workspace-command-palette";

type WorkspaceHeaderProps = {
  workspaceSlug: string;
};

export function WorkspaceHeader({ workspaceSlug }: WorkspaceHeaderProps) {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  return (
    <>
      <header className="w-full rounded-[32px] border border-border bg-background/80 px-5 py-4 shadow-xs backdrop-blur-sm sm:px-6 lg:px-8 lg:py-5">
        <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap lg:gap-8">
          <div className="shrink-0">
            <BrandBadge />
          </div>

          <div className="order-3 w-full min-w-0 lg:order-none lg:flex-1">
            <button
              type="button"
              className="flex h-12 w-full items-center gap-3 rounded-2xl bg-muted/60 px-4 text-left shadow-none transition-colors lg:h-14 lg:rounded-3xl lg:px-5"
              onClick={() => setIsPaletteOpen(true)}
              aria-label="Mở tìm kiếm nhanh"
            >
              <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground lg:text-base">
                Tìm kiếm công việc tại đây...
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="hidden rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground sm:inline-flex">
                  Ctrl K
                </span>
                <span className="flex size-8 items-center justify-center rounded-xl">
                  <Search className="size-4" />
                </span>
              </span>
            </button>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="rounded-xl"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="rounded-xl"
              aria-label="Calendar"
            >
              <CalendarDays className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="rounded-xl"
              aria-label="Quick action"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <WorkspaceCommandPalette
        open={isPaletteOpen}
        onOpenChange={setIsPaletteOpen}
        workspaceSlug={workspaceSlug}
      />
    </>
  );
}
