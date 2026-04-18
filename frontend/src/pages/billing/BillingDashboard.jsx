import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import HMSLayout from "../../components/layout/HMSLayout";
import HMSTopBar from "../../components/layout/HMSTopBar";
import { PatientBanner, FlowBar, RefNums, Card, Sec, FL, ErrBox, EmptyState, Badge, BtnGhost, BtnGreen, IS, SS, Btn } from "../../components/common/HMSComponents";
import { T, SERVICES } from "../../utils/hmsConstants";
import { fmtKES, genNo } from "../../utils/hmsHelpers";

export default function BillingDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { patients, saveBilling } = usePatients();

  const initQueueNo = location.state?.queueNo || null;
  const [selectedQueueNo, setSelectedQueueNo] = useState(initQueueNo);
  const active = patients.find(p => p.queueNo === selectedQueueNo) || null;

  const [bItems,  setBItems]  = useState(() => active?.billing?.items   || []);
  const [bDisc,   setBDisc]   = useState(() => active?.billing?.discount || 0);
  const [bMethod, setBMethod] = useState(() => active?.billing?.method   || "Cash");
  const [bNote,   setBNote]   = useState(() => active?.billing?.note     || "");
  const [bErr,    setBErr]    = useState("");
  const [bTab,    setBTab]    = useState("consultation");

  const waiting = patients.filter(p => p.status === "Registered");

  const pickPatient = (p) => {
    setSelectedQueueNo(p.queueNo);
    setBItems(p.billing?.items || []);
    setBDisc(p.billing?.discount || 0);
    setBMethod(p.billing?.method || (p.category === "Cash" ? "Cash" : "SHA"));
    setBNote(p.billing?.note || "");
    setBErr(""); setBTab("consultation");
  };

  const addItem = (item) => {
    setBItems(prev => {
      const ex = prev.find(i => i.id === item.id);
      return ex ? prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...item, qty: 1 }];
    });
  };

  const handleSave = (paid) => {
    if (!bItems.length) { setBErr("Add at least one service item."); return; }
    saveBilling(selectedQueueNo, { items: bItems, discount: bDisc, method: bMethod, note: bNote }, paid,
      () => { setSelectedQueueNo(null); navigate("/hms/queue"); });
  };

  const total = bItems.reduce((s, i) => s + i.price * i.qty, 0) - bDisc;

  return (
    <HMSLayout>
      <HMSTopBar
        title="Billing"
        subtitle={active ? active.queueNo + " · " + (active.firstName || active.name) + " " + (active.lastName || "") : waiting.length + " awaiting billing"}
        action={
          <div style={{ display: "flex", gap: 8 }}>
            {active && <button onClick={() => setSelectedQueueNo(null)} style={BtnGhost}>← List</button>}
            <button onClick={() => navigate("/hms/queue")} style={BtnGhost}>← Queue</button>
          </div>
        }
      />
      <div style={{ padding: "20px 24px" }}>
        {!active ? (
          waiting.length === 0 ? <EmptyState icon="💳" msg="No patients awaiting billing." /> :
          waiting.map(p => (
            <div key={p.queueNo} onClick={() => pickPatient(p)} style={{
              background: T.card, borderRadius: 11, padding: "14px 18px", marginBottom: 10,
              boxShadow: "0 1px 6px rgba(0,0,0,.06)", border: "1.5px solid " + T.border,
              cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.firstName} {p.lastName}</div>
                <div style={{ fontSize: 11, color: T.slateL, fontFamily: "'DM Mono',monospace" }}>{p.queueNo} · {p.category}</div>
              </div>
              <span style={{ ...Btn, padding: "7px 16px", fontSize: 12, background: T.blue, color: "#fff" }}>💳 Bill</span>
            </div>
          ))
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" }}>
            <div>
              <PatientBanner p={active} />
              <FlowBar status={active.status} />
              <RefNums p={active} />
              <ErrBox msg={bErr} />

              {/* Tab nav */}
              <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
                {["consultation","lab","radiology","pharmacy"].map(tab => {
                  const cnt = bItems.filter(i => i.cat === tab).length;
                  return (
                    <button key={tab} onClick={() => setBTab(tab)} style={{
                      ...Btn, padding: "8px 16px", fontSize: 12, fontWeight: bTab === tab ? 700 : 400,
                      background: bTab === tab ? "#f0f9ff" : "#fff", color: bTab === tab ? "#0369a1" : T.slate,
                      borderBottom: bTab === tab ? "2px solid #0369a1" : "2px solid transparent",
                      border: "1.5px solid " + T.border,
                    }}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      {cnt > 0 && <span style={{ background: "#0369a1", color: "#fff", borderRadius: 8, padding: "0 6px", fontSize: 10, marginLeft: 4 }}>{cnt}</span>}
                    </button>
                  );
                })}
              </div>

              <Card>
                <Sec>Services — {bTab.charAt(0).toUpperCase() + bTab.slice(1)}</Sec>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {SERVICES.filter(s => s.cat === bTab || (bTab === "consultation" && s.cat === "procedure")).map(s => {
                    const added = bItems.some(i => i.id === s.id);
                    return (
                      <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 9, border: "1.5px solid " + (added ? "#86efac" : T.border), background: added ? "#f0fdf4" : "#fff" }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: T.slateL, fontFamily: "'DM Mono',monospace" }}>{s.price > 0 ? fmtKES(s.price) : "Variable"}</div>
                        </div>
                        <button onClick={() => addItem(s)} style={{ ...Btn, padding: "5px 12px", fontSize: 11, background: added ? "#dcfce7" : "#f1f5f9", color: added ? T.green : T.slate }}>
                          {added ? "Added ✓" : "+ Add"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {bItems.length > 0 && (
                <Card>
                  <Sec>Bill Items</Sec>
                  {bItems.map(item => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid " + T.border }}>
                      <span style={{ fontSize: 13 }}>{item.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", color: T.slate }}>x{item.qty}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{fmtKES(item.price * item.qty)}</span>
                        <button onClick={() => setBItems(prev => prev.filter(i => i.id !== item.id))}
                          style={{ background: "#fee2e2", border: "none", borderRadius: 5, width: 22, height: 22, cursor: "pointer", color: T.red, fontWeight: 700 }}>×</button>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 10 }}>
                    <FL label="Discount (KES)" ch={<input type="number" value={bDisc} onChange={e => setBDisc(Number(e.target.value) || 0)} style={{ ...IS(), maxWidth: 160 }} />} />
                  </div>
                </Card>
              )}
            </div>

            {/* Invoice panel */}
            <div style={{ position: "sticky", top: 70 }}>
              <Card>
                <div style={{
                  background: "linear-gradient(135deg," + T.green + ",#047857)",
                  borderRadius: 10, padding: "14px", marginBottom: 14, color: "#fff",
                }}>
                  <div style={{ fontSize: 9, fontFamily: "'DM Mono',monospace", letterSpacing: 1.5, opacity: .65, marginBottom: 3 }}>Invoice No.</div>
                  <div style={{ fontSize: 17, fontWeight: 900, fontFamily: "'DM Mono',monospace" }}>
                    {active ? genNo("INV-26", patients.findIndex(p => p.queueNo === active.queueNo) + 1) : "—"}
                  </div>
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,.2)", fontSize: 10, opacity: .6 }}>
                    {(active.firstName || active.name)} {active.lastName || ""} · {new Date().toISOString().split("T")[0]}
                  </div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: T.navy, marginBottom: 4 }}>{fmtKES(total)}</div>
                <div style={{ fontSize: 11, color: T.slateL, marginBottom: 14 }}>{bItems.length} item(s){bDisc > 0 ? " · Discount: " + fmtKES(bDisc) : ""}</div>
                {active?.category !== "Cash" && (
                  <FL label="Payment Method" ch={
                    <select value={bMethod} onChange={e => setBMethod(e.target.value)} style={SS}>
                      {["SHA","NHIF","Corporate Account","Cash","M-Pesa","POS / Card"].map(m => <option key={m}>{m}</option>)}
                    </select>
                  } />
                )}
                <div style={{ marginTop: 8 }}>
                  <FL label="Notes" ch={<input value={bNote} onChange={e => setBNote(e.target.value)} placeholder="Optional note" style={IS()} />} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
                  <button onClick={() => handleSave(true)}  style={{ ...BtnGreen, width: "100%", textAlign: "center" }}>✅ Confirm Payment</button>
                  <button onClick={() => handleSave(false)} style={{ ...BtnGhost, width: "100%", textAlign: "center" }}>📋 Save Invoice (Unpaid)</button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </HMSLayout>
  );
}
