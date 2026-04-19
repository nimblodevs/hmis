import { createContext, useContext, useState, useEffect } from "react";
import { SEED } from "../utils/hmsSeed";
import { timeNow, today, pad, genNo } from "../utils/hmsHelpers";

const PatientContext = createContext(null);

export function usePatients() {
  return useContext(PatientContext);
}

export function PatientProvider({ children }) {
  const [patients, setPatients] = useState(SEED);
  const [toast, setToast]       = useState(null);

  // ── Shifts & Cashiering ───────────────────────────────────────────────────
  const [shifts, setShifts] = useState(() => {
    const saved = localStorage.getItem("hmis_shifts");
    if (saved) return JSON.parse(saved);

    // Dummy data for testing filters and multi-user view
    return [
      {
        id: "SHF-260418-001",
        officer: "Officer John",
        float: 5000,
        openedAt: "2026-04-18T08:00:00.000Z",
        closedAt: "2026-04-18T16:30:00.000Z",
        receipts: [
          { id: "REC-260418-001", patientId: "MRN-1001", patient: "James Mwangi", age: 45, amount: 2500, method: "Cash", time: "2026-04-18T09:15:00.000Z", billNo: "BL-260418-001", cashier: "Officer John", shiftId: "SHF-260418-001", discount: 0, items: [{ name: "Consultation - GP", price: 1500, qty: 1 }, { name: "Lab: Malaria Test", price: 1000, qty: 1 }] },
          { id: "REC-260418-002", patientId: "MRN-1024", patient: "Amara Ochieng", age: 28, amount: 4500, method: "M-Pesa", time: "2026-04-18T10:45:00.000Z", billNo: "BL-260418-002", cashier: "Officer John", shiftId: "SHF-260418-001", discount: 500, items: [{ name: "Lab: Full Hemogram", price: 2500, qty: 1 }, { name: "X-Ray Chest", price: 2500, qty: 1 }] },
          { id: "REC-260418-003", patientId: "MRN-1055", patient: "Peter Odhiambo", age: 34, amount: 1200, method: "Cash", time: "2026-04-18T14:20:00.000Z", billNo: "BL-260418-003", cashier: "Officer John", shiftId: "SHF-260418-001", discount: 0, items: [{ name: "Pharmacy: Paracetamol", price: 200, qty: 1 }, { name: "Procedure: Dressing", price: 1000, qty: 1 }] },
        ]
      },
      {
        id: "SHF-260417-005",
        officer: "Officer Mary",
        float: 3000,
        openedAt: "2026-04-17T07:30:00.000Z",
        closedAt: "2026-04-17T17:00:00.000Z",
        receipts: [
          { id: "REC-260417-010", patientId: "MRN-2044", patient: "Esther Njoroge", age: 52, amount: 7500, method: "POS / Card", time: "2026-04-17T11:00:00.000Z", billNo: "BL-260417-010", cashier: "Officer Mary", shiftId: "SHF-260417-005", discount: 1000, items: [{ name: "Physiotherapy Session", price: 6000, qty: 1 }, { name: "Pharmacy: Multi-vitamins", price: 2500, qty: 1 }] },
          { id: "REC-260417-011", patientId: "MRN-2088", patient: "Fatuma Hassan", age: 19, amount: 3200, method: "Cash", time: "2026-04-17T15:30:00.000Z", billNo: "BL-260417-011", cashier: "Officer Mary", shiftId: "SHF-260417-005", discount: 0, items: [{ name: "Lab: Urinalysis", price: 1200, qty: 1 }, { name: "Lab: Blood Sugar", price: 2000, qty: 1 }] },
        ]
      },
      {
        id: "SHF-260415-002",
        officer: "Admin Sarah",
        float: 10000,
        openedAt: "2026-04-15T09:00:00.000Z",
        closedAt: "2026-04-15T13:00:00.000Z",
        receipts: [
          { id: "REC-260415-001", patientId: "MRN-3011", patient: "John Doe", age: 60, amount: 15000, method: "Cheque", time: "2026-04-15T10:00:00.000Z", billNo: "BL-260415-001", cashier: "Admin Sarah", shiftId: "SHF-260415-002", discount: 0, items: [{ name: "Inpatient Deposit", price: 15000, qty: 1 }] },
        ]
      },
      {
        id: "SHF-260419-001",
        officer: "Night Officer Ben",
        float: 2500,
        openedAt: "2026-04-19T00:00:00.000Z",
        closedAt: "2026-04-19T06:00:00.000Z",
        receipts: [
          { id: "REC-260419-001", patientId: "MRN-4050", patient: "Kelvin Kibet", age: 29, amount: 1800, method: "M-Pesa", time: "2026-04-19T02:30:00.000Z", billNo: "BL-260419-001", cashier: "Night Officer Ben", shiftId: "SHF-260419-001", discount: 0, items: [{ name: "ER: Emergency Consultation", price: 1500, qty: 1 }, { name: "Pharmacy: Painkillers", price: 300, qty: 1 }] },
          { id: "REC-260419-002", patientId: "MRN-4088", patient: "Sarah Waceke", age: 22, amount: 500, method: "Cash", time: "2026-04-19T04:15:00.000Z", billNo: "BL-260419-002", cashier: "Night Officer Ben", shiftId: "SHF-260419-001", discount: 0, items: [{ name: "Lab: Blood Type Test", price: 500, qty: 1 }] },
        ]
      }
    ];
  });

  const [activeShift, setActiveShift] = useState(() => {
    const saved = localStorage.getItem("hmis_active_shift");
    if (saved) return JSON.parse(saved);
    
    // Add a dummy active shift for multi-user view demonstration
    return {
      id: "SHF-260419-ACTIVE",
      officer: "Night Officer Ben",
      float: 2000,
      openedAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
      closedAt: null,
      receipts: [
        { id: "REC-ACT-001", patientId: "MRN-4001", patient: "Jane Smith", age: 24, amount: 1200, method: "Cash", time: new Date(Date.now() - 3600000 * 2).toISOString(), billNo: "BL-ACT-001", cashier: "Night Officer Ben", shiftId: "SHF-260419-ACTIVE", discount: 0, items: [{ name: "Consultation - GP", price: 1200, qty: 1 }] }
      ]
    };
  });

  // Persist shifts to localStorage
  useEffect(() => {
    localStorage.setItem("hmis_shifts", JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem("hmis_active_shift", JSON.stringify(activeShift));
  }, [activeShift]);

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const showToast = (title, msg, icon, cb) => setToast({ title, msg, icon, cb });
  const closeToast = () => {
    const cb = toast?.cb;
    setToast(null);
    if (cb) cb();
  };

  // ── Queue ──────────────────────────────────────────────────────────────────
  const addWalkIn = (name, phone) => {
    const seq = patients.length + 1;
    const np = {
      id: null, mrn: null, queueNo: "Q-" + pad(seq, 3), queueTime: timeNow(),
      name: name.trim(), phone: phone.trim(), registeredDate: today(), status: "Queued",
      firstName: null, lastName: null, dateOfBirth: null, gender: null, bloodGroup: null,
      category: null, triage: null, billing: null, clerking: null,
      consentTx: false, consentData: false,
    };
    setPatients(prev => [...prev, np]);
    return np;
  };

  // ── Triage ─────────────────────────────────────────────────────────────────
  const saveTriage = (queueNo, trForm, onDone) => {
    setPatients(prev =>
      prev.map(x => x.queueNo === queueNo ? { ...x, triage: { ...trForm }, status: "Triaged" } : x)
    );
    const p = patients.find(x => x.queueNo === queueNo);
    const name = p ? (p.firstName || p.name || queueNo) : queueNo;
    showToast("Triage Saved", name + " triaged successfully. Ready for registration.", "🩺", onDone);
  };

  // ── Registration ───────────────────────────────────────────────────────────
  const saveRegistration = (queueNo, reg, onDone) => {
    const seq = patients.findIndex(p => p.queueNo === queueNo) + 1;
    const id  = genNo("PAT-2026", seq);
    const mrn = genNo("MRN-2026", seq);
    setPatients(prev =>
      prev.map(x => x.queueNo === queueNo ? { ...x, ...reg, id, mrn, status: "Registered" } : x)
    );
    showToast("Registration Complete", id + " — " + reg.firstName + " " + reg.lastName + " registered.", "📝", onDone);
  };

  const registerDirect = (reg, onDone) => {
    const seq = patients.length + 1;
    const id  = genNo("PAT-2026", seq);
    const mrn = genNo("MRN-2026", seq);
    const np = {
      ...reg,
      id, mrn,
      queueNo: "D-" + pad(seq, 3), // D for Direct
      queueTime: timeNow(),
      registeredDate: today(),
      status: "Registered",
      triage: null, billing: null, clerking: null,
    };
    setPatients(prev => [...prev, np]);
    showToast("Manual Registration Complete", id + " — " + reg.firstName + " " + reg.lastName + " registered manually.", "📝", onDone);
  };

  // ── Billing ────────────────────────────────────────────────────────────────
  const saveBilling = (queueNo, { items, discount, method, note }, paid, onDone) => {
    const seq = patients.findIndex(p => p.queueNo === queueNo) + 1;
    const inv = genNo("INV-26", seq);
    const rec = paid ? genNo("REC-26", seq) : null;
    const billing = {
      invoiceNo: inv, receiptNo: rec, billedBy: "Cashier",
      billedAt: new Date().toISOString(), paid, method: paid ? method : "",
      items, discount, note,
    };
    setPatients(prev =>
      prev.map(x => x.queueNo === queueNo ? { ...x, billing, status: "Billed" } : x)
    );
    const total = items.reduce((s, i) => s + i.price * i.qty, 0) - discount;
    showToast(
      paid ? "Payment Confirmed" : "Invoice Saved",
      inv + " — KES " + Number(total).toLocaleString() + (paid ? " received via " + method : " invoice pending."),
      "💳",
      onDone
    );
  };

  // ── Doctor ─────────────────────────────────────────────────────────────────
  const saveClerking = (queueNo, clk, labSel, rxList, labUrg, labNote, onDone) => {
    const seq     = patients.findIndex(p => p.queueNo === queueNo) + 1;
    const consNo  = genNo("CONS-26", seq);
    const orders  = {
      lab: labSel.length ? { tests: labSel, urgency: labUrg, notes: labNote } : null,
      rx:  rxList.length ? { drugs: rxList } : null,
      rad: null, consult: null,
    };
    const newStatus = labSel.length ? "Lab Pending" : "Completed";
    setPatients(prev =>
      prev.map(x => {
        if (x.queueNo !== queueNo) return x;
        return {
          ...x, status: newStatus,
          clerking: {
            ...clk, consNo, orders, savedAt: new Date().toISOString(),
            labResults:      x.clerking?.labResults      || null,
            labNo:           x.clerking?.labNo           || null,
            labScientist:    x.clerking?.labScientist    || null,
            labCompletedAt:  x.clerking?.labCompletedAt  || null,
            rxNo:            x.clerking?.rxNo            || null,
            dispensed:       x.clerking?.dispensed       || false,
            pharmacist:      x.clerking?.pharmacist      || null,
            dispensedAt:     x.clerking?.dispensedAt     || null,
          },
        };
      })
    );
    const note = labSel.length ? labSel.length + " test(s) sent to lab." : "Encounter complete.";
    showToast("Clerking Saved", consNo + " — " + note, "🩻", onDone);
  };

  // ── Laboratory ─────────────────────────────────────────────────────────────
  const saveLabResults = (queueNo, labRes, labSci, onDone) => {
    const seq   = patients.findIndex(p => p.queueNo === queueNo) + 1;
    const labNo = genNo("LAB-26", seq);
    setPatients(prev =>
      prev.map(x => {
        if (x.queueNo !== queueNo) return x;
        return {
          ...x, status: "With Doctor (Post-Lab)",
          clerking: {
            ...x.clerking, labResults: labRes, labScientist: labSci,
            labNo, labCompletedAt: new Date().toISOString(),
          },
        };
      })
    );
    const p    = patients.find(x => x.queueNo === queueNo);
    const name = p ? ((p.firstName ? p.firstName + " " + p.lastName : p.name)) : queueNo;
    showToast("Results Ready", labNo + " — " + name + " sent back to doctor.", "🧪", onDone);
  };

  // ── Pharmacy ───────────────────────────────────────────────────────────────
  const dispense = (queueNo, pharmist, pharmChecks, pharmNotes, onDone) => {
    const seq  = patients.findIndex(p => p.queueNo === queueNo) + 1;
    const rxNo = genNo("RX-26", seq);
    setPatients(prev =>
      prev.map(x => {
        if (x.queueNo !== queueNo) return x;
        return {
          ...x,
          clerking: {
            ...x.clerking, dispensed: true, rxNo,
            dispensedAt: new Date().toISOString(),
            pharmacist: pharmist, pharmacyNotes: pharmNotes, dispensedChecks: pharmChecks,
          },
        };
      })
    );
    const p    = patients.find(x => x.queueNo === queueNo);
    const name = p ? ((p.firstName ? p.firstName + " " + p.lastName : p.name)) : queueNo;
    showToast("Prescription Dispensed", rxNo + " — All drugs for " + name + " dispensed.", "💊", onDone);
  };

  // ── Shifts ────────────────────────────────────────────────────────────────
  const openShift = (officer, float) => {
    const id = "SHF-" + new Date().toISOString().slice(2, 10).replace(/-/g, "") + "-" + pad(Math.floor(Math.random() * 999) + 1, 3);
    const newShift = {
      id,
      officer: officer.trim(),
      float: parseFloat(float) || 0,
      openedAt: new Date().toISOString(),
      closedAt: null,
      receipts: [],
    };
    setActiveShift(newShift);
    setShifts(prev => [newShift, ...prev]);
    return newShift;
  };

  const closeShift = (id) => {
    const closedAt = new Date().toISOString();
    setShifts(prev => prev.map(s => s.id === id ? { ...s, closedAt } : s));
    if (activeShift?.id === id) {
      setActiveShift(null);
    }
  };

  const recordReceipt = (shiftId, receipt) => {
    setShifts(prev => prev.map(s => 
      s.id === shiftId ? { ...s, receipts: [...s.receipts, receipt] } : s
    ));
    // Also update active shift if it matches
    if (activeShift?.id === shiftId) {
      setActiveShift(prev => ({ ...prev, receipts: [...prev.receipts, receipt] }));
    }
  };

  return (
    <PatientContext.Provider value={{
      patients, setPatients,
      toast, showToast, closeToast,
      shifts, setShifts,
      activeShift, setActiveShift,
      openShift, closeShift, recordReceipt,
      addWalkIn,
      saveTriage,
      saveRegistration,
      registerDirect,
      saveBilling,
      saveClerking,
      saveLabResults,
      dispense,
    }}>
      {children}
    </PatientContext.Provider>
  );
}
