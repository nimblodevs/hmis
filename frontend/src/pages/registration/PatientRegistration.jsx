import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import HMSLayout from "../../components/layout/HMSLayout";
import HMSTopBar from "../../components/layout/HMSTopBar";
import { PatientBanner, FlowBar, Card, Sec, FL, ErrBox, EmptyState, BtnGhost, BtnPrimary, IS, SS, Btn } from "../../components/common/HMSComponents";
import { T, REG_TABS } from "../../utils/hmsConstants";
import { genNo, pad } from "../../utils/hmsHelpers";
import { useBreakpoint } from "../../hooks/useBreakpoint";

const INIT_REG = {
  firstName: "", middleName: "", lastName: "", dateOfBirth: "", gender: "Female",
  phone: "", email: "", address: "", emergencyName: "", emergencyPhone: "",
  category: "Cash", insuranceNo: "", occupation: "", kin: ""
};

export default function PatientRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const { patients, saveRegistration, registerDirect } = usePatients();
  const { isMobile } = useBreakpoint();

  const initQueueNo = location.state?.queueNo || null;
  const isDirect = location.state?.direct || false;

  const [selectedQueueNo, setSelectedQueueNo] = useState(initQueueNo);
  const [directMode, setDirectMode] = useState(isDirect);
  const [reg, setReg] = useState({ ...INIT_REG });
  const [regTab, setRegTab] = useState(0);
  const [regErr, setRegErr] = useState("");

  const active = patients.find(p => p.queueNo === selectedQueueNo) || null;

  useEffect(() => {
    if (active) {
      const parts = (active.name || "").split(" ");
      setReg(prev => ({ ...prev, firstName: parts[0] || "", lastName: parts.slice(1).join(" ") || "", phone: active.phone || "" }));
    }
  }, [active]);

  const rf = k => e => setReg(p => ({ ...p, [k]: e.target.value }));

  const startDirect = () => {
    setDirectMode(true);
    setSelectedQueueNo(null);
    setReg({ ...INIT_REG });
    setRegTab(0);
  };

  const handleSave = () => {
    if (!reg.firstName?.trim() || !reg.lastName?.trim() || !reg.dateOfBirth) {
      setRegErr("First Name, Last Name and Date of Birth are required.");
      setRegTab(0); return;
    }
    if (directMode) {
      registerDirect(reg, () => navigate("/hms/register"));
    } else {
      saveRegistration(selectedQueueNo, reg, () => navigate("/hms/register"));
    }
  };

  if (!active && !directMode) {
    return (
      <HMSLayout>
        <HMSTopBar title="Patient Registration" subtitle="No patient selected" action={<button onClick={() => navigate("/hms/register")} style={BtnGhost}>← Dashboard</button>} />
        <div style={{ padding: "40px" }}><EmptyState icon="❓" msg="No patient selected for registration. Please select from the dashboard." /></div>
      </HMSLayout>
    );
  }

  return (
    <HMSLayout>
      <HMSTopBar
        title="Patient Registration"
        subtitle={directMode ? "Manual Registration" : active ? active.queueNo + " · " + (active.name || "") : "Processing..."}
        action={<button onClick={() => navigate("/hms/register")} style={BtnGhost}>← Dashboard</button>}
      />
      <div style={{ padding: isMobile ? "16px" : "20px 24px", maxWidth: 820 }}>
        {directMode && (
          <div style={{ background: T.teal, color: "#fff", borderRadius: 11, padding: "14px 18px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 12px " + T.teal + "33" }}>
            <span style={{ fontSize: 20 }}>📝</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>Manual Registration Mode</div>
              <div style={{ fontSize: 11, opacity: .85 }}>Creating a fresh patient file without a queue token.</div>
            </div>
          </div>
        )}
        
        {active && (
          <>
            <PatientBanner p={active} />
            <FlowBar status={active.status} />
          </>
        )}

        <div style={{ display: "flex", background: T.card, borderRadius: 10, overflowX: "auto", marginBottom: 14, border: "1px solid " + T.border }}>
          {REG_TABS.map((t, i) => (
            <button key={t} onClick={() => setRegTab(i)} style={{
              flex: 1, padding: "11px 12px", border: "none", fontFamily: "'Outfit',sans-serif",
              cursor: "pointer", fontSize: 11, fontWeight: regTab === i ? 700 : 400,
              background: regTab === i ? "#f0f9ff" : "transparent",
              color: regTab === i ? "#0369a1" : T.slateL,
              borderBottom: regTab === i ? "3px solid #0369a1" : "3px solid transparent",
              whiteSpace: "nowrap"
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
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
                <FL label="First Name *" ch={<input value={reg.firstName || ""} onChange={rf("firstName")} style={IS(!reg.firstName && regErr)} />} />
                <FL label="Middle Name" ch={<input value={reg.middleName || ""} onChange={rf("middleName")} style={IS()} />} />
                <FL label="Last Name *" ch={<input value={reg.lastName || ""} onChange={rf("lastName")} style={IS(!reg.lastName && regErr)} />} />
                <FL label="Date of Birth *" ch={<input type="date" value={reg.dateOfBirth || ""} onChange={rf("dateOfBirth")} style={IS(!reg.dateOfBirth && regErr)} />} />
                <FL label="Gender" ch={<select value={reg.gender || "Female"} onChange={rf("gender")} style={SS}>{["Male", "Female", "Other"].map(g => <option key={g}>{g}</option>)}</select>} />
              </div>
            </div>
          )}
          {regTab === 1 && (
            <div>
              <Sec accent="#0891b2">Contact Details</Sec>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                <FL label="Phone Number" ch={<input value={reg.phone || ""} onChange={rf("phone")} style={IS()} />} />
                <FL label="Email Address" ch={<input value={reg.email || ""} onChange={rf("email")} style={IS()} />} />
                <FL label="Residential Address" span={isMobile ? 1 : 2} ch={<input value={reg.address || ""} onChange={rf("address")} style={IS()} />} />
              </div>
            </div>
          )}
          {regTab === 2 && (
            <div>
              <Sec accent="#ea580c">Emergency Contact</Sec>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                <FL label="Next of Kin Name" ch={<input value={reg.kin || ""} onChange={rf("kin")} style={IS()} />} />
                <FL label="Next of Kin Phone" ch={<input value={reg.emergencyPhone || ""} onChange={rf("emergencyPhone")} style={IS()} />} />
                <FL label="Emergency Contact Name" ch={<input value={reg.emergencyName || ""} onChange={rf("emergencyName")} style={IS()} />} />
                <FL label="Occupation" ch={<input value={reg.occupation || ""} onChange={rf("occupation")} style={IS()} />} />
              </div>
            </div>
          )}
          {regTab === 3 && (
            <div>
              <Sec accent="#059669">Payment & Category</Sec>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                <FL label="Patient Category" ch={
                  <select value={reg.category || "Cash"} onChange={rf("category")} style={SS}>
                    {["Cash", "SHA", "Corporate", "Insurance"].map(c => <option key={c}>{c}</option>)}
                  </select>
                } />
                <FL label="Insurance / ID Card No." ch={<input value={reg.insuranceNo || ""} onChange={rf("insuranceNo")} style={IS()} />} />
              </div>
              <div style={{ marginTop: 20, padding: 14, background: "#f8fafc", borderRadius: 10, border: "1.5px dashed " + T.border }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.navy, marginBottom: 4 }}>New MRN Generation</div>
                <div style={{ fontSize: 11, color: T.slateL }}>A medical record number (MRN) and PAT ID will be automatically generated upon saving.</div>
              </div>
            </div>
          )}
        </Card>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, gap: 10, flexDirection: isMobile ? "column" : "row" }}>
          <button onClick={() => navigate("/hms/register")} style={{ ...BtnGhost, width: isMobile ? "100%" : "auto" }}>← Back to Dashboard</button>
          <button onClick={handleSave} style={{ ...BtnPrimary, background: T.teal, padding: "10px 24px", width: isMobile ? "100%" : "auto" }}>💾 Save & Complete Registration</button>
        </div>
      </div>
    </HMSLayout>
  );
}
    </HMSLayout>
  );
}
