import { useNavigate } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import HMSLayout from "../../components/layout/HMSLayout";
import HMSTopBar from "../../components/layout/HMSTopBar";
import { Card, Badge } from "../../components/common/HMSComponents";
import { T, STATUS_META } from "../../utils/hmsConstants";
import { calcAge, fmtKES } from "../../utils/hmsHelpers";
import { useBreakpoint } from "../../hooks/useBreakpoint";

export default function ReportsDashboard() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { isMobile, isTablet } = useBreakpoint();

  const total = patients.length;
  const completed = patients.filter(p => p.status === "Completed").length;
  const revenue = patients.reduce((s, p) => s + (p.billing?.items?.reduce((si, i) => si + i.price * i.qty, 0) || 0) - (p.billing?.discount || 0), 0);
  const paid = patients.filter(p => p.billing?.paid).length;
  const labDone = patients.filter(p => p.clerking?.labNo).length;
  const rxDone = patients.filter(p => p.clerking?.dispensed).length;

  const stats = [
    { label: "Total Patients", value: total, icon: "👥", col: T.navy, bg: "#f1f5f9" },
    { label: "Completed", value: completed, icon: "✅", col: T.green, bg: "#dcfce7" },
    { label: "Revenue Today", value: fmtKES(revenue), icon: "💰", col: T.blue, bg: "#dbeafe" },
    { label: "Paid Invoices", value: paid, icon: "💳", col: "#0e7490", bg: "#cffafe" },
    { label: "Lab Reports", value: labDone, icon: "🧪", col: T.amber, bg: "#fef3c7" },
    { label: "Prescriptions Dispensed", value: rxDone, icon: "💊", col: T.purple, bg: "#f3e8ff" },
  ];

  const statusCounts = Object.keys(STATUS_META).map(s => ({
    s, n: patients.filter(p => p.status === s).length,
    ...STATUS_META[s],
  })).filter(x => x.n > 0);

  return (
    <HMSLayout>
      <HMSTopBar
        title="Reports"
        subtitle={"Daily summary · " + new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        action={<button onClick={() => navigate("/hms/queue")} style={{ padding: "8px 16px", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, background: "#f1f5f9", color: T.slate }}>← Queue</button>}
      />
      <div style={{ padding: isMobile ? "16px" : "20px 24px" }}>

        {/* KPI cards */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)", 
          gap: 12, 
          marginBottom: 20 
        }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: s.bg, border: "1px solid " + T.border, borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: isMobile ? 24 : 32, lineHeight: 1 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: s.col }}>{s.value}</div>
                <div style={{ fontSize: 11, color: T.slateL, marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 1fr", gap: 16 }}>
          {/* Status breakdown */}
          <Card>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 12 }}>Queue Status Breakdown</div>
            {statusCounts.map(x => (
              <div key={x.s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid " + T.border }}>
                <Badge label={x.s} col={x.col} bg={x.bg} />
                <span style={{ fontSize: 16, fontWeight: 800, color: x.col, fontFamily: "'DM Mono',monospace" }}>{x.n}</span>
              </div>
            ))}
          </Card>

          {/* Payment breakdown */}
          <Card>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 12 }}>Payment Methods</div>
            {(() => {
              const methods = {};
              patients.forEach(p => {
                if (p.billing?.paid && p.billing?.method) {
                  methods[p.billing.method] = (methods[p.billing.method] || 0) + 1;
                }
              });
              return Object.entries(methods).length === 0
                ? <div style={{ fontSize: 13, color: T.slateL, textAlign: "center", padding: "20px 0" }}>No payments recorded today</div>
                : Object.entries(methods).map(([method, count]) => (
                  <div key={method} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid " + T.border }}>
                    <span style={{ fontSize: 13, color: T.slate }}>{method}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'DM Mono',monospace", color: T.navy }}>{count}</span>
                  </div>
                ));
            })()}
          </Card>
        </div>

        {/* Patient log */}
        <Card mb={0} style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 12 }}>Today's Patient Log</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Queue", "Patient", "Age", "Sex", "Category", "Status", "Doctor", "Invoice", "Lab No", "Rx No"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: T.slateL, fontFamily: "'DM Mono',monospace", letterSpacing: .8, borderBottom: "1px solid " + T.border }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients.map((p, i) => {
                  const sm = STATUS_META[p.status] || STATUS_META["Queued"];
                  return (
                    <tr key={p.queueNo} style={{ borderBottom: "1px solid #f8fafc", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ padding: "8px 10px", fontFamily: "'DM Mono',monospace", fontSize: 11, fontWeight: 700, color: T.navy }}>{p.queueNo}</td>
                      <td style={{ padding: "8px 10px", fontSize: 12, fontWeight: 600 }}>{p.firstName || p.name} {p.lastName || ""}</td>
                      <td style={{ padding: "8px 10px", fontSize: 11, color: T.slate }}>{calcAge(p.dateOfBirth) !== "-" ? calcAge(p.dateOfBirth) + "y" : "—"}</td>
                      <td style={{ padding: "8px 10px", fontSize: 11, color: T.slate }}>{p.gender?.[0] || "—"}</td>
                      <td style={{ padding: "8px 10px", fontSize: 11, color: T.slate }}>{p.category || "—"}</td>
                      <td style={{ padding: "8px 10px" }}><Badge label={p.status} col={sm.col} bg={sm.bg} sm /></td>
                      <td style={{ padding: "8px 10px", fontSize: 11, color: T.slate }}>{p.clerking?.doctorName || "—"}</td>
                      <td style={{ padding: "8px 10px", fontSize: 10, fontFamily: "'DM Mono',monospace", color: T.blue }}>{p.billing?.invoiceNo || "—"}</td>
                      <td style={{ padding: "8px 10px", fontSize: 10, fontFamily: "'DM Mono',monospace", color: T.teal }}>{p.clerking?.labNo || "—"}</td>
                      <td style={{ padding: "8px 10px", fontSize: 10, fontFamily: "'DM Mono',monospace", color: T.purple }}>{p.clerking?.rxNo || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </HMSLayout>
  );
}
