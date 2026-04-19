import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../../../context/PatientContext';
import HMSLayout from '../../../components/layout/HMSLayout';
import HMSTopBar from '../../../components/layout/HMSTopBar';
import {
  Card, Sec, FL, ErrBox, EmptyState,
  BtnGreen, BtnRed, BtnGhost, IS,
} from '../../../components/common/HMSComponents';
import { T, HOSPITAL_INFO } from '../../../utils/hmsConstants';
import { fmtKES, pad, calcAge, printReceipt } from '../../../utils/hmsHelpers';
import { useBreakpoint } from '../../../hooks/useBreakpoint';

// ─── Method config ────────────────────────────────────────────────────────────
const METHODS = ["Cash", "M-Pesa", "POS / Card", "Cheque"];
const M_ICON = { "Cash": "💵", "M-Pesa": "📱", "POS / Card": "💳", "Cheque": "📄" };
const M_COLOR = {
  "Cash": { col: "#15803d", bg: "#f0fdf4", bd: "#86efac" },
  "M-Pesa": { col: "#0369a1", bg: "#eff6ff", bd: "#bfdbfe" },
  "POS / Card": { col: "#7c3aed", bg: "#f5f3ff", bd: "#ddd6fe" },
  "Cheque": { col: "#b45309", bg: "#fffbeb", bd: "#fcd34d" },
};

// Item category labels
const CAT_LABEL = {
  consultation: "Consultation",
  procedure: "Procedure",
  lab: "Laboratory",
  radiology: "Radiology",
  pharmacy: "Pharmacy",
  other: "Other",
};
const CAT_COLOR = {
  consultation: { bg: "#eff6ff", col: "#1e40af", bd: "#bfdbfe" },
  procedure: { bg: "#f0fdf4", col: "#166534", bd: "#bbf7d0" },
  lab: { bg: "#fdf4ff", col: "#7e22ce", bd: "#e9d5ff" },
  radiology: { bg: "#fff7ed", col: "#9a3412", bd: "#fed7aa" },
  pharmacy: { bg: "#ecfdf5", col: "#065f46", bd: "#6ee7b7" },
  other: { bg: "#f8fafc", col: "#475569", bd: "#e2e8f0" },
};

// ─── Inline styles ────────────────────────────────────────────────────────────
const FONT = "'Outfit', sans-serif";
const MONO = "'DM Mono', monospace";
const inputBase = {
  width: "100%", padding: "9px 12px", borderRadius: 8, fontFamily: FONT,
  fontSize: 13, outline: "none", boxSizing: "border-box", border: "1.5px solid " + T.border,
  background: "#fff", transition: "border-color .15s",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CashierReceipting() {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const { patients, setPatients, activeShift, closeShift, recordReceipt } = usePatients();

  const [tab, setTab] = useState("pending");
  const [selectedBills, setSelectedBills] = useState([]);
  const [rxMethod, setRxMethod] = useState("Cash");
  const [rxRef, setRxRef] = useState("");
  const [rxBank, setRxBank] = useState("");   // ← NEW: bank name
  const [rxAmount, setRxAmount] = useState("");   // ← NEW: amount confirmation
  const [rxErr, setRxErr] = useState("");
  const [duration, setDuration] = useState("");
  const [endConfirm, setEndConfirm] = useState(false);

  // ── Shift timer ──
  useEffect(function () {
    if (!activeShift) return;
    var itv = setInterval(function () {
      var diff = Date.now() - new Date(activeShift.openedAt).getTime();
      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      setDuration(pad(h, 2) + ":" + pad(m, 2) + ":" + pad(s, 2));
    }, 1000);
    return function () { clearInterval(itv); };
  }, [activeShift]);

  // ── Redirect if no active shift ──
  useEffect(function () {
    if (!activeShift) navigate("/hms/cashier");
  }, [activeShift, navigate]);

  // ── Data ──
  const allBills = useMemo(function () {
    if (!patients) return [];
    return patients
      .filter(function (p) { return p.billing && p.category === "Cash"; })
      .map(function (p) {
        return {
          patient: p,
          billing: p.billing,
          depts: [
            p.billing.items.some(function (i) { return i.cat === "consultation" || i.cat === "procedure"; }) && "Consultation",
            p.billing.items.some(function (i) { return i.cat === "lab"; }) && "Laboratory",
            p.billing.items.some(function (i) { return i.cat === "radiology"; }) && "Radiology",
            p.billing.items.some(function (i) { return i.cat === "pharmacy"; }) && "Pharmacy",
          ].filter(Boolean),
        };
      });
  }, [patients]);

  const pendingBills = useMemo(function () { return allBills.filter(function (b) { return !b.billing.paid; }); }, [allBills]);
  const shiftReceipts = useMemo(function () { return activeShift?.receipts || []; }, [activeShift]);

  // ── Totals ──
  var shiftTotal = shiftReceipts.reduce(function (s, r) { return s + r.amount; }, 0);
  var cashTotal = shiftReceipts.filter(function (r) { return r.method === "Cash"; }).reduce(function (s, r) { return s + r.amount; }, 0);
  var mpesaTotal = shiftReceipts.filter(function (r) { return r.method === "M-Pesa"; }).reduce(function (s, r) { return s + r.amount; }, 0);
  var cardTotal = shiftReceipts.filter(function (r) { return r.method === "POS / Card"; }).reduce(function (s, r) { return s + r.amount; }, 0);
  var chequeTotal = shiftReceipts.filter(function (r) { return r.method === "Cheque"; }).reduce(function (s, r) { return s + r.amount; }, 0);

  var selectedTotal = selectedBills.reduce(function (s, b) {
    return s + b.billing.items.reduce(function (a, i) { return a + i.price * i.qty; }, 0) - (b.billing.discount || 0);
  }, 0);

  // Parsed amount entered by cashier
  var enteredAmount = parseFloat(rxAmount) || 0;
  var amountMatch = Math.abs(enteredAmount - selectedTotal) < 0.01;
  var amountShort = enteredAmount < selectedTotal;

  // ── Toggle bill selection ──
  function toggleBill(b) {
    var billId = b.billing.invoiceNo || b.billing.billNo;
    setSelectedBills(function (prev) {
      var idx = prev.findIndex(function (x) { return (x.billing.invoiceNo || x.billing.billNo) === billId; });
      return idx > -1 ? prev.filter(function (_, i) { return i !== idx; }) : [...prev, b];
    });
    setRxErr("");
    setRxAmount("");
  }

  // ── Receipt handler ──
  function handleReceipt() {
    if (!selectedBills.length) return;
    if (!rxMethod) { setRxErr("Select a payment method."); return; }

    // Amount confirmation validation
    if (!rxAmount.trim()) { setRxErr("Enter the amount received from patient."); return; }
    if (isNaN(parseFloat(rxAmount))) { setRxErr("Enter a valid numeric amount."); return; }
    if (parseFloat(rxAmount) < selectedTotal) {
      setRxErr("Amount received (" + fmtKES(parseFloat(rxAmount)) + ") is less than the bill total (" + fmtKES(selectedTotal) + ")."); return;
    }

    if (["M-Pesa", "POS / Card", "Cheque"].includes(rxMethod) && !rxRef.trim()) {
      setRxErr("Reference / transaction number required for " + rxMethod + "."); return;
    }
    if (["POS / Card", "Cheque"].includes(rxMethod) && !rxBank.trim()) {
      setRxErr("Bank name is required for " + rxMethod + "."); return;
    }

    var seq = patients.findIndex(function (p) { return p.queueNo === selectedBills[0].patient.queueNo; }) + 1;
    var recNo = "REC-" + new Date().toISOString().slice(2, 10).replace(/-/g, "") + "-" + pad(seq > 0 ? seq : Math.floor(Math.random() * 1000), 3);
    var now = new Date().toISOString();

    var grandTotal = 0;
    var combinedItems = [];
    var billNos = [];
    var totalDiscount = 0;

    selectedBills.forEach(function (b) {
      var total = b.billing.items.reduce(function (s, i) { return s + i.price * i.qty; }, 0) - (b.billing.discount || 0);
      grandTotal += total;
      totalDiscount += (b.billing.discount || 0);
      combinedItems = combinedItems.concat(b.billing.items);
      if (b.billing.invoiceNo || b.billing.billNo) {
        billNos.push(b.billing.invoiceNo || b.billing.billNo);
      }
    });

    var first = selectedBills[0];
    var pName = ((first.patient.firstName || first.patient.name) || "") + " " + ((first.patient.lastName) || "");
    var pId = first.patient.patientNo || first.patient.id || first.patient.queueNo;
    var pAge = calcAge(first.patient.dateOfBirth || first.patient.dob);

    recordReceipt(activeShift.id, {
      id: recNo,
      billNo: billNos.join(", "),
      patient: pName.trim(),
      queueNo: first.patient.queueNo,
      patientId: pId,
      amount: grandTotal,
      amountReceived: parseFloat(rxAmount),
      change: parseFloat(rxAmount) - grandTotal,
      method: rxMethod,
      ref: rxRef.trim(),
      bank: rxBank.trim(),
      time: now,
      cashier: activeShift.officer,
      items: combinedItems,
      age: pAge,
      discount: totalDiscount,
      shiftId: activeShift.id,
      depts: Array.from(new Set(selectedBills.flatMap(function (b) { return b.depts; }))),
    });

    setPatients(function (prev) {
      return prev.map(function (p) {
        var matched = selectedBills.some(function (b) { return b.patient.queueNo === p.queueNo; });
        if (!matched) return p;
        return { ...p, billing: { ...p.billing, paid: true, method: rxMethod, receiptNo: recNo, paidAt: now } };
      });
    });

    setSelectedBills([]); setRxRef(""); setRxBank(""); setRxAmount(""); setRxErr("");
  }

  // ── End shift ──
  function handleEndShift() {
    closeShift(activeShift.id);
    navigate("/hms/cashier");
  }

  // ── Clear form when method changes ──
  function handleMethodChange(m) {
    setRxMethod(m);
    setRxRef("");
    setRxBank("");
    setRxErr("");
  }

  if (!activeShift) return null;

  // ── Flattened items from selected bills for the breakdown panel ──
  var allSelectedItems = selectedBills.flatMap(function (b) {
    return b.billing.items.map(function (it) {
      return { ...it, _billId: b.billing.invoiceNo || b.billing.billNo };
    });
  });

  // Change calculation (for Cash only, when amount > bill)
  var changeAmount = enteredAmount > selectedTotal ? enteredAmount - selectedTotal : 0;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <HMSLayout>
      {/* ── Top Bar ── */}
      <HMSTopBar
        title={activeShift.officer}
        subtitle={"Shift: " + activeShift.id + " · ⏱ " + duration + " · Cash patients only"}
        action={
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{
              background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 9,
              padding: "6px 14px", fontSize: 12, fontWeight: 700, color: T.green, fontFamily: MONO
            }}>
              💰 {fmtKES(shiftTotal)}
            </div>
            <button onClick={function () { navigate("/hms/cashier"); }} style={{ ...BtnGhost, fontSize: 12 }}>
              Dashboard
            </button>
            <button onClick={function () { setEndConfirm(true); }} style={{ ...BtnRed, fontSize: 12 }}>
              🔴 End Shift
            </button>
          </div>
        }
      />

      <div style={{ padding: isMobile ? "14px" : "20px 24px" }}>

        {/* ── Summary Cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(5,1fr)",
          gap: 10, marginBottom: 20
        }}>
          {[
            ["Total", shiftTotal, T.navy, "#e2e8f0", "💰"],
            ["Cash", cashTotal, T.green, "#f0fdf4", "💵"],
            ["M-Pesa", mpesaTotal, "#0369a1", "#eff6ff", "📱"],
            ["POS / Card", cardTotal, T.purple, "#f5f3ff", "💳"],
            ["Cheque", chequeTotal, T.amber, "#fffbeb", "📄"],
          ].map(function (item) {
            var lbl = item[0], amt = item[1], col = item[2], bg = item[3], icon = item[4];
            return (
              <div key={lbl} style={{
                background: T.card, borderRadius: 11, padding: "13px 15px",
                boxShadow: "0 1px 6px rgba(0,0,0,.05)", border: "1px solid " + T.border,
                display: "flex", alignItems: "center", gap: 10
              }}>
                <div style={{
                  width: 36, height: 36, background: bg, borderRadius: 9, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17
                }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: col, lineHeight: 1, fontFamily: MONO }}>
                    {fmtKES(amt)}
                  </div>
                  <div style={{ fontSize: 10, color: T.slateL, marginTop: 2 }}>{lbl}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Tabs ── */}
        <div style={{
          display: "flex", background: T.card, borderRadius: 12, overflow: "hidden",
          marginBottom: 20, border: "1px solid " + T.border
        }}>
          {[
            ["pending", "📋 Pending Bills (" + pendingBills.length + ")"],
            ["receipted", "✅ Receipted Today (" + shiftReceipts.length + ")"],
          ].map(function (item) {
            var k = item[0], lbl = item[1];
            return (
              <button key={k} onClick={function () { setTab(k); }}
                style={{
                  flex: 1, padding: "13px", border: "none", cursor: "pointer", fontFamily: FONT,
                  fontSize: 13, fontWeight: tab === k ? 700 : 400, transition: "all .15s",
                  background: tab === k ? "#f0f9ff" : "transparent",
                  color: tab === k ? "#0369a1" : T.slateL,
                  borderBottom: tab === k ? "3px solid #0369a1" : "3px solid transparent"
                }}>
                {lbl}
              </button>
            );
          })}
        </div>

        {/* ── Content Grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 400px",
          gap: 20, alignItems: "start"
        }}>

          {/* ── LEFT: Table ── */}
          <div>
            {tab === "pending" ? (
              pendingBills.length === 0
                ? <EmptyState icon="📋" msg="No bills pending receipt." />
                : (
                  <div style={{ background: T.card, borderRadius: 12, border: "1px solid " + T.border, overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid " + T.border }}>
                          {["", "Time", "Bill No", "Patient ID", "Patient", "Departments", "Amount", "Billed By"].map(function (th) {
                            return (
                              <th key={th} style={{
                                padding: "11px 14px", fontSize: 10, fontWeight: 700,
                                color: T.slate, textTransform: "uppercase", letterSpacing: .6,
                                whiteSpace: "nowrap", fontFamily: FONT
                              }}>
                                {th}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {pendingBills.map(function (b) {
                          var billId = b.billing.invoiceNo || b.billing.billNo;
                          var total = b.billing.items.reduce(function (s, i) { return s + i.price * i.qty; }, 0) - (b.billing.discount || 0);
                          var isSel = selectedBills.some(function (x) { return (x.billing.invoiceNo || x.billing.billNo) === billId; });
                          return (
                            <tr key={billId}
                              onClick={function () { toggleBill(b); }}
                              style={{
                                borderBottom: "1px solid " + T.border, cursor: "pointer",
                                background: isSel ? "#eff6ff" : "#fff", transition: "background .12s"
                              }}>
                              <td style={{ padding: "11px 14px", width: 36 }}>
                                <input type="checkbox" readOnly checked={isSel}
                                  style={{ cursor: "pointer", width: 16, height: 16, accentColor: T.navy }} />
                              </td>
                              <td style={{ padding: "11px 14px", fontSize: 12, color: T.slate, whiteSpace: "nowrap" }}>
                                {b.billing.billedAt
                                  ? new Date(b.billing.billedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                  : "—"}
                              </td>
                              <td style={{ padding: "11px 14px", fontSize: 12, fontWeight: 700, fontFamily: MONO, color: T.blue, whiteSpace: "nowrap" }}>
                                {billId || "—"}
                              </td>
                              <td style={{ padding: "11px 14px", fontSize: 11, color: T.slateL, fontFamily: MONO }}>
                                {b.patient.patientNo || b.patient.id || "—"}
                              </td>
                              <td style={{ padding: "11px 14px" }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: T.navy, whiteSpace: "nowrap" }}>
                                  {b.patient.firstName || b.patient.name} {b.patient.lastName || ""}
                                </div>
                                <div style={{ fontSize: 10, color: T.slateL, fontFamily: MONO, marginTop: 1 }}>
                                  {b.patient.queueNo}
                                </div>
                              </td>
                              <td style={{ padding: "11px 14px" }}>
                                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                  {b.depts.map(function (d) {
                                    return (
                                      <span key={d} style={{
                                        background: "#f1f5f9", color: T.slate,
                                        borderRadius: 4, padding: "1px 7px", fontSize: 10, fontWeight: 600, whiteSpace: "nowrap"
                                      }}>
                                        {d}
                                      </span>
                                    );
                                  })}
                                </div>
                              </td>
                              <td style={{ padding: "11px 14px", fontSize: 14, fontWeight: 800, color: T.navy, fontFamily: MONO, whiteSpace: "nowrap" }}>
                                {fmtKES(total)}
                                {(b.billing.discount > 0) && (
                                  <div style={{ fontSize: 10, color: T.red, fontWeight: 600, marginTop: 1 }}>
                                    -{fmtKES(b.billing.discount)} disc.
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: "11px 14px", fontSize: 12, color: T.slateL }}>
                                {b.billing.billedBy || "System"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
            ) : (
              /* ── Receipted Today table ── */
              shiftReceipts.length === 0
                ? <EmptyState icon="✅" msg="No receipts issued this shift yet." />
                : (
                  <div style={{ background: T.card, borderRadius: 12, border: "1px solid " + T.border, overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid " + T.border }}>
                          {["Time", "Receipt No", "Bill No", "Patient ID", "Patient", "Method", "Reference", "Amount", "Served By", ""].map(function (th) {
                            return (
                              <th key={th} style={{
                                padding: "11px 14px", fontSize: 10, fontWeight: 700,
                                color: T.slate, textTransform: "uppercase", letterSpacing: .6,
                                whiteSpace: "nowrap", fontFamily: FONT
                              }}>
                                {th}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {shiftReceipts.slice().reverse().map(function (r) {
                          var mc = M_COLOR[r.method] || { col: T.slate, bg: "#f1f5f9", bd: T.border };
                          return (
                            <tr key={r.id} style={{ borderBottom: "1px solid " + T.border, background: "#fff" }}>
                              <td style={{ padding: "11px 14px", fontSize: 12, color: T.slate, whiteSpace: "nowrap" }}>
                                {new Date(r.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </td>
                              <td style={{ padding: "11px 14px", fontSize: 12, fontWeight: 700, fontFamily: MONO, color: T.green, whiteSpace: "nowrap" }}>
                                {r.id}
                              </td>
                              <td style={{ padding: "11px 14px", fontSize: 11, fontFamily: MONO, color: T.slateL }}>
                                {r.billNo || r.invoiceNo || "—"}
                              </td>
                              <td style={{ padding: "11px 14px", fontSize: 11, color: T.slateL, fontFamily: MONO }}>
                                {r.patientId || "—"}
                              </td>
                              <td style={{ padding: "11px 14px" }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: T.navy, whiteSpace: "nowrap" }}>{r.patient}</div>
                                <div style={{ fontSize: 10, color: T.slateL, fontFamily: MONO, marginTop: 1 }}>{r.queueNo || ""}</div>
                              </td>
                              <td style={{ padding: "11px 14px" }}>
                                <span style={{
                                  background: mc.bg, color: mc.col, border: "1px solid " + mc.bd,
                                  borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 700,
                                  whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 4
                                }}>
                                  {M_ICON[r.method]} {r.method}
                                </span>
                              </td>
                              <td style={{ padding: "11px 14px", fontSize: 11, color: T.slateL, fontFamily: MONO }}>
                                {r.ref || "—"}
                              </td>
                              <td style={{ padding: "11px 14px", fontSize: 14, fontWeight: 800, color: T.green, fontFamily: MONO, whiteSpace: "nowrap" }}>
                                {fmtKES(r.amount)}
                              </td>
                              <td style={{ padding: "11px 14px", fontSize: 12, color: T.slate }}>{r.cashier}</td>
                              <td style={{ padding: "11px 14px" }}>
                                <button onClick={function () { printReceipt(r, HOSPITAL_INFO); }}
                                  style={{ ...BtnGhost, padding: "5px 10px", fontSize: 11 }}>
                                  🖨️ Print
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        <tr style={{ background: "#f8fafc", borderTop: "2px solid " + T.border }}>
                          <td colSpan={6} style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: T.slate }}>
                            {shiftReceipts.length} transaction{shiftReceipts.length !== 1 ? "s" : ""} this shift
                          </td>
                          <td colSpan={2} style={{ padding: "10px 14px", fontSize: 15, fontWeight: 900, color: T.navy, fontFamily: MONO, textAlign: "right" }}>
                            {fmtKES(shiftTotal)}
                          </td>
                          <td colSpan={2} />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )
            )}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div style={{ position: "sticky", top: 70 }}>
            {tab === "pending" ? (
              /* ── Enhanced Payment Form ── */
              <Card>
                {selectedBills.length > 0 ? (
                  <>
                    {/* ── Header: bill & patient info ── */}
                    <div style={{
                      background: "linear-gradient(135deg," + T.navy + "," + T.navyL + ")",
                      borderRadius: 10, padding: "16px", marginBottom: 14
                    }}>
                      <div style={{
                        fontSize: 9, color: "rgba(255,255,255,.45)", fontFamily: MONO,
                        textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4
                      }}>
                        {selectedBills.length} Bill{selectedBills.length > 1 ? "s" : ""} Selected
                      </div>
                      <div style={{ fontSize: 26, fontWeight: 900, fontFamily: MONO, color: "#00bcd4", lineHeight: 1 }}>
                        {fmtKES(selectedTotal)}
                      </div>
                      <div style={{ fontSize: 12, marginTop: 8, color: "rgba(255,255,255,.6)", lineHeight: 1.5 }}>
                        {Array.from(new Set(selectedBills.map(function (b) {
                          return (b.patient.firstName || b.patient.name) + " " + (b.patient.lastName || "");
                        }))).join(", ")}
                      </div>
                      {/* Bill IDs row */}
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,.15)" }}>
                        {selectedBills.map(function (b) {
                          var billId = b.billing.invoiceNo || b.billing.billNo;
                          var total = b.billing.items.reduce(function (s, i) { return s + i.price * i.qty; }, 0) - (b.billing.discount || 0);
                          return (
                            <div key={billId} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11 }}>
                              <span style={{ color: "rgba(255,255,255,.65)", fontFamily: MONO }}>{billId}</span>
                              <span style={{ color: "#fff", fontWeight: 700, fontFamily: MONO }}>{fmtKES(total)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ── Bill Items Breakdown ── */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{
                        fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                        letterSpacing: ".07em", color: T.slateL, marginBottom: 8
                      }}>
                        Bill Items
                      </div>
                      <div style={{
                        border: "1px solid " + T.border, borderRadius: 10,
                        maxHeight: 220, overflowY: "auto",
                        background: "#fafbfc",
                      }}>
                        {allSelectedItems.map(function (it, idx) {
                          var cc = CAT_COLOR[it.cat] || CAT_COLOR.other;
                          var lbl = CAT_LABEL[it.cat] || "Other";
                          var lineTotal = it.price * it.qty;
                          return (
                            <div key={idx} style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "8px 12px", gap: 8,
                              borderBottom: idx < allSelectedItems.length - 1 ? "1px solid #f1f5f9" : "none",
                              background: idx % 2 === 0 ? "#fff" : "#fafbfc",
                            }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: T.navy, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {it.qty > 1 && (
                                    <span style={{
                                      fontSize: 10, fontWeight: 700, color: "#fff",
                                      background: T.navy, borderRadius: 4,
                                      padding: "0 5px", marginRight: 5, fontFamily: MONO,
                                    }}>
                                      ×{it.qty}
                                    </span>
                                  )}
                                  {it.name}
                                </div>
                                <span style={{
                                  display: "inline-block", marginTop: 3,
                                  fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em",
                                  background: cc.bg, color: cc.col, border: "1px solid " + cc.bd,
                                  borderRadius: 4, padding: "1px 6px",
                                }}>
                                  {lbl}
                                </span>
                              </div>
                              <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 800, color: T.navy, fontFamily: MONO }}>
                                  {fmtKES(lineTotal)}
                                </div>
                                {it.qty > 1 && (
                                  <div style={{ fontSize: 10, color: T.slateL, fontFamily: MONO }}>
                                    {fmtKES(it.price)} ea.
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* Subtotal / discount / total footer inside items box */}
                        <div style={{
                          borderTop: "2px solid " + T.border,
                          background: "#f8fafc", padding: "10px 12px",
                          display: "flex", flexDirection: "column", gap: 5,
                        }}>
                          {selectedBills.some(function (b) { return b.billing.discount > 0; }) && (
                            <>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                                <span style={{ color: T.slateL }}>Subtotal</span>
                                <span style={{ fontFamily: MONO, fontWeight: 600 }}>
                                  {fmtKES(selectedTotal + selectedBills.reduce(function (s, b) { return s + (b.billing.discount || 0); }, 0))}
                                </span>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                                <span style={{ color: T.red }}>Discount</span>
                                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.red }}>
                                  -{fmtKES(selectedBills.reduce(function (s, b) { return s + (b.billing.discount || 0); }, 0))}
                                </span>
                              </div>
                            </>
                          )}
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                            <span style={{ fontWeight: 800, color: T.navy }}>Total Due</span>
                            <span style={{ fontFamily: MONO, fontWeight: 900, color: T.navy }}>{fmtKES(selectedTotal)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <ErrBox msg={rxErr} />

                    {/* ── Method selector ── */}
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.slate, marginBottom: 8 }}>
                      Payment Method
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                      {METHODS.map(function (m) {
                        var sel = rxMethod === m;
                        var mc = M_COLOR[m];
                        return (
                          <button key={m} onClick={function () { handleMethodChange(m); }}
                            style={{
                              padding: "10px 8px", borderRadius: 9, cursor: "pointer", fontFamily: FONT,
                              border: "1.5px solid " + (sel ? mc.bd : T.border),
                              background: sel ? mc.bg : "#fff", color: sel ? mc.col : T.slate,
                              fontSize: 12, fontWeight: sel ? 700 : 400,
                              display: "flex", alignItems: "center", gap: 7, transition: "all .12s"
                            }}>
                            <span style={{ fontSize: 18 }}>{M_ICON[m]}</span>
                            {m}
                          </button>
                        );
                      })}
                    </div>

                    {/* ── Reference field (non-cash) ── */}
                    {["M-Pesa", "POS / Card", "Cheque"].includes(rxMethod) && (
                      <div style={{ marginBottom: 10 }}>
                        <FL label={rxMethod === "M-Pesa" ? "M-Pesa Code *" : rxMethod === "Cheque" ? "Cheque Number *" : "POS Approval Code *"} ch={
                          <input value={rxRef} onChange={function (e) { setRxRef(e.target.value); }}
                            placeholder={rxMethod === "M-Pesa" ? "e.g. QA12345678" : rxMethod === "Cheque" ? "e.g. 001234" : "e.g. 447821"}
                            style={{
                              ...inputBase,
                              borderColor: (!rxRef && rxErr) ? "#fca5a5" : T.border,
                              background: (!rxRef && rxErr) ? "#fef2f2" : "#fff",
                              fontFamily: MONO, fontWeight: 600
                            }} />
                        } />
                      </div>
                    )}

                    {/* ── Bank Name field (POS / Card and Cheque only) ── */}
                    {["POS / Card", "Cheque"].includes(rxMethod) && (
                      <div style={{ marginBottom: 14 }}>
                        <FL label="Bank Name *" ch={
                          <input
                            value={rxBank}
                            onChange={function (e) { setRxBank(e.target.value); }}
                            placeholder={rxMethod === "Cheque" ? "e.g. Equity Bank" : "e.g. KCB Bank"}
                            style={{
                              ...inputBase,
                              borderColor: (!rxBank && rxErr) ? "#fca5a5" : T.border,
                              background: (!rxBank && rxErr) ? "#fef2f2" : "#fff",
                            }}
                          />
                        } />
                      </div>
                    )}

                    {/* ── Amount Received ── */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: T.slate, marginBottom: 6 }}>
                        Amount Received (KES) *
                      </div>
                      <div style={{ position: "relative" }}>
                        <span style={{
                          position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                          fontSize: 12, fontWeight: 700, color: T.slateL, fontFamily: MONO,
                          pointerEvents: "none",
                        }}>
                          KES
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={rxAmount}
                          onChange={function (e) { setRxAmount(e.target.value); setRxErr(""); }}
                          placeholder={"0.00"}
                          style={{
                            ...inputBase,
                            paddingLeft: 46,
                            fontFamily: MONO,
                            fontSize: 16,
                            fontWeight: 800,
                            borderColor: rxAmount
                              ? amountMatch
                                ? "#86efac"
                                : amountShort
                                  ? "#fca5a5"
                                  : "#86efac"    /* overpaid: still fine */
                              : T.border,
                            background: rxAmount
                              ? amountShort
                                ? "#fef2f2"
                                : "#f0fdf4"
                              : "#fff",
                            color: rxAmount
                              ? amountShort ? "#dc2626" : "#15803d"
                              : T.navy,
                          }}
                        />
                      </div>

                      {/* Live feedback row */}
                      {rxAmount && !isNaN(parseFloat(rxAmount)) && (
                        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                          {/* Balance due / change */}
                          {amountShort ? (
                            <div style={{
                              display: "flex", justifyContent: "space-between", alignItems: "center",
                              background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8,
                              padding: "7px 12px",
                            }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#dc2626" }}>⚠  Due Amount</span>
                              <span style={{ fontFamily: MONO, fontWeight: 900, fontSize: 13, color: "#dc2626" }}>
                                {fmtKES(selectedTotal - enteredAmount)}
                              </span>
                            </div>
                          ) : changeAmount > 0 ? (
                            <div style={{
                              display: "flex", justifyContent: "space-between", alignItems: "center",
                              background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8,
                              padding: "7px 12px",
                            }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#b45309" }}>💴 Change to Return</span>
                              <span style={{ fontFamily: MONO, fontWeight: 900, fontSize: 13, color: "#b45309" }}>
                                {fmtKES(changeAmount)}
                              </span>
                            </div>
                          ) : (
                            <div style={{
                              display: "flex", justifyContent: "space-between", alignItems: "center",
                              background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8,
                              padding: "7px 12px",
                            }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#15803d" }}>✅ Amount Matches Receipt Total</span>
                              <span style={{ fontFamily: MONO, fontWeight: 900, fontSize: 13, color: "#15803d" }}>
                                {fmtKES(selectedTotal)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ── Actions ── */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={function () { setSelectedBills([]); setRxErr(""); setRxAmount(""); setRxBank(""); }}
                        style={{ ...BtnGhost, flex: 1 }}>
                        Cancel
                      </button>
                      <button
                        onClick={handleReceipt}
                        disabled={!!amountShort && !!rxAmount}
                        style={{
                          ...BtnGreen, flex: 2,
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          opacity: (amountShort && rxAmount) ? 0.5 : 1,
                          cursor: (amountShort && rxAmount) ? "not-allowed" : "pointer",
                        }}>
                        ✅ Confirm Receipt
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "36px 0", color: T.slateL }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>👆</div>
                    <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                      Select one or more pending bills<br />to process payment
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              /* ── Shift Collection Summary panel ── */
              <div>
                <div style={{
                  background: "linear-gradient(135deg," + T.navy + "," + T.navyL + ")",
                  borderRadius: 13, padding: "20px", marginBottom: 14,
                  boxShadow: "0 4px 16px rgba(7,24,40,.25)"
                }}>
                  <div style={{
                    fontSize: 9, color: "rgba(255,255,255,.4)", fontFamily: MONO,
                    textTransform: "uppercase", letterSpacing: 2, marginBottom: 8
                  }}>
                    Shift Collection Summary
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, fontFamily: MONO, color: "#00bcd4", lineHeight: 1 }}>
                    {fmtKES(shiftTotal)}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)", marginTop: 6 }}>
                    Total collected · excluding float
                  </div>
                  <div style={{
                    marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.12)",
                    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10
                  }}>
                    {[
                      ["Opening Float", activeShift.float || 0, T.cyan],
                      ["Expected Cash", (activeShift.float || 0) + cashTotal, "#86efac"],
                    ].map(function (item) {
                      var lbl = item[0], val = item[1], col = item[2];
                      return (
                        <div key={lbl}>
                          <div style={{
                            fontSize: 9, color: "rgba(255,255,255,.35)", letterSpacing: 1,
                            textTransform: "uppercase", fontFamily: MONO, marginBottom: 3
                          }}>{lbl}</div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: col, fontFamily: MONO }}>{fmtKES(val)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Card mb={14}>
                  <Sec accent={T.teal}>Breakdown by Method</Sec>
                  {METHODS.map(function (m) {
                    var amt = shiftReceipts.filter(function (r) { return r.method === m; }).reduce(function (s, r) { return s + r.amount; }, 0);
                    var cnt = shiftReceipts.filter(function (r) { return r.method === m; }).length;
                    var mc = M_COLOR[m];
                    return (
                      <div key={m} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px 12px", borderRadius: 9, marginBottom: 8,
                        background: amt > 0 ? mc.bg : "#f8fafc",
                        border: "1px solid " + (amt > 0 ? mc.bd : T.border),
                        opacity: amt > 0 ? 1 : .55
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 20 }}>{M_ICON[m]}</span>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: amt > 0 ? mc.col : T.slateL }}>{m}</div>
                            <div style={{ fontSize: 10, color: T.slateL }}>{cnt} transaction{cnt !== 1 ? "s" : ""}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: amt > 0 ? mc.col : T.slateL, fontFamily: MONO }}>
                          {fmtKES(amt)}
                        </div>
                      </div>
                    );
                  })}
                </Card>

                <Card mb={14}>
                  <Sec>Shift Details</Sec>
                  {[
                    ["Shift ID", activeShift.id],
                    ["Officer", activeShift.officer],
                    ["Opened", new Date(activeShift.openedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })],
                    ["Duration", duration],
                    ["Float", fmtKES(activeShift.float || 0)],
                    ["Transactions", String(shiftReceipts.length)],
                  ].map(function (item) {
                    var lbl = item[0], val = item[1];
                    return (
                      <div key={lbl} style={{
                        display: "flex", justifyContent: "space-between",
                        padding: "6px 0", borderBottom: "1px solid " + T.border
                      }}>
                        <span style={{ fontSize: 11, color: T.slateL }}>{lbl}</span>
                        <span style={{
                          fontSize: 12, fontWeight: 600, color: T.navy,
                          fontFamily: lbl === "Shift ID" || lbl === "Float" || lbl === "Duration" ? MONO : FONT
                        }}>
                          {val}
                        </span>
                      </div>
                    );
                  })}
                </Card>

                <button onClick={function () { setEndConfirm(true); }}
                  style={{ ...BtnRed, width: "100%", textAlign: "center", justifyContent: "center" }}>
                  🔴 End This Shift
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── End Shift Confirmation Modal ── */}
      {endConfirm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(7,24,40,.6)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 300, backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: "#fff", borderRadius: 18, padding: "28px 32px", width: 440,
            boxShadow: "0 24px 64px rgba(0,0,0,.35)", fontFamily: FONT
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔴</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.navy, marginBottom: 4 }}>End Shift?</div>
            <div style={{ fontSize: 13, color: T.slate, marginBottom: 20, lineHeight: 1.6 }}>
              This will close shift <strong>{activeShift.id}</strong>. Once closed it cannot be reopened.
            </div>
            <div style={{
              background: "#f8fafc", borderRadius: 10, padding: "14px 16px",
              border: "1px solid " + T.border, marginBottom: 20
            }}>
              {[
                ["Cashier", activeShift.officer],
                ["Transactions", String(shiftReceipts.length)],
                ["Float", fmtKES(activeShift.float || 0)],
                ["Cash Collected", fmtKES(cashTotal)],
                ["M-Pesa", fmtKES(mpesaTotal)],
                ["POS / Card", fmtKES(cardTotal)],
                ["Cheque", fmtKES(chequeTotal)],
              ].map(function (item) {
                var lbl = item[0], val = item[1];
                return (
                  <div key={lbl} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "5px 0", borderBottom: "1px solid " + T.border
                  }}>
                    <span style={{ fontSize: 12, color: T.slate }}>{lbl}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, fontFamily: MONO }}>{val}</span>
                  </div>
                );
              })}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: T.navy }}>Total Collected</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: T.green, fontFamily: MONO }}>{fmtKES(shiftTotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: T.slateL }}>Expected Cash in Drawer</span>
                <span style={{ fontSize: 11, fontWeight: 700, fontFamily: MONO }}>{fmtKES((activeShift.float || 0) + cashTotal)}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={function () { setEndConfirm(false); }} style={{ ...BtnGhost, flex: 1 }}>Cancel</button>
              <button onClick={handleEndShift} style={{ ...BtnRed, flex: 2 }}>🔴 Confirm End Shift</button>
            </div>
          </div>
        </div>
      )}
    </HMSLayout>
  );
}