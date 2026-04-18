import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import HMSLayout from "../../components/layout/HMSLayout";
import HMSTopBar from "../../components/layout/HMSTopBar";
import { PatientBanner, FlowBar, RefNums, Card, Sec, FL, ErrBox, EmptyState, BtnGhost, BtnGreen, BtnPrimary, IS, SS, TA, Btn, PatientSearch } from "../../components/common/HMSComponents";
import { T, ICD10, LAB_TESTS, FLAG_STYLE, LAB_REF } from "../../utils/hmsConstants";

const INIT_CLK = {
  complaint: "", hpc: "", pmh: "", psh: "", fhx: "", shx: "", meds: "", allergies: "",
  exam: "", provDx: "", provCode: "", finalDx: "", finalCode: "", differentials: "",
  plan: "", disp: "OPD Follow-up", doctorName: "", doctorReg: "",
};
const INIT_RX = { name: "", dose: "", route: "Oral", freq: "BD (Twice daily)", duration: "5 days", instructions: "" };
const DOC_TABS = ["📋 History", "🔍 Exam", "🎯 Diagnosis", "🧪 Lab Orders", "💊 Prescription", "📋 Summary"];

export default function DoctorClerking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { patients, saveClerking } = usePatients();

  const initQueueNo = location.state?.queueNo || null;
  const [selQNo, setSelQNo] = useState(initQueueNo);
  const active = patients.find(p => p.queueNo === selQNo) || null;

  const [docTab, setDocTab] = useState(0);
  const [clk, setClk] = useState(() => active?.clerking ? { ...INIT_CLK, ...active.clerking } : { ...INIT_CLK });
  const [docErr, setDocErr] = useState("");
  const [labSel, setLabSel] = useState(() => active?.clerking?.orders?.lab?.tests || []);
  const [labUrg, setLabUrg] = useState(() => active?.clerking?.orders?.lab?.urgency || "Routine");
  const [labNote, setLabNote] = useState(() => active?.clerking?.orders?.lab?.notes || "");
  const [labQ, setLabQ] = useState("");
  const [rxList, setRxList] = useState(() => active?.clerking?.orders?.rx?.drugs || []);
  const [rxForm, setRxForm] = useState({ ...INIT_RX });

  const waiting = patients.filter(p => p.status === "Billed" || p.status === "With Doctor (Post-Lab)");
  const ck = k => e => setClk(p => ({ ...p, [k]: e.target.value }));

  const pickPatient = (p) => {
    setSelQNo(p.queueNo);
    setClk(p.clerking ? { ...INIT_CLK, ...p.clerking } : { ...INIT_CLK });
    setLabSel(p.clerking?.orders?.lab?.tests || []);
    setLabUrg(p.clerking?.orders?.lab?.urgency || "Routine");
    setLabNote(p.clerking?.orders?.lab?.notes || "");
    setRxList(p.clerking?.orders?.rx?.drugs || []);
    setRxForm({ ...INIT_RX });
    setDocTab(0); setDocErr("");
  };

  const addRx = () => {
    if (!rxForm.name.trim()) return;
    setRxList(p => [...p, { ...rxForm, id: Date.now() }]);
    setRxForm({ ...INIT_RX });
  };

  const handleSave = () => {
    if (!clk.complaint?.trim()) { setDocErr("Presenting complaint required."); setDocTab(0); return; }
    if (!clk.doctorName?.trim()) { setDocErr("Doctor name required."); setDocTab(1); return; }
    saveClerking(selQNo, clk, labSel, rxList, labUrg, labNote,
      () => { setSelQNo(null); navigate("/hms/doctor"); });
  };

  const labResults = active?.clerking?.labResults;
  const resulted = !!(labResults && Object.keys(labResults).length > 0);
  const labAbnorm = resulted ? Object.values(labResults).filter(r => r.flag === "low" || r.flag === "high").length : 0;
  const labCrit = resulted ? Object.values(labResults).filter(r => r.flag === "critical").length : 0;

  if (!active) {
    return (
      <HMSLayout>
        <HMSTopBar title="Patient Clerking" subtitle="No patient selected" action={<button onClick={() => navigate("/hms/doctor")} style={BtnGhost}>← Dashboard</button>} />
        <div style={{ padding: "40px" }}><EmptyState icon="❓" msg="No patient selected for clerking. Please select from the dashboard." /></div>
      </HMSLayout>
    );
  }

  return (
    <HMSLayout>
      <HMSTopBar
        title="Patient Clerking"
        subtitle={active.queueNo + " · " + (active.firstName || active.name) + " " + (active.lastName || "")}
        action={<button onClick={() => navigate("/hms/doctor")} style={BtnGhost}>← Dashboard</button>}
      />
      <div style={{ padding: "20px 24px" }}>
        <PatientBanner p={active} />
        <FlowBar status={active.status} />
        <RefNums p={active} />

            {/* Vitals strip */}
            {active.triage && (
              <div style={{ background: "linear-gradient(90deg," + T.navy + "," + T.navyL + ")", borderRadius: 10, padding: "11px 16px", marginBottom: 14, display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[["BP", active.triage.bp + " mmHg"], ["Pulse", active.triage.pulse + " bpm"], ["Temp", active.triage.temp + "°C"], ["SpO2", active.triage.spo2 + "%"], ["GCS", active.triage.gcs + "/15"], ["Wt", active.triage.wt + " kg"]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,.35)", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#e0f7fa" }}>{v}</div>
                  </div>
                ))}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 8, color: "rgba(255,255,255,.35)", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: 1 }}>Complaint</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#e0f7fa" }}>{active.triage.complaint}</div>
                </div>
              </div>
            )}

            {/* Lab results panel */}
            {labResults && (
              <Card mb={14}>
                <div style={{ background: "linear-gradient(135deg," + T.teal + ",#0369a1)", borderRadius: 9, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>🧪 Lab Results — {active.clerking?.labNo}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {labCrit > 0 && <span style={{ background: "#fee2e2", color: T.red, borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>🔴 {labCrit} Critical</span>}
                    {labAbnorm > 0 && <span style={{ background: "#fef3c7", color: "#b45309", borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>⚠️ {labAbnorm} Abnormal</span>}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 8 }}>
                  {Object.entries(labResults).map(([sid, r]) => {
                    const ref = LAB_REF[sid]; const fc = FLAG_STYLE[r.flag] || FLAG_STYLE.empty;
                    return (
                      <div key={sid} style={{ background: fc.bg, border: "1.5px solid " + fc.bd, borderRadius: 8, padding: "8px 10px" }}>
                        <div style={{ fontSize: 10, color: T.slateL, marginBottom: 3 }}>{ref ? ref.name : sid}</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: fc.tx, fontFamily: "'DM Mono',monospace" }}>{r.value || "—"} <span style={{ fontSize: 10 }}>{ref?.unit || ""}</span></div>
                        {r.flag && r.flag !== "normal" && r.flag !== "empty" && <span style={{ background: fc.tBg, color: fc.tTx, borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 700 }}>{fc.tag}</span>}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Tab nav */}
            <div style={{ display: "flex", background: T.card, borderRadius: 10, overflow: "hidden", marginBottom: 14, border: "1px solid " + T.border }}>
              {DOC_TABS.map((t, i) => (
                <button key={t} onClick={() => setDocTab(i)} style={{ flex: 1, padding: "11px 6px", border: "none", fontFamily: "'Outfit',sans-serif", cursor: "pointer", fontSize: 10, fontWeight: docTab === i ? 700 : 400, background: docTab === i ? "#f0f9ff" : "transparent", color: docTab === i ? "#0369a1" : T.slateL, borderBottom: docTab === i ? "3px solid #0369a1" : "3px solid transparent" }}>{t}</button>
              ))}
            </div>
            <ErrBox msg={docErr} />

            <Card>
              {docTab === 0 && (
                <div>
                  <Sec>History</Sec>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <FL label="Presenting Complaint *" span={2} ch={<textarea value={clk.complaint} onChange={ck("complaint")} rows={2} style={TA(!clk.complaint && docErr)} />} />
                    <FL label="History of PC" span={2} ch={<textarea value={clk.hpc} onChange={ck("hpc")} rows={3} style={TA()} />} />
                    <FL label="Past Medical History" ch={<textarea value={clk.pmh} onChange={ck("pmh")} rows={2} style={TA()} />} />
                    <FL label="Past Surgical History" ch={<textarea value={clk.psh} onChange={ck("psh")} rows={2} style={TA()} />} />
                    <FL label="Family History" ch={<textarea value={clk.fhx} onChange={ck("fhx")} rows={2} style={TA()} />} />
                    <FL label="Social History" ch={<textarea value={clk.shx} onChange={ck("shx")} rows={2} style={TA()} />} />
                    <FL label="Current Medications" ch={<textarea value={clk.meds} onChange={ck("meds")} rows={2} style={TA()} />} />
                    <FL label="Allergies" ch={<input value={clk.allergies} onChange={ck("allergies")} placeholder="NKDA or list" style={IS()} />} />
                  </div>
                </div>
              )}
              {docTab === 1 && (
                <div>
                  <Sec>Physical Examination</Sec>
                  <FL label="Examination Findings *" ch={<textarea value={clk.exam} onChange={ck("exam")} rows={6} style={TA(!clk.exam && docErr)} />} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                    <FL label="Doctor Name *" ch={<input value={clk.doctorName} onChange={ck("doctorName")} placeholder="Full name" style={IS(!clk.doctorName && docErr)} />} />
                    <FL label="Doctor Reg. No." ch={<input value={clk.doctorReg} onChange={ck("doctorReg")} placeholder="KMA/MDCN number" style={IS()} />} />
                  </div>
                </div>
              )}
              {docTab === 2 && (
                <div>
                  <Sec>Diagnosis & Plan</Sec>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <FL label="Provisional Diagnosis" ch={<input value={clk.provDx} onChange={ck("provDx")} style={IS()} />} />
                    <FL label="ICD-10 Code" ch={
                      <select value={clk.provCode} onChange={e => { const it = ICD10.find(c => c.code === e.target.value); setClk(p => ({ ...p, provCode: e.target.value, provDx: it ? it.desc : p.provDx })); }} style={SS}>
                        <option value="">Select...</option>
                        {ICD10.map(c => <option key={c.code} value={c.code}>{c.code} — {c.desc}</option>)}
                      </select>
                    } />
                    <FL label="Final Diagnosis" ch={<input value={clk.finalDx} onChange={ck("finalDx")} style={IS()} />} />
                    <FL label="Final ICD-10" ch={
                      <select value={clk.finalCode} onChange={e => { const it = ICD10.find(c => c.code === e.target.value); setClk(p => ({ ...p, finalCode: e.target.value, finalDx: it ? it.desc : p.finalDx })); }} style={SS}>
                        <option value="">Select...</option>
                        {ICD10.map(c => <option key={c.code} value={c.code}>{c.code} — {c.desc}</option>)}
                      </select>
                    } />
                    <FL label="Differential Diagnoses" span={2} ch={<textarea value={clk.differentials} onChange={ck("differentials")} rows={2} style={TA()} />} />
                    <FL label="Management Plan" span={2} ch={<textarea value={clk.plan} onChange={ck("plan")} rows={3} style={TA()} />} />
                    <FL label="Disposition" ch={
                      <select value={clk.disp} onChange={ck("disp")} style={SS}>
                        {["OPD Follow-up", "Admit - Medical", "Admit - Surgical", "Admit - ICU", "Refer", "Discharge"].map(d => <option key={d}>{d}</option>)}
                      </select>
                    } />
                  </div>
                </div>
              )}
              {docTab === 3 && (
                <div>
                  <Sec accent={T.teal}>Lab Test Orders</Sec>
                  <div style={{ position: "relative", marginBottom: 12 }}>
                    <input value={labQ} onChange={e => setLabQ(e.target.value)} placeholder="Search — FBC, HbA1c, Troponin..." style={{ ...IS(), paddingLeft: 36 }} />
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.slateL, fontSize: 14 }}>🔍</span>
                  </div>
                  {labQ.trim() && (
                    <div style={{ background: "#fff", border: "1px solid " + T.border, borderRadius: 9, overflow: "hidden", marginBottom: 12, maxHeight: 220, overflowY: "auto" }}>
                      {LAB_TESTS.filter(t => t.name.toLowerCase().includes(labQ.toLowerCase()) || t.cat.toLowerCase().includes(labQ.toLowerCase())).map(t => {
                        const added = labSel.includes(t.id);
                        return (
                          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 14px", borderBottom: "1px solid " + T.border, background: added ? "#f0fdf4" : "#fff" }}>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: added ? 700 : 500 }}>{t.name}</div>
                              <div style={{ fontSize: 10, color: T.slateL }}>{t.cat}</div>
                            </div>
                            <button onClick={() => { setLabSel(prev => added ? prev.filter(x => x !== t.id) : [...prev, t.id]); if (!added) setLabQ(""); }} style={{ ...Btn, padding: "4px 12px", fontSize: 11, background: added ? "#fee2e2" : "#dbeafe", color: added ? T.red : T.blue }}>
                              {added ? "Remove" : "+ Add"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {labSel.length > 0 ? (
                    <div style={{ border: "1.5px solid " + (resulted ? "#99f6e4" : "#93c5fd"), borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ background: resulted ? T.teal : T.blue, padding: "9px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{resulted ? "✅" : "🧪"} {labSel.length} test(s) · {labUrg}</span>
                        {!resulted && <button onClick={() => setLabSel([])} style={{ background: "rgba(255,255,255,.15)", border: "none", borderRadius: 5, padding: "2px 9px", color: "#fff", fontSize: 11, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Clear all</button>}
                      </div>
                      {labSel.map((id, i) => {
                        const t = LAB_TESTS.find(x => x.id === id); if (!t) return null; return (
                          <div key={id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 14px", background: i % 2 === 0 ? "#fff" : resulted ? "#f0fdfa" : "#f0f9ff", borderBottom: i < labSel.length - 1 ? "1px solid " + T.border : "none" }}>
                            <span style={{ fontSize: 13 }}>{t.name}{resulted && <span style={{ marginLeft: 10, fontSize: 11, color: T.green, fontWeight: 700 }}>✓ Resulted</span>}</span>
                            {!resulted && <button onClick={() => setLabSel(prev => prev.filter(x => x !== id))} style={{ background: "#fee2e2", border: "none", borderRadius: 5, width: 22, height: 22, cursor: "pointer", color: T.red, fontWeight: 700 }}>×</button>}
                          </div>
                        );
                      })}
                    </div>
                  ) : <div style={{ padding: "20px", textAlign: "center", color: T.slateL, fontSize: 13, border: "1.5px dashed " + T.border, borderRadius: 10 }}>Search and add tests above</div>}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                    <FL label="Urgency" ch={<select value={labUrg} onChange={e => setLabUrg(e.target.value)} style={SS}>{["Routine", "Urgent", "STAT (Immediate)"].map(u => <option key={u}>{u}</option>)}</select>} />
                    <FL label="Clinical Notes" ch={<input value={labNote} onChange={e => setLabNote(e.target.value)} placeholder="Clinical indication" style={IS()} />} />
                  </div>
                </div>
              )}
              {docTab === 4 && (
                <div>
                  <Sec accent={T.green}>Prescription</Sec>
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px", border: "1px solid " + T.border, marginBottom: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                      <FL label="Drug Name *" ch={<input value={rxForm.name} onChange={e => setRxForm(p => ({ ...p, name: e.target.value }))} placeholder="Drug name" style={IS()} />} />
                      <FL label="Dose" ch={<input value={rxForm.dose} onChange={e => setRxForm(p => ({ ...p, dose: e.target.value }))} placeholder="e.g. 500mg" style={IS()} />} />
                      <FL label="Route" ch={<select value={rxForm.route} onChange={e => setRxForm(p => ({ ...p, route: e.target.value }))} style={SS}>{["Oral", "IV Bolus", "IV Infusion", "IM", "SC", "Sublingual", "Topical", "Inhaled", "Rectal"].map(r => <option key={r}>{r}</option>)}</select>} />
                      <FL label="Frequency" ch={<select value={rxForm.freq} onChange={e => setRxForm(p => ({ ...p, freq: e.target.value }))} style={SS}>{["OD (Once daily)", "BD (Twice daily)", "TDS (Three times daily)", "QDS (Four times daily)", "Nocte", "Stat", "PRN"].map(f => <option key={f}>{f}</option>)}</select>} />
                      <FL label="Duration" ch={<select value={rxForm.duration} onChange={e => setRxForm(p => ({ ...p, duration: e.target.value }))} style={SS}>{["1 day", "3 days", "5 days", "7 days", "14 days", "1 month", "3 months", "Ongoing", "PRN"].map(d => <option key={d}>{d}</option>)}</select>} />
                      <FL label="Instructions" ch={<input value={rxForm.instructions} onChange={e => setRxForm(p => ({ ...p, instructions: e.target.value }))} placeholder="e.g. Take with food" style={IS()} />} />
                    </div>
                    <button onClick={addRx} style={{ ...BtnGreen, padding: "8px 18px", fontSize: 12 }}>+ Add Drug</button>
                  </div>
                  {rxList.length > 0 && (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr style={{ background: "#f8fafc" }}>{["#", "Drug", "Dose", "Route", "Freq", "Duration", "Instructions", ""].map(h => <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: T.slateL, borderBottom: "1px solid " + T.border }}>{h}</th>)}</tr></thead>
                      <tbody>
                        {rxList.map((d, i) => (
                          <tr key={d.id} style={{ borderBottom: "1px solid " + T.border }}>
                            <td style={{ padding: "8px 10px", fontSize: 11, color: T.slateL }}>{i + 1}</td>
                            <td style={{ padding: "8px 10px", fontWeight: 600, fontSize: 13 }}>{d.name}</td>
                            <td style={{ padding: "8px 10px", fontSize: 12 }}>{d.dose}</td>
                            <td style={{ padding: "8px 10px", fontSize: 12 }}>{d.route}</td>
                            <td style={{ padding: "8px 10px", fontSize: 12 }}>{d.freq}</td>
                            <td style={{ padding: "8px 10px", fontSize: 12 }}>{d.duration}</td>
                            <td style={{ padding: "8px 10px", fontSize: 11, color: T.slateL }}>{d.instructions}</td>
                            <td style={{ padding: "8px 10px" }}><button onClick={() => setRxList(p => p.filter(x => x.id !== d.id))} style={{ background: "#fee2e2", border: "none", borderRadius: 5, width: 22, height: 22, cursor: "pointer", color: T.red, fontWeight: 700 }}>×</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
              {docTab === 5 && (
                <div>
                  <Sec>Encounter Summary</Sec>
                  {[["Complaint", clk.complaint], ["History", clk.hpc], ["Exam", clk.exam], ["Prov. Dx", clk.provDx ? clk.provCode + " — " + clk.provDx : ""], ["Final Dx", clk.finalDx ? clk.finalCode + " — " + clk.finalDx : ""], ["Plan", clk.plan], ["Disposition", clk.disp], ["Doctor", clk.doctorName + " " + (clk.doctorReg || "")]].map(([l, v]) => v ? (
                    <div key={l} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid " + T.border }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: T.slateL, minWidth: 100, flexShrink: 0 }}>{l}</div>
                      <div style={{ fontSize: 13, color: T.navy }}>{v}</div>
                    </div>
                  ) : null)}
                  {labSel.length > 0 && <div style={{ marginTop: 10, padding: "10px", background: "#f0f9ff", borderRadius: 8, fontSize: 12 }}>🧪 Lab ordered: {labSel.map(id => LAB_TESTS.find(t => t.id === id)?.name).filter(Boolean).join(", ")}</div>}
                  {rxList.length > 0 && <div style={{ marginTop: 8, padding: "10px", background: "#f0fdf4", borderRadius: 8, fontSize: 12 }}>💊 Prescribed: {rxList.map(d => d.name).join(", ")}</div>}
                </div>
              )}
            </Card>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setSelQNo(null)} style={BtnGhost}>← Back</button>
              <button onClick={handleSave} style={BtnGreen}>💾 Save Clerking</button>
            </div>
      </div>
    </HMSLayout>
  );
}
