import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { getWaitlistCounts } from "../../api/waitlist";

function AnimatedNumber({ target }: { target: number }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return <span ref={ref}>{current.toLocaleString()}</span>;
}

export function WaitlistCounter() {
  const [counts, setCounts] = useState({ founders: 0, investors: 0 });

  useEffect(() => {
    getWaitlistCounts()
      .then((data) =>
        setCounts({ founders: data.founders, investors: data.investors })
      )
      .catch((err) => console.error("Failed to fetch counts:", err));
  }, []);

  const cards = [
    { emoji: "🚀", label: "Founders Joined", count: counts.founders },
    { emoji: "💼", label: "Investors Joined", count: counts.investors },
  ];

  return (
    <section
      style={{ fontFamily: "Inter, sans-serif", paddingTop: 40, paddingBottom: 40 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto px-6 text-center"
        style={{ maxWidth: 900 }}
      >
        <h2
          style={{
            color: "#EBEDEF",
            fontSize: "clamp(24px, 3.5vw, 36px)",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Our Early Access Community Is Growing.
        </h2>
        <p
          style={{
            color: "rgba(235,237,239,0.55)",
            fontSize: 16,
            marginBottom: 36,
          }}
        >
          Founders and investors are securing their spot.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {cards.map((card) => (
            <motion.div
              key={card.label}
              whileHover={{ y: -6, boxShadow: "0 0 32px rgba(60,56,189,0.35)" }}
              transition={{ duration: 0.25 }}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(126,122,232,0.18)",
                borderRadius: 20,
                padding: "36px 48px",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                minWidth: 220,
                cursor: "default",
                boxShadow: "0 0 20px rgba(60,56,189,0.08)",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{card.emoji}</div>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #3C38BD, #7E7AE8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.1,
                  marginBottom: 8,
                }}
              >
                <AnimatedNumber target={card.count} />
              </div>
              <div
                style={{ color: "rgba(235,237,239,0.6)", fontSize: 14, fontWeight: 500 }}
              >
                {card.label}
              </div>
            </motion.div>
          ))}
        </div>

        <p
          style={{
            color: "rgba(235,237,239,0.3)",
            fontSize: 12,
            marginTop: 20,
            letterSpacing: 0.5,
          }}
        >
          Updated in real time.
        </p>
        <p
          style={{
            color: "#7E7AE8",
            fontSize: 14,
            marginTop: 8,
            fontWeight: 500,
          }}
        >
          Join before we close early access.
        </p>
      </motion.div>
    </section>
  );
}
