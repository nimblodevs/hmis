import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../../../context/PatientContext';
import HMSLayout from '../../../components/layout/HMSLayout';
import HMSTopBar from '../../../components/layout/HMSTopBar';
import { 
  Card, Sec, FL, ErrBox, EmptyState, 
  BtnGreen, BtnGhost, IS, SS 
} from '../../../components/common/HMSComponents';
import { T } from '../../../utils/hmsConstants';
import { fmtKES } from '../../../utils/hmsHelpers';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { useMemo } from 'react';

export default function ShiftDashboard() {
  const navigate = useNavigate();
  const { shifts, activeShift, openShift } = usePatients();
  const { isMobile } = useBreakpoint();

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ officer: "", float: "" });
  const [err, setErr] = useState("");

  // Filters
  const [fDateStart, setFDateStart] = useState("");
  const [fDateEnd, setFDateEnd] = useState("");
  const [fCashier, setFCashier] = useState("");
  const [fQuery, setFQuery] = useState("");

  const runningShifts = shifts.filter(s => !s.closedAt);
  
  const cashiers = [...new Set(shifts.map(s => s.officer))].sort();

  const filteredHistory = useMemo(() => {
    return shifts
      .filter(s => s.closedAt)
      .filter(s => {
        const date = new Date(s.closedAt).toISOString().split('T')[0];
        const matchesDate = (!fDateStart || date >= fDateStart) && (!fDateEnd || date <= fDateEnd);
        const matchesCashier = !fCashier || s.officer === fCashier;
        const matchesQuery = !fQuery || s.id.toLowerCase().includes(fQuery.toLowerCase()) || s.officer.toLowerCase().includes(fQuery.toLowerCase());
        return matchesDate && matchesCashier && matchesQuery;
      });
  }, [shifts, fDateStart, fDateEnd, fCashier, fQuery]);

  const handleOpen = () => {
    if (!form.officer.trim()) { setErr("Officer name required."); return; }
    openShift(form.officer, form.float);
    setModal(false);
    navigate("/hms/cashier/receipting");
  };

  return (
    <HMSLayout>
      <HMSTopBar 
        title="Shift Dashboard" 
        subtitle="Manage cashiering shifts and history"
        action={
          !activeShift && (
            <button onClick={() => setModal(true)} style={{ ...BtnGreen, fontSize: 13 }}>
              🟢 Open New Shift
            </button>
          )
        }
      />

      <div style={{ padding: isMobile ? "16px" : "24px", maxWidth: 1000 }}>
        {activeShift && (
          <div style={{
            background: "linear-gradient(135deg," + T.navy + "," + T.navyL + ")",
            borderRadius: 16, padding: "20px 24px", marginBottom: 24, color: "#fff",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            boxShadow: "0 12px 32px rgba(7,24,40,.2)"
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, opacity: .6, marginBottom: 4 }}>Active Running Shift</div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{activeShift.officer}</div>
              <div style={{ fontSize: 13, opacity: .7, fontFamily: "'DM Mono',monospace", marginTop: 2 }}>{activeShift.id} · Opened {new Date(activeShift.openedAt).toLocaleTimeString()}</div>
            </div>
            <button onClick={() => navigate("/hms/cashier/receipting")} 
              style={{ ...BtnGreen, background: T.cyan, color: T.navy, fontWeight: 800, padding: "10px 20px" }}>
              Enter Receipting →
            </button>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24, alignItems: "start" }}>
          {/* Running Shifts */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              📡 Running Shifts
              <span style={{ background: T.green + "22", color: T.green, borderRadius: 6, padding: "1px 8px", fontSize: 11 }}>{runningShifts.length}</span>
            </div>
            {runningShifts.length === 0 ? (
              <EmptyState icon="📡" msg="No active shifts found. Open a shift to start receipting." />
            ) : (
              runningShifts.map(s => (
                <div key={s.id} onClick={() => navigate("/hms/cashier/receipting")}
                  style={{
                    background: T.card, borderRadius: 12, padding: "16px", marginBottom: 10,
                    border: "1.5px solid " + (activeShift?.id === s.id ? T.cyan : T.border),
                    cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.03)"
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{s.officer}</div>
                      <div style={{ fontSize: 11, color: T.slateL, fontFamily: "'DM Mono',monospace" }}>{s.id}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: T.green }}>{fmtKES(s.receipts.reduce((a, b) => a + b.amount, 0))}</div>
                      <div style={{ fontSize: 10, color: T.slateL }}>{s.receipts.length} receipts</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Shift History */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 12 }}>📜 Shift History</div>
            
            {/* Filter Bar */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "16px", marginBottom: 16, border: "1px solid " + T.border, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: T.slateL, textTransform: "uppercase", marginBottom: 4, display: "block" }}>Start Date</label>
                  <input type="date" value={fDateStart} onChange={e => setFDateStart(e.target.value)} style={{ ...IS(), padding: "6px 10px" }} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: T.slateL, textTransform: "uppercase", marginBottom: 4, display: "block" }}>End Date</label>
                  <input type="date" value={fDateEnd} onChange={e => setFDateEnd(e.target.value)} style={{ ...IS(), padding: "6px 10px" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: T.slateL, textTransform: "uppercase", marginBottom: 4, display: "block" }}>Cashier</label>
                <select value={fCashier} onChange={e => setFCashier(e.target.value)} style={{ ...SS, padding: "6px 10px" }}>
                  <option value="">All Cashiers</option>
                  {cashiers.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <input value={fQuery} onChange={e => setFQuery(e.target.value)} placeholder="Search Shift ID or name..." style={{ ...IS(), padding: "8px 12px", fontSize: 12 }} />
              {(fDateStart || fDateEnd || fCashier || fQuery) && (
                <button onClick={() => { setFDateStart(""); setFDateEnd(""); setFCashier(""); setFQuery(""); }} 
                  style={{ border: "none", background: "none", color: T.red, fontSize: 11, fontWeight: 700, cursor: "pointer", textAlign: "left", padding: 0 }}>
                  ✕ Clear Filters
                </button>
              )}
            </div>

            {filteredHistory.length === 0 ? (
              <EmptyState icon="📜" msg="No shifts match the filters." />
            ) : (
              filteredHistory.map(s => (
                <div key={s.id} onClick={() => navigate(`/hms/cashier/summary/${s.id}`)}
                  style={{
                    background: "#f8fafc", borderRadius: 12, padding: "14px 16px", marginBottom: 8,
                    border: "1px solid " + T.border, cursor: "pointer", opacity: .85
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{s.officer}</div>
                      <div style={{ fontSize: 10, color: T.slateL, fontFamily: "'DM Mono',monospace" }}>
                        {new Date(s.closedAt).toLocaleDateString()} · {new Date(s.closedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: T.navy }}>{fmtKES(s.receipts.reduce((a, b) => a + b.amount, 0))}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Open Shift Modal */}
      {modal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(7,24,40,.6)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)"
        }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "32px", width: 400, boxShadow: "0 32px 64px rgba(0,0,0,.4)" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.navy, marginBottom: 24 }}>Open New Cashier Shift</div>
            <ErrBox msg={err} />
            <div style={{ marginBottom: 16 }}>
              <FL label="Cashier / Officer Name *" ch={
                <input value={form.officer} onChange={e => setForm(p => ({ ...p, officer: e.target.value }))}
                  placeholder="Enter your name" style={IS(!form.officer && err)} autoFocus />
              } />
            </div>
            <FL label="Opening Float (KES)" ch={
              <input type="number" value={form.float} onChange={e => setForm(p => ({ ...p, float: e.target.value }))}
                placeholder="e.g. 5000" style={IS()} />
            } />
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button onClick={() => setModal(false)} style={{ ...BtnGhost, flex: 1 }}>Cancel</button>
              <button onClick={handleOpen} style={{ ...BtnGreen, flex: 2 }}>Open Shift</button>
            </div>
          </div>
        </div>
      )}
    </HMSLayout>
  );
}
