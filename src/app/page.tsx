import { Plus, Search } from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const workspaceStats = [
  { label: "Active projects", value: "12", detail: "Across product, engineering and ops" },
  { label: "Open tasks", value: "148", detail: "27 due this week" },
  { label: "Team members", value: "24", detail: "6 online right now" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 space-y-6 p-4 sm:p-6">
            <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="space-y-3">
                  <div className="inline-flex w-fit items-center rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    WorkSphere UI Foundation
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-3xl tracking-tight">Build workspace operations without rebuilding the design system.</CardTitle>
                    <CardDescription className="max-w-2xl text-sm leading-6">
                      This demo confirms the shadcn/ui setup is working with App Router, alias imports, shared layout components and reusable primitives.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="Search workspace, project or task"
                    />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="sm:w-auto">
                        <Plus className="size-4" />
                        New task
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create task</DialogTitle>
                        <DialogDescription>
                          Dialog is rendered from shadcn/ui and ready for future form wiring.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3">
                        <Input placeholder="Task title" />
                        <Input placeholder="Assign to project" />
                        <Button className="w-full">Save draft</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle>Environment check</CardTitle>
                  <CardDescription>Quick signals that the frontend foundation is in place.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-4 py-3">
                    <span>Alias imports</span>
                    <span className="font-medium text-foreground">`@/...` active</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-4 py-3">
                    <span>shadcn/ui primitives</span>
                    <span className="font-medium text-foreground">Button, Card, Input, Dialog</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-4 py-3">
                    <span>Theme tokens</span>
                    <span className="font-medium text-foreground">CSS variables ready</span>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              {workspaceStats.map((item) => (
                <Card key={item.label} className="border-border/60 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardDescription>{item.label}</CardDescription>
                    <CardTitle className="text-3xl">{item.value}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{item.detail}</CardContent>
                </Card>
              ))}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
