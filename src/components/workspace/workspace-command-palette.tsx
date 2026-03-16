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
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  closeCommandPalette,
  openCommandPalette,
} from "@/store/slices/ui-slice";

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
  const dispatch = useAppDispatch();
  const router = useRouter();
  const open = useAppSelector((state) => state.ui.isCommandPaletteOpen);
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
          console.log("Create task");
          dispatch(closeCommandPalette());
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
          dispatch(closeCommandPalette());
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
          dispatch(closeCommandPalette());
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
          dispatch(closeCommandPalette());
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
          dispatch(closeCommandPalette());
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
          dispatch(closeCommandPalette());
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
          dispatch(closeCommandPalette());
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
          dispatch(closeCommandPalette());
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
          dispatch(closeCommandPalette());
        },
      },
    ],
    [dispatch, router, workspaceSlug],
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
    dispatch(openCommandPalette());
  }, [dispatch]);

  const closePalette = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    dispatch(closeCommandPalette());
  }, [dispatch]);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 px-4 py-4 backdrop-blur-sm sm:px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closePalette();
        }
      }}
    >
      <div className="flex max-h-[min(720px,calc(100vh-2rem))] w-full max-w-3xl flex-col overflow-hidden rounded-[32px] border border-border bg-background shadow-xl sm:max-h-[min(760px,calc(100vh-3rem))]">
        <div className="border-b border-border px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border">
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
              placeholder="Search tasks, projects, actions..."
              className="h-12 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-xl"
              aria-label="Close"
              onClick={closePalette}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-3">
          {groupedEntries.length > 0 ? (
            <div className="space-y-3">
              {groupedEntries.map((entry) => {
                if (entry.type === "group") {
                  return (
                    <div key={entry.id} className="px-2 pt-2">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
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
                      "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors",
                      isActive && "bg-accent text-accent-foreground",
                    )}
                    onMouseEnter={() => setActiveIndex(itemIndex)}
                    onClick={() => handleSelect(entry.item)}
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{entry.item.label}</p>
                      {entry.item.description ? (
                        <p className="truncate text-xs text-muted-foreground">
                          {entry.item.description}
                        </p>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-48 items-center justify-center rounded-3xl border border-dashed border-border px-6 text-center">
              <div className="space-y-2">
                <p className="text-sm font-medium">Không tìm thấy kết quả phù hợp</p>
                <p className="text-xs text-muted-foreground">
                  Hãy thử một từ khóa khác hoặc mở rộng phạm vi tìm kiếm.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground sm:px-5">
          <span>↑ ↓ Navigate</span>
          <span>Enter Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
