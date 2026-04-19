import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../../../context/PatientContext';
import HMSLayout from '../../../components/layout/HMSLayout';
import HMSTopBar from '../../../components/layout/HMSTopBar';
import { 
  Card, Sec, FL, ErrBox, EmptyState, 
  BtnGreen, BtnRed, BtnGhost, IS 
} from '../../../components/common/HMSComponents';
import { T } from '../../../utils/hmsConstants';
import { fmtKES, pad, calcAge } from '../../../utils/hmsHelpers';
import { useBreakpoint } from '../../../hooks/useBreakpoint';

export default function CashierReceipting() {
  const navigate = useNavigate();
  const { patients, setPatients, activeShift, closeShift, recordReceipt } = usePatients();
  const { isMobile } = useBreakpoint();

  const [tab, setTab] = useState("pending");
  const [rxActive, setRxActive] = useState(null);
  const [rxMethod, setRxMethod] = useState("Cash");
  const [rxRef, setRxRef] = useState("");
  const [rxNote, setRxNote] = useState("");
  const [rxErr, setRxErr] = useState("");

  const [duration, setDuration] = useState("");

  // Timer logic
  useEffect(() => {
    if (!activeShift) return;
    const itv = setInterval(() => {
      const diff = Date.now() - new Date(activeShift.openedAt).getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setDuration(`${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)}`);
    }, 1000);
    return () => clearInterval(itv);
  }, [activeShift]);

  // If no active shift, redirect to dashboard
  useEffect(() => {
    if (!activeShift) navigate("/hms/cashier");
  }, [activeShift, navigate]);

  // Data processing
  const allBills = useMemo(() => {
    return patients
      .filter(p => p.billing && p.category === "Cash")
      .map(p => ({
        patient: p,
        billing: p.billing,
        depts: [
          p.billing.items.some(i => i.cat === "consultation" || i.cat === "procedure") && "Consultation",
          p.billing.items.some(i => i.cat === "lab") && "Laboratory",
          p.billing.items.some(i => i.cat === "radiology") && "Radiology",
          p.billing.items.some(i => i.cat === "pharmacy") && "Pharmacy",
        ].filter(Boolean),
      }));
  }, [patients]);

  const pendingBills = useMemo(() => allBills.filter(b => !b.billing.paid), [allBills]);
  
  const shiftReceipts = useMemo(() => activeShift?.receipts || [], [activeShift]);

  const handleReceipt = () => {
    if (!rxActive) return;
    if (!rxMethod) { setRxErr("Select payment method."); return; }
    if (["M-Pesa", "Cheque", "POS / Card"].includes(rxMethod) && !rxRef.trim()) {
      setRxErr(`Reference required for ${rxMethod}.`);
      return;
    }

    const total = rxActive.billing.items.reduce((s, i) => s + i.price * i.qty, 0) - (rxActive.billing.discount || 0);
    const seq = patients.findIndex(p => p.queueNo === rxActive.patient.queueNo) + 1;
    const recNo = "REC-" + new Date().toISOString().slice(2, 10).replace(/-/g, "") + "-" + pad(seq, 3);

    // Update patient
    setPatients(prev => prev.map(p => 
      p.queueNo === rxActive.patient.queueNo
        ? { ...p, billing: { ...p.billing, paid: true, method: rxMethod, receiptNo: recNo, paidAt: new Date().toISOString() } }
        : p
    ));

    // Update shift
    recordReceipt(activeShift.id, {
      id: recNo,
      billNo: rxActive.billing.billNo || rxActive.billing.invoiceNo,
      patient: (rxActive.patient.firstName || rxActive.patient.name) + " " + (rxActive.patient.lastName || ""),
      amount: total,
      method: rxMethod,
      ref: rxRef.trim(),
      time: new Date().toISOString(),
      cashier: activeShift.officer,
      patientId: rxActive.patient.patientNo || rxActive.patient.id,
      items: rxActive.billing.items,
      age: rxActive.patient.dob ? calcAge(rxActive.patient.dob) : "-",
      shiftId: activeShift.id,
      discount: rxActive.billing.discount || 0,
    });

    setRxActive(null);
    setRxErr("");
    setRxRef("");
    setRxNote("");
  };

  const METHODS = ["Cash", "M-Pesa", "POS / Card", "Cheque"];
  const M_ICON = { "Cash": "💵", "M-Pesa": "📱", "POS / Card": "💳", "Cheque": "📄" };

  if (!activeShift) return null;

  return (
    <HMSLayout>
      <HMSTopBar 
        title={activeShift.officer}
        subtitle={`Active Shift: ${activeShift.id} · ⏱ ${duration}`}
        action={
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => navigate("/hms/cashier")} style={BtnGhost}>Dashboard</button>
            <button onClick={() => { closeShift(activeShift.id); navigate("/hms/cashier"); }} style={BtnRed}>End Shift</button>
          </div>
        }
      />

      <div style={{ padding: isMobile ? "16px" : "20px 24px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", background: T.card, borderRadius: 12, overflow: "hidden", marginBottom: 20, border: "1px solid " + T.border }}>
          {[["pending", "📋 Pending Bills (" + pendingBills.length + ")"], ["receipted", "✅ Receipted Today (" + shiftReceipts.length + ")"]].map(([k, lbl]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{
                flex: 1, padding: "14px", border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                fontSize: 13, fontWeight: tab === k ? 700 : 400,
                background: tab === k ? "#f0f9ff" : "transparent",
                color: tab === k ? "#0369a1" : T.slateL,
                borderBottom: tab === k ? "3px solid #0369a1" : "3px solid transparent",
                transition: "all .15s"
              }}>
              {lbl}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 400px", gap: 20, alignItems: "start" }}>
          {/* Main List */}
          <div>
            {tab === "pending" ? (
              pendingBills.length === 0 ? <EmptyState icon="📋" msg="No bills pending receipt." /> : (
                pendingBills.map(b => {
                  const total = b.billing.items.reduce((s, i) => s + i.price * i.qty, 0) - (b.billing.discount || 0);
                  const isSel = rxActive?.billing.invoiceNo === b.billing.invoiceNo;
                  return (
                    <div key={b.billing.invoiceNo} onClick={() => { setRxActive(b); setRxErr(""); }}
                      style={{
                        background: isSel ? "#f0f9ff" : T.card, borderRadius: 12, padding: "16px", marginBottom: 10,
                        border: "1.5px solid " + (isSel ? "#0369a1" : T.border), cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,.04)"
                      }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{b.patient.firstName || b.patient.name} {b.patient.lastName || ""}</div>
                          <div style={{ fontSize: 11, color: T.slateL, fontFamily: "'DM Mono',monospace" }}>{b.billing.invoiceNo} · {b.patient.queueNo}</div>
                          <div style={{ display: "flex", gap: 5, marginTop: 6 }}>
                            {b.depts.map(d => <span key={d} style={{ background: "#f1f5f9", borderRadius: 4, padding: "1px 6px", fontSize: 10 }}>{d}</span>)}
                          </div>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: T.navy, fontFamily: "'DM Mono',monospace" }}>{fmtKES(total)}</div>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              shiftReceipts.length === 0 ? <EmptyState icon="✅" msg="No receipts issued in this shift yet." /> : (
                shiftReceipts.slice().reverse().map(r => (
                  <div key={r.id} style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px", marginBottom: 8, border: "1px solid " + T.border }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{r.patient}</div>
                        <div style={{ fontSize: 10, color: T.slateL, fontFamily: "'DM Mono',monospace" }}>{r.id} · {M_ICON[r.method]} {r.method} {r.ref && `· ${r.ref}`}</div>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: T.green }}>{fmtKES(r.amount)}</div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>

          {/* Form Panel */}
          {tab === "pending" && (
            <Card>
              {rxActive ? (
                <>
                  <div style={{ background: T.navy, borderRadius: 10, padding: "16px", color: "#fff", marginBottom: 16 }}>
                    <div style={{ fontSize: 10, opacity: .6, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Bill Amount</div>
                    <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "'DM Mono',monospace", color: T.cyan }}>
                      {fmtKES(rxActive.billing.items.reduce((s, i) => s + i.price * i.qty, 0) - (rxActive.billing.discount || 0))}
                    </div>
                    <div style={{ fontSize: 12, marginTop: 4, opacity: .8 }}>{rxActive.patient.firstName} {rxActive.patient.lastName}</div>
                  </div>

                  <ErrBox msg={rxErr} />

                  <div style={{ fontSize: 11, fontWeight: 700, color: T.slate, marginBottom: 8 }}>Payment Method</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 16 }}>
                    {METHODS.map(m => (
                      <button key={m} onClick={() => { setRxMethod(m); setRxRef(""); setRxErr(""); }}
                        style={{
                          padding: "10px", borderRadius: 10, border: "1.5px solid " + (rxMethod === m ? "#0369a1" : T.border),
                          background: rxMethod === m ? "#eff6ff" : "#fff", color: rxMethod === m ? "#0369a1" : T.slate,
                          fontSize: 12, fontWeight: rxMethod === m ? 700 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
                        }}>
                        <span style={{ fontSize: 16 }}>{M_ICON[m]}</span> {m}
                      </button>
                    ))}
                  </div>

                  {["M-Pesa", "POS / Card", "Cheque"].includes(rxMethod) && (
                    <FL label={`${rxMethod} Reference *`} ch={
                      <input value={rxRef} onChange={e => setRxRef(e.target.value)} placeholder="Ref / Auth Code" style={IS(!rxRef && rxErr)} />
                    } />
                  )}

                  <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                    <button onClick={() => setRxActive(null)} style={{ ...BtnGhost, flex: 1 }}>Cancel</button>
                    <button onClick={handleReceipt} style={{ ...BtnGreen, flex: 2 }}>Confirm Receipt</button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 0", color: T.slateL }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>👆</div>
                  <div style={{ fontSize: 14 }}>Select a patient on the left to process payment</div>
                </div>
              )}
            </Card>
          )}

          {tab === "receipted" && (
            <Card>
              <Sec>Shift Collection Summary</Sec>
              <div style={{ fontSize: 24, fontWeight: 900, color: T.navy, fontFamily: "'DM Mono',monospace", marginBottom: 4 }}>
                {fmtKES(shiftReceipts.reduce((a, b) => a + b.amount, 0))}
              </div>
              <div style={{ fontSize: 12, color: T.slateL, marginBottom: 20 }}>Total Collected (excluding float)</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Cash", "M-Pesa", "POS / Card", "Cheque"].map(m => {
                  const amt = shiftReceipts.filter(r => r.method === m).reduce((a, b) => a + b.amount, 0);
                  if (amt === 0) return null;
                  return (
                    <div key={m} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid " + T.border }}>
                      <span style={{ fontSize: 13, color: T.slate }}>{M_ICON[m]} {m}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{fmtKES(amt)}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>
    </HMSLayout>
  );
}
