import { motion } from "motion/react";
import { Shield, Users, Eye, Volume2 } from "lucide-react";

const cards = [
  {
    icon: Shield,
    title: "Founder-Controlled Access",
    desc: "Founders decide who sees their data. Full control over visibility and outreach.",
  },
  {
    icon: Users,
    title: "Curated Investor Network",
    desc: "Vetted investors aligned with your stage, sector, and vision. No cold outreach.",
  },
  {
    icon: Eye,
    title: "Private Startup Profiles",
    desc: "Share your metrics confidently in a secure, invite-only environment.",
  },
  {
    icon: Volume2,
    title: "Low-Noise Ecosystem",
    desc: "No spam, no noise. Only relevant connections that move the needle.",
  },
];

export function ValueGrid() {
  return (
    <section style={{ fontFamily: "Inter, sans-serif", paddingTop: 40, paddingBottom: 60 }}>
      <div className="mx-auto px-6" style={{ maxWidth: 1100 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group cursor-default transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(126,122,232,0.12)",
                borderRadius: 16,
                padding: "32px 28px",
                backdropFilter: "blur(12px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(126,122,232,0.35)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(60,56,189,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(126,122,232,0.12)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <card.icon size={28} style={{ color: "#7E7AE8", marginBottom: 16 }} />
              <h3 style={{ color: "#EBEDEF", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                {card.title}
              </h3>
              <p style={{ color: "rgba(235,237,239,0.5)", fontSize: 14, lineHeight: 1.6 }}>
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
