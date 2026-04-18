import { useState } from "react";
import { T } from "../../utils/hmsConstants";
import HMSSidebar from "./HMSSidebar";
import { Toast } from "../common/HMSComponents";
import { usePatients } from "../../context/PatientContext";
import { useBreakpoint } from "../../hooks/useBreakpoint";

export default function HMSLayout({ children }) {
  const { toast, closeToast } = usePatients();
  const { isMobile } = useBreakpoint();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: "'Outfit',sans-serif" }}>
      {/* Mobile overlay backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(7,24,40,.65)",
            zIndex: 50, backdropFilter: "blur(2px)"
          }}
        />
      )}

      {/* Sidebar — fixed on mobile, sticky on desktop */}
      <div style={{
        position: isMobile ? "fixed" : "sticky",
        top: 0, left: 0, height: "100vh", zIndex: 60,
        transform: isMobile ? (sidebarOpen ? "translateX(0)" : "translateX(-100%)") : "none",
        transition: "transform .25s cubic-bezier(.4,0,.2,1)",
        flexShrink: 0,
      }}>
        <HMSSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {/* Mobile top bar with hamburger */}
        {isMobile && (
          <div style={{
            background: T.navy, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
            position: "sticky", top: 0, zIndex: 40, boxShadow: "0 2px 8px rgba(0,0,0,.3)",
          }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: "rgba(255,255,255,.1)", border: "none", borderRadius: 8,
                color: "#fff", padding: "8px 10px", cursor: "pointer", fontSize: 18, lineHeight: 1,
              }}
              aria-label="Open navigation menu"
            >
              ☰
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: "linear-gradient(135deg," + T.cyan + "," + T.cyanD + ")",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
              }}>🏥</div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: .2 }}>MediCore HMS</div>
            </div>
          </div>
        )}
        {children}
      </div>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
