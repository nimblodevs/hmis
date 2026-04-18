import { createContext, useContext, useState } from "react";
import { SEED } from "../utils/hmsSeed";
import { timeNow, today, pad, genNo } from "../utils/hmsHelpers";

const PatientContext = createContext(null);

export function usePatients() {
  return useContext(PatientContext);
}

export function PatientProvider({ children }) {
  const [patients, setPatients] = useState(SEED);
  const [toast, setToast]       = useState(null);

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

  return (
    <PatientContext.Provider value={{
      patients,
      toast, showToast, closeToast,
      addWalkIn,
      saveTriage,
      saveRegistration,
      saveBilling,
      saveClerking,
      saveLabResults,
      dispense,
    }}>
      {children}
    </PatientContext.Provider>
  );
}
