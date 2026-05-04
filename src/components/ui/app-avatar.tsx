"use client";

import { Facehash } from "facehash";
import Image from "next/image";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const defaultAvatarColors = [
  "var(--avatar-ocean-1)",
  "var(--avatar-ocean-2)",
  "var(--avatar-ocean-3)",
  "var(--avatar-ocean-4)",
  "var(--avatar-ocean-5)",
];

type AppAvatarProps = Omit<ComponentProps<typeof Facehash>, "name" | "size"> & {
  name: string;
  src?: string | null;
  alt?: string;
  size?: number;
};

export function AppAvatar({
  name,
  src,
  alt,
  size = 40,
  className,
  variant = "gradient",
  intensity3d = "subtle",
  showInitial = true,
  enableBlink = true,
  colors = defaultAvatarColors,
  ...props
}: AppAvatarProps) {
  const avatarClassName = cn(
    "shrink-0 overflow-hidden rounded-full font-bold transition-transform duration-300 hover:scale-105",
    className,
  );

  if (src) {
    return (
      <Image
        src={src}
        alt={alt || name}
        width={size}
        height={size}
        className={cn("object-cover", avatarClassName)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <Facehash
      name={name}
      size={size}
      variant={variant}
      intensity3d={intensity3d}
      showInitial={showInitial}
      enableBlink={enableBlink}
      colors={colors}
      className={cn("text-avatar-ocean-foreground", avatarClassName)}
      {...props}
    />
  );
}
