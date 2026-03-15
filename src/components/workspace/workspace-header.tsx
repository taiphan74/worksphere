import { Bell, CalendarDays, Plus, Search } from "lucide-react";

import { BrandBadge } from "@/components/brand/brand-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WorkspaceHeader() {
  return (
    <header className="w-full rounded-[32px] border border-border bg-background/80 px-5 py-4 shadow-xs backdrop-blur-sm sm:px-6 lg:px-8 lg:py-5">
      <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap lg:gap-8">
        <div className="shrink-0">
          <BrandBadge />
        </div>

        <div className="order-3 w-full min-w-0 lg:order-none lg:flex-1">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Tìm kiếm công việc tại đây..."
              className="h-12 rounded-2xl border-0 bg-muted/60 pr-14 pl-5 shadow-none lg:h-14 lg:rounded-3xl"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-xl lg:right-3"
              aria-label="Search"
            >
              <Search className="size-4" />
            </Button>
          </div>
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
  );
}
