import React, { useState } from 'react';
import { usePatients } from '../../context/PatientContext';
import { T, DOCTORS } from '../../utils/hmsConstants';
import { BtnGreen, BtnGhost } from '../../components/common/HMSComponents';

const PatientFlow = () => {
  const { patients } = usePatients();
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [assignDoctor, setAssignDoctor] = useState(null);
  const [clinicFilter, setClinicFilter] = useState("All Clinics");

  // Filter patients waiting for doctor or in triage
  const queue = patients.filter(p => 
    (p.status === "Pending Doctor" || p.status === "Pending Triage" || p.status === "Unpaid") &&
    (clinicFilter === "All Clinics" || (p.triage?.clinic || "A&E") === clinicFilter)
  );

  const toggleSelect = (id) => {
    setSelectedPatients(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const clinics = ["All Clinics", "A&E", "Outpatient", "GOPD", "Specialist Clinic"];

  return (
    <div style={{ padding: 24, background: T.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: T.navy, margin: 0 }}>Triage/Procedure Time Schedule</h1>
          <p style={{ color: T.slateL, margin: "4px 0 0 0" }}>Manage patient flow and doctor assignments</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.slateL }}>Available Doctors</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: T.green }}>{DOCTORS.length}</div>
          </div>
          <div style={{ width: 1, background: T.border, margin: "0 12px" }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.slateL }}>Waiting Patients</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: T.red }}>{queue.length}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 24 }}>
        {/* Left Side: Patient Queue */}
        <div style={{ background: '#fff', borderRadius: 12, border: "1px solid " + T.border, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 16, borderBottom: "1px solid " + T.border, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: T.bg }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>Counter:</span>
              <select 
                value={clinicFilter}
                onChange={(e) => setClinicFilter(e.target.value)}
                style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid " + T.border, fontSize: 13, fontWeight: 600 }}
              >
                {clinics.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button 
              disabled={selectedPatients.length === 0 || !assignDoctor}
              style={{ ...BtnGreen, padding: "8px 16px", opacity: (selectedPatients.length === 0 || !assignDoctor) ? 0.5 : 1 }}
            >
              Forward To Doctor
            </button>
          </div>

          <div style={{ flex: 1, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: T.bg, borderBottom: "1px solid " + T.border }}>
                  <th style={{ padding: "12px 16px", textAlign: 'left', width: 40 }}>Sel</th>
                  <th style={{ padding: "12px 16px", textAlign: 'left', width: 40 }}>S/No</th>
                  <th style={{ padding: "12px 16px", textAlign: 'left' }}>Patient No</th>
                  <th style={{ padding: "12px 16px", textAlign: 'left' }}>Name</th>
                  <th style={{ padding: "12px 16px", textAlign: 'left' }}>Clinic</th>
                  <th style={{ padding: "12px 16px", textAlign: 'left' }}>Date In</th>
                  <th style={{ padding: "12px 16px", textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((p, idx) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid " + T.border, transition: '0.2s' }} className="hover-row">
                    <td style={{ padding: "12px 16px" }}>
                      <input 
                        type="checkbox" 
                        checked={selectedPatients.includes(p.id)}
                        onChange={() => toggleSelect(p.id)}
                      />
                    </td>
                    <td style={{ padding: "12px 16px", color: T.slateL }}>{idx + 1}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: T.navy }}>{p.mrn || p.id}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "4px 8px", background: T.bg, borderRadius: 4, fontSize: 11, fontWeight: 700, color: T.slate }}>
                        {p.triage?.clinic || "A&E"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: T.slateL }}>{p.registeredDate}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ 
                        padding: "4px 8px", 
                        borderRadius: 20, 
                        fontSize: 10, 
                        fontWeight: 800, 
                        textTransform: 'uppercase',
                        background: p.status === "Unpaid" ? T.red + "20" : T.green + "20",
                        color: p.status === "Unpaid" ? T.red : T.green
                      }}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {queue.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ padding: 48, textAlign: 'center', color: T.slateL }}>
                      No patients in queue for the selected clinic.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid " + T.border, background: T.bg, fontSize: 12, fontWeight: 700, color: T.slateL }}>
            Patient Count: {queue.length}
          </div>
        </div>

        {/* Right Side: Doctor Assignment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: T.navy, borderBottom: "2px solid " + T.navy, paddingBottom: 8 }}>
            Active Doctors
          </div>
          
          <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DOCTORS.map(doc => (
              <div 
                key={doc.id}
                onClick={() => setAssignDoctor(doc.id)}
                style={{ 
                  background: '#fff', 
                  borderRadius: 10, 
                  border: "2px solid " + (assignDoctor === doc.id ? T.green : T.border),
                  padding: 16,
                  cursor: 'pointer',
                  boxShadow: assignDoctor === doc.id ? "0 4px 12px " + T.green + "20" : "none",
                  transition: '0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.slateL, textTransform: 'uppercase' }}>Doctor</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: T.navy }}>{doc.name}</div>
                  </div>
                  <input 
                    type="radio" 
                    name="assignDoc" 
                    checked={assignDoctor === doc.id} 
                    onChange={() => setAssignDoctor(doc.id)}
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: "8px 0", borderTop: "1px solid " + T.border }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: 10, color: T.slateL }}>Seen</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: T.green }}>{doc.patientsSeen}</div>
                  </div>
                  <div style={{ width: 1, height: 20, background: T.border }} />
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: 10, color: T.slateL }}>Waiting</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: T.red }}>0</div>
                  </div>
                </div>

                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button style={{ ...BtnGhost, flex: 1, padding: "4px 0", fontSize: 10 }}>Freeze</button>
                  <button style={{ ...BtnGhost, flex: 1, padding: "4px 0", fontSize: 10 }}>Access</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: 16, background: T.bg, borderRadius: 10, border: "1px solid " + T.border }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: T.slateL }}>Doctor Count</span>
              <span style={{ fontWeight: 800 }}>{DOCTORS.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: T.slateL }}>Available</span>
              <span style={{ fontWeight: 800, color: T.green }}>{DOCTORS.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientFlow;
