"use client";

import {
  Bell,
  FolderKanban,
  Home,
  type LucideIcon,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useWorkspaceUiStore } from "@/features/workspace";

type WorkspaceCommandPaletteProps = {
  workspaceSlug: string;
};

type CommandItem = {
  id: string;
  label: string;
  group: "Quick Actions" | "Navigation";
  description?: string;
  icon: LucideIcon;
  keywords?: string[];
  onSelect: () => void;
};

type CommandEntry =
  | {
      type: "group";
      id: string;
      label: string;
    }
  | {
      type: "item";
      item: CommandItem;
    };

export function WorkspaceCommandPalette({
  workspaceSlug,
}: WorkspaceCommandPaletteProps) {
  const open = useWorkspaceUiStore((state) => state.isCommandPaletteOpen);
  const openCommandPalette = useWorkspaceUiStore((state) => state.openCommandPalette);
  const closeCommandPalette = useWorkspaceUiStore((state) => state.closeCommandPalette);
  const openWorkspacePanel = useWorkspaceUiStore((state) => state.openWorkspacePanel);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const items = useMemo<CommandItem[]>(
    () => [
      {
        id: "create-task",
        label: "Tạo công việc",
        group: "Quick Actions",
        description: "Khởi tạo một task mới trong workspace",
        icon: Sparkles,
        keywords: ["task", "create", "new"],
        onSelect: () => {
          openWorkspacePanel();
          closeCommandPalette();
        },
      },
      {
        id: "create-project",
        label: "Tạo dự án",
        group: "Quick Actions",
        description: "Thêm một project mới cho đội nhóm",
        icon: FolderKanban,
        keywords: ["project", "create", "new"],
        onSelect: () => {
          console.log("Create project");
          closeCommandPalette();
        },
      },
      {
        id: "invite-member",
        label: "Mời thành viên",
        group: "Quick Actions",
        description: "Thêm người mới vào workspace",
        icon: Users,
        keywords: ["invite", "member", "team"],
        onSelect: () => {
          console.log("Invite member");
          closeCommandPalette();
        },
      },
      {
        id: "go-settings",
        label: "Đi tới cài đặt",
        group: "Quick Actions",
        description: "Mở trang cấu hình workspace",
        icon: Settings,
        keywords: ["settings", "config"],
        onSelect: () => {
          router.push(`/w/${workspaceSlug}/settings`);
          closeCommandPalette();
        },
      },
      {
        id: "nav-home",
        label: "Trang chủ",
        group: "Navigation",
        description: "Đi đến khu vực tổng quan",
        icon: Home,
        keywords: ["home", "dashboard"],
        onSelect: () => {
          router.push(`/w/${workspaceSlug}/home`);
          closeCommandPalette();
        },
      },
      {
        id: "nav-projects",
        label: "Dự án",
        group: "Navigation",
        description: "Đi đến danh sách dự án",
        icon: FolderKanban,
        keywords: ["projects", "project"],
        onSelect: () => {
          router.push(`/w/${workspaceSlug}/projects`);
          closeCommandPalette();
        },
      },
      {
        id: "nav-tasks",
        label: "Công việc",
        group: "Navigation",
        description: "Đi đến danh sách công việc",
        icon: Bell,
        keywords: ["tasks", "task"],
        onSelect: () => {
          router.push(`/w/${workspaceSlug}/tasks`);
          closeCommandPalette();
        },
      },
      {
        id: "nav-members",
        label: "Thành viên",
        group: "Navigation",
        description: "Đi đến danh sách thành viên",
        icon: Users,
        keywords: ["members", "member", "team"],
        onSelect: () => {
          router.push(`/w/${workspaceSlug}/members`);
          closeCommandPalette();
        },
      },
      {
        id: "nav-settings",
        label: "Cài đặt",
        group: "Navigation",
        description: "Đi đến trang cài đặt",
        icon: Settings,
        keywords: ["settings"],
        onSelect: () => {
          router.push(`/w/${workspaceSlug}/settings`);
          closeCommandPalette();
        },
      },
    ],
    [closeCommandPalette, openWorkspacePanel, router, workspaceSlug],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => {
      const haystack = [item.label, item.description, item.group, ...(item.keywords ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [items, query]);

  const groupedEntries = useMemo<CommandEntry[]>(() => {
    const groups = new Map<string, CommandItem[]>();

    filteredItems.forEach((item) => {
      const current = groups.get(item.group) ?? [];
      current.push(item);
      groups.set(item.group, current);
    });

    return Array.from(groups.entries()).flatMap(([group, groupItems]) => [
      { type: "group" as const, id: group, label: group },
      ...groupItems.map((item) => ({ type: "item" as const, item })),
    ]);
  }, [filteredItems]);

  const openPalette = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    openCommandPalette();
  }, [openCommandPalette]);

  const closePalette = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    closeCommandPalette();
  }, [closeCommandPalette]);

  function handleSelect(item: CommandItem) {
    item.onSelect();
  }

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();

        if (open) {
          closePalette();
          return;
        }

        openPalette();
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [closePalette, open, openPalette]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) {
    return null;
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closePalette();
      return;
    }

    if (filteredItems.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((currentIndex) => (currentIndex + 1) % filteredItems.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((currentIndex) =>
        currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      handleSelect(filteredItems[activeIndex]);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 px-4 py-4 backdrop-blur-md sm:px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closePalette();
        }
      }}
    >
      <Card
        variant="glass"
        rounded="3xl"
        className="mx-auto w-full max-w-3xl border-white/40 shadow-[0_32px_64px_rgba(0,0,0,0.12)] min-h-0 flex flex-col max-h-[min(720px,calc(100vh-2rem))] sm:max-h-[min(760px,calc(100vh-3rem))]"
      >
        <CardHeader className="border-b border-white/20 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/10 shadow-inner">
              <Search className="size-4" />
            </div>
            <Input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Tìm kiếm công việc, dự án, thao tác..."
              className="h-12 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 placeholder:text-neutral-500"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-xl hover:bg-white/20"
              aria-label="Close"
              onClick={closePalette}
            >
              <X className="size-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto p-3 no-scrollbar">
          {groupedEntries.length > 0 ? (
            <div className="space-y-3">
              {groupedEntries.map((entry) => {
                if (entry.type === "group") {
                  return (
                    <div key={entry.id} className="px-2 pt-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500/80">
                        {entry.label}
                      </p>
                    </div>
                  );
                }

                const itemIndex = filteredItems.findIndex((item) => item.id === entry.item.id);
                const Icon = entry.item.icon;
                const isActive = itemIndex === activeIndex;

                return (
                  <button
                    key={entry.item.id}
                    type="button"
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-[22px] px-3 py-3 text-left transition-all duration-200",
                      isActive 
                        ? "bg-white/40 shadow-[0_8px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] scale-[1.01]" 
                        : "hover:bg-white/20",
                    )}
                    onMouseEnter={() => setActiveIndex(itemIndex)}
                    onClick={() => handleSelect(entry.item)}
                  >
                    <div className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-2xl border transition-colors",
                      isActive ? "border-white/50 bg-white/60 shadow-sm" : "border-white/20 bg-white/10"
                    )}>
                      <Icon className={cn("size-4", isActive ? "text-primary" : "text-neutral-600")} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn("truncate text-sm font-semibold", isActive ? "text-neutral-900" : "text-neutral-700")}>
                        {entry.item.label}
                      </p>
                      {entry.item.description ? (
                        <p className={cn("truncate text-xs", isActive ? "text-neutral-600" : "text-neutral-500")}>
                          {entry.item.description}
                        </p>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-48 items-center justify-center rounded-3xl border border-dashed border-white/30 bg-white/5 px-6 text-center">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-neutral-800">Không tìm thấy kết quả phù hợp</p>
                <p className="text-xs text-neutral-500">
                  Hãy thử một từ khóa khác hoặc mở rộng phạm vi tìm kiếm.
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap items-center gap-4 border-t border-white/20 px-4 py-3 text-[11px] font-medium text-neutral-500 sm:px-5">
          <div className="flex items-center gap-1.5">
            <kbd className="rounded-md border border-white/30 bg-white/10 px-1.5 py-0.5 font-sans text-[10px]">↑↓</kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="rounded-md border border-white/30 bg-white/10 px-1.5 py-0.5 font-sans text-[10px]">Enter</kbd>
            <span>Select</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="rounded-md border border-white/30 bg-white/10 px-1.5 py-0.5 font-sans text-[10px]">Esc</kbd>
            <span>Close</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
