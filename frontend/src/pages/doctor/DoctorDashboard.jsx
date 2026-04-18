import { useNavigate } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import HMSLayout from "../../components/layout/HMSLayout";
import HMSTopBar from "../../components/layout/HMSTopBar";
import { StatCard, EmptyState, PatientSearch } from "../../components/common/HMSComponents";
import { T } from "../../utils/hmsConstants";
import { useBreakpoint } from "../../hooks/useBreakpoint";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { isMobile } = useBreakpoint();

  const waiting = patients.filter(p => p.status === "Billed" || p.status === "With Doctor (Post-Lab)");
  const seenToday = patients.filter(p => p.status === "Pharmacy Pending" || p.status === "Discharged").length;
  const critical = patients.filter(p => p.triage?.lv === "1").length;

  const handleSelect = (p) => {
    navigate("/hms/doctor/clerk", { state: { queueNo: p.queueNo } });
  };

  return (
    <HMSLayout>
      <HMSTopBar 
        title="Doctor Dashboard" 
        subtitle="Clinical Consultations & Clerking" 
        action={<PatientSearch patients={patients} onSelect={handleSelect} placeholder="Search patient history..." />}
      />
      
      <div style={{ padding: isMobile ? "16px" : "20px 24px" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", 
          gap: 16, 
          marginBottom: 24 
        }}>
          <StatCard label="Pending Consultation" value={waiting.length} icon="🩻" color={T.purple} />
          <StatCard label="Patients Seen Today" value={seenToday} icon="✅" color={T.green} />
          <StatCard label="Critical Alerts" value={critical} icon="🚨" color={T.red} />
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 12 }}>Doctor's Queue</div>
        
        {waiting.length === 0 ? (
          <EmptyState icon="🩻" msg="No patients in the queue. You're all caught up!" />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 }}>
            {waiting.map(p => {
              const isReturn = p.status === "With Doctor (Post-Lab)";
              return (
                <div key={p.queueNo} onClick={() => handleSelect(p)} style={{
                  background: T.card, borderRadius: 12, padding: "16px 20px",
                  boxShadow: "0 1px 6px rgba(0,0,0,.06)", border: "1.5px solid " + (isReturn ? T.teal : T.border),
                  cursor: "pointer", transition: "all .2s", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: T.navy }}>{p.firstName || p.name} {p.lastName || ""}</div>
                    <div style={{ fontSize: 11, color: T.slateL, fontFamily: "'DM Mono',monospace", marginTop: 2 }}>
                      {p.queueNo} · {p.triage?.complaint || "Routine Consultation"}
                    </div>
                    {isReturn && <span style={{ fontSize: 10, background: T.teal + "22", color: T.teal, padding: "2px 8px", borderRadius: 4, fontWeight: 700, marginTop: 4, display: "inline-block" }}>🧪 Lab results available</span>}
                  </div>
                  <div style={{ background: (isReturn ? T.teal : T.purple) + "11", color: isReturn ? T.teal : T.purple, padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                    Clerk →
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </HMSLayout>
  );
}
