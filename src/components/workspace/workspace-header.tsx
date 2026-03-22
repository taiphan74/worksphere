"use client";

import { Bell, CalendarDays, Plus, Search } from "lucide-react";

import { BrandBadge } from "@/components/brand/brand-badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAppDispatch } from "@/store/hooks";
import {
  openCommandPalette,
  openWorkspacePanel,
} from "@/store/slices/ui-slice";

export function WorkspaceHeader() {
  const dispatch = useAppDispatch();

  return (
    <header className="w-full rounded-[24px] border border-border bg-background/80 px-4 py-3 shadow-xs backdrop-blur-sm sm:px-5 lg:px-6">
      <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap lg:gap-6">
        <div className="flex shrink-0 items-center gap-3">
          <SidebarTrigger />
          <BrandBadge />
        </div>

        <div className="order-3 w-full min-w-0 lg:order-none lg:flex-1">
          <button
            type="button"
            className="flex h-10 w-full items-center gap-3 rounded-2xl bg-muted/60 px-4 text-left shadow-none transition-colors lg:h-11"
            onClick={() => dispatch(openCommandPalette())}
            aria-label="Mo tim kiem nhanh"
          >
            <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
              Tim kiem cong viec tai day...
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="hidden rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground sm:inline-flex">
                Ctrl K
              </span>
              <span className="flex size-7 items-center justify-center rounded-xl">
                <Search className="size-4" />
              </span>
            </span>
          </button>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
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
            onClick={() => dispatch(openWorkspacePanel())}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
