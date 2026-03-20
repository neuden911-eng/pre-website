import { motion } from "motion/react";

const founderSteps = [
  { step: "01", title: "Apply & Verify", desc: "Submit your startup profile for review." },
  { step: "02", title: "Get Matched", desc: "Connect with aligned, vetted investors." },
  { step: "03", title: "Control Access", desc: "Share data on your terms, privately." },
];

const investorSteps = [
  { step: "01", title: "Request Invite", desc: "Apply with your investment thesis." },
  { step: "02", title: "Browse Deals", desc: "Access curated, founder-approved startups." },
  { step: "03", title: "Connect Directly", desc: "Engage founders with warm introductions." },
];

function StepColumn({ title, steps }: { title: string; steps: typeof founderSteps }) {
  return (
    <div>
      <h3 style={{ color: "#7E7AE8", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 28 }}>
        {title}
      </h3>
      <div className="flex flex-col gap-0">
        {steps.map((s, i) => (
          <div key={s.step} className="flex gap-5">
            {/* Vertical indicator */}
            <div className="flex flex-col items-center">
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(60,56,189,0.2)",
                  border: "1px solid rgba(126,122,232,0.3)",
                  color: "#7E7AE8",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {s.step}
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 1, flex: 1, minHeight: 32, background: "rgba(126,122,232,0.15)" }} />
              )}
            </div>
            <div style={{ paddingBottom: i < steps.length - 1 ? 28 : 0 }}>
              <h4 style={{ color: "#EBEDEF", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{s.title}</h4>
              <p style={{ color: "rgba(235,237,239,0.5)", fontSize: 14, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section style={{ fontFamily: "Inter, sans-serif", paddingTop: 60, paddingBottom: 60 }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto px-6"
        style={{ maxWidth: 1100 }}
      >
        <h2
          className="text-center"
          style={{ color: "#EBEDEF", fontSize: 28, fontWeight: 700, marginBottom: 48 }}
        >
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <StepColumn title="For Founders" steps={founderSteps} />
          <StepColumn title="For Investors" steps={investorSteps} />
        </div>
      </motion.div>
    </section>
  );
}
