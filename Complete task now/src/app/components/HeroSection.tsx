import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { joinWaitlist } from "../../api/waitlist";

export function HeroSection() {
  const [role, setRole] = useState("Founder");
  const [email, setEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await joinWaitlist(email, role.toLowerCase() as "founder" | "investor");
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      if (err.message?.includes("already registered")) {
        setError("This email is already on the waitlist!");
      } else {
        setError("Something went wrong. Please try again.");
      }
      console.error("Waitlist signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ paddingTop: 120, paddingBottom: 60, fontFamily: "Inter, sans-serif" }}
    >
      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 400,
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse, rgba(60,56,189,0.25) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center mx-auto px-6"
        style={{ maxWidth: 900 }}
      >
        <div
          className="inline-flex items-center gap-2 mx-auto mb-6"
          style={{
            background: "rgba(126,122,232,0.1)",
            border: "1px solid rgba(126,122,232,0.25)",
            borderRadius: 9999,
            padding: "8px 20px",
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7E7AE8", flexShrink: 0 }} />
          <span style={{ color: "#7E7AE8", fontSize: 14, whiteSpace: "nowrap" }}>
            Private startup investment opportunities — verified investors only
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#EBEDEF",
            marginBottom: 20,
          }}
        >
          Private startup{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #3C38BD, #7E7AE8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            deal flow
          </span>
          <br />
          for modern investors.
        </h1>

        <p style={{ color: "rgba(235,237,239,0.65)", fontSize: 17, maxWidth: 520, margin: "0 auto 12px", lineHeight: 1.6 }}>
          Invest in startups starting small.
        </p>
        <p style={{ color: "rgba(235,237,239,0.65)", fontSize: 17, maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.6 }}>
          Raise funding without exposing your identity.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3" style={{ maxWidth: 520, margin: "0 auto" }}>
          {/* Role Selector */}
          <div ref={dropdownRef} className="relative" style={{ minWidth: 140 }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between w-full cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(126,122,232,0.2)",
                borderRadius: 12,
                padding: "12px 16px",
                color: "#EBEDEF",
                fontSize: 14,
                backdropFilter: "blur(12px)",
              }}
            >
              {role}
              <ChevronDown size={16} style={{ marginLeft: 8, opacity: 0.6 }} />
            </button>
            {dropdownOpen && (
              <div
                className="absolute top-full left-0 right-0 mt-1 z-20"
                style={{
                  background: "rgba(22,21,60,0.95)",
                  border: "1px solid rgba(126,122,232,0.25)",
                  borderRadius: 10,
                  overflow: "hidden",
                  backdropFilter: "blur(16px)",
                }}
              >
                {["Founder", "Investor"].map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRole(r); setDropdownOpen(false); }}
                    className="block w-full text-left cursor-pointer transition-colors duration-200"
                    style={{
                      padding: "10px 16px",
                      color: role === r ? "#7E7AE8" : "#EBEDEF",
                      fontSize: 14,
                      background: "transparent",
                      border: "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(60,56,189,0.2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Email Input */}
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 w-full sm:w-auto transition-all duration-300 outline-none"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(126,122,232,0.2)",
              borderRadius: 12,
              padding: "12px 16px",
              color: "#EBEDEF",
              fontSize: 14,
              backdropFilter: "blur(12px)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(126,122,232,0.5)";
              e.currentTarget.style.boxShadow = "0 0 16px rgba(60,56,189,0.3)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(126,122,232,0.2)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />

          {/* CTA Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="cursor-pointer transition-all duration-300 whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #3C38BD, #7E7AE8)",
              color: "#EBEDEF",
              borderRadius: 12,
              padding: "12px 28px",
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 28px rgba(60,56,189,0.5)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {loading ? "Submitting..." : submitted ? "Requested!" : "Request Early Access"}
          </button>
        </div>

        {error && (
          <p style={{ color: "#e74c3c", fontSize: 13, marginTop: 12 }}>
            {error}
          </p>
        )}

        <p style={{ color: "rgba(235,237,239,0.35)", fontSize: 12, marginTop: 16, letterSpacing: 0.5 }}>
          Limited onboarding. Invite-only access.
        </p>
      </motion.div>
    </section>
  );
}