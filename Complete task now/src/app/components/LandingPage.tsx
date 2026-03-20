import { useRef } from "react";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { TrustStrip } from "./TrustStrip";
import { WaitlistCounter } from "./WaitlistCounter";
import { ValueGrid } from "./ValueGrid";
import { HowItWorks } from "./HowItWorks";
import { FomoSection } from "./FomoSection";
import { Footer } from "./Footer";

export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  const scrollToHero = () => {
    heroRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, #000000 0%, #16153C 100%)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Floating ambient shapes */}
      <div
        className="fixed pointer-events-none"
        style={{
          width: 500,
          height: 500,
          top: "20%",
          right: "-10%",
          background:
            "radial-gradient(ellipse, rgba(60,56,189,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          width: 400,
          height: 400,
          bottom: "10%",
          left: "-5%",
          background:
            "radial-gradient(ellipse, rgba(126,122,232,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <Navbar onCtaClick={scrollToHero} />

      <div ref={heroRef}>
        <HeroSection />
      </div>
      <TrustStrip />
      <WaitlistCounter />
      <ValueGrid />
      <HowItWorks />
      <FomoSection onCtaClick={scrollToHero} />
      <Footer />
    </div>
  );
}
