import { T } from "../../utils/hmsConstants";

export default function HMSTopBar({ title, subtitle, action }) {
  return (
    <div style={{
      background: T.card, padding: "14px 24px", display: "flex", justifyContent: "space-between",
      alignItems: "center", borderBottom: "1px solid " + T.border, position: "sticky", top: 0, zIndex: 10,
      boxShadow: "0 1px 8px rgba(0,0,0,.04)",
    }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: T.navy, letterSpacing: -.2 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: T.slateL, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {action && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{action}</div>}
    </div>
  );
}
