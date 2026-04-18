import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import HMSLayout from "../../components/layout/HMSLayout";
import HMSTopBar from "../../components/layout/HMSTopBar";
import { PatientBanner, Card, Sec, FL, ErrBox, EmptyState, BtnGhost, BtnGreen, IS, SS, Btn } from "../../components/common/HMSComponents";
import { T, LAB_TESTS, LAB_REF, TEST_SUBS, FLAG_STYLE } from "../../utils/hmsConstants";
import { getFlag, printLabReport } from "../../utils/hmsHelpers";

export default function LabDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { patients, saveLabResults } = usePatients();

  const initQueueNo = location.state?.queueNo || null;
  const [selQNo,  setSelQNo]  = useState(initQueueNo);
  const [labStep, setLabStep] = useState("specimen");
  const [labSci,  setLabSci]  = useState("");
  const [labRes,  setLabRes]  = useState({});
  const [labErr,  setLabErr]  = useState("");

  const active  = patients.find(p => p.queueNo === selQNo) || null;
  const waiting = patients.filter(p => p.status === "Lab Pending");

  const pickPatient = (p) => {
    setSelQNo(p.queueNo);
    setLabRes(p.clerking?.labResults || {});
    setLabSci(p.clerking?.labScientist || "");
    setLabStep(Object.keys(p.clerking?.labResults || {}).length ? "results" : "specimen");
    setLabErr("");
  };

  const handleSave = () => {
    if (!labSci.trim()) { setLabErr("Lab scientist name required."); return; }
    saveLabResults(selQNo, labRes, labSci, () => { setSelQNo(null); navigate("/hms/queue"); });
  };

  const orderedTests = active?.clerking?.orders?.lab?.tests || [];

  const setResult = (sid, val) => {
    const gender = active?.gender || "";
    const flag   = getFlag(sid, val, gender);
    setLabRes(prev => ({ ...prev, [sid]: { value: val, flag, type: LAB_REF[sid]?.type || "desc" } }));
  };

  return (
    <HMSLayout>
      <HMSTopBar
        title="Laboratory"
        subtitle={active ? active.queueNo + " · " + (active.firstName||active.name) + " " + (active.lastName||"") : waiting.length + " specimen(s) pending"}
        action={
          <div style={{display:"flex",gap:8}}>
            {active && <button onClick={()=>setSelQNo(null)} style={BtnGhost}>← List</button>}
            <button onClick={()=>navigate("/hms/queue")} style={BtnGhost}>← Queue</button>
          </div>
        }
      />
      <div style={{padding:"20px 24px"}}>
        {!active ? (
          waiting.length===0 ? <EmptyState icon="🧪" msg="No specimens pending." /> :
          waiting.map(p=>(
            <div key={p.queueNo} onClick={()=>pickPatient(p)} style={{background:T.card,borderRadius:11,padding:"14px 18px",marginBottom:10,boxShadow:"0 1px 6px rgba(0,0,0,.06)",border:"1.5px solid "+T.border,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>{p.firstName||p.name} {p.lastName||""}</div>
                <div style={{fontSize:11,color:T.slateL,fontFamily:"'DM Mono',monospace"}}>{p.queueNo} · {p.clerking?.orders?.lab?.tests?.length||0} test(s) · {p.clerking?.orders?.lab?.urgency||"Routine"}</div>
              </div>
              <button style={{...Btn,padding:"8px 16px",fontSize:12,background:"#fef3c7",color:"#b45309"}}>🧪 Process</button>
            </div>
          ))
        ) : (
          <div>
            <PatientBanner p={active} />

            {/* Step tabs */}
            <div style={{display:"flex",background:T.card,borderRadius:10,overflow:"hidden",marginBottom:14,border:"1px solid "+T.border}}>
              {[["specimen","🧫 Specimen"],["results","📊 Results"],["summary","✅ Summary"]].map(([key,lbl])=>(
                <button key={key} onClick={()=>setLabStep(key)} style={{flex:1,padding:"11px",border:"none",fontFamily:"'Outfit',sans-serif",cursor:"pointer",fontSize:12,fontWeight:labStep===key?700:400,background:labStep===key?"#f0fdfa":"transparent",color:labStep===key?T.teal:T.slateL,borderBottom:labStep===key?"3px solid "+T.teal:"3px solid transparent"}}>
                  {lbl}
                </button>
              ))}
            </div>
            <ErrBox msg={labErr} />

            {labStep==="specimen" && (
              <Card>
                <Sec accent={T.teal}>Specimen Collection</Sec>
                <div style={{marginBottom:14}}>
                  <FL label="Lab Scientist *" ch={<input value={labSci} onChange={e=>setLabSci(e.target.value)} placeholder="Full name" style={IS(!labSci&&labErr)} />} />
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
                  {orderedTests.map(id=>{
                    const t=LAB_TESTS.find(x=>x.id===id);
                    if(!t)return null;
                    return (
                      <div key={id} style={{background:"#f8fafc",borderRadius:10,padding:"12px 14px",border:"1px solid "+T.border}}>
                        <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>{t.name}</div>
                        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                          <span style={{background:t.colour+"22",color:t.colour,borderRadius:5,padding:"2px 8px",fontSize:10,fontWeight:700}}>{t.container}</span>
                          <span style={{background:"#f1f5f9",color:T.slate,borderRadius:5,padding:"2px 8px",fontSize:10}}>{t.vol}</span>
                          <span style={{background:"#f1f5f9",color:T.slate,borderRadius:5,padding:"2px 8px",fontSize:10}}>{t.specimen}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button onClick={()=>setLabStep("results")} style={{...BtnGreen,marginTop:16}}>→ Enter Results</button>
              </Card>
            )}

            {labStep==="results" && (
              <div>
                {orderedTests.map(testId=>{
                  const test=LAB_TESTS.find(t=>t.id===testId);
                  if(!test)return null;
                  const subs=TEST_SUBS[testId]||[];
                  return (
                    <Card key={testId}>
                      <Sec accent={test.colour}>{test.name}</Sec>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
                        {subs.map(sid=>{
                          const ref=LAB_REF[sid];
                          if(!ref)return null;
                          const cur=labRes[sid];
                          const fc=FLAG_STYLE[cur?.flag]||FLAG_STYLE.empty;
                          return (
                            <div key={sid} style={{background:fc.bg,border:"1.5px solid "+fc.bd,borderRadius:8,padding:"10px 12px"}}>
                              <div style={{fontSize:11,color:T.slate,marginBottom:6,fontWeight:600}}>{ref.name} {ref.unit?"("+ref.unit+")":""}</div>
                              {ref.type==="qual"?(
                                <select value={cur?.value||""} onChange={e=>setResult(sid,e.target.value)} style={{...SS,background:fc.bg,color:fc.tx,fontWeight:700}}>
                                  <option value="">Select...</option>
                                  {ref.opts?.map(o=><option key={o}>{o}</option>)}
                                </select>
                              ):ref.type==="desc"?(
                                <textarea value={cur?.value||""} onChange={e=>setResult(sid,e.target.value)} rows={3} style={{...IS(),resize:"vertical",background:fc.bg}} />
                              ):(
                                <div style={{display:"flex",alignItems:"center",gap:6}}>
                                  <input type="number" value={cur?.value||""} onChange={e=>setResult(sid,e.target.value)} style={{...IS(),background:fc.bg,color:fc.tx,fontWeight:800,flex:1}} />
                                  {cur?.flag&&cur.flag!=="empty"&&<span style={{background:fc.tBg,color:fc.tTx,borderRadius:4,padding:"2px 7px",fontSize:9,fontWeight:700,flexShrink:0}}>{fc.tag}</span>}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  );
                })}
                <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
                  <button onClick={()=>setLabStep("specimen")} style={BtnGhost}>← Specimen</button>
                  <button onClick={()=>setLabStep("summary")} style={BtnGreen}>→ Review Summary</button>
                </div>
              </div>
            )}

            {labStep==="summary" && (
              <Card>
                <Sec accent={T.teal}>Results Summary</Sec>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:8,marginBottom:16}}>
                  {Object.entries(labRes).map(([sid,r])=>{
                    const ref=LAB_REF[sid]; const fc=FLAG_STYLE[r.flag]||FLAG_STYLE.empty;
                    return (
                      <div key={sid} style={{background:fc.bg,border:"1.5px solid "+fc.bd,borderRadius:8,padding:"10px 12px"}}>
                        <div style={{fontSize:10,color:T.slateL,marginBottom:3}}>{ref?ref.name:sid}</div>
                        <div style={{fontSize:15,fontWeight:800,color:fc.tx,fontFamily:"'DM Mono',monospace"}}>{r.value||"—"} <span style={{fontSize:10}}>{ref?.unit||""}</span></div>
                        {r.flag&&r.flag!=="normal"&&r.flag!=="empty"&&<span style={{background:fc.tBg,color:fc.tTx,borderRadius:4,padding:"1px 6px",fontSize:9,fontWeight:700}}>{fc.tag}</span>}
                      </div>
                    );
                  })}
                </div>
                <FL label="Lab Scientist *" ch={<input value={labSci} onChange={e=>setLabSci(e.target.value)} placeholder="Full name" style={IS(!labSci&&labErr)} />} />
                <div style={{display:"flex",justifyContent:"space-between",marginTop:14,gap:10}}>
                  <button onClick={()=>setLabStep("results")} style={BtnGhost}>← Edit Results</button>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>printLabReport({...active,clerking:{...active.clerking,labResults:labRes,labScientist:labSci}})} style={{...Btn,background:"#f1f5f9",color:T.slate}}>🖨️ Print</button>
                    <button onClick={handleSave} style={BtnGreen}>✅ Release Results</button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </HMSLayout>
  );
}
