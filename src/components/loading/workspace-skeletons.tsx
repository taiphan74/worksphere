import { cn } from "@/lib/utils";
import { glassEffect } from "@/styles/glass";

function Pulse({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-white/20", className)} />
  );
}

/**
 * Skeleton cho sidebar workspace
 */
export function WorkspaceSidebarSkeleton() {
  return (
    <div className="hidden w-[240px] shrink-0 flex-col gap-4 rounded-[26px] border border-white/30 bg-white/10 p-4 shadow-[0_20px_48px_rgba(86,110,148,0.18)] backdrop-blur-xl lg:flex">
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Pulse key={i} className="h-9 w-full rounded-xl" />
        ))}
      </div>
      <div className="mt-auto space-y-3">
        <Pulse className="h-9 w-full rounded-xl" />
        <Pulse className="h-9 w-full rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Skeleton cho header workspace
 */
export function WorkspaceHeaderSkeleton() {
  return (
    <header className={cn(
      "w-full rounded-[24px] border border-white/30 bg-white/14 px-4 py-4 shadow-[0_16px_40px_rgba(82,99,132,0.16)] backdrop-blur-xl sm:px-5",
      glassEffect,
    )}>
      <div className="flex items-center gap-3">
        <Pulse className="h-9 w-9 rounded-full" />
        <Pulse className="h-9 w-9 rounded-full" />
        <Pulse className="h-10 flex-1 rounded-2xl" />
        <div className="flex gap-2">
          <Pulse className="h-9 w-9 rounded-xl" />
          <Pulse className="h-9 w-9 rounded-xl" />
          <Pulse className="h-9 w-9 rounded-xl" />
        </div>
      </div>
    </header>
  );
}

/**
 * Skeleton cho content chính trong workspace
 */
export function WorkspaceContentSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Pulse className="h-8 w-48" />
        <Pulse className="h-9 w-28 rounded-xl" />
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <Pulse key={i} className="h-16 w-full rounded-2xl" />
      ))}
    </div>
  );
}

/**
 * Skeleton cho Members page
 */
export function WorkspaceMembersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Pulse className="h-8 w-48" />
        <Pulse className="h-9 w-36 rounded-xl" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
          <Pulse className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Pulse className="h-4 w-32" />
            <Pulse className="h-3 w-48" />
          </div>
          <Pulse className="h-7 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
