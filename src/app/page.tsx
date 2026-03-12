import { LandingHeader } from "@/components/layout/landing-header";
import { FogOverlay } from "@/components/landing/fog-overlay";
import { HeroHeadline } from "@/components/landing/hero-headline";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <FogOverlay />
      <LandingHeader />
      <section className="relative z-10 min-h-screen px-4 sm:px-6">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center">
          <HeroHeadline />
        </div>
      </section>
    </main>
  );
}
