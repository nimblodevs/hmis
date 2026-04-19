import { useNavigate, useLocation } from "react-router-dom";
import { T } from "../../utils/hmsConstants";
import { usePatients } from "../../context/PatientContext";
import { useBreakpoint } from "../../hooks/useBreakpoint";

const NAV = [
  { key: "queue",    label: "Queue",        emoji: "🎫", path: "/hms/queue"    },
  { key: "triage",   label: "Triage",       emoji: "🩺", path: "/hms/triage"   },
  { key: "register", label: "Registration", emoji: "📝", path: "/hms/register" },
  { key: "billing",  label: "Billing",      emoji: "💳", path: "/hms/billing"  },
  { key: "doctor",   label: "Doctor",       emoji: "🩻", path: "/hms/doctor"   },
  { key: "lab",      label: "Laboratory",   emoji: "🧪", path: "/hms/lab"      },
  { key: "pharmacy", label: "Pharmacy",     emoji: "💊", path: "/hms/pharmacy" },
  { key: "cashier",  label: "Cashier",      emoji: "💵", path: "/hms/cashier"  },
  { key: "reports",  label: "Reports",      emoji: "📊", path: "/hms/reports"  },
];

export default function HMSSidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { patients } = usePatients();
  const { isMobile } = useBreakpoint();

  const cnt = {
    queue:    patients.filter(p => p.status === "Queued").length,
    triage:   patients.filter(p => p.status === "Queued").length,
    register: patients.filter(p => p.status === "Triaged").length,
    billing:  patients.filter(p => p.status === "Registered").length,
    doctor:   patients.filter(p => p.status === "Billed" || p.status === "With Doctor (Post-Lab)").length,
    lab:      patients.filter(p => p.status === "Lab Pending").length,
    pharmacy: patients.filter(p => p.clerking?.orders?.rx?.drugs?.length > 0 && !p.clerking?.dispensed).length,
    cashier:  patients.filter(p => p.billing && p.category === "Cash" && !p.billing.paid).length,
    reports:  0,
  };

  const routeMap = [
    { prefix: "/hms/triage",       key: "triage"   },
    { prefix: "/hms/register",     key: "register" },
    { prefix: "/hms/registration", key: "register" },
    { prefix: "/hms/billing",      key: "billing"  },
    { prefix: "/hms/doctor",       key: "doctor"   },
    { prefix: "/hms/lab",          key: "lab"      },
    { prefix: "/hms/laboratory",   key: "lab"      },
    { prefix: "/hms/pharmacy",     key: "pharmacy" },
    { prefix: "/hms/cashier",      key: "cashier"  },
    { prefix: "/hms/reports",      key: "reports"  },
    { prefix: "/hms/queue",        key: "queue"    },
  ];
  const matched = routeMap.find(r => location.pathname.startsWith(r.prefix));
  const currentKey = matched?.key || "queue";

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <div style={{
      width: 224, minHeight: "100vh", height: "100vh", flexShrink: 0,
      background: "linear-gradient(180deg," + T.navy + " 0%," + T.navyM + " 60%,#0a1f38 100%)",
      display: "flex", flexDirection: "column",
      boxShadow: "4px 0 24px rgba(0,0,0,.4)", overflow: "hidden",
    }}>
      {/* Logo / close row */}
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg," + T.cyan + "," + T.cyanD + ")",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19,
            boxShadow: "0 4px 12px rgba(0,188,212,.4)",
          }}>🏥</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: .2 }}>MediCore</div>
            <div style={{ color: "rgba(255,255,255,.3)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Mono',monospace" }}>HMS · v3.0</div>
          </div>
        </div>
        {/* Close button on mobile */}
        {isMobile && (
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,.1)", border: "none", borderRadius: 7,
            color: "rgba(255,255,255,.7)", fontSize: 18, padding: "4px 8px", cursor: "pointer",
          }}>✕</button>
        )}
      </div>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,.18)", fontFamily: "'DM Mono',monospace", padding: "6px 16px" }}>
        MFL: 13104 · Nairobi, Kenya
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
        {NAV.map(n => {
          const active = currentKey === n.key;
          const badge = cnt[n.key];
          return (
            <button key={n.key} onClick={() => handleNav(n.path)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 10px", borderRadius: 9, border: "none", cursor: "pointer",
                fontFamily: "'Outfit',sans-serif", textAlign: "left", marginBottom: 2, transition: "all .15s",
                background: active ? "rgba(0,188,212,.18)" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,.55)",
              }}>
              <span style={{ fontSize: 17, width: 22, textAlign: "center", flexShrink: 0 }}>{n.emoji}</span>
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
