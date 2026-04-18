import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import HMSLayout from "../../components/layout/HMSLayout";
import HMSTopBar from "../../components/layout/HMSTopBar";
import { PatientBanner, RefNums, Card, Sec, FL, ErrBox, EmptyState, BtnGhost, BtnGreen, IS, Btn } from "../../components/common/HMSComponents";
import { T } from "../../utils/hmsConstants";
import { printRxLabel } from "../../utils/hmsHelpers";

export default function PharmacyDispensePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { patients, dispense } = usePatients();

  const initQueueNo = location.state?.queueNo || null;
  const [selQNo, setSelQNo] = useState(initQueueNo);
  const [pharmist, setPharmist] = useState("");
  const [pharmChecks, setPharmChecks] = useState({});
  const [pharmNotes, setPharmNotes] = useState("");
  const [pharmErr, setPharmErr] = useState("");

  const active = patients.find(p => p.queueNo === selQNo) || null;

  if (!active) {
    return (
      <HMSLayout>
        <HMSTopBar title="Pharmacy Dispensing" subtitle="No patient selected" action={<button onClick={() => navigate("/hms/pharmacy")} style={BtnGhost}>← Dashboard</button>} />
        <div style={{ padding: "40px" }}><EmptyState icon="❓" msg="No patient selected for dispensing. Please select from the dashboard." /></div>
      </HMSLayout>
    );
  }

  const handleDispense = () => {
    if (!pharmist.trim()) { setPharmErr("Pharmacist name required."); return; }
    const drugs = active.clerking?.orders?.rx?.drugs || [];
    if (drugs.some(d => !pharmChecks[d.id])) { setPharmErr("Verify all drugs before dispensing."); return; }
    dispense(selQNo, pharmist, pharmChecks, pharmNotes, () => navigate("/hms/pharmacy"));
  };

  const drugs = active?.clerking?.orders?.rx?.drugs || [];

  return (
    <HMSLayout>
      <HMSTopBar
        title="Pharmacy Dispensing"
        subtitle={active.queueNo + " · " + (active.firstName || active.name) + " " + (active.lastName || "")}
        action={<button onClick={() => navigate("/hms/pharmacy")} style={BtnGhost}>← Dashboard</button>}
      />
      <div style={{ padding: "20px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" }}>
          <div>
            <PatientBanner p={active} />
            <RefNums p={active} />
            <ErrBox msg={pharmErr} />

            {active.clerking?.allergies && active.clerking.allergies.toLowerCase() !== "nkda" && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontWeight: 700, color: T.red, fontSize: 13 }}>
                ⚠️ ALLERGY: {active.clerking.allergies}
              </div>
            )}

            <Card>
              <Sec accent={T.green}>Prescription Verification</Sec>
              <div style={{ marginBottom: 12, fontSize: 11, color: T.slateL }}>Check each drug before dispensing. All must be verified.</div>
              {drugs.map((d, i) => {
                const checked = !!pharmChecks[d.id];
                return (
                  <div key={d.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", marginBottom: 8, borderRadius: 10, border: "1.5px solid " + (checked ? "#86efac" : T.border), background: checked ? "#f0fdf4" : "#fff", transition: "all .2s", cursor: "pointer" }} onClick={() => setPharmChecks(p => ({ ...p, [d.id]: !p[d.id] }))}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, border: "2px solid " + (checked ? T.green : T.slateL), background: checked ? T.green : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      {checked && <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: checked ? T.green : T.navy }}>{i + 1}. {d.name} {d.dose}</div>
                      <div style={{ fontSize: 11, color: T.slate, marginTop: 2 }}>{d.route} · {d.freq} · {d.duration}</div>
                      {d.instructions && <div style={{ fontSize: 11, color: T.slateL, marginTop: 2, fontStyle: "italic" }}>{d.instructions}</div>}
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>

          <div style={{ position: "sticky", top: 70 }}>
            <Card>
              <Sec accent={T.green}>Dispensing</Sec>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: T.slateL, marginBottom: 4 }}>Verified</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: T.green }}>{Object.values(pharmChecks).filter(Boolean).length} / {drugs.length}</div>
                <div style={{ height: 6, background: T.border, borderRadius: 3, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: T.green, borderRadius: 3, width: (drugs.length ? Object.values(pharmChecks).filter(Boolean).length / drugs.length * 100 : 0) + "%", transition: "width .3s" }} />
                </div>
              </div>
              <FL label="Pharmacist Name *" ch={<input value={pharmist} onChange={e => setPharmist(e.target.value)} placeholder="Full name" style={IS(!pharmist && pharmErr)} />} />
              <div style={{ marginTop: 10 }}>
                <FL label="Notes" ch={<textarea value={pharmNotes} onChange={e => setPharmNotes(e.target.value)} rows={3} placeholder="Counselling notes..." style={{ width: "100%", padding: "9px 12px", borderRadius: 8, fontFamily: "'Outfit',sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box", border: "1.5px solid " + T.border, background: "#fff", resize: "vertical" }} />} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
                <button onClick={handleDispense} style={{ ...BtnGreen, width: "100%", textAlign: "center" }}>✅ Dispense All</button>
                <button onClick={() => printRxLabel(active)} style={{ ...Btn, width: "100%", textAlign: "center", background: "#f1f5f9", color: T.slate }}>🖨️ Print Label</button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </HMSLayout>
  );
}
