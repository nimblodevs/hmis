import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import HMSLayout from "../../components/layout/HMSLayout";
import HMSTopBar from "../../components/layout/HMSTopBar";
import { Badge, Btn, BtnCyan, BtnGhost, ErrBox, FL, IS } from "../../components/common/HMSComponents";
import { T, STATUS_META, TRIAGE_LEVELS } from "../../utils/hmsConstants";

export default function QueueDashboard() {
  const navigate = useNavigate();
  const { patients, addWalkIn } = usePatients();

  const [qModal, setQModal] = useState(false);
  const [qName,  setQName]  = useState("");
  const [qPhone, setQPhone] = useState("");
  const [qErr,   setQErr]   = useState("");

  const saveWalkIn = () => {
    if (!qName.trim() || !qPhone.trim()) { setQErr("Name and phone required."); return; }
    addWalkIn(qName, qPhone);
    setQModal(false); setQName(""); setQPhone(""); setQErr("");
  };

  const statCounts = ["All","Queued","Triaged","Registered","Billed","With Doctor","Lab Pending","Completed"].map(s => ({
    s, n: s === "All" ? patients.length : patients.filter(p => p.status === s).length,
  }));

  return (
    <HMSLayout>
      <HMSTopBar
        title="Patient Queue"
        subtitle={patients.length + " patient(s) today · " + new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        action={<button onClick={() => setQModal(true)} style={BtnCyan}>🎫 Walk-in</button>}
      />
      <div style={{ padding: "20px 24px" }}>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 8, marginBottom: 18 }}>
          {statCounts.map(x => {
            const sm = STATUS_META[x.s] || { bg: "#e2e8f0", col: T.navy };
            return (
              <div key={x.s} style={{ background: T.card, borderRadius: 10, padding: "10px 12px", boxShadow: "0 1px 6px rgba(0,0,0,.05)", textAlign: "center", border: "1px solid " + T.border }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: x.s === "All" ? T.navy : sm.col }}>{x.n}</div>
                <div style={{ fontSize: 9, color: T.slateL, fontFamily: "'DM Mono',monospace", marginTop: 2 }}>{x.s}</div>
              </div>
            );
          })}
        </div>

        {/* Patient table */}
        <div style={{ background: T.card, borderRadius: 12, boxShadow: "0 1px 8px rgba(0,0,0,.06)", overflow: "hidden", border: "1px solid " + T.border }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Queue","Patient","Phone","Category","Status","ESI","Next Action"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, color: T.slateL, fontFamily: "'DM Mono',monospace", letterSpacing: .8, borderBottom: "1px solid " + T.border }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map((p, i) => {
                const sm = STATUS_META[p.status] || STATUS_META["Queued"];
                const tl = TRIAGE_LEVELS.find(t => t.lv === p.triage?.lv);
                const actions = [];
                if (p.status === "Queued")                                     actions.push({ lbl: "🩺 Triage",   path: "/hms/triage",   col: "#ea580c", bg: "#ffedd5" });
                if (p.status === "Triaged")                                    actions.push({ lbl: "📝 Register", path: "/hms/register", col: "#b45309", bg: "#fef9c3" });
                if (p.status === "Registered")                                 actions.push({ lbl: "💳 Bill",     path: "/hms/billing",  col: T.blue,    bg: "#dbeafe" });
                if (p.status === "Billed")                                     actions.push({ lbl: "🩻 Doctor",   path: "/hms/doctor",   col: T.purple,  bg: "#f3e8ff" });
                if (p.status === "Lab Pending")                                actions.push({ lbl: "🧪 Lab",      path: "/hms/lab",      col: T.amber,   bg: "#fef3c7" });
                if (p.status === "With Doctor (Post-Lab)")                     actions.push({ lbl: "🩻 Doctor",   path: "/hms/doctor",   col: T.teal,    bg: "#cffafe" });
                if (p.status === "Completed" && p.clerking?.orders?.rx?.drugs?.length > 0 && !p.clerking?.dispensed)
                  actions.push({ lbl: "💊 Pharmacy", path: "/hms/pharmacy", col: T.green, bg: "#dcfce7" });

                return (
                  <tr key={p.queueNo} style={{ borderBottom: "1px solid #f8fafc", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "11px 14px", fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 700, color: T.navy }}>{p.queueNo}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{p.firstName || p.name} {p.lastName || ""}</div>
                      {p.id && <div style={{ fontSize: 10, color: T.slateL, fontFamily: "'DM Mono',monospace" }}>{p.id}</div>}
                    </td>
                    <td style={{ padding: "11px 14px", fontSize: 12, color: T.slate }}>{p.phone}</td>
                    <td style={{ padding: "11px 14px" }}>
                      {p.category && <Badge label={p.category} col={p.category === "Insurance" ? T.blue : p.category === "Corporate" ? T.green : T.amber} bg={p.category === "Insurance" ? "#dbeafe" : p.category === "Corporate" ? "#dcfce7" : "#fef3c7"} sm />}
                    </td>
                    <td style={{ padding: "11px 14px" }}><Badge label={p.status} col={sm.col} bg={sm.bg} sm /></td>
                    <td style={{ padding: "11px 14px" }}>
                      {tl && <span style={{ background: tl.bg, color: tl.col, borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>L{tl.lv}</span>}
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {actions.map(a => (
                          <button key={a.lbl} onClick={() => navigate(a.path, { state: { queueNo: p.queueNo } })}
                            style={{ ...Btn, padding: "6px 12px", fontSize: 11, background: a.bg, color: a.col, border: "1px solid transparent" }}>
                            {a.lbl}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Walk-in Modal */}
      {qModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(7,24,40,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "28px 32px", width: 400, boxShadow: "0 24px 64px rgba(0,0,0,.3)" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.navy, marginBottom: 4 }}>🎫 New Walk-in Patient</div>
            <div style={{ fontSize: 12, color: T.slateL, marginBottom: 20 }}>Queue a new patient for triage</div>
            <ErrBox msg={qErr} />
            <FL label="Patient Name *" ch={<input value={qName} onChange={e => setQName(e.target.value)} placeholder="Full name" style={IS(!qName.trim() && qErr)} />} />
            <div style={{ marginBottom: 14 }} />
            <FL label="Phone Number *" ch={<input value={qPhone} onChange={e => setQPhone(e.target.value)} placeholder="+254..." style={IS(!qPhone.trim() && qErr)} />} />
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => { setQModal(false); setQErr(""); }} style={{ ...BtnGhost, flex: 1 }}>Cancel</button>
              <button onClick={saveWalkIn} style={{ ...BtnCyan, flex: 1 }}>Add to Queue</button>
            </div>
          </div>
        </div>
      )}
    </HMSLayout>
  );
}
