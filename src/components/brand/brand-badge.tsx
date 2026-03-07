import Image from "next/image";

export function BrandBadge() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Image
        src="/brand/logo.png"
        alt="WorkSphere logo"
        width={24}
        height={24}
        className="h-6 w-6"
        priority
      />
      <span className="text-sm font-medium text-foreground">WorkSphere</span>
    </div>
  );
}
