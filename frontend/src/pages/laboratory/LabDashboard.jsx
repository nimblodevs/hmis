import { useNavigate } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import HMSLayout from "../../components/layout/HMSLayout";
import HMSTopBar from "../../components/layout/HMSTopBar";
import { StatCard, EmptyState, PatientSearch } from "../../components/common/HMSComponents";
import { T } from "../../utils/hmsConstants";
import { useBreakpoint } from "../../hooks/useBreakpoint";

export default function LabDashboard() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { isMobile } = useBreakpoint();

  const waiting = patients.filter(p => p.status === "Lab Pending");
  const processedToday = patients.filter(p => p.status === "With Doctor (Post-Lab)").length;
  const critical = patients.filter(p => {
    if (!p.clerking?.labResults) return false;
    return Object.values(p.clerking.labResults).some(r => r.flag === "critical");
  }).length;

  const handleSelect = (p) => {
    navigate("/hms/lab/process", { state: { queueNo: p.queueNo } });
  };

  return (
    <HMSLayout>
      <HMSTopBar 
        title="Laboratory Dashboard" 
        subtitle="Specimen Processing & Diagnostics" 
        action={<PatientSearch patients={patients} onSelect={handleSelect} placeholder="Manual Lab Lookup..." />}
      />
      
      <div style={{ padding: isMobile ? "16px" : "20px 24px" }}>
        {/* Stats Row */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", 
          gap: 16, 
          marginBottom: 24 
        }}>
          <StatCard label="Pending Specimens" value={waiting.length} icon="🧪" color={T.orange} />
          <StatCard label="Results Released" value={processedToday} icon="✅" color={T.green} />
          <StatCard label="Critical Results" value={critical} icon="🚨" color={T.red} />
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 12 }}>Laboratory Queue</div>
        
        {waiting.length === 0 ? (
          <EmptyState icon="🧪" msg="No specimens pending in the queue. All clear!" />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 }}>
            {waiting.map(p => (
              <div key={p.queueNo} onClick={() => handleSelect(p)} style={{
                background: T.card, borderRadius: 12, padding: "16px 20px",
                boxShadow: "0 1px 6px rgba(0,0,0,.06)", border: "1.5px solid " + T.border,
                cursor: "pointer", transition: "all .2s", display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: T.navy }}>{p.firstName || p.name} {p.lastName || ""}</div>
                  <div style={{ fontSize: 11, color: T.slateL, fontFamily: "'DM Mono',monospace", marginTop: 2 }}>
                    {p.queueNo} · {p.clerking?.orders?.lab?.tests?.length || 0} test(s) · {p.clerking?.orders?.lab?.urgency || "Routine"}
                  </div>
                </div>
                <div style={{ background: T.teal + "11", color: T.teal, padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                  Process →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </HMSLayout>
  );
}
