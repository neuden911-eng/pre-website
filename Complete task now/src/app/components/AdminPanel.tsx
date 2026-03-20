import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { supabase } from "../../supabase/db";
import {
  Trash2,
  Download,
  RotateCcw,
  Plus,
  Rocket,
  Briefcase,
  ArrowLeft,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";
import logoIcon from "@/assets/254964fcfa0200058b1f33cfa89f7b1a3d04373d.png";

interface WaitlistEntry {
  id: string;
  email: string;
  role: string;
  created_at: string;
  status: string;
}

// ─── Login Gate ───
function LoginGate({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.rpc('check_admin_password', { pw: password });
      if (error) throw error;
      if (data === true) {
        onLogin();
      } else {
        setError("Invalid password");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(180deg, #000000 0%, #16153C 100%)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(126,122,232,0.18)",
          borderRadius: 20,
          padding: "48px 40px",
          backdropFilter: "blur(16px)",
          maxWidth: 400,
          width: "100%",
        }}
      >
        <h1
          style={{
            color: "#EBEDEF",
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 4,
            textAlign: "center",
          }}
        >
          StartHub Admin
        </h1>
        <p
          style={{
            color: "rgba(235,237,239,0.45)",
            fontSize: 14,
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          Sign in to manage the waitlist
        </p>

        <form onSubmit={handleSubmit}>
          <div className="relative" style={{ marginBottom: 16 }}>
            <input
              type={showPw ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(126,122,232,0.2)",
                borderRadius: 12,
                padding: "14px 44px 14px 16px",
                color: "#EBEDEF",
                fontSize: 14,
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute cursor-pointer"
              style={{
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "rgba(235,237,239,0.4)",
              }}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p style={{ color: "#e74c3c", fontSize: 13, marginBottom: 12 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer transition-all duration-300 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #3C38BD, #7E7AE8)",
              color: "#EBEDEF",
              borderRadius: 12,
              padding: "14px 28px",
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Dashboard ───
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("founder");
  const [addLoading, setAddLoading] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const fetchEntries = useCallback(async () => {
    try {
      const [foundersRes, investorsRes] = await Promise.all([
        supabase.from("founder").select("*").order("created_at", { ascending: false }),
        supabase.from("investor").select("*").order("created_at", { ascending: false })
      ]);

      if (foundersRes.error) throw foundersRes.error;
      if (investorsRes.error) throw investorsRes.error;

      const combined = [
        ...(foundersRes.data || []).map(f => ({ ...f, role: 'founder' })),
        ...(investorsRes.data || []).map(i => ({ ...i, role: 'investor' }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setEntries(combined);
    } catch (err) {
      console.error("Failed to fetch entries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();

    // Subscribe to realtime changes
    const channel1 = supabase
      .channel('founders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'founder' }, () => {
        fetchEntries();
      })
      .subscribe();

    const channel2 = supabase
      .channel('investors-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'investor' }, () => {
        fetchEntries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
    };
  }, [fetchEntries]);

  const activeEntries = entries.filter((e) => e.status === "active");
  const founders = entries.filter((e) => e.role === "founder");
  const investors = entries.filter((e) => e.role === "investor");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    setAddLoading(true);
    try {
      const { error } = await supabase.from(newRole).insert({ email: newEmail });
      if (error) throw error;
      setNewEmail("");
      fetchEntries();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (entry: WaitlistEntry) => {
    if (!confirm("Delete this entry?")) return;
    try {
      const { error } = await supabase.from(entry.role).delete().eq("id", entry.id);
      if (error) throw error;
      fetchEntries();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (entry: WaitlistEntry) => {
    const newStatus = entry.status === "active" ? "removed" : "active";
    try {
      const { error } = await supabase.from(entry.role).update({ status: newStatus }).eq("id", entry.id);
      if (error) throw error;
      fetchEntries();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReset = async () => {
    try {
      const [foundersRes, investorsRes] = await Promise.all([
        supabase.from("founder").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
        supabase.from("investor").delete().neq("id", "00000000-0000-0000-0000-000000000000")
      ]);
      if (foundersRes.error) throw foundersRes.error;
      if (investorsRes.error) throw investorsRes.error;
      setResetConfirm(false);
      fetchEntries();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleExportCSV = () => {
    const header = "Email,Role,Date Joined,Status\n";
    const rows = entries
      .map(
        (e) =>
          `"${e.email}","${e.role}","${new Date(e.created_at).toLocaleDateString()}","${e.status}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `starthub-waitlist-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const glassCard: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(126,122,232,0.18)",
    borderRadius: 16,
    padding: "24px",
    backdropFilter: "blur(16px)",
  };

  const Table = ({ title, data }: { title: string; data: WaitlistEntry[] }) => (
    <div style={{ ...glassCard, padding: 0, overflow: "hidden", flex: 1 }}>
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid rgba(126,122,232,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h3 style={{ color: "#EBEDEF", fontSize: 16, fontWeight: 600, margin: 0 }}>
          {title} ({data.length})
        </h3>
      </div>
      <div style={{ overflowX: "auto", maxHeight: 500 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(126,122,232,0.1)" }}>
              {["Email", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    color: "rgba(235,237,239,0.4)",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr key={entry.id} style={{ borderBottom: "1px solid rgba(126,122,232,0.06)" }}>
                <td style={{ padding: "12px 16px", color: "#EBEDEF", fontSize: 13 }}>{entry.email}</td>
                <td style={{ padding: "12px 16px" }}>
                  <button
                    onClick={() => handleToggleStatus(entry)}
                    style={{
                      background: entry.status === "active" ? "rgba(46,204,113,0.1)" : "rgba(231,76,60,0.1)",
                      color: entry.status === "active" ? "#2ecc71" : "#e74c3c",
                      borderRadius: 20,
                      padding: "2px 8px",
                      fontSize: 10,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {entry.status}
                  </button>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <button
                    onClick={() => handleDelete(entry)}
                    style={{ background: "none", border: "none", color: "rgba(231,76,60,0.6)", padding: 4, cursor: "pointer" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #000000 0%, #16153C 100%)",
        fontFamily: "Inter, sans-serif",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Top Right Logo Section */}
        <div style={{ position: "fixed", top: 24, right: 24, display: "flex", alignItems: "center", gap: 12, zIndex: 100 }}>
          <div className="flex items-center gap-2">
            <img src={logoIcon} alt="StartHub" style={{ height: 32 }} />
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>
              <span style={{ color: "#FFFFFF" }}>Start</span>
              <span style={{ color: "#3C38BD" }}>Hub</span>
            </span>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(126,122,232,0.2)",
              borderRadius: 10,
              padding: "8px",
              color: "#EBEDEF",
              cursor: "pointer"
            }}
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 style={{ color: "#EBEDEF", fontSize: 28, fontWeight: 700 }}>Admin Operations</h1>
          <p style={{ color: "rgba(235,237,239,0.45)", fontSize: 14 }}>Real-time waitlist management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Founders", value: founders.filter(e => e.status === 'active').length, color: "#3C38BD", icon: <Rocket size={20} /> },
            { label: "Investors", value: investors.filter(e => e.status === 'active').length, color: "#7E7AE8", icon: <Briefcase size={20} /> },
            { label: "Today", value: activeEntries.filter(e => new Date(e.created_at).toDateString() === new Date().toDateString()).length, color: "#5C58D4", icon: <Plus size={20} /> }
          ].map(s => (
            <div key={s.label} style={glassCard}>
              <div style={{ color: s.color, display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                {s.icon} <span style={{ fontSize: 13, color: "rgba(235,237,239,0.5)" }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#EBEDEF" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Manual Add & Actions */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div style={{ ...glassCard, flex: 2 }}>
            <h3 style={{ color: "#EBEDEF", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Quick Addition</h3>
            <form onSubmit={handleAdd} className="flex gap-3">
              <input
                type="email"
                placeholder="Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(126,122,232,0.2)", borderRadius: 10, padding: "10px 14px", color: "#EBEDEF", fontSize: 14 }}
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(126,122,232,0.2)", borderRadius: 10, padding: "10px 14px", color: "#EBEDEF", fontSize: 14 }}
              >
                <option value="founder">Founder</option>
                <option value="investor">Investor</option>
              </select>
              <button type="submit" disabled={addLoading} style={{ background: "linear-gradient(135deg, #3C38BD, #7E7AE8)", color: "#EBEDEF", border: "none", borderRadius: 10, padding: "0 20px", fontWeight: 600, cursor: "pointer" }}>
                Add
              </button>
            </form>
          </div>
          <div style={{ ...glassCard, flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <button onClick={handleExportCSV} style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(126,122,232,0.2)", borderRadius: 10, padding: "10px", color: "#EBEDEF", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Download size={14} /> Export CSV
            </button>
            <button onClick={() => setResetConfirm(!resetConfirm)} style={{ width: "100%", background: resetConfirm ? "#e74c3c" : "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 10, padding: "10px", color: resetConfirm ? "#fff" : "#e74c3c", fontSize: 13, cursor: "pointer" }}>
              {resetConfirm ? "Confirm Clear All?" : "Clear Waitlist"}
            </button>
            {resetConfirm && <button onClick={handleReset} style={{ fontSize: 11, color: "rgba(235,237,239,0.4)", background: "transparent", border: "none", cursor: "pointer" }}>Yes, I'm sure</button>}
          </div>
        </div>

        {/* Side-by-Side Tables */}
        <div className="flex flex-col lg:flex-row gap-6">
          <Table title="Founders" data={founders} />
          <Table title="Investors" data={investors} />
        </div>
      </div>
    </div>
  );
}

export function AdminPanel() {
  const [session, setSession] = useState(() => {
    return sessionStorage.getItem("adminAuth") === "true";
  });

  const handleLogin = () => {
    sessionStorage.setItem("adminAuth", "true");
    setSession(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setSession(false);
  };

  if (!session) {
    return <LoginGate onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
