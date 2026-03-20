import { useState, useEffect } from "react";
import logoIcon from "@/assets/254964fcfa0200058b1f33cfa89f7b1a3d04373d.png";

export function Navbar({ onCtaClick }: { onCtaClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(0,0,0,0.7)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(60,56,189,0.15)" : "none",
      }}
    >
      <div className="mx-auto flex items-center justify-between px-6 py-4" style={{ maxWidth: 1100 }}>
        <div className="flex items-center gap-2">
          <img src={logoIcon} alt="StartHub" style={{ height: 36 }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>
            <span style={{ color: "#FFFFFF" }}>Start</span>
            <span style={{ color: "#3C38BD" }}>Hub</span>
          </span>
        </div>
        <button
          onClick={onCtaClick}
          className="cursor-pointer transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #3C38BD, #7E7AE8)",
            color: "#EBEDEF",
            borderRadius: 12,
            padding: "10px 24px",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
            border: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 24px rgba(60,56,189,0.5)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Join Waitlist
        </button>
      </div>
    </nav>
  );
}