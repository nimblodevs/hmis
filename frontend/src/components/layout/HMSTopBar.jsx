import { T } from "../../utils/hmsConstants";
import { useBreakpoint } from "../../hooks/useBreakpoint";

export default function HMSTopBar({ title, subtitle, action }) {
  const { isMobile } = useBreakpoint();

  return (
    <div style={{
      background: T.card,
      padding: isMobile ? "12px 16px" : "14px 24px",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "center",
      gap: isMobile ? 10 : 0,
      borderBottom: "1px solid " + T.border,
      position: "sticky",
      top: isMobile ? 54 : 0,   // offset by mobile nav bar height
      zIndex: 10,
      boxShadow: "0 1px 8px rgba(0,0,0,.04)",
    }}>
      <div>
        <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, color: T.navy, letterSpacing: -.2 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: T.slateL, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {action && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", width: isMobile ? "100%" : "auto" }}>
          {action}
        </div>
      )}
    </div>
  );
}
