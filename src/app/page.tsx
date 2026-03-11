import { FogOverlay } from "@/components/landing/fog-overlay";
import { HeroHeadline } from "@/components/landing/hero-headline";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6">
      <FogOverlay />
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <HeroHeadline />
      </div>
    </main>
  );
}
