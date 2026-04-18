import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import HMSLayout from "../../components/layout/HMSLayout";
import HMSTopBar from "../../components/layout/HMSTopBar";
import { PatientBanner, FlowBar, RefNums, Card, Sec, FL, ErrBox, EmptyState, Badge, BtnGhost, BtnGreen, IS, SS, Btn } from "../../components/common/HMSComponents";
import { T, SERVICES } from "../../utils/hmsConstants";
import { fmtKES, genNo } from "../../utils/hmsHelpers";
import { useBreakpoint } from "../../hooks/useBreakpoint";

export default function BillingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { patients, saveBilling } = usePatients();
  const { isMobile, isTablet } = useBreakpoint();

  const initQueueNo = location.state?.queueNo || null;
  const [selectedQueueNo, setSelectedQueueNo] = useState(initQueueNo);
  const active = patients.find(p => p.queueNo === selectedQueueNo) || null;

  const [bTab, setBTab] = useState("consultation");
  const [bItems, setBItems] = useState(() => active?.billing?.items || []);
  const [bMethod, setBMethod] = useState("Cash");
  const [bErr, setBErr] = useState("");

  if (!active) {
    return (
      <HMSLayout>
        <HMSTopBar title="Billing Process" subtitle="No patient selected" action={<button onClick={() => navigate("/hms/billing")} style={BtnGhost}>← Dashboard</button>} />
        <div style={{ padding: "40px" }}><EmptyState icon="❓" msg="No patient selected for billing. Please select from the dashboard." /></div>
      </HMSLayout>
    );
  }

  const addItem = (svc) => {
    setBItems(p => [...p, { ...svc, id: Date.now(), qty: 1, total: svc.price }]);
  };

  const handleSave = (paid = true) => {
    if (bItems.length === 0) { setBErr("Please add at least one item."); return; }
    saveBilling(selectedQueueNo, { items: bItems, discount: 0, method: bMethod, note: "" }, paid, () => {
      navigate("/hms/billing");
    });
  };

  const total = bItems.reduce((acc, i) => acc + i.total, 0);

  return (
    <HMSLayout>
      <HMSTopBar
        title="Billing Process"
        subtitle={active.queueNo + " · " + (active.firstName || active.name) + " " + (active.lastName || "")}
        action={<button onClick={() => navigate("/hms/billing")} style={BtnGhost}>← Dashboard</button>}
      />
      <div style={{ padding: isMobile ? "16px" : "20px 24px" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1fr 280px", 
          gap: 16, 
          alignItems: "start" 
        }}>
          <div>
            <PatientBanner p={active} />
            <FlowBar status={active.status} />
            <RefNums p={active} />
            <ErrBox msg={bErr} />

            {/* Tab nav */}
            <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
              {["consultation", "lab", "radiology", "pharmacy"].map(tab => {
                const cnt = bItems.filter(i => i.cat === tab).length;
                return (
                  <button key={tab} onClick={() => setBTab(tab)} style={{
                    ...Btn, padding: isMobile ? "6px 10px" : "8px 16px", fontSize: 11, fontWeight: bTab === tab ? 700 : 400,
                    background: bTab === tab ? "#f0f9ff" : "#fff", color: bTab === tab ? "#0369a1" : T.slate,
                    borderBottom: bTab === tab ? "2px solid #0369a1" : "2px solid transparent",
                    border: "1.5px solid " + T.border,
                    flex: isMobile ? "1 0 45%" : "none"
                  }}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} {cnt > 0 && <span style={{ marginLeft: 4, opacity: .6 }}>({cnt})</span>}
                  </button>
                );
              })}
            </div>

            <Card>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                {SERVICES.filter(s => s.cat === bTab).map(s => (
                  <div key={s.id} onClick={() => addItem(s)} style={{
                    background: "#f8fafc", padding: "12px 14px", borderRadius: 10, border: "1.5px solid " + T.border,
                    cursor: "pointer", transition: "all .15s"
                  }} onMouseOver={e => e.currentTarget.style.borderColor = T.blue} onMouseOut={e => e.currentTarget.style.borderColor = T.border}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: T.navy }}>{s.name}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: T.blue, marginTop: 4 }}>{fmtKES(s.price)}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card mt={16}>
              <Sec>Bill Items</Sec>
              {bItems.length === 0 ? <EmptyState icon="🧾" msg="No items added yet." sm /> : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
                    <thead>
                      <tr style={{ background: "#f8fafc" }}>
                        {["Item", "Price", "Qty", "Total", ""].map(h => <th key={h} style={{ padding: "10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: T.slateL, borderBottom: "1px solid " + T.border }}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {bItems.map(i => (
                        <tr key={i.id} style={{ borderBottom: "1px solid " + T.border }}>
                          <td style={{ padding: "10px", fontSize: 13, fontWeight: 600 }}>{i.name}</td>
                          <td style={{ padding: "10px", fontSize: 13 }}>{fmtKES(i.price)}</td>
                          <td style={{ padding: "10px", fontSize: 13 }}>{i.qty}</td>
                          <td style={{ padding: "10px", fontSize: 13, fontWeight: 800 }}>{fmtKES(i.total)}</td>
                          <td style={{ padding: "10px", textAlign: "right" }}>
                            <button onClick={() => setBItems(p => p.filter(x => x.id !== i.id))} style={{ background: "#fee2e2", border: "none", borderRadius: 6, color: T.red, padding: "4px 8px", cursor: "pointer" }}>×</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          <div style={{ position: isMobile || isTablet ? "static" : "sticky", top: 70 }}>
            <Card>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.navy, marginBottom: 12 }}>Payment Summary</div>
              <div style={{ paddingBottom: 12, borderBottom: "1.5px dashed " + T.border, marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: T.slate, marginBottom: 4 }}>Total Amount Due</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: T.blue }}>{fmtKES(total)}</div>
              </div>

              <FL label="Payment Method" ch={
                <select value={bMethod} onChange={e => setBMethod(e.target.value)} style={SS}>
                  <option>Cash</option>
                  <option>M-PESA</option>
                  <option>Insurance (NHIF/Private)</option>
                  <option>SHA</option>
                  <option>Credit</option>
                </select>
              } />

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
                <button onClick={() => handleSave(true)} style={{ ...BtnGreen, width: "100%", textAlign: "center", padding: "12px" }}>✅ Confirm Payment</button>
                <button onClick={() => handleSave(false)} style={{ ...BtnGhost, width: "100%", textAlign: "center" }}>📋 Save Invoice (Pending)</button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </HMSLayout>
  );
}
