import * as XLSX from 'xlsx-js-style';
import { HOSPITAL_INFO, T } from '../../../utils/hmsConstants';

export const exportExcel = ({ shift, filteredReceipts, totals, grandTotal }) => {
    const formatDateStr = (dateVal) => {
        if (!dateVal) return '';
        const d = new Date(dateVal);
        return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()} ${d.toLocaleTimeString('en-GB')}`;
    };

    const aoa = [
        ["Service Provider:", `${HOSPITAL_INFO.name}`.toUpperCase()],
        ["Branch:", `${HOSPITAL_INFO.branch}`.toUpperCase()],
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

export const exportPDF = ({ shift, filteredReceipts, totals, grandTotal }) => {
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
