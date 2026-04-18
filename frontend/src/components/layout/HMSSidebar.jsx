import { useNavigate, useLocation } from "react-router-dom";
import { T } from "../../utils/hmsConstants";
import { usePatients } from "../../context/PatientContext";

const NAV = [
  { key: "queue", label: "Queue", emoji: "🎫", path: "/hms/queue" },
  { key: "triage", label: "Triage", emoji: "🩺", path: "/hms/triage" },
  { key: "register", label: "Registration", emoji: "📝", path: "/hms/register" },
  { key: "billing", label: "Billing", emoji: "💳", path: "/hms/billing" },
  { key: "doctor", label: "Doctor", emoji: "🩻", path: "/hms/doctor" },
  { key: "lab", label: "Laboratory", emoji: "🧪", path: "/hms/lab" },
  { key: "pharmacy", label: "Pharmacy", emoji: "💊", path: "/hms/pharmacy" },
  { key: "reports", label: "Reports", emoji: "📊", path: "/hms/reports" },
];

export default function HMSSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { patients } = usePatients();

  const cnt = {
    queue: patients.filter(p => p.status === "Queued").length,
    triage: patients.filter(p => p.status === "Queued").length,
    register: patients.filter(p => p.status === "Triaged").length,
    billing: patients.filter(p => p.status === "Registered").length,
    doctor: patients.filter(p => p.status === "Billed" || p.status === "With Doctor (Post-Lab)").length,
    lab: patients.filter(p => p.status === "Lab Pending").length,
    pharmacy: patients.filter(p => p.clerking?.orders?.rx?.drugs?.length > 0 && !p.clerking?.dispensed).length,
    reports: 0,
  };

  // Map any route prefix to its sidebar key
  const routeMap = [
    { prefix: "/hms/triage",       key: "triage"   },
    { prefix: "/hms/register",     key: "register" },
    { prefix: "/hms/registration", key: "register" },
    { prefix: "/hms/billing",      key: "billing"  },
    { prefix: "/hms/doctor",       key: "doctor"   },
    { prefix: "/hms/lab",          key: "lab"      },
    { prefix: "/hms/laboratory",   key: "lab"      },
    { prefix: "/hms/pharmacy",     key: "pharmacy" },
    { prefix: "/hms/reports",      key: "reports"  },
    { prefix: "/hms/queue",        key: "queue"    },
  ];
  const matched = routeMap.find(r => location.pathname.startsWith(r.prefix));
  const currentKey = matched?.key || "queue";

  return (
    <div style={{
      width: 224, minHeight: "100vh", flexShrink: 0, position: "sticky", top: 0, height: "100vh",
      background: "linear-gradient(180deg," + T.navy + " 0%," + T.navyM + " 60%,#0a1f38 100%)",
      display: "flex", flexDirection: "column", boxShadow: "4px 0 24px rgba(0,0,0,.4)", overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11, flexShrink: 0,
            background: "linear-gradient(135deg," + T.cyan + "," + T.cyanD + ")",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            boxShadow: "0 4px 12px rgba(0,188,212,.4)",
          }}>🏥</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: .2 }}>MediCore</div>
            <div style={{ color: "rgba(255,255,255,.3)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Mono',monospace" }}>HMS · v3.0</div>
          </div>
        </div>
        <div style={{ marginTop: 10, fontSize: 10, color: "rgba(255,255,255,.2)", fontFamily: "'DM Mono',monospace" }}>
          MFL: 13104 · Nairobi, Kenya
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
        {NAV.map(n => {
          const active = currentKey === n.key;
          const badge = cnt[n.key];
          return (
            <button key={n.key} onClick={() => navigate(n.path)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: 9, border: "none", cursor: "pointer",
                fontFamily: "'Outfit',sans-serif", textAlign: "left", marginBottom: 2, transition: "all .15s",
                background: active ? "rgba(0,188,212,.18)" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,.55)",
              }}>
              <span style={{ fontSize: 16, width: 22, textAlign: "center", flexShrink: 0 }}>{n.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: active ? 700 : 400, flex: 1 }}>{n.label}</span>
              {(badge > 0) && (
                <span style={{
                  background: active ? T.cyan : T.amber, color: "#fff",
                  borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700, minWidth: 20, textAlign: "center",
                }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,.06)", fontSize: 9, color: "rgba(255,255,255,.2)", fontFamily: "'DM Mono',monospace" }}>
        <div>Mater Hospital · Level 5</div>
        <div style={{ marginTop: 2 }}>
          {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
        </div>
      </div>
    </div>
  );
}
