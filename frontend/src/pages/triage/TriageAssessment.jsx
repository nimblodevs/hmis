import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import HMSLayout from "../../components/layout/HMSLayout";
import HMSTopBar from "../../components/layout/HMSTopBar";
import { PatientBanner, Card, Sec, FL, ErrBox, EmptyState, BtnGhost, BtnGreen, IS, TA } from "../../components/common/HMSComponents";
import { T, TRIAGE_LEVELS, DOCTORS, DISABILITIES, CHRONIC_CONDITIONS, COMMON_ALLERGIES } from "../../utils/hmsConstants";
import { timeNow } from "../../utils/hmsHelpers";
import { useBreakpoint } from "../../hooks/useBreakpoint";

const INIT_FORM = { lv: "3", bp: "", pulse: "", temp: "", rr: "", spo2: "", gcs: "", wt: "", ht: "", complaint: "", allergies: "", disability: "", chronic: "", nurse: "", time: "", education: "" };

export default function TriageAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { patients, saveTriage } = usePatients();
  const { isMobile, isTablet } = useBreakpoint();

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
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [frozenDocs, setFrozenDocs] = useState(() => {
    const init = {};
    DOCTORS.forEach(d => { if (d.frozenReason) init[d.id] = d.frozenReason; });
    return init;
  }); 
  const [viewingDocPatients, setViewingDocPatients] = useState(null); // docId
  const [selDis, setSelDis] = useState("");
  const [selChron, setSelChron] = useState("");
  const [selAllergy, setSelAllergy] = useState("");

  const tf = k => e => setTrForm(p => ({ ...p, [k]: e.target.value }));

  const addToList = (field, val, setter) => {
    if (!val || val === "None") return;
    setTrForm(prev => {
      const cur = prev[field] || "";
      if (cur.includes(val)) return prev;
      return { ...prev, [field]: cur ? cur + ", " + val : val };
    });
    setter("");
  };

  const toggleFreeze = (docId) => {
    if (frozenDocs[docId]) {
      const newFrozen = { ...frozenDocs };
      delete newFrozen[docId];
      setFrozenDocs(newFrozen);
    } else {
      const reason = window.prompt("Reason for freezing doctor " + docId + ":", "Busy with procedures");
      if (reason) setFrozenDocs({ ...frozenDocs, [docId]: reason });
    }
  };

  const handleSave = () => {
    const req = ["bp", "pulse", "temp", "rr", "spo2", "gcs", "wt", "ht", "complaint", "nurse"];
    if (req.some(k => !trForm[k]?.toString().trim())) { setTrErr("All vital signs, complaint and nurse name are required."); return; }
    // Save first, then show assignment modal
    saveTriage(selectedQueueNo, trForm, () => { 
      setShowAssignModal(true);
    });
  };

  const finalizeAssignment = () => {
    // In a real system, we'd call an API to assign the patient to selectedDocId
    // For now, we just navigate away
    setSelectedQueueNo(null); 
    navigate("/hms/triage");
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
      <div style={{ padding: isMobile ? "16px" : "20px 24px" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1fr 400px", 
          gap: 16, 
          alignItems: "start" 
        }}>
          {/* Main form */}
          <div>
            <PatientBanner p={active} />
            
            {/* Horizontal Triage Summary */}
            <div style={{ 
              background: "#fff", 
              borderRadius: 12, 
              border: "1px solid " + T.border, 
              padding: "12px 20px", 
              marginBottom: 16, 
              display: "flex", 
              flexWrap: "wrap",
              gap: 24,
              alignItems: "center",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: T.navy, textTransform: "uppercase", letterSpacing: "0.5px", borderRight: "2px solid " + T.border, paddingRight: 16 }}>Triage Summary</div>
              
              <div style={{ display: "flex", flex: 1, flexWrap: "wrap", gap: 20 }}>
                {[["BP", trForm.bp, "mmHg"], ["Pulse", trForm.pulse, "bpm"], ["Temp", trForm.temp, "°C"],
                ["RR", trForm.rr, "/min"], ["SpO2", trForm.spo2, "%"], ["GCS", trForm.gcs, "/15"],
                ["WT", trForm.wt, "kg"], ["HT", trForm.ht, "cm"]].map(([lbl, val, unit]) => (
                  <div key={lbl} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: T.slateL }}>{lbl}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: val ? T.navy : T.border, fontFamily: "'DM Mono',monospace" }}>
                      {val || "--"} <span style={{ fontSize: 9, fontWeight: 400, color: T.slateL }}>{unit}</span>
                    </span>
                  </div>
                ))}
                
                {(() => {
                  const b = bmiCalc(); 
                  if (!b) return null; 
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, borderLeft: "1px solid " + T.border, paddingLeft: 20 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: T.slateL }}>BMI</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 900, color: b.col, fontFamily: "'DM Mono',monospace" }}>{b.bmi}</span>
                        <span style={{ background: b.bg, color: b.col, borderRadius: 4, padding: "1px 5px", fontSize: 9, fontWeight: 800 }}>{b.lbl}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <ErrBox msg={trErr} />
            <Card>
              <Sec accent={T.red}>Vital Signs *</Sec>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", 
                gap: 12, 
                marginBottom: 14 
              }}>
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
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
                gap: 12,
                marginBottom: 12
              }}>
                <FL label="Chief Complaint *" ch={<textarea value={trForm.complaint || ""} onChange={tf("complaint")} rows={2} placeholder="Patient's main complaint" style={TA(!trForm.complaint && trErr)} />} />
                <FL label="Patient Education" ch={<textarea value={trForm.education || ""} onChange={tf("education")} rows={2} placeholder="Instructions or advice given to patient" style={TA()} />} />
              </div>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
                gap: 12, 
                marginTop: 12 
              }}>
                <FL label="Known Allergies" ch={
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <select value={selAllergy} onChange={(e) => setSelAllergy(e.target.value)} style={{ ...IS(), flex: 1 }}>
                        <option value="">-- Select Common Allergy --</option>
                        {COMMON_ALLERGIES.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                      <button onClick={() => addToList("allergies", selAllergy, setSelAllergy)} style={{ ...BtnGreen, padding: "0 12px", borderRadius: 8 }}>+</button>
                    </div>
                    {trForm.allergies && <input value={trForm.allergies || ""} onChange={tf("allergies")} placeholder="Selected or Custom" style={IS()} />}
                  </div>
                } />
                
                <FL label="Known Disability" ch={
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <select value={selDis} onChange={(e) => setSelDis(e.target.value)} style={{ ...IS(), flex: 1 }}>
                        <option value="">-- Select Disability --</option>
                        {DISABILITIES.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <button onClick={() => addToList("disability", selDis, setSelDis)} style={{ ...BtnGreen, padding: "0 12px", borderRadius: 8 }}>+</button>
                    </div>
                    {trForm.disability && <input value={trForm.disability || ""} onChange={tf("disability")} placeholder="Selected or Custom" style={IS()} />}
                  </div>
                } />

                <FL label="Known Chronic Condition" span={isMobile ? 1 : 2} ch={
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <select value={selChron} onChange={(e) => setSelChron(e.target.value)} style={{ ...IS(), flex: 1 }}>
                        <option value="">-- Select Condition --</option>
                        {CHRONIC_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <button onClick={() => addToList("chronic", selChron, setSelChron)} style={{ ...BtnGreen, padding: "0 12px", borderRadius: 8 }}>+</button>
                    </div>
                    {trForm.chronic && <input value={trForm.chronic || ""} onChange={tf("chronic")} placeholder="Selected or Custom" style={IS()} />}
                  </div>
                } />
              </div>
              
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
                gap: 12,
                marginTop: 16,
                paddingTop: 16,
                borderTop: "1px solid " + T.border
              }}>
                <FL label="Triage Nurse *" ch={<input value={trForm.nurse || ""} onChange={tf("nurse")} placeholder="Nurse name" style={IS(!trForm.nurse && trErr)} />} />
                <FL label="Triage Time" ch={<input value={trForm.time || ""} onChange={tf("time")} style={IS()} />} />
              </div>
            </Card>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <button onClick={() => navigate("/hms/triage")} style={BtnGhost}>← Back</button>
              <button onClick={handleSave} style={BtnGreen}>💾 Save Triage</button>
            </div>
          </div>

          {/* Summary panel */}
          <div style={{ position: "sticky", top: 70 }}>
            {/* Active Doctors Section */}
            <Card>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.navy, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Active Doctors</span>
                <span style={{ fontSize: 10, background: T.green + "20", color: T.green, padding: "2px 6px", borderRadius: 4 }}>{DOCTORS.length} Online</span>
              </div>
              
              <div style={{ maxHeight: "680px", overflowY: "auto", paddingRight: 4 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {DOCTORS.map(doc => {
                    const isFrozen = !!frozenDocs[doc.id];
                    return (
                      <div key={doc.id} style={{ padding: 10, borderRadius: 8, border: "1px solid " + (isFrozen ? T.red : T.border), background: isFrozen ? "#fef2f2" : "#fff", transition: "0.2s" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: T.navy, lineHeight: 1.2, flex: 1 }}>{doc.name}</div>
                          {isFrozen && <span style={{ fontSize: 9, fontWeight: 900, color: T.red, background: "#fff", padding: "1px 4px", borderRadius: 4, border: "1px solid " + T.red }}>FROZEN</span>}
                        </div>
                        
                        {isFrozen && <div style={{ fontSize: 9, color: T.red, marginTop: 4, fontStyle: "italic" }}>Reason: {frozenDocs[doc.id]}</div>}

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10 }}>
                          <div style={{ color: T.slate }}>Seen: <span style={{ fontWeight: 800, color: T.green }}>{doc.patientsSeen}</span></div>
                          <div style={{ color: T.slate }}>Waiting: <span style={{ fontWeight: 800, color: T.red }}>0</span></div>
                        </div>

                        <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
                          <button 
                            onClick={() => toggleFreeze(doc.id)}
                            style={{ ...BtnGhost, flex: 1, padding: "4px 0", fontSize: 9, color: isFrozen ? T.green : T.red, borderColor: isFrozen ? T.green : T.red }}
                          >
                            {isFrozen ? "Unfreeze" : "Freeze"}
                          </button>
                          <button 
                            onClick={() => setViewingDocPatients(viewingDocPatients === doc.id ? null : doc.id)}
                            style={{ ...BtnGhost, flex: 1, padding: "4px 0", fontSize: 9 }}
                          >
                            {viewingDocPatients === doc.id ? "Hide Patients" : "View Patients"}
                          </button>
                        </div>

                        {viewingDocPatients === doc.id && (
                          <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 8, border: "1px solid " + T.border }}>
                            <div style={{ fontSize: 9, fontWeight: 900, color: T.navy, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Assigned Patients</div>
                            
                            {doc.assignedPatients?.length > 0 ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {/* Header */}
                                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 0.8fr 1.2fr", gap: 4, padding: "0 6px", fontSize: 8, fontWeight: 900, color: T.slateL, textTransform: "uppercase" }}>
                                  <span>Patient Name</span>
                                  <span>ID</span>
                                  <span>Clinic</span>
                                  <span>Date & Time</span>
                                </div>

                                {doc.assignedPatients.map(ap => (
                                  <div key={ap.id} style={{ 
                                    display: "grid", 
                                    gridTemplateColumns: "1.2fr 1fr 0.8fr 1.2fr", 
                                    gap: 4, 
                                    alignItems: "center",
                                    fontSize: 9, 
                                    background: "#fff", 
                                    padding: "6px", 
                                    borderRadius: 5, 
                                    border: "1px solid " + T.border + "66",
                                    color: T.navy
                                  }}>
                                    <span style={{ fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ap.name}</span>
                                    <span style={{ color: T.slate, fontSize: 8 }}>{ap.id}</span>
                                    <span style={{ color: T.slate }}>{ap.clinic}</span>
                                    <span style={{ color: T.slate, fontSize: 8, textAlign: "right" }}>{ap.dateTime}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div style={{ fontSize: 9, color: T.slate, fontStyle: "italic", textAlign: "center", padding: "10px 0" }}>No patients currently assigned</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Doctor Assignment Modal */}
      {showAssignModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 450, overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid " + T.border, background: T.bg, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: T.navy }}>Assign to Doctor</h3>
                <p style={{ margin: "4px 0 0 0", fontSize: 12, color: T.slateL }}>Select a doctor to forward {active.name}</p>
              </div>
              <button onClick={() => navigate("/hms/triage")} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 20, color: T.slate }}>✕</button>
            </div>
            
            <div style={{ padding: 24 }}>
              <div style={{ maxHeight: "350px", overflowY: "auto", paddingRight: 4, display: "flex", flexDirection: "column", gap: 10 }}>
                {DOCTORS.map(doc => (
                  <div 
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    style={{ 
                      padding: "14px 16px", 
                      borderRadius: 12, 
                      border: "2px solid " + (selectedDocId === doc.id ? T.green : T.border),
                      background: selectedDocId === doc.id ? T.green + "08" : "#fff",
                      cursor: "pointer",
                      transition: "0.2s"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: T.navy }}>{doc.name}</div>
                        <div style={{ fontSize: 11, color: T.slateL, marginTop: 4 }}>
                          Patients Waiting: <span style={{ fontWeight: 800, color: T.red }}>0</span>
                        </div>
                      </div>
                      <div style={{ 
                        width: 20, 
                        height: 20, 
                        borderRadius: "50%", 
                        border: "2px solid " + (selectedDocId === doc.id ? T.green : T.slateL + "44"),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        {selectedDocId === doc.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: T.green }} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                <button 
                  disabled={!selectedDocId}
                  onClick={finalizeAssignment}
                  style={{ 
                    ...BtnGreen, 
                    width: "100%", 
                    padding: "14px", 
                    fontSize: 15, 
                    opacity: selectedDocId ? 1 : 0.5,
                    cursor: selectedDocId ? "pointer" : "not-allowed" 
                  }}
                >
                  Confirm & Forward to Doctor
                </button>
                <button 
                  onClick={() => navigate("/hms/triage")}
                  style={{ ...BtnGhost, width: "100%", padding: "10px" }}
                >
                  Skip Assignment for Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </HMSLayout>
  );
}
