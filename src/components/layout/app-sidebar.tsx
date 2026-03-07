import { BriefcaseBusiness, FolderKanban, LayoutGrid, ListTodo, Settings } from "lucide-react";

const navigation = [
  { label: "Overview", icon: LayoutGrid, href: "#" },
  { label: "Workspaces", icon: BriefcaseBusiness, href: "#" },
  { label: "Projects", icon: FolderKanban, href: "#" },
  { label: "Tasks", icon: ListTodo, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
];

export function AppSidebar() {
  return (
    <aside className="w-full border-b border-sidebar-border bg-sidebar lg:min-h-screen lg:w-72 lg:border-r lg:border-b-0">
      <div className="flex h-full flex-col">
        <div className="border-b border-sidebar-border px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sidebar-foreground/60">
            WorkSphere
          </p>
          <h2 className="mt-2 text-xl font-semibold text-sidebar-foreground">
            Team control center
          </h2>
        </div>

        <nav className="grid gap-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="mt-auto p-4 pt-0">
          <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent p-4">
            <p className="text-sm font-semibold text-sidebar-accent-foreground">
              Enterprise-ready base
            </p>
            <p className="mt-1 text-sm leading-6 text-sidebar-accent-foreground/70">
              Shared tokens, reusable primitives and layout shell are ready for workspace modules.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
