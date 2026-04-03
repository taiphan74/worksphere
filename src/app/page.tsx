import { AuthFlashNotice } from "@/components/auth/auth-flash-notice";
import { LandingHeader } from "@/components/layout/landing-header";
import { FogOverlay } from "@/components/landing/fog-overlay";
import { HeroHeadline } from "@/components/landing/hero-headline";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(104,151,255,0.25),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,180,120,0.25),transparent_45%),radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%),linear-gradient(135deg,#f5f7fb_0%,#e9eef8_42%,#eef2ff_100%)]">
      <FogOverlay />
      <LandingHeader />
      <section className="relative z-10 min-h-screen px-4 sm:px-6">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center">
          <AuthFlashNotice />
          <HeroHeadline />
        </div>
      </section>
    </main>
  );
}
