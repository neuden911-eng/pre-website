import { motion } from "motion/react";
import { ShieldCheck, UserCheck, Lock } from "lucide-react";

const items = [
  { icon: ShieldCheck, text: "Verified Community" },
  { icon: UserCheck, text: "Founder-Approved Access" },
  { icon: Lock, text: "Privacy-First Platform" },
];

export function TrustStrip() {
  return (
    <section style={{ fontFamily: "Inter, sans-serif", paddingTop: 20, paddingBottom: 40 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 px-6"
        style={{ maxWidth: 1100 }}
      >
        {items.map((item) => (
          <div key={item.text} className="flex items-center gap-3">
            <item.icon size={20} style={{ color: "#7E7AE8" }} />
            <span style={{ color: "rgba(235,237,239,0.6)", fontSize: 14, fontWeight: 500 }}>
              {item.text}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
