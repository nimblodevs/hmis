import { useNavigate } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import HMSLayout from "../../components/layout/HMSLayout";
import HMSTopBar from "../../components/layout/HMSTopBar";
import { StatCard, EmptyState, Btn, PatientSearch } from "../../components/common/HMSComponents";
import { T } from "../../utils/hmsConstants";
import { useBreakpoint } from "../../hooks/useBreakpoint";

export default function RegistrationDashboard() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { isMobile } = useBreakpoint();

  const waiting = patients.filter(p => p.status === "Triaged");
  const regToday = patients.filter(p => p.status !== "Queued" && p.status !== "Triaged").length;
  const newPatients = patients.filter(p => p.id && p.id.startsWith("PAT-2026")).length;

  const handleSelect = (p) => {
    navigate("/hms/registration/process", { state: { queueNo: p.queueNo } });
  };

  const startDirect = () => {
    navigate("/hms/registration/process", { state: { direct: true } });
  };

  return (
    <HMSLayout>
      <HMSTopBar 
        title="Registration Dashboard" 
        subtitle="Patient Files & Record Management" 
        action={
          <div style={{ display: "flex", gap: 8, flexDirection: isMobile ? "column" : "row", width: isMobile ? "100%" : "auto" }}>
            <PatientSearch patients={patients} onSelect={handleSelect} placeholder="Search records..." />
            <button onClick={startDirect} style={{ ...Btn, background: T.teal, color: "#fff", width: isMobile ? "100%" : "auto" }}>📝 Manual Registration</button>
          </div>
        }
      />
      
      <div style={{ padding: isMobile ? "16px" : "20px 24px" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", 
          gap: 16, 
          marginBottom: 24 
        }}>
          <StatCard label="Awaiting Registration" value={waiting.length} icon="📋" color={T.blue} />
          <StatCard label="Registered Today" value={regToday} icon="✅" color={T.green} />
          <StatCard label="Total Records" value={newPatients} icon="🗄️" color={T.navy} />
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 12 }}>Registration Queue (Triaged Patients)</div>
        
        {waiting.length === 0 ? (
          <EmptyState icon="📋" msg="No patients awaiting registration from triage. Use Manual Registration for walk-ins." />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 }}>
            {waiting.map(p => (
              <div key={p.queueNo} onClick={() => handleSelect(p)} style={{
                background: T.card, borderRadius: 12, padding: "16px 20px",
                boxShadow: "0 1px 6px rgba(0,0,0,.06)", border: "1.5px solid " + T.border,
                cursor: "pointer", transition: "all .2s", display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: T.navy }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: T.slateL, fontFamily: "'DM Mono',monospace", marginTop: 2 }}>
                    {p.queueNo} · {p.phone} · Triaged {p.triage?.lv ? "Level " + p.triage.lv : ""}
                  </div>
                </div>
                <div style={{ background: T.blue + "11", color: T.blue, padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                  Register →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </HMSLayout>
  );
}
