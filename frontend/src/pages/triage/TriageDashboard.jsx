import { useNavigate } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import HMSLayout from "../../components/layout/HMSLayout";
import HMSTopBar from "../../components/layout/HMSTopBar";
import { StatCard, EmptyState, BtnGhost, PatientSearch } from "../../components/common/HMSComponents";
import { T } from "../../utils/hmsConstants";
import { useBreakpoint } from "../../hooks/useBreakpoint";

export default function TriageDashboard() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { isMobile } = useBreakpoint();

  const waiting = patients.filter(p => p.status === "Queued");
  const todayCount = patients.filter(p => p.status !== "Queued").length;
  const critical = patients.filter(p => p.triage?.lv === "1" || p.triage?.lv === "2").length;

  const handleSelect = (p) => {
    navigate("/hms/triage/assess", { state: { queueNo: p.queueNo } });
  };

  return (
    <HMSLayout>
      <HMSTopBar 
        title="Triage Dashboard" 
        subtitle="Vitals & Patient Prioritization" 
        action={<PatientSearch patients={patients} onSelect={handleSelect} placeholder="Manual Triage Lookup..." />}
      />
      
      <div style={{ padding: isMobile ? "16px" : "20px 24px" }}>
        {/* Stats Row */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", 
          gap: 16, 
          marginBottom: 24 
        }}>
          <StatCard label="Awaiting Triage" value={waiting.length} icon="🩺" color={T.orange} />
          <StatCard label="Triaged Today" value={todayCount} icon="✅" color={T.green} />
          <StatCard label="High Priority" value={critical} icon="🚨" color={T.red} trend={isMobile ? "" : "Requires Immediate Action"} />
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 12 }}>Active Triage Queue</div>
        
        {waiting.length === 0 ? (
          <EmptyState icon="🩺" msg="No patients awaiting triage. Great job!" />
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
                    {p.queueNo} · {p.phone} · In at {p.queueTime}
                  </div>
                </div>
                <div style={{ background: T.teal + "11", color: T.teal, padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                  Assess →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </HMSLayout>
  );
}
