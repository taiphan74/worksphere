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
import Link from "next/link";
import { usePathname } from "next/navigation";

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

const navigationItems = (workspaceSlug: string): NavItem[] => [
  { title: "Trang chủ", href: `/w/${workspaceSlug}/home`, icon: Home },
  { title: "Dự án", href: `/w/${workspaceSlug}/projects`, icon: FolderKanban },
  { title: "Công việc", href: `/w/${workspaceSlug}/tasks`, icon: CheckSquare },
  { title: "Thành viên", href: `/w/${workspaceSlug}/members`, icon: Users },
];

const workspaceItems: NavItem[] = [
  { title: "Hoạt động", icon: CheckSquare, disabled: true },
  { title: "Tệp", icon: FolderKanban, disabled: true },
  { title: "Lịch", icon: CalendarDays, disabled: true },
];

const settingItems = (workspaceSlug: string): NavItem[] => [
  { title: "Cài đặt", href: `/w/${workspaceSlug}/settings`, icon: Settings },
];

export function WorkspaceSidebar({ workspaceSlug }: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const { state, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  function renderItem(item: NavItem) {
    const isActive = item.href ? pathname === item.href : false;
    const Icon = item.icon;

    if (item.href) {
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            isActive={isActive}
            className={cn(isCollapsed && "size-11")}
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
      className="self-stretch lg:rounded-[26px] lg:border lg:border-border lg:shadow-xs"
    >
      <SidebarContent className="gap-3 px-3 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(isCollapsed && "sr-only")}>
            Điều hướng
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{navigationItems(workspaceSlug).map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={cn(isCollapsed && "sr-only")}>
            Không gian làm việc
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{workspaceItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={cn(isCollapsed && "sr-only")}>
            Cài đặt
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{settingItems(workspaceSlug).map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className={cn(isCollapsed && "size-11")}>
              <User2 className="size-4 shrink-0" />
              <span className={cn(isCollapsed && "hidden")}>Tài khoản</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className={cn(isCollapsed && "size-11")}>
              <LogOut className="size-4 shrink-0" />
              <span className={cn(isCollapsed && "hidden")}>Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
