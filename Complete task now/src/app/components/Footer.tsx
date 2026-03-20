import { Linkedin, Instagram } from "lucide-react";
import logoFull from "@/assets/254964fcfa0200058b1f33cfa89f7b1a3d04373d.png";

export function Footer() {
  return (
    <footer
      style={{
        fontFamily: "Inter, sans-serif",
        borderTop: "1px solid rgba(126,122,232,0.1)",
        paddingTop: 40,
        paddingBottom: 40,
      }}
    >
      <div className="mx-auto px-6" style={{ maxWidth: 1100 }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src={logoFull} alt="StartHub" style={{ height: 36 }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>
              <span style={{ color: "#FFFFFF" }}>Start</span>
              <span style={{ color: "#3C38BD" }}>Hub</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <span style={{ color: "rgba(235,237,239,0.4)", fontSize: 13 }}>Privacy-First Platform</span>
            <span style={{ color: "rgba(235,237,239,0.4)", fontSize: 13 }}>Not a broker-dealer</span>
            <span style={{ color: "rgba(235,237,239,0.4)", fontSize: 13 }}>hello@starthub.io</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/company/112751905/admin/dashboard/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200"
              style={{ color: "rgba(235,237,239,0.4)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#7E7AE8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(235,237,239,0.4)")}
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://www.instagram.com/starthubofficial_"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200"
              style={{ color: "rgba(235,237,239,0.4)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#7E7AE8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(235,237,239,0.4)")}
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>

        <div className="text-center mt-8">
          <p style={{ color: "rgba(235,237,239,0.2)", fontSize: 12 }}>
            &copy; 2026 StartHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}