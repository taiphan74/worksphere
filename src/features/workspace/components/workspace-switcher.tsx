"use client";

import { Check, ChevronDown, Plus, Settings, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppAvatar } from "@/components/ui/app-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { useWorkspaces } from "../hooks";
import type { Workspace } from "../types";
import { useWorkspaceUiStore } from "../store/use-ui-store";

type WorkspaceSwitcherProps = {
  workspaceSlug: string;
};

function getWorkspaceAvatarSeed(workspace?: Workspace, fallback = "workspace") {
  return workspace?.slug || workspace?.name || fallback;
}

export function WorkspaceSwitcher({ workspaceSlug }: WorkspaceSwitcherProps) {
  const t = useTranslations("workspace.switcher");
  const router = useRouter();
  const openWorkspacePanel = useWorkspaceUiStore((state) => state.openWorkspacePanel);
  const { data: workspaces = [], isLoading } = useWorkspaces();
  const activeWorkspace = workspaces.find((workspace) => workspace.slug === workspaceSlug);
  const activeName = activeWorkspace?.name || workspaceSlug;

  function handleWorkspaceSelect(workspace: Workspace) {
    if (workspace.slug === workspaceSlug) {
      return;
    }

    router.push(`/w/${workspace.slug}/home`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="glassLight"
          className="h-11 max-w-[220px] justify-start gap-2 rounded-2xl px-2.5 text-neutral-900 sm:max-w-[260px]"
          aria-label={t("triggerAriaLabel", { workspace: activeName })}
        >
          <AppAvatar
            name={getWorkspaceAvatarSeed(activeWorkspace, workspaceSlug)}
            size={32}
            variant="solid"
            className="rounded-xl bg-avatar-ocean-1 shadow-[0_8px_20px_rgba(14,165,233,0.22)]"
          />
          <span className="min-w-0 flex-1 truncate text-left text-sm font-semibold">
            {isLoading ? t("loading") : activeName}
          </span>
          <ChevronDown className="size-4 shrink-0 text-neutral-600" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-80 rounded-2xl p-2">
        <div className="flex items-center gap-3 px-2 py-2.5">
          <AppAvatar
            name={getWorkspaceAvatarSeed(activeWorkspace, workspaceSlug)}
            size={40}
            variant="solid"
            className="rounded-xl bg-avatar-ocean-1 shadow-[0_8px_20px_rgba(14,165,233,0.22)]"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-950">
              {isLoading ? t("loading") : activeName}
            </p>
            <p className="text-xs text-neutral-500">{t("planLabel")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 px-1 py-1">
          <DropdownMenuItem asChild className="justify-center border border-neutral-900/10 bg-white/40">
            <Link href={`/w/${workspaceSlug}/settings`}>
              <Settings className="size-4" />
              {t("settings")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="justify-center border border-neutral-900/10 bg-white/40">
            <Link href={`/w/${workspaceSlug}/members`}>
              <Users className="size-4" />
              {t("people")}
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs font-medium text-neutral-500">
          {t("workspacesLabel")}
        </DropdownMenuLabel>

        <DropdownMenuGroup>
          {workspaces.length === 0 && !isLoading ? (
            <DropdownMenuItem disabled>{t("empty")}</DropdownMenuItem>
          ) : null}

          {workspaces.map((workspace) => {
            const isActive = workspace.slug === workspaceSlug;

            return (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => handleWorkspaceSelect(workspace)}
                className={cn("gap-3 py-2", isActive && "bg-neutral-900/6")}
              >
                <AppAvatar
                  name={getWorkspaceAvatarSeed(workspace)}
                  size={32}
                  variant="solid"
                  className="rounded-lg bg-avatar-ocean-1"
                />
                <span className="min-w-0 flex-1 truncate font-medium">{workspace.name}</span>
                {isActive ? <Check className="size-4 text-neutral-700" /> : null}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={openWorkspacePanel}
          className="justify-center border border-neutral-900/10 bg-white/40 font-medium"
        >
          <Plus className="size-4" />
          {t("createWorkspace")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}