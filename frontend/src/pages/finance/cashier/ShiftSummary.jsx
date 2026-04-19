import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx-js-style';
import { usePatients } from '../../../context/PatientContext';
import HMSLayout from '../../../components/layout/HMSLayout';
import HMSTopBar from '../../../components/layout/HMSTopBar';
import { Card, Sec, EmptyState, BtnGhost, IS, SS, BtnGreen, BtnRed } from '../../../components/common/HMSComponents';
import { T, HOSPITAL_INFO } from '../../../utils/hmsConstants';
import { fmtKES, printReceipt } from '../../../utils/hmsHelpers';
import { useBreakpoint } from '../../../hooks/useBreakpoint';

export default function ShiftSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shifts } = usePatients();
  const { isMobile } = useBreakpoint();

  const [q, setQ] = useState("");
  const [method, setMethod] = useState("");
  const [viewRec, setViewRec] = useState(null);

  const shift = shifts.find(s => s.id === id);

  if (!shift) {
    return (
      <HMSLayout>
        <HMSTopBar title="Shift Not Found" action={<button onClick={() => navigate("/hms/cashier")} style={BtnGhost}>← Dashboard</button>} />
        <div style={{ padding: 40 }}><EmptyState icon="❓" msg="The requested shift record could not be found." /></div>
      </HMSLayout>
    );
  }

  const totals = {
    Cash: shift.receipts.filter(r => r.method === "Cash").reduce((a, b) => a + b.amount, 0),
    "M-Pesa": shift.receipts.filter(r => r.method === "M-Pesa").reduce((a, b) => a + b.amount, 0),
    "POS / Card": shift.receipts.filter(r => r.method === "POS / Card").reduce((a, b) => a + b.amount, 0),
    Cheque: shift.receipts.filter(r => r.method === "Cheque").reduce((a, b) => a + b.amount, 0),
  };
  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);

  const filteredReceipts = useMemo(() => {
    if (!shift) return [];
    return shift.receipts.filter(r => {
      const matchesQ = !q || r.patient.toLowerCase().includes(q.toLowerCase()) || r.id.toLowerCase().includes(q.toLowerCase()) || (r.patientId && r.patientId.toLowerCase().includes(q.toLowerCase()));
      const matchesM = !method || r.method === method;
      return matchesQ && matchesM;
    });
  }, [shift, q, method]);

  // ── Excel Export ─────────────────────────────────────────────────
  const exportExcel = () => {
    const formatDateStr = (dateVal) => {
      if (!dateVal) return '';
      const d = new Date(dateVal);
      return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()} ${d.toLocaleTimeString('en-GB')}`;
    };

    const aoa = [
      ["Service Provider:", `${HOSPITAL_INFO.name}`.toUpperCase()],
      ["Location:", `${HOSPITAL_INFO.branch}`.toUpperCase()],
      ["Shift ID:", shift.id],
      ["Time Period:", "From", formatDateStr(shift.openedAt), "To", shift.closedAt ? formatDateStr(shift.closedAt) : "Still Running"],
      ["Operator:", shift.officer, "Date of Report:", formatDateStr(new Date())],
      ["Opening Float:", shift.float, "Net Expected:", grandTotal + shift.float, "Total Collected:", grandTotal]
    ];

    aoa.push([]); // Empty row for spacing

    // Headers
    aoa.push(['Time', 'Receipt No', 'Bill No', 'Patient ID', 'Patient Name', 'Clinic', 'Method', 'Method Ref', 'Amount (KES)', 'Served By']);

    // Data
    filteredReceipts.forEach(r => {
      aoa.push([
        new Date(r.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        r.id,
        r.billNo || r.invoiceNo || '',
        r.patientId || '',
        r.patient,
        r.clinic || 'General OPD',
        r.method,
        r.ref || '',
        r.amount,
        r.cashier || ''
      ]);
    });

    // Summary rows at the bottom
    aoa.push([]);
    const sumTitleRow = new Array(10).fill(null);
    sumTitleRow[7] = '── SUMMARY ──';
    aoa.push(sumTitleRow);

    Object.entries(totals).forEach(([m, amt]) => {
      const row = new Array(10).fill(null);
      row[7] = m;
      row[8] = amt;
      aoa.push(row);
    });

    const gtRow = new Array(10).fill(null);
    gtRow[7] = 'Grand Total';
    gtRow[8] = grandTotal;
    aoa.push(gtRow);

    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // Styling configuration
    const hex = (c) => c.replace('#', '').toUpperCase();
    
    const labelStyle = {
      font: { bold: true, color: { rgb: "000000" } },
      fill: { fgColor: { rgb: hex(T.bg) } },
      border: { top: { style: "thin", color: { rgb: hex(T.border) } }, bottom: { style: "thin", color: { rgb: hex(T.border) } }, left: { style: "thin", color: { rgb: hex(T.border) } }, right: { style: "thin", color: { rgb: hex(T.border) } } }
    };
    const valStyle = {
      font: { color: { rgb: "333333" } },
      border: { top: { style: "thin", color: { rgb: hex(T.border) } }, bottom: { style: "thin", color: { rgb: hex(T.border) } }, left: { style: "thin", color: { rgb: hex(T.border) } }, right: { style: "thin", color: { rgb: hex(T.border) } } }
    };
    const thStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: hex(T.navy) } },
      alignment: { vertical: "center" }
    };
    const gtStyle = {
      font: { bold: true, color: { rgb: hex(T.green) } },
      fill: { fgColor: { rgb: hex(T.bg) } }
    };

    // Apply styles to info header (rows 0-5)
    for (let R = 0; R <= 5; R++) {
      for (let C = 0; C < 6; C++) {
        if (!aoa[R][C] && aoa[R][C] !== 0 && aoa[R][C] !== "") continue;
        const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
        if (!ws[cellRef]) ws[cellRef] = { t: 's', v: '' };
        ws[cellRef].s = (C % 2 === 0) ? labelStyle : valStyle;
      }
    }

    // Apply styles to table header (row 7)
    for (let C = 0; C < 10; C++) {
      const cellRef = XLSX.utils.encode_cell({ c: C, r: 7 });
      if (ws[cellRef]) ws[cellRef].s = thStyle;
    }

    // Apply styles to Grand Total row (last row)
    const gtRowIndex = aoa.length - 1;
    for (let C = 0; C < 10; C++) {
      const cellRef = XLSX.utils.encode_cell({ c: C, r: gtRowIndex });
      if (ws[cellRef]) ws[cellRef].s = gtStyle;
    }

    ws['!cols'] = [{ wch: 16 }, { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 24 }, { wch: 16 }, { wch: 14 }, { wch: 20 }, { wch: 16 }, { wch: 20 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Shift Report');
    XLSX.writeFile(wb, `Shift_${shift.id}_${new Date().toLocaleDateString('en-KE').replace(/\//g, '-')}.xlsx`);
  };

  // ── PDF Export (print window) ────────────────────────────────────
  const exportPDF = () => {
    const rows = filteredReceipts.map((r, i) => `
      <tr style="background:${i % 2 === 0 ? '#fff' : '#f8fafc'}">
        <td>${new Date(r.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
        <td style="font-weight:700">${r.id}</td>
        <td>${r.billNo || r.invoiceNo || '—'}</td>
        <td>${r.patientId || '—'}</td>
        <td style="font-weight:600">${r.patient}</td>
        <td>${r.method}</td>
        <td style="color:#64748b">${r.ref || '—'}</td>
        <td style="text-align:right;font-weight:700">KES ${r.amount.toLocaleString()}</td>
        <td>${r.cashier || '—'}</td>
      </tr>
    `).join('');

    const summaryRows = Object.entries(totals).map(([m, amt]) =>
      `<tr><td colspan="7" style="text-align:right;color:#64748b">${m}</td><td style="text-align:right;font-weight:700">KES ${amt.toLocaleString()}</td><td></td></tr>`
    ).join('');

    const html = `<!DOCTYPE html><html><head><title>Shift Report – ${shift.id}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, sans-serif; font-size: 11px; color: #1e293b; padding: 24px; }
        h1 { font-size: 16px; font-weight: 900; text-align:center; margin-bottom:2px; }
        .sub { text-align:center; color:#64748b; font-size:10px; margin-bottom:16px; }
        .meta { display:flex; gap:24px; margin-bottom:16px; font-size:10px; }
        .meta div { flex:1; }
        .meta b { display:block; font-size:9px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; }
        table { width:100%; border-collapse:collapse; margin-bottom:16px; }
        thead th { background:#071828; color:#fff; padding:8px 10px; text-align:left; font-size:10px; }
        tbody td { padding:7px 10px; border-bottom:1px solid #f1f5f9; font-size:10px; }
        .totals-row td { background:#f0fdf4; font-weight:800; color:#15803d; }
        .grand-total { font-size:13px; font-weight:900; }
        @media print { @page { size: A4 landscape; margin: 16mm; } }
      </style></head><body>
      <h1>${HOSPITAL_INFO.name} — Shift Report</h1>
      <p class="sub">${HOSPITAL_INFO.address} &nbsp;|&nbsp; ${HOSPITAL_INFO.phone} &nbsp;|&nbsp; ${HOSPITAL_INFO.email}</p>
      <div class="meta">
        <div><b>Shift ID</b>${shift.id}</div>
        <div><b>Cashier</b>${shift.officer}</div>
        <div><b>Opened At</b>${new Date(shift.openedAt).toLocaleString()}</div>
        <div><b>Closed At</b>${shift.closedAt ? new Date(shift.closedAt).toLocaleString() : 'Still Running'}</div>
        <div><b>Float</b>KES ${shift.float?.toLocaleString()}</div>
        <div><b>Total Receipts</b>${shift.receipts.length}</div>
      </div>
      <table>
        <thead><tr>
          <th>Time</th><th>Receipt No</th><th>Bill No</th><th>Patient ID</th><th>Patient Name</th><th>Method</th><th>Method Ref</th><th style="text-align:right">Amount</th><th>Served By</th>
        </tr></thead>
        <tbody>${rows}</tbody>
        <tfoot>
          ${summaryRows}
          <tr class="totals-row"><td colspan="7" style="text-align:right" class="grand-total">Grand Total</td><td style="text-align:right" class="grand-total">KES ${grandTotal.toLocaleString()}</td><td></td></tr>
        </tfoot>
      </table>
      <p style="text-align:center;color:#94a3b8;font-size:9px">Generated on ${new Date().toLocaleString()} — ${HOSPITAL_INFO.name}</p>
    </body></html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  return (
    <HMSLayout>
      <HMSTopBar
        title={`Shift Summary: ${shift.id}`}
        subtitle={`Cashier: ${shift.officer} · ${new Date(shift.openedAt).toLocaleDateString()}`}
        action={<button onClick={() => navigate("/hms/cashier")} style={BtnGhost}>← Back to Dashboard</button>}
      />

      <div style={{ padding: isMobile ? "16px" : "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "320px 1fr", gap: 24, alignItems: "start" }}>

          {/* Summary Stats */}
          <div>
            <Card>
              <Sec>Financial Summary</Sec>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: T.slateL, textTransform: "uppercase", letterSpacing: 1 }}>Opening Float</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: T.navy }}>{fmtKES(shift.float)}</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {Object.entries(totals).map(([m, amt]) => (
                  <div key={m} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: T.slate }}>{m}</span>
                    <span style={{ fontWeight: 700 }}>{fmtKES(amt)}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: T.border, margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 900, color: T.green }}>
                  <span>Total Collection</span>
                  <span>{fmtKES(grandTotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 900, color: T.navy, marginTop: 8 }}>
                  <span>Net Expected</span>
                  <span>{fmtKES(grandTotal + shift.float)}</span>
                </div>
              </div>
            </Card>

            <Card style={{ marginTop: 16 }}>
              <Sec>Shift Details</Sec>
              <div style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: T.slateL }}>Opened At</span>
                  <span style={{ fontWeight: 600 }}>{new Date(shift.openedAt).toLocaleTimeString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: T.slateL }}>Closed At</span>
                  <span style={{ fontWeight: 600 }}>{shift.closedAt ? new Date(shift.closedAt).toLocaleTimeString() : "Still Running"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: T.slateL }}>Total Receipts</span>
                  <span style={{ fontWeight: 600 }}>{shift.receipts.length}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Detailed Logs */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.navy }}>🧾 Detailed Transaction Log</div>
                <div style={{ fontSize: 11, color: T.slateL, marginTop: 2 }}>Showing {filteredReceipts.length} of {shift.receipts.length} transactions</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={exportExcel} style={{ ...BtnGhost, padding: "7px 14px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  📊 Export Excel
                </button>
                <button onClick={exportPDF} style={{ ...BtnGreen, padding: "7px 14px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  📄 Export PDF
                </button>
              </div>
            </div>

            {/* Filter Log */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "12px", marginBottom: 12, border: "1px solid " + T.border, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search patient or receipt..." style={{ ...IS(), padding: "6px 10px", flex: 2, minWidth: 150 }} />
              <select value={method} onChange={e => setMethod(e.target.value)} style={{ ...SS, padding: "6px 10px", flex: 1, minWidth: 120 }}>
                <option value="">All Methods</option>
                {["Cash", "M-Pesa", "POS / Card", "Cheque"].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <Card style={{ padding: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead style={{ background: "#f8fafc", borderBottom: "1px solid " + T.border }}>
                  <tr>
                    <th style={{ textAlign: "left", padding: "12px 16px" }}>Time</th>
                    <th style={{ textAlign: "left", padding: "12px 16px" }}>Receipt No</th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>Bill No</th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>Patient ID</th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>Patient Name</th>
                    <th style={{ textAlign: "left", padding: "12px 16px" }}>Method</th>
                    <th style={{ textAlign: "left", padding: "12px 16px" }}>Method Ref</th>
                    <th style={{ textAlign: "right", padding: "12px 16px" }}>Amount</th>
                    <th style={{ textAlign: "left", padding: "12px 16px" }}>Served By</th>
                    <th style={{ textAlign: "center", padding: "12px 16px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReceipts.map((r, i) => (
                    <tr key={r.id} style={{ borderBottom: i < filteredReceipts.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                      <td style={{ padding: "12px 16px", color: T.slateL, fontFamily: "'DM Mono',monospace" }}>
                        {new Date(r.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: T.navy, fontFamily: "'DM Mono',monospace", fontSize: 11 }}>
                        {r.id}
                      </td>
                      <td style={{ padding: "12px 16px", color: T.slateL, fontFamily: "'DM Mono',monospace", fontSize: 11 }}>
                        {r.billNo || r.invoiceNo}
                      </td>
                      <td style={{ padding: "12px 16px", fontFamily: "'DM Mono',monospace", fontSize: 11 }}>
                        {r.patientId || "—"}
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                        {r.patient}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontWeight: 600 }}>{r.method}</div>
                      </td>
                      <td style={{ padding: "12px 16px", fontFamily: "'DM Mono',monospace", fontSize: 11, color: T.slate }}>
                        {r.ref || <span style={{ opacity: 0.35 }}>—</span>}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 800 }}>
                        {fmtKES(r.amount)}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 11, color: T.slate }}>
                        {r.cashier || "—"}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button onClick={() => setViewRec(r)} style={{ ...BtnGhost, padding: "4px 8px", fontSize: 10 }}>👁 View</button>
                          <button onClick={() => printReceipt(r, true)} style={{ ...BtnGreen, padding: "4px 8px", fontSize: 10 }}>🖨 Print</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredReceipts.length === 0 && (
                    <tr>
                      <td colSpan={10} style={{ padding: 40, textAlign: "center", color: T.slateL }}>No transactions match your search.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          </div>

        </div>
      </div>

      {/* View Receipt Modal */}
      {viewRec && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(7,24,40,.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "32px", width: 400, boxShadow: "0 32px 64px rgba(0,0,0,.4)" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: T.navy }}>{HOSPITAL_INFO.name}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.slate }}>{HOSPITAL_INFO.branch}</div>
              <div style={{ fontSize: 10, color: T.slateL, marginTop: 4 }}>
                {HOSPITAL_INFO.address}<br />
                {HOSPITAL_INFO.phone}<br />
                {HOSPITAL_INFO.email}
              </div>
              <div style={{ height: 1, background: T.border, margin: "16px 0" }} />
              <div style={{ fontSize: 14, fontWeight: 800, color: T.navy }}>OFFICIAL RECEIPT</div>
              <div style={{ fontSize: 11, color: T.slateL }}>{viewRec.id} · Shift: {viewRec.shiftId}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: T.slateL }}>Patient ID:</span><span style={{ fontWeight: 700 }}>{viewRec.patientId}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: T.slateL }}>Patient Name:</span><span style={{ fontWeight: 700 }}>{viewRec.patient} ({viewRec.age} Yrs)</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: T.slateL }}>Bill No:</span><span style={{ fontWeight: 700 }}>{viewRec.billNo || viewRec.invoiceNo}</span></div>

              <div style={{ height: 1, background: T.border, margin: "8px 0" }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: T.slateL, textTransform: "uppercase", letterSpacing: 1 }}>Itemized Bill</div>
              <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid " + T.border, borderRadius: 8, padding: 10 }}>
                {viewRec.items?.map((it, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: T.navy, flex: 1 }}>{it.qty}x {it.name}</span>
                    <span style={{ fontWeight: 600 }}>{fmtKES(it.price * it.qty)}</span>
                  </div>
                ))}
                {(!viewRec.items || viewRec.items.length === 0) && <div style={{ fontSize: 12, color: T.slateL }}>No items found.</div>}
              </div>

              <div style={{ height: 1, background: T.border, margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: T.slateL }}>Method:</span><span style={{ fontWeight: 700 }}>{viewRec.method}</span></div>
              {viewRec.ref && <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: T.slateL }}>Reference:</span><span style={{ fontWeight: 700 }}>{viewRec.ref}</span></div>}

              {viewRec.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: T.red }}>
                  <span>Discount:</span>
                  <span style={{ fontWeight: 700 }}>-{fmtKES(viewRec.discount)}</span>
                </div>
              )}

              <div style={{ height: 1, background: T.border, margin: "4px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16 }}><span style={{ fontWeight: 800 }}>Total Paid:</span><span style={{ fontWeight: 900, color: T.green }}>{fmtKES(viewRec.amount)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}><span style={{ color: T.slateL }}>Served By:</span><span style={{ fontWeight: 600 }}>{viewRec.cashier}</span></div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <button onClick={() => setViewRec(null)} style={{ ...BtnGhost, flex: 1 }}>Close</button>
              <button onClick={() => { printReceipt(viewRec, true); setViewRec(null); }} style={{ ...BtnGreen, flex: 2 }}>Print Receipt</button>
            </div>
          </div>
        </div>
      )}
    </HMSLayout>
  );
}
