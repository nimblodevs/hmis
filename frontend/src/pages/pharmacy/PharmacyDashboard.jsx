import { useNavigate } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import HMSLayout from "../../components/layout/HMSLayout";
import HMSTopBar from "../../components/layout/HMSTopBar";
import { StatCard, EmptyState, PatientSearch } from "../../components/common/HMSComponents";
import { T } from "../../utils/hmsConstants";
import { useBreakpoint } from "../../hooks/useBreakpoint";

export default function PharmacyDashboard() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { isMobile } = useBreakpoint();

  const waiting = patients.filter(p => p.clerking?.orders?.rx?.drugs?.length > 0 && !p.clerking?.dispensed);
  const dispensedToday = patients.filter(p => p.clerking?.dispensed).length;
  const stockAlerts = 3; // Mock value

  const handleSelect = (p) => {
    navigate("/hms/pharmacy/dispense", { state: { queueNo: p.queueNo } });
  };

  return (
    <HMSLayout>
      <HMSTopBar 
        title="Pharmacy Dashboard" 
        subtitle="Medication Dispensing & Inventory" 
        action={<PatientSearch patients={patients} onSelect={handleSelect} placeholder="Search prescriptions..." />}
      />
      
      <div style={{ padding: isMobile ? "16px" : "20px 24px" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", 
          gap: 16, 
          marginBottom: 24 
        }}>
          <StatCard label="Pending Dispense" value={waiting.length} icon="💊" color={T.green} />
          <StatCard label="Dispensed Today" value={dispensedToday} icon="✅" color={T.blue} />
          <StatCard label="Stock Alerts" value={stockAlerts} icon="⚠️" color={T.red} trend={isMobile ? "" : "Reorder items soon"} />
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 12 }}>Pharmacy Queue</div>
        
        {waiting.length === 0 ? (
          <EmptyState icon="💊" msg="No prescriptions pending. All caught up!" />
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
                    {p.queueNo} · {p.clerking?.orders?.rx?.drugs?.length || 0} drug(s) · Dr. {p.clerking?.doctorName || "—"}
                  </div>
                </div>
                <div style={{ background: T.green + "11", color: T.green, padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                  Dispense →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </HMSLayout>
  );
}
