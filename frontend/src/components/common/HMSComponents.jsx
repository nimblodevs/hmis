import { T, FLOW, STATUS_META, TRIAGE_LEVELS, FLAG_STYLE } from '../../utils/hmsConstants';
import { calcAge, hue, fmtKES, genNo } from '../../utils/hmsHelpers';

// ─── Style Primitives ──────────────────────────────────────────────────────────
export const inputBase = {
  width: "100%", padding: "9px 12px", borderRadius: 8, fontFamily: "'Outfit',sans-serif",
  fontSize: 13, outline: "none", boxSizing: "border-box", transition: "border-color .15s",
};
export const IS  = (err) => ({ ...inputBase, border: "1.5px solid " + (err ? "#fca5a5" : T.border), background: "#fff" });
export const SS  = { ...IS(), background: "#fff" };
export const TA  = (err) => ({ ...IS(err), resize: "vertical", minHeight: 72 });
export const Btn = {
  padding: "10px 20px", border: "none", borderRadius: 9, cursor: "pointer",
  fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, transition: "all .15s",
};
export const BtnPrimary = { ...Btn, background: T.navy,  color: "#fff" };
export const BtnGreen   = { ...Btn, background: T.green, color: "#fff" };
export const BtnCyan    = { ...Btn, background: T.cyan,  color: "#fff" };
export const BtnRed     = { ...Btn, background: T.red,   color: "#fff" };
export const BtnGhost   = { ...Btn, background: "#fff",  color: T.slate, border: "1.5px solid " + T.border };

// ─── Atoms ────────────────────────────────────────────────────────────────────
export function Badge({ label, col, bg, sm }) {
  return (
    <span style={{
      background: bg || "#f1f5f9", color: col || T.slate, borderRadius: 6,
      padding: sm ? "2px 8px" : "4px 10px", fontSize: sm ? 10 : 12, fontWeight: 700, whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

export function Card({ children, mb = 14 }) {
  return (
    <div style={{
      background: T.card, borderRadius: 12, padding: "18px 20px",
      boxShadow: "0 1px 8px rgba(0,0,0,.06)", marginBottom: mb, border: "1px solid " + T.border,
    }}>
      {children}
    </div>
  );
}

export function Sec({ children, accent = "#475569" }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, color: accent, letterSpacing: 1.5,
      textTransform: "uppercase", fontFamily: "'DM Mono',monospace", marginBottom: 12,
      paddingBottom: 8, borderBottom: "1px solid " + T.border,
    }}>
      {children}
    </div>
  );
}

export function FL({ label, ch, span }) {
  return (
    <div style={{ gridColumn: span ? "1/-1" : undefined }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: T.slate, marginBottom: 5, letterSpacing: .4 }}>
        {label}
      </label>
      {ch}
    </div>
  );
}

export function ErrBox({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 9,
      padding: "10px 14px", marginBottom: 14, fontSize: 13, color: T.red, fontWeight: 500,
    }}>
      {msg}
    </div>
  );
}

export function EmptyState({ icon, msg }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 56, padding: "0 20px" }}>
      <div style={{ fontSize: 48, lineHeight: 1 }}>{icon}</div>
      <div style={{ fontSize: 14, color: T.slate, fontWeight: 500, textAlign: "center", maxWidth: 340 }}>{msg}</div>
    </div>
  );
}

export function Toast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(7,24,40,.55)", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(3px)",
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "32px 36px", maxWidth: 400, width: "92%",
        boxShadow: "0 24px 64px rgba(0,0,0,.35)", textAlign: "center", animation: "fadeUp .25s ease",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "linear-gradient(135deg," + T.green + ",#047857)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(5,150,105,.3)",
        }}>
          {toast.icon}
        </div>
        <div style={{ fontSize: 9, fontWeight: 700, color: T.green, letterSpacing: 2.5, textTransform: "uppercase", fontFamily: "'DM Mono',monospace", marginBottom: 8 }}>✅ Success</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: T.navy, marginBottom: 10 }}>{toast.title}</div>
        <div style={{ fontSize: 13, color: T.slate, lineHeight: 1.7, marginBottom: 24 }}>{toast.msg}</div>
        <button onClick={onClose} style={{
          padding: "12px 36px", border: "none", borderRadius: 10, cursor: "pointer",
          fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", width: "100%",
          background: "linear-gradient(135deg," + T.green + ",#047857)", boxShadow: "0 4px 14px rgba(5,150,105,.3)",
        }}>
          ✓ Continue
        </button>
      </div>
    </div>
  );
}

// ─── Patient-specific UI ──────────────────────────────────────────────────────
export function FlowBar({ status }) {
  const statusToKey = {
    "Queued": "queue", "Triaged": "triage", "Registered": "register",
    "Billed": "billing", "With Doctor": "doctor", "With Doctor (Post-Lab)": "doctor",
    "Lab Pending": "lab", "Completed": "pharmacy",
  };
  const idx = FLOW.findIndex(f => f.key === statusToKey[status]);
  return (
    <div style={{ background: T.card, borderRadius: 10, padding: "12px 16px", marginBottom: 14, boxShadow: "0 1px 6px rgba(0,0,0,.05)", border: "1px solid " + T.border }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {FLOW.map((s, i) => {
          const done = (i < idx), curr = (i === idx);
          return (
            <div key={s.key} style={{ display: "flex", alignItems: "center", flex: (i < FLOW.length - 1) ? 1 : "auto" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flexShrink: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: done ? 12 : 13, fontWeight: 800,
                  background: done ? T.navy : curr ? T.cyan : "#f1f5f9",
                  color: (done || curr) ? "#fff" : T.slateL,
                  boxShadow: curr ? "0 0 0 4px rgba(0,188,212,.2)" : "none", transition: "all .2s",
                }}>
                  {done ? "✓" : s.icon}
                </div>
                <span style={{ fontSize: 8, fontWeight: curr ? 700 : 400, whiteSpace: "nowrap", color: curr ? T.navy : done ? T.slate : T.slateL }}>
                  {s.lbl}
                </span>
              </div>
              {(i < FLOW.length - 1) && (
                <div style={{ flex: 1, height: 2, borderRadius: 2, margin: "0 4px", marginBottom: 14, background: done ? T.navy : T.border, transition: "background .3s" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PatientBanner({ p }) {
  if (!p) return null;
  const sm = STATUS_META[p.status] || STATUS_META["Queued"];
  const h  = hue(p.id || p.queueNo);
  return (
    <div style={{
      background: T.card, borderRadius: 11, padding: "13px 16px", marginBottom: 12,
      boxShadow: "0 1px 6px rgba(0,0,0,.05)", display: "flex", justifyContent: "space-between",
      alignItems: "center", flexWrap: "wrap", gap: 10, border: "1px solid " + T.border,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
          background: "hsl(" + h + ",50%,82%)", color: "hsl(" + h + ",40%,28%)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800,
        }}>
          {(p.firstName || p.name || "?")[0]}{(p.lastName || "")[0] || ""}
        </div>
        <div>
          <div style={{ fontWeight: 700, color: T.navy, fontSize: 14 }}>
            {p.firstName || p.name} {p.middleName || ""} {p.lastName || ""}
          </div>
          <div style={{ fontSize: 11, color: T.slateL, fontFamily: "'DM Mono',monospace" }}>
            {p.id || "Unregistered"} · {p.mrn || "-"} · {p.queueNo}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
        {p.dateOfBirth && <div><div style={{ fontSize: 9, color: T.slateL, fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: 1 }}>Age</div><div style={{ fontSize: 13, fontWeight: 600 }}>{calcAge(p.dateOfBirth)} yrs</div></div>}
        {p.gender     && <div><div style={{ fontSize: 9, color: T.slateL, fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: 1 }}>Sex</div><div style={{ fontSize: 13, fontWeight: 600 }}>{p.gender}</div></div>}
        {p.bloodGroup && <div><div style={{ fontSize: 9, color: T.slateL, fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: 1 }}>Blood</div><div style={{ fontSize: 13, fontWeight: 600 }}>{p.bloodGroup}</div></div>}
        {p.category   && <div><div style={{ fontSize: 9, color: T.slateL, fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: 1 }}>Category</div><div style={{ fontSize: 13, fontWeight: 600 }}>{p.category}</div></div>}
        <Badge label={p.status} col={sm.col} bg={sm.bg} sm />
      </div>
    </div>
  );
}

export function RefNums({ p }) {
  if (!p) return null;
  const chips = [
    p.billing?.invoiceNo && { lbl: "Invoice",      val: p.billing.invoiceNo, col: "#1d4ed8", bg: "#eff6ff", bd: "#bfdbfe", badge: p.billing.paid ? { t: "PAID", bg: "#dcfce7", c: "#15803d" } : { t: "UNPAID", bg: "#fef3c7", c: "#b45309" } },
    p.billing?.receiptNo && { lbl: "Receipt",       val: p.billing.receiptNo, col: "#15803d", bg: "#f0fdf4", bd: "#bbf7d0" },
    p.clerking?.consNo   && { lbl: "Consultation",  val: p.clerking.consNo,   col: "#7c3aed", bg: "#f5f3ff", bd: "#ddd6fe" },
    p.clerking?.labNo    && { lbl: "Lab Report",    val: p.clerking.labNo,    col: "#0f766e", bg: "#f0fdfa", bd: "#99f6e4" },
    p.clerking?.rxNo     && { lbl: "Rx",            val: p.clerking.rxNo,     col: "#15803d", bg: "#f0fdf4", bd: "#86efac", badge: { t: "DISPENSED", bg: "#dcfce7", c: "#166534" } },
    p.billing?.billedBy  && { lbl: "Billed By",     val: p.billing.billedBy,  col: T.slate,   bg: "#f8fafc", bd: T.border },
  ].filter(Boolean);
  if (!chips.length) return null;
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
      {chips.map(c => (
        <div key={c.lbl} style={{ background: c.bg, border: "1px solid " + c.bd, borderRadius: 8, padding: "5px 11px", display: "flex", alignItems: "center", gap: 6 }}>
          <div>
            <div style={{ fontSize: 8, fontFamily: "'DM Mono',monospace", color: c.col, textTransform: "uppercase", letterSpacing: 1.2, opacity: .7, marginBottom: 1 }}>{c.lbl}</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: c.col, fontFamily: "'DM Mono',monospace", lineHeight: 1 }}>{c.val}</div>
          </div>
          {c.badge && (
            <span style={{ background: c.badge.bg, color: c.badge.c, borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 800, letterSpacing: .5, flexShrink: 0 }}>
              {c.badge.t}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function LabResultGrid({ labResults }) {
  if (!labResults) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 8 }}>
      {Object.entries(labResults).map(([sid, r]) => {
        const fc = FLAG_STYLE[r.flag] || FLAG_STYLE.empty;
        return (
          <div key={sid} style={{ background: fc.bg, border: "1.5px solid " + fc.bd, borderRadius: 8, padding: "8px 10px" }}>
            <div style={{ fontSize: 10, color: T.slateL, marginBottom: 3 }}>{sid}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: fc.tx, fontFamily: "'DM Mono',monospace" }}>
              {r.value || "—"}
            </div>
            {r.flag && r.flag !== "normal" && r.flag !== "empty" && (
              <span style={{ background: fc.tBg, color: fc.tTx, borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 700 }}>{fc.tag}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
