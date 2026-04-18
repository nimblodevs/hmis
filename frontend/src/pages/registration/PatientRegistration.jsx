import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import HMSLayout from "../../components/layout/HMSLayout";
import HMSTopBar from "../../components/layout/HMSTopBar";
import { PatientBanner, FlowBar, Card, Sec, FL, ErrBox, EmptyState, BtnGhost, BtnGreen, BtnPrimary, IS, SS } from "../../components/common/HMSComponents";
import { T, INS_PROVIDERS, CORP_ORGS, COUNTIES } from "../../utils/hmsConstants";

const REG_TABS = ["Personal", "Demographics", "NOK & EC", "Category", "Consent"];

const INIT_REG = {
  firstName: "", middleName: "", lastName: "", dateOfBirth: "", gender: "Female",
  bloodGroup: "Unknown", maritalStatus: "Single", nationality: "Kenyan", occupation: "",
  phone: "", altPhone: "", email: "", address: "", city: "Nairobi", county: "Nairobi", country: "Kenya",
  nokName: "", nokRel: "Spouse", nokPhone: "", ecSameNok: true, ecName: "", ecRel: "Spouse", ecPhone: "",
  category: "Cash", insProvider: "SHA", insMemberNo: "", insExpiry: "",
  corpOrg: CORP_ORGS[0], corpId: "", consentTx: false, consentData: false,
};

export default function PatientRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const { patients, saveRegistration } = usePatients();

  const initQueueNo = location.state?.queueNo || null;
  const [selectedQueueNo, setSelectedQueueNo] = useState(initQueueNo);
  const active = patients.find(p => p.queueNo === selectedQueueNo) || null;

  const [regTab, setRegTab] = useState(0);
  const [reg,    setReg]    = useState(() => {
    if (initQueueNo) {
      const p = patients.find(x => x.queueNo === initQueueNo);
      if (p) {
        const parts = (p.name || "").split(" ");
        return { ...INIT_REG, firstName: parts[0] || "", lastName: parts.slice(1).join(" ") || "", phone: p.phone || "" };
      }
    }
    return { ...INIT_REG };
  });
  const [regErr, setRegErr] = useState("");

  const waiting = patients.filter(p => p.status === "Triaged");

  const rf = k => e => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setReg(p => ({ ...p, [k]: v }));
  };

  const pickPatient = (p) => {
    setSelectedQueueNo(p.queueNo);
    const parts = (p.name || "").split(" ");
    setReg({ ...INIT_REG, firstName: parts[0] || "", lastName: parts.slice(1).join(" ") || "", phone: p.phone || "" });
    setRegTab(0); setRegErr("");
  };

  const handleSave = () => {
    if (!reg.firstName?.trim() || !reg.lastName?.trim() || !reg.dateOfBirth || !reg.phone?.trim()) {
      setRegErr("First name, last name, date of birth and phone are required."); return;
    }
    saveRegistration(selectedQueueNo, reg, () => { setSelectedQueueNo(null); navigate("/hms/queue"); });
  };

  return (
    <HMSLayout>
      <HMSTopBar
        title="Patient Registration"
        subtitle={active ? active.queueNo + " · " + (active.name || "") : waiting.length + " patient(s) awaiting registration"}
        action={<button onClick={() => navigate("/hms/queue")} style={BtnGhost}>← Queue</button>}
      />
      <div style={{ padding: "20px 24px", maxWidth: 820 }}>
        {!active ? (
          waiting.length === 0 ? <EmptyState icon="📝" msg="No patients awaiting registration." /> :
          waiting.map(p => (
            <div key={p.queueNo} onClick={() => pickPatient(p)} style={{
              background: T.card, borderRadius: 11, padding: "14px 18px", marginBottom: 10,
              boxShadow: "0 1px 6px rgba(0,0,0,.06)", border: "1.5px solid " + T.border,
              cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: T.slateL, fontFamily: "'DM Mono',monospace" }}>
                  {p.queueNo} · {p.phone} · ESI {p.triage?.lv || "-"}
                </div>
              </div>
              <span style={{ ...BtnPrimary, padding: "7px 16px", fontSize: 12, background: "#b45309" }}>📝 Register</span>
            </div>
          ))
        ) : (
          <>
            <PatientBanner p={active} />
            <FlowBar status={active.status} />

            {/* Tab bar */}
            <div style={{ display: "flex", background: T.card, borderRadius: 10, overflow: "hidden", marginBottom: 14, border: "1px solid " + T.border }}>
              {REG_TABS.map((t, i) => (
                <button key={t} onClick={() => setRegTab(i)} style={{
                  flex: 1, padding: "11px 6px", border: "none", fontFamily: "'Outfit',sans-serif",
                  cursor: "pointer", fontSize: 11, fontWeight: regTab === i ? 700 : 400,
                  background: regTab === i ? "#f0f9ff" : "transparent",
                  color: regTab === i ? "#0369a1" : T.slateL,
                  borderBottom: regTab === i ? "3px solid #0369a1" : "3px solid transparent",
                }}>
                  {t}
                </button>
              ))}
            </div>
            <ErrBox msg={regErr} />

            <Card>
              {regTab === 0 && (
                <div>
                  <Sec accent="#0369a1">Personal Information</Sec>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
                    <FL label="First Name *" ch={<input value={reg.firstName || ""} onChange={rf("firstName")} style={IS(!reg.firstName && regErr)} />} />
                    <FL label="Middle Name"  ch={<input value={reg.middleName || ""} onChange={rf("middleName")} style={IS()} />} />
                    <FL label="Last Name *"  ch={<input value={reg.lastName || ""}  onChange={rf("lastName")} style={IS(!reg.lastName && regErr)} />} />
                    <FL label="Date of Birth *" ch={<input type="date" value={reg.dateOfBirth || ""} onChange={rf("dateOfBirth")} style={IS(!reg.dateOfBirth && regErr)} />} />
                    <FL label="Gender" ch={<select value={reg.gender || "Female"} onChange={rf("gender")} style={SS}>{["Male","Female","Other"].map(g => <option key={g}>{g}</option>)}</select>} />
                    <FL label="Blood Group" ch={<select value={reg.bloodGroup || "Unknown"} onChange={rf("bloodGroup")} style={SS}>{["Unknown","A+","A-","B+","B-","AB+","AB-","O+","O-"].map(g => <option key={g}>{g}</option>)}</select>} />
                  </div>
                  <Sec accent="#0369a1">Contact</Sec>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <FL label="Phone *"   ch={<input value={reg.phone || ""}    onChange={rf("phone")}    style={IS(!reg.phone && regErr)} />} />
                    <FL label="Alt. Phone" ch={<input value={reg.altPhone || ""} onChange={rf("altPhone")} style={IS()} />} />
                    <FL label="Email"      ch={<input value={reg.email || ""}    onChange={rf("email")}    style={IS()} />} />
                    <FL label="Address" span={3} ch={<input value={reg.address || ""} onChange={rf("address")} style={IS()} />} />
                    <FL label="City"   ch={<input value={reg.city || ""}    onChange={rf("city")}   style={IS()} />} />
                    <FL label="County" ch={<select value={reg.county || "Nairobi"} onChange={rf("county")} style={SS}>{COUNTIES.map(c => <option key={c}>{c}</option>)}</select>} />
                    <FL label="Country" ch={<input value={reg.country || "Kenya"} onChange={rf("country")} style={IS()} />} />
                  </div>
                </div>
              )}

              {regTab === 1 && (
                <div>
                  <Sec accent="#7c3aed">Socio-demographic</Sec>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <FL label="Marital Status" ch={<select value={reg.maritalStatus || "Single"} onChange={rf("maritalStatus")} style={SS}>{["Single","Married","Divorced","Widowed"].map(v => <option key={v}>{v}</option>)}</select>} />
                    <FL label="Nationality"    ch={<input value={reg.nationality || "Kenyan"} onChange={rf("nationality")} style={IS()} />} />
                    <FL label="Occupation"     ch={<input value={reg.occupation || ""}        onChange={rf("occupation")}  style={IS()} />} />
                  </div>
                </div>
              )}

              {regTab === 2 && (
                <div>
                  <Sec accent={T.red}>Next of Kin</Sec>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    <FL label="NOK Name *"   ch={<input value={reg.nokName || ""}  onChange={rf("nokName")}  style={IS(!reg.nokName && regErr)} />} />
                    <FL label="Relationship" ch={<select value={reg.nokRel || "Spouse"} onChange={rf("nokRel")} style={SS}>{["Spouse","Parent","Child","Sibling","Friend","Other"].map(r => <option key={r}>{r}</option>)}</select>} />
                    <FL label="NOK Phone *"  ch={<input value={reg.nokPhone || ""} onChange={rf("nokPhone")} style={IS(!reg.nokPhone && regErr)} />} />
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f0f9ff", borderRadius: 9, border: "1px solid #bae6fd", cursor: "pointer", marginBottom: 12 }}>
                    <input type="checkbox" checked={reg.ecSameNok || false} onChange={rf("ecSameNok")} style={{ width: 16, height: 16 }} />
                    <span style={{ fontSize: 13, color: "#0369a1", fontWeight: 600 }}>Emergency contact same as NOK</span>
                  </label>
                  {!reg.ecSameNok && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <FL label="EC Name"  ch={<input value={reg.ecName || ""}  onChange={rf("ecName")}  style={IS()} />} />
                      <FL label="EC Phone" ch={<input value={reg.ecPhone || ""} onChange={rf("ecPhone")} style={IS()} />} />
                    </div>
                  )}
                </div>
              )}

              {regTab === 3 && (
                <div>
                  <Sec accent={T.green}>Patient Category</Sec>
                  <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                    {["Cash","Corporate","Insurance"].map(cat => (
                      <button key={cat} onClick={() => setReg(p => ({ ...p, category: cat }))} style={{
                        flex: 1, padding: "14px 8px", borderRadius: 11, cursor: "pointer",
                        fontFamily: "'Outfit',sans-serif", textAlign: "center",
                        border: reg.category === cat ? "2px solid " + T.green : "2px solid " + T.border,
                        background: reg.category === cat ? "#f0fdf4" : "#fff",
                      }}>
                        <div style={{ fontSize: 22, marginBottom: 4 }}>{cat === "Cash" ? "💵" : cat === "Corporate" ? "🏢" : "🛡️"}</div>
                        <div style={{ fontWeight: 700, fontSize: 12, color: reg.category === cat ? T.green : T.slate }}>{cat}</div>
                      </button>
                    ))}
                  </div>
                  {reg.category === "Insurance" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "14px", background: "#eff6ff", borderRadius: 10 }}>
                      <FL label="Provider"   ch={<select value={reg.insProvider || "SHA"} onChange={rf("insProvider")} style={SS}>{INS_PROVIDERS.map(p => <option key={p}>{p}</option>)}</select>} />
                      <FL label="Member No." ch={<input value={reg.insMemberNo || ""} onChange={rf("insMemberNo")} style={IS()} />} />
                      <FL label="Expiry"     ch={<input type="date" value={reg.insExpiry || ""} onChange={rf("insExpiry")} style={IS()} />} />
                    </div>
                  )}
                  {reg.category === "Corporate" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "14px", background: "#f0fdf4", borderRadius: 10 }}>
                      <FL label="Organisation" ch={<select value={reg.corpOrg || CORP_ORGS[0]} onChange={rf("corpOrg")} style={SS}>{CORP_ORGS.map(o => <option key={o}>{o}</option>)}</select>} />
                      <FL label="Staff ID"      ch={<input value={reg.corpId || ""} onChange={rf("corpId")} style={IS()} />} />
                    </div>
                  )}
                </div>
              )}

              {regTab === 4 && (
                <div>
                  <Sec accent="#854d0e">Consent & Compliance</Sec>
                  <div style={{ background: "#fef9c3", borderRadius: 10, padding: "16px", border: "1px solid #fde047", marginBottom: 14 }}>
                    <p style={{ fontSize: 13, color: "#78350f", marginBottom: 12, lineHeight: 1.7 }}>
                      Patient or legal guardian must provide informed consent before registration.
                    </p>
                    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, cursor: "pointer" }}>
                      <input type="checkbox" checked={reg.consentTx || false} onChange={rf("consentTx")} style={{ width: 16, height: 16, marginTop: 2 }} />
                      <span style={{ fontSize: 13 }}><strong>Consent to Treatment:</strong> Patient consents to examination, diagnostic procedures and treatment.</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                      <input type="checkbox" checked={reg.consentData || false} onChange={rf("consentData")} style={{ width: 16, height: 16, marginTop: 2 }} />
                      <span style={{ fontSize: 13 }}><strong>Data Privacy:</strong> Patient informed of rights under Kenya Data Protection Act 2019.</span>
                    </label>
                  </div>
                  {reg.consentTx && reg.consentData && (
                    <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: T.green, fontWeight: 600 }}>
                      ✅ Consent recorded. Ready to complete registration.
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Progress & Nav */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 5 }}>
                {REG_TABS.map((_, i) => (
                  <div key={i} style={{ width: i === regTab ? 20 : 7, height: 7, borderRadius: 4, background: i === regTab ? T.navy : T.border, transition: "width .2s" }} />
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {regTab > 0 && <button onClick={() => setRegTab(regTab - 1)} style={BtnGhost}>← Back</button>}
                {regTab < REG_TABS.length - 1
                  ? <button onClick={() => setRegTab(regTab + 1)} style={BtnPrimary}>Next →</button>
                  : <button onClick={handleSave} style={BtnGreen}>✅ Complete Registration</button>
                }
              </div>
            </div>
          </>
        )}
      </div>
    </HMSLayout>
  );
}
