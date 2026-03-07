import { Bell, Command, PanelLeftDashed } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="border-b border-border/60 bg-background/95 px-4 py-4 backdrop-blur sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            <PanelLeftDashed className="size-4" />
            Workspace dashboard
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Operations overview</h1>
            <p className="text-sm text-muted-foreground">
              Starter shell for workspace, project and task management flows.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" aria-label="Command menu">
            <Command className="size-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
