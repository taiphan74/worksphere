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
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useWorkspaceUiStore } from "@/features/workspace";
import { cn } from "@/lib/utils";

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
  const isOpen = useWorkspaceUiStore((state) => state.isWorkspacePanelOpen);
  const closeWorkspacePanel = useWorkspaceUiStore((state) => state.closeWorkspacePanel);
  const toggleWorkspacePanel = useWorkspaceUiStore((state) => state.toggleWorkspacePanel);
  const [title, setTitle] = useState("");
  const t = useTranslations("taskCreate");

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
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/10 px-4 py-6 backdrop-blur-sm sm:px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeWorkspacePanel();
        }
      }}
    >
      <Card 
        variant="glass" 
        rounded="2xl" 
        className="z-50 flex max-h-[min(840px,calc(100vh-2rem))] w-full max-w-5xl flex-col border-white/40 shadow-[0_48px_80px_rgba(0,0,0,0.15)]"
      >
        <CardHeader className="px-5 pt-5 pb-0 sm:px-6 sm:pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full border-white/30 bg-white/10 px-3.5 shadow-sm hover:bg-white/20"
              >
                Project 1
                <ChevronDown className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full border-white/30 bg-white/10 px-3.5 shadow-sm hover:bg-white/20"
              >
                Task
                <ChevronDown className="size-4" />
              </Button>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full hover:bg-white/20"
              aria-label={t("closeAriaLabel")}
              onClick={closeWorkspacePanel}
            >
              <X className="size-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-8 p-5 sm:p-6 overflow-y-auto no-scrollbar">
          <div className="space-y-4">
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t("taskNamePlaceholder")}
              className="h-14 rounded-none border-0 bg-transparent px-0 text-2xl font-bold text-neutral-900 shadow-none focus-visible:ring-0 md:text-3xl placeholder:text-neutral-400"
            />

            <div className="flex flex-wrap items-center gap-2.5">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="rounded-full bg-white/10 px-4 text-xs font-semibold text-neutral-600 hover:bg-white/20"
              >
                {t("addDescription")}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="rounded-full bg-primary/10 px-4 text-xs font-semibold text-primary hover:bg-primary/20"
              >
                <Sparkles className="size-3.5" />
                {t("writeWithAi")}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <MetaChip icon={CircleEllipsis} label={t("todo")} className="bg-white/15" />
            <MetaChip icon={UserRoundPlus} label={t("assignee")} className="bg-white/15" />
            <MetaChip icon={CalendarDays} label={t("dueDate")} className="bg-white/15" />
            <MetaChip icon={Sparkles} label={t("priority")} className="bg-white/15" />
            <MetaChip icon={Tag} label={t("tags")} className="bg-white/15" />
            <MetaChip icon={CircleEllipsis} label={t("more")} className="bg-white/15 cursor-default" />
          </div>

          <div className="space-y-4 rounded-[24px] border border-dashed border-white/40 bg-white/5 p-5 sm:p-6 transition-all hover:bg-white/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  {t("customFields")}
                </h2>
                <p className="mt-1.5 text-xs font-medium text-neutral-500">
                  {t("customFieldsDescription")}
                </p>
              </div>
            </div>

            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-8 rounded-full border border-white/20 bg-white/10 px-4 text-[10px] font-bold uppercase tracking-wider text-neutral-600 hover:bg-white/20"
            >
              {t("createNewField")}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t border-white/20 px-5 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="rounded-full border-white/30 bg-white/10 px-4 font-semibold text-neutral-700 hover:bg-white/20"
            >
              {t("templates")}
            </Button>

            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon-sm" className="rounded-full hover:bg-white/20">
                <Paperclip className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon-sm" className="rounded-full hover:bg-white/20">
                <CalendarDays className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="rounded-full px-3 text-xs font-medium text-neutral-500 hover:bg-white/20">
                {t("activityCount", { count: 0 })}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5">
            <Button 
              type="button" 
              className="h-11 rounded-full bg-primary px-7 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]" 
              onClick={handleCreateTask}
            >
              {t("createTask")}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="icon-lg" 
              className="size-11 rounded-full border-white/30 bg-white/10 hover:bg-white/20 shadow-sm"
            >
              <ChevronDown className="size-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
