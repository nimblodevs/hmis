import { useNavigate } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import HMSLayout from "../../components/layout/HMSLayout";
import HMSTopBar from "../../components/layout/HMSTopBar";
import { StatCard, EmptyState, PatientSearch } from "../../components/common/HMSComponents";
import { T } from "../../utils/hmsConstants";
import { fmtKES } from "../../utils/hmsHelpers";
import { useBreakpoint } from "../../hooks/useBreakpoint";

export default function BillingDashboard() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { isMobile } = useBreakpoint();

  const waiting = patients.filter(p => p.status === "Awaiting Billing");
  const paidToday = patients.filter(p => p.billing?.paid).length;
  const totalRevenue = patients.reduce((acc, p) => acc + (p.billing?.total || 0), 0);

  const handleSelect = (p) => {
    navigate("/hms/billing/process", { state: { queueNo: p.queueNo } });
  };

  return (
    <HMSLayout>
      <HMSTopBar 
        title="Billing Dashboard" 
        subtitle="Revenue & Financial Operations" 
        action={<PatientSearch patients={patients} onSelect={handleSelect} placeholder="Manual Bill Search..." />}
      />
      
      <div style={{ padding: isMobile ? "16px" : "20px 24px" }}>
        {/* Stats Row */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", 
          gap: 16, 
          marginBottom: 24 
        }}>
          <StatCard label="Pending Bills" value={waiting.length} icon="💳" color={T.orange} />
          <StatCard label="Transactions Today" value={paidToday} icon="✅" color={T.green} />
          <StatCard label="Total Revenue" value={fmtKES(totalRevenue)} icon="💰" color={T.blue} trend={isMobile ? "" : "+12% from yesterday"} />
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 12 }}>Active Billing Queue</div>
        
        {waiting.length === 0 ? (
          <EmptyState icon="💳" msg="No patients awaiting billing. All caught up!" />
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
                    {p.queueNo} · {p.category} · {p.status}
                  </div>
                </div>
                <div style={{ background: T.orange + "11", color: T.orange, padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                  Bill →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </HMSLayout>
  );
}
