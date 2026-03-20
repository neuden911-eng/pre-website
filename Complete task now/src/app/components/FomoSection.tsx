import { motion } from "motion/react";

export function FomoSection({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <section style={{ fontFamily: "Inter, sans-serif", paddingTop: 60, paddingBottom: 60 }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto px-6 text-center relative overflow-hidden"
        style={{
          maxWidth: 1100,
          background: "linear-gradient(135deg, rgba(60,56,189,0.15), rgba(22,21,60,0.6))",
          border: "1px solid rgba(126,122,232,0.15)",
          borderRadius: 24,
          padding: "64px 32px",
        }}
      >
        {/* Glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 400,
            height: 300,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(ellipse, rgba(60,56,189,0.2) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        <h2
          className="relative z-10"
          style={{ color: "#EBEDEF", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}
        >
          Early Access Is Limited.
        </h2>
        <p
          className="relative z-10"
          style={{ color: "rgba(235,237,239,0.55)", fontSize: 16, marginBottom: 36, maxWidth: 440, margin: "0 auto 36px" }}
        >
          We are onboarding our first private community.
        </p>
        <button
          onClick={onCtaClick}
          className="relative z-10 cursor-pointer transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #3C38BD, #7E7AE8)",
            color: "#EBEDEF",
            borderRadius: 14,
            padding: "16px 44px",
            fontSize: 16,
            fontWeight: 600,
            border: "none",
            fontFamily: "Inter, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 36px rgba(60,56,189,0.5)";
            e.currentTarget.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Secure Your Spot
        </button>
      </motion.div>
    </section>
  );
}
