"use client";

import {
  CalendarDays,
  ChevronDown,
  CircleEllipsis,
  Paperclip,
  Sparkles,
  Tag,
  UserRoundPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/use-ui-store";

type MetaChipProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  className?: string;
};

function MetaChip({ icon: Icon, label, className }: MetaChipProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("rounded-full px-3", className)}
    >
      <Icon className="size-4" />
      {label}
    </Button>
  );
}

export function TaskCreatePanel() {
  const isOpen = useUiStore((state) => state.isWorkspacePanelOpen);
  const closeWorkspacePanel = useUiStore((state) => state.closeWorkspacePanel);
  const toggleWorkspacePanel = useUiStore((state) => state.toggleWorkspacePanel);
  const [title, setTitle] = useState("");

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (event.altKey && event.key.toLowerCase() === "n") {
        event.preventDefault();
        toggleWorkspacePanel();
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [toggleWorkspacePanel]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeWorkspacePanel();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [closeWorkspacePanel, isOpen]);

  function handleCreateTask() {
    console.log({
      project: "Project 1",
      type: "Task",
      title,
      status: "TO DO",
    });
    closeWorkspacePanel();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-background/70 px-4 py-6 backdrop-blur-sm sm:px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeWorkspacePanel();
        }
      }}
    >
      <section className="z-50 flex max-h-[min(840px,calc(100vh-2rem))] w-full max-w-5xl flex-col overflow-hidden rounded-[30px] border border-border bg-background shadow-xs">
        <div className="flex flex-col gap-6 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full px-3.5"
              >
                Project 1
                <ChevronDown className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full px-3.5"
              >
                Task
                <ChevronDown className="size-4" />
              </Button>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              aria-label="Đóng tạo công việc"
              onClick={closeWorkspacePanel}
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Task Name or type '/' for commands"
              className="h-14 rounded-none border-0 px-0 text-2xl font-semibold shadow-none focus-visible:ring-0 md:text-3xl"
            />

            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="ghost" size="sm" className="rounded-full px-3">
                Add description
              </Button>
              <Button type="button" variant="ghost" size="sm" className="rounded-full px-3">
                <Sparkles className="size-4" />
                Write with AI
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <MetaChip icon={CircleEllipsis} label="TO DO" />
            <MetaChip icon={UserRoundPlus} label="Assignee" />
            <MetaChip icon={CalendarDays} label="Due date" />
            <MetaChip icon={Sparkles} label="Priority" />
            <MetaChip icon={Tag} label="Tags" />
            <MetaChip icon={CircleEllipsis} label="More" />
          </div>

          <div className="space-y-4 rounded-[24px] border border-dashed border-border p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Fields
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add structured details to enrich this task.
                </p>
              </div>
            </div>

            <Button type="button" variant="ghost" size="sm" className="rounded-full px-3">
              + Create new field
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border px-5 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" className="rounded-full px-3.5">
              Templates
            </Button>

            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon-sm" className="rounded-full">
                <Paperclip className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon-sm" className="rounded-full">
                <CalendarDays className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="rounded-full px-3">
                0 Activity
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button type="button" className="rounded-full px-5" onClick={handleCreateTask}>
              Create Task
            </Button>
            <Button type="button" variant="outline" size="icon-sm" className="rounded-full">
              <ChevronDown className="size-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
