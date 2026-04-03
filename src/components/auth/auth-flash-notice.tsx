"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { glassEffect } from "@/styles/glass";

const AUTH_FLASH_STORAGE_KEY = "worksphere.auth_flash";

export function AuthFlashNotice() {
  const [message] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return window.sessionStorage.getItem(AUTH_FLASH_STORAGE_KEY);
  });

  useEffect(() => {
    if (!message) {
      return;
    }

    window.sessionStorage.removeItem(AUTH_FLASH_STORAGE_KEY);
  }, [message]);

  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        "mx-auto mb-6 max-w-xl rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 backdrop-blur-md",
        glassEffect,
      )}
    >
      {message}
    </div>
  );
}
