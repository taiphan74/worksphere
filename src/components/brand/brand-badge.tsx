import Image from "next/image";

export function BrandBadge() {
  return (
    <div className="flex items-center justify-center gap-3">
      <Image
        src="/brand/logo.png"
        alt="WorkSphere logo"
        width={28}
        height={28}
        className="h-7 w-7"
        priority
      />
      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        WorkSphere
      </span>
    </div>
  );
}
