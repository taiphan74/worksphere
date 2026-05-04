"use client";

import {
  CalendarDays,
  CheckSquare,
  FolderKanban,
  Home,
  LogOut,
  Settings,
  User2,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type WorkspaceSidebarProps = {
  workspaceSlug: string;
};

type NavItem = {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
};

export function WorkspaceSidebar({ workspaceSlug }: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const { state, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const tSidebar = useTranslations("workspace.sidebar");

  const navigationItems: NavItem[] = [
    { title: tSidebar("home"), href: `/w/${workspaceSlug}/home`, icon: Home },
    { title: tSidebar("projects"), href: `/w/${workspaceSlug}/projects`, icon: FolderKanban },
    { title: tSidebar("tasks"), href: `/w/${workspaceSlug}/tasks`, icon: CheckSquare },
    { title: tSidebar("members"), href: `/w/${workspaceSlug}/members`, icon: Users },
  ];

  const workspaceItems: NavItem[] = [
    { title: tSidebar("activity"), icon: CheckSquare, disabled: true },
    { title: tSidebar("files"), icon: FolderKanban, disabled: true },
    { title: tSidebar("calendar"), icon: CalendarDays, disabled: true },
  ];

  const settingItems: NavItem[] = [
    { title: tSidebar("settings"), href: `/w/${workspaceSlug}/settings`, icon: Settings },
  ];

  function renderItem(item: NavItem) {
    const isActive = item.href ? pathname === item.href : false;
    const Icon = item.icon;

    if (item.href) {
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            isActive={isActive}
            className={cn(
              isCollapsed && "size-11",
              isActive && "border-white/20 bg-white/15 text-neutral-900 shadow-[0_8px_20px_rgba(82,99,132,0.12)] backdrop-blur-md",
            )}
          >
            <Link href={item.href} onClick={() => setOpenMobile(false)}>
              <Icon className="size-4 shrink-0" />
              <span className={cn(isCollapsed && "hidden")}>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          disabled={item.disabled}
          className={cn(isCollapsed && "size-11")}
        >
          <Icon className="size-4 shrink-0" />
          <span className={cn(isCollapsed && "hidden")}>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Sidebar
      collapsible="icon"
      className={cn("self-stretch", glassSidebar)}
    >
      <SidebarContent className="gap-3 px-3 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(isCollapsed && "sr-only")}>
            {tSidebar("navigation")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{navigationItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={cn(isCollapsed && "sr-only")}>
            {tSidebar("workspace")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{workspaceItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={cn(isCollapsed && "sr-only")}>
            {tSidebar("settings")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{settingItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className={cn(isCollapsed && "size-11")}>
              <User2 className="size-4 shrink-0" />
              <span className={cn(isCollapsed && "hidden")}>{tSidebar("account")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className={cn(isCollapsed && "size-11")}>
              <LogOut className="size-4 shrink-0" />
              <span className={cn(isCollapsed && "hidden")}>{tSidebar("logout")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
