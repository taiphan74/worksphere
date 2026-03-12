import Link from "next/link";

import { BrandBadge } from "@/components/brand/brand-badge";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="flex items-center justify-between rounded-full border border-border bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-5">
          <Link href="/" className="flex items-center">
            <BrandBadge />
          </Link>

          <Button
            asChild
            className="h-10 rounded-full px-5 text-sm shadow-none"
          >
            <Link href="/login">Đăng nhập</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
