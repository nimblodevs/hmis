import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import HMSLayout from "../../components/layout/HMSLayout";
import HMSTopBar from "../../components/layout/HMSTopBar";
import { PatientBanner, Card, Sec, FL, ErrBox, EmptyState, BtnGhost, BtnGreen, IS, TA } from "../../components/common/HMSComponents";
import { T, TRIAGE_LEVELS } from "../../utils/hmsConstants";
import { timeNow } from "../../utils/hmsHelpers";

const INIT_FORM = { lv: "3", bp: "", pulse: "", temp: "", rr: "", spo2: "", gcs: "", wt: "", ht: "", complaint: "", allergies: "", disability: "", chronic: "", nurse: "", time: "" };

export default function TriageAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { patients, saveTriage } = usePatients();

  const initQueueNo = location.state?.queueNo || null;
  const [selectedQueueNo, setSelectedQueueNo] = useState(initQueueNo);
  const active = patients.find(p => p.queueNo === selectedQueueNo) || null;

  const [trForm, setTrForm] = useState(() => {
    if (initQueueNo) {
      const p = patients.find(x => x.queueNo === initQueueNo);
      return p?.triage ? { ...p.triage } : { ...INIT_FORM, time: timeNow() };
    }
    return { ...INIT_FORM, time: timeNow() };
  });
  const [trErr, setTrErr] = useState("");

  const tf = k => e => setTrForm(p => ({ ...p, [k]: e.target.value }));

  const handleSave = () => {
    const req = ["bp", "pulse", "temp", "rr", "spo2", "gcs", "wt", "ht", "complaint", "nurse"];
    if (req.some(k => !trForm[k]?.toString().trim())) { setTrErr("All vital signs, complaint and nurse name are required."); return; }
    saveTriage(selectedQueueNo, trForm, () => { 
      setSelectedQueueNo(null); 
      navigate("/hms/triage"); 
    });
  };

  const bmiCalc = () => {
    const wt = parseFloat(trForm.wt), ht = parseFloat(trForm.ht);
    if (!wt || !ht) return null;
    const bmi = +(wt / ((ht / 100) ** 2)).toFixed(1);
    const cat = bmi < 18.5 ? { lbl: "Underweight", col: "#0369a1", bg: "#eff6ff" }
      : bmi < 25 ? { lbl: "Normal Weight", col: T.green, bg: "#f0fdf4" }
        : bmi < 30 ? { lbl: "Overweight", col: "#b45309", bg: "#fffbeb" }
          : bmi < 35 ? { lbl: "Obese Class I", col: "#c2410c", bg: "#fff7ed" }
            : bmi < 40 ? { lbl: "Obese Class II", col: T.red, bg: "#fef2f2" }
              : { lbl: "Obese Class III", col: "#9f1239", bg: "#fff1f2" };
    return { bmi, ...cat };
  };

  if (!active) {
    return (
      <HMSLayout>
        <HMSTopBar title="Triage Assessment" subtitle="No patient selected" action={<button onClick={() => navigate("/hms/triage")} style={BtnGhost}>← Dashboard</button>} />
        <div style={{ padding: "40px" }}><EmptyState icon="❓" msg="No patient selected for triage. Please select from the dashboard." /></div>
      </HMSLayout>
    );
  }

  return (
    <HMSLayout>
      <HMSTopBar
        title="Triage Assessment"
        subtitle={active.queueNo + " · " + (active.name || "Patient")}
        action={<button onClick={() => navigate("/hms/triage")} style={BtnGhost}>← Dashboard</button>}
      />
      <div style={{ padding: "20px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, alignItems: "start" }}>
          {/* Main form */}
          <div>
            <PatientBanner p={active} />
            <ErrBox msg={trErr} />
            <Card>
              <Sec accent={T.red}>Vital Signs *</Sec>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 14 }}>
                {[["bp", "Blood Pressure", "e.g. 120/80"], ["pulse", "Pulse (bpm)", "60-100"],
                ["temp", "Temp (°C)", "36.1-37.2"], ["rr", "Resp Rate", "/min"],
                ["spo2", "SpO2 (%)", "95-100"], ["gcs", "GCS", "/15"],
                ["wt", "Weight (kg)", ""], ["ht", "Height (cm)", ""]].map(([k, lbl, ph]) => (
                  <FL key={k} label={lbl + " *"} ch={<input value={trForm[k] || ""} onChange={tf(k)} placeholder={ph} style={IS(!trForm[k] && trErr)} />} />
                ))}
                {/* BMI auto-calculated */}
                {(() => {
                  const b = bmiCalc();
                  if (!b) return <FL label="BMI (auto)" ch={<input value="" readOnly placeholder="Enter wt & ht" style={{ ...IS(), background: "#f8fafc", color: T.slateL, cursor: "default" }} />} />;
                  return (
                    <FL label="BMI (auto) — kg/m²" ch={
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <input value={b.bmi} readOnly style={{ ...IS(), background: b.bg, color: b.col, fontWeight: 800, fontFamily: "'DM Mono',monospace", cursor: "default", flex: 1, fontSize: 15 }} />
                        <div style={{ background: b.bg, color: b.col, border: "1px solid " + b.col + "55", borderRadius: 6, padding: "4px 9px", flexShrink: 0, textAlign: "center" }}>
                          <div style={{ fontSize: 10, fontWeight: 800, whiteSpace: "nowrap" }}>{b.lbl}</div>
                        </div>
                      </div>
                    } />
                  );
                })()}
              </div>
              <FL label="Chief Complaint *" ch={<textarea value={trForm.complaint || ""} onChange={tf("complaint")} rows={2} placeholder="Patient's main complaint" style={TA(!trForm.complaint && trErr)} />} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                <FL label="Known Allergies" ch={<input value={trForm.allergies || ""} onChange={tf("allergies")} placeholder="Drug / food allergies or NKDA" style={IS()} />} />
                <FL label="Known Disability" ch={<input value={trForm.disability || ""} onChange={tf("disability")} placeholder="Physical, sensory, cognitive or None" style={IS()} />} />
                <FL label="Known Chronic Condition" span={2} ch={<input value={trForm.chronic || ""} onChange={tf("chronic")} placeholder="e.g. Hypertension, Diabetes, Asthma or None" style={IS()} />} />
              </div>
            </Card>

            <Card>
              <Sec>ESI Triage Level</Sec>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {TRIAGE_LEVELS.map(t => (
                  <button key={t.lv} onClick={() => setTrForm(p => ({ ...p, lv: t.lv }))}
                    style={{ flex: 1, padding: "10px 6px", borderRadius: 9, cursor: "pointer", fontFamily: "'Outfit',sans-serif", background: t.bg, color: t.col, fontWeight: trForm.lv === t.lv ? 800 : 600, fontSize: 11, border: trForm.lv === t.lv ? "2px solid " + T.navy : "2px solid transparent" }}>
                    <div style={{ fontSize: 16, marginBottom: 3 }}>L{t.lv}</div>
                    <div>{t.label}</div>
                  </button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FL label="Triage Nurse *" ch={<input value={trForm.nurse || ""} onChange={tf("nurse")} placeholder="Nurse name" style={IS(!trForm.nurse && trErr)} />} />
                <FL label="Triage Time" ch={<input value={trForm.time || ""} onChange={tf("time")} style={IS()} />} />
              </div>
            </Card>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => navigate("/hms/triage")} style={BtnGhost}>← Back</button>
              <button onClick={handleSave} style={BtnGreen}>💾 Save Triage</button>
            </div>
          </div>

          {/* Summary panel */}
          <div style={{ position: "sticky", top: 70 }}>
            <Card>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.navy, marginBottom: 12 }}>Triage Summary</div>
              {[["BP", trForm.bp, "mmHg"], ["Pulse", trForm.pulse, "bpm"], ["Temp", trForm.temp, "°C"],
              ["RR", trForm.rr, "/min"], ["SpO2", trForm.spo2, "%"], ["GCS", trForm.gcs, "/15"],
              ["Weight", trForm.wt, "kg"], ["Height", trForm.ht, "cm"]].map(([lbl, val, unit]) =>
                val ? (
                  <div key={lbl} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid " + T.border }}>
                    <span style={{ fontSize: 12, color: T.slate }}>{lbl}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.navy, fontFamily: "'DM Mono',monospace" }}>{val} {unit}</span>
                  </div>
                ) : null
              )}
              {(() => {
                const b = bmiCalc(); if (!b) return null; return (
                  <div style={{ padding: "6px 0", borderBottom: "1px solid " + T.border }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: T.slate }}>BMI</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: b.col, fontFamily: "'DM Mono',monospace" }}>{b.bmi}</span>
                        <span style={{ background: b.bg, color: b.col, borderRadius: 5, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>{b.lbl}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
              {trForm.complaint && <div style={{ marginTop: 10, padding: "8px 10px", background: "#f8fafc", borderRadius: 7, fontSize: 11, color: T.slate, fontStyle: "italic" }}>"{trForm.complaint}"</div>}
              {trForm.allergies && (
                <div style={{ marginTop: 8, padding: "7px 10px", borderRadius: 7, fontSize: 11, fontWeight: 700, background: trForm.allergies.toLowerCase() === "nkda" ? "#f0fdf4" : "#fef2f2", color: trForm.allergies.toLowerCase() === "nkda" ? T.green : T.red, border: "1px solid " + (trForm.allergies.toLowerCase() === "nkda" ? "#86efac" : "#fca5a5") }}>
                  ⚠️ Allergies: {trForm.allergies}
                </div>
              )}
              {trForm.lv && TRIAGE_LEVELS.filter(t => t.lv === trForm.lv).map(t => (
                <div key={t.lv} style={{ background: t.bg, color: t.col, borderRadius: 8, padding: "8px 12px", fontWeight: 800, fontSize: 12, textAlign: "center", marginTop: 10 }}>
                  ESI Level {t.lv} — {t.label}
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </HMSLayout>
  );
}
