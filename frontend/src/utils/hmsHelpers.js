import { LAB_REF, HOSPITAL_INFO } from './hmsConstants';

export const pad     = (n, l = 5) => String(n).padStart(l, "0");
export const today   = ()         => new Date().toISOString().split("T")[0];
export const timeNow = ()         => new Date().toTimeString().slice(0, 5);
export const fmtKES  = (n)        => "KES " + Number(n || 0).toLocaleString();
export const calcAge = (d)        => !d ? "-" : Math.floor((Date.now() - new Date(d)) / (365.25 * 24 * 3600 * 1000));
export const hue     = (id)       => parseInt((id || "0").replace(/\D/g, "").slice(-4) || "0") * 53 % 360;

export function genNo(prefix, seq) {
  const yr = String(new Date().getFullYear()).slice(-2);
  return prefix + "-" + yr + "-" + pad(seq);
}

export function getFlag(sid, val, gender) {
  if (!val && val !== "0") return "empty";
  const r = LAB_REF[sid];
  if (!r || r.type !== "num") return "empty";
  const n = parseFloat(val);
  if (isNaN(n)) return "empty";
  const lo = (gender === "Female" && r.fLo !== undefined) ? r.fLo : r.lo;
  const hi = (gender === "Female" && r.fHi !== undefined) ? r.fHi : r.hi;
  if (r.cLo !== undefined && n <= r.cLo) return "critical";
  if (r.cHi !== undefined && n >= r.cHi) return "critical";
  if (lo  !== undefined && n < lo)       return "low";
  if (hi  !== undefined && n > hi)       return "high";
  return "normal";
}

export function printLabReport(pat) {
  const res  = pat.clerking?.labResults || {};
  const name = (pat.firstName || pat.name || "") + " " + (pat.lastName || "");
  const rows = Object.entries(res).map(function ([sid, r]) {
    const ref    = LAB_REF[sid];
    const flagTx = r.flag === "critical" ? "#dc2626" : (r.flag === "low" || r.flag === "high") ? "#b45309" : "#15803d";
    const flagLbl= r.flag === "critical" ? "CRITICAL" : r.flag === "high" ? "HIGH" : r.flag === "low" ? "LOW" : "Normal";
    return `<tr>
      <td style='padding:6px 10px;border-bottom:1px solid #e2e8f0'>${ref ? ref.name : sid}</td>
      <td style='padding:6px 10px;border-bottom:1px solid #e2e8f0;font-weight:700;color:${flagTx}'>${r.value || "-"}</td>
      <td style='padding:6px 10px;border-bottom:1px solid #e2e8f0;color:#64748b'>${ref ? ref.unit || "" : ""}</td>
      <td style='padding:6px 10px;border-bottom:1px solid #e2e8f0;font-weight:700;color:${flagTx}'>${flagLbl}</td>
    </tr>`;
  }).join("");
  const html = `<!DOCTYPE html><html><head><title>Lab Report</title>
    <style>body{font-family:sans-serif;margin:32px;color:#1e293b}h2{margin:0 0 4px}
    table{width:100%;border-collapse:collapse;margin-top:16px}
    th{background:#071828;color:#fff;padding:8px 10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px}
    </style></head><body>
    <h2>MediCore HMS - Laboratory Report</h2>
    <p><b>Patient:</b> ${name} &nbsp; <b>ID:</b> ${pat.id || "-"} &nbsp; <b>Queue:</b> ${pat.queueNo}
    &nbsp; <b>Lab No:</b> ${pat.clerking?.labNo || "-"} &nbsp; <b>Date:</b> ${new Date().toLocaleDateString("en-GB")}</p>
    <p><b>Requesting Doctor:</b> ${pat.clerking?.doctorName || "-"} &nbsp; <b>Lab Scientist:</b> ${pat.clerking?.labScientist || "-"}</p>
    <table><thead><tr><th>Analyte</th><th>Result</th><th>Unit</th><th>Flag</th></tr></thead><tbody>${rows}</tbody></table>
    </body></html>`;
  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
  w.print();
}

export function printRxLabel(pat) {
  const drugs = pat.clerking?.orders?.rx?.drugs || [];
  const name  = (pat.firstName || pat.name || "") + " " + (pat.lastName || "");
  const rows  = drugs.map((d, i) => `<tr>
    <td style='padding:8px 10px;border-bottom:1px solid #e2e8f0;font-weight:600'>${i + 1}. ${d.name}</td>
    <td style='padding:8px 10px;border-bottom:1px solid #e2e8f0'>${d.dose}</td>
    <td style='padding:8px 10px;border-bottom:1px solid #e2e8f0'>${d.route}</td>
    <td style='padding:8px 10px;border-bottom:1px solid #e2e8f0'>${d.freq}</td>
    <td style='padding:8px 10px;border-bottom:1px solid #e2e8f0'>${d.duration}</td>
    <td style='padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#475569'>${d.instructions}</td>
  </tr>`).join("");
  const allergy = pat.clerking?.allergies
    ? `<div style='background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:8px 14px;margin:12px 0;color:#dc2626;font-weight:700'>ALLERGY: ${pat.clerking.allergies}</div>`
    : "";
  const dispInfo = pat.clerking?.dispensed
    ? `<div style='margin-top:16px;padding:10px;background:#f0fdf4;border-radius:8px'>Dispensed by: ${pat.clerking.pharmacist || "-"} | Rx No: ${pat.clerking.rxNo || "-"} | ${pat.clerking.dispensedAt ? new Date(pat.clerking.dispensedAt).toLocaleString() : "-"}</div>`
    : "";
  const html = `<!DOCTYPE html><html><head><title>Prescription</title>
    <style>body{font-family:sans-serif;margin:32px;color:#1e293b}h2{margin:0 0 4px}
    table{width:100%;border-collapse:collapse;margin-top:12px}
    th{background:#071828;color:#fff;padding:8px 10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px}
    </style></head><body>
    <h2>MediCore HMS - Prescription</h2>
    <p><b>Patient:</b> ${name} &nbsp; <b>ID:</b> ${pat.id || "-"} &nbsp; <b>Cons No:</b> ${pat.clerking?.consNo || "-"}
    &nbsp; <b>Rx No:</b> ${pat.clerking?.rxNo || "Pending"} &nbsp; <b>Doctor:</b> ${pat.clerking?.doctorName || "-"}</p>
    ${allergy}
    <table><thead><tr><th>Drug</th><th>Dose</th><th>Route</th><th>Freq</th><th>Duration</th><th>Instructions</th></tr></thead><tbody>${rows}</tbody></table>
    ${dispInfo}</body></html>`;
  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
  w.print();
}

export function printReceipt(r, isCopy = false) {
  const subtotal = (r.items || []).reduce((s, i) => s + i.price * i.qty, 0);
  const vId = Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
  
  const html = `<!DOCTYPE html><html><head><title>Receipt - ${r.id}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Outfit:wght@400;700;900&display=swap');
      body { font-family: 'Outfit', sans-serif; margin: 5px; color: #0f172a; max-width: 380px; font-size: 13px; line-height: 1.1; letter-spacing: -0.3px; }
      .mono { font-family: 'DM Mono', monospace; font-size: 12px; }
      .hr { border-top: 1px dotted #000; margin: 4px 0; }
      .hr-dashed { display: none; }
      .center { text-align: center; }
      .bold { font-weight: 700; }
      .row { display: flex; justify-content: space-between; margin-bottom: 2px; }
      .section-title { font-weight: 900; font-size: 11px; margin: 6px 0 2px; letter-spacing: 0.5px; }
      .total-row { font-size: 16px; font-weight: 900; margin-top: 4px; padding: 6px 0; }
      @media print { margin: 0; }
    </style></head><body>
    
    <div class="center">
      <div style="font-size: 20px; font-weight: 900;">${HOSPITAL_INFO.name}</div>
      <div style="font-size: 11px; font-weight: 700; color: #475569;">${HOSPITAL_INFO.branch}</div>
      <div style="font-size: 10px; color: #64748b; margin-top: 4px;">
        ${HOSPITAL_INFO.address}<br/>
        Tel: ${HOSPITAL_INFO.phone}<br/>
        Email: ${HOSPITAL_INFO.email}
      </div>
      
      <div style="margin: 10px 0;">
        <div class="hr"></div>
        <div class="bold">${isCopy ? "COPY RECEIPT" : "OFFICIAL RECEIPT"}</div>
        ${isCopy ? '<div style="font-size: 10px; color: #64748b">(Reprint Copy)</div>' : ""}
      </div>
    </div>

    <div class="hr"></div>
    <div style="text-align: center; font-weight: 900; font-size: 14px; margin-bottom: 8px;">${r.shiftId}</div>

    <div style="margin-top: 8px;">
      <div class="row"><span class="bold">Receipt No:</span><span class="mono">${r.id}</span></div>
      <div class="row"><span class="bold">Bill No:</span><span class="mono">${r.billNo || r.invoiceNo || "-"}</span></div>
      <div style="height: 4px"></div>
      <div class="row"><span>Date:</span><span class="mono">${new Date(r.time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>
      <div class="row"><span>Time:</span><span class="mono">${new Date(r.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
    </div>

    <div class="section-title">PATIENT DETAILS</div>
    <div class="row"><span>Patient Name:</span><span class="bold">${r.patient}</span></div>
    <div class="row"><span>Patient ID:</span><span class="mono">${r.patientId}</span></div>
    <div class="row"><span>Age:</span><span class="bold">${r.age} Yrs</span></div>

    <div class="section-title">BILL DETAILS</div>
    ${(r.items || []).map(it => `
      <div class="row">
        <span>${it.name}</span>
        <span class="mono">KSh ${Number(it.price * it.qty).toLocaleString()}</span>
      </div>
    `).join("")}
    
    <div class="row"><span>Subtotal</span><span class="mono">KSh ${Number(subtotal).toLocaleString()}</span></div>
    <div class="row"><span>Discount</span><span class="mono">KSh ${Number(r.discount || 0).toLocaleString()}</span></div>
    
    <div class="total-row">
      <div class="row">
        <span>TOTAL</span>
        <span>KSh ${Number(r.amount).toLocaleString()}</span>
      </div>
    </div>

    <div class="hr"></div>
    <div class="section-title" style="margin-top: 20px;">PAYMENT INFORMATION</div>
    <div class="row"><span>Method:</span><span class="bold">${r.method}</span></div>
    ${(() => {
      if (!r.ref) return "";
      let label = "Reference";
      if (r.method === "M-Pesa") label = "M-Pesa Code";
      if (r.method === "Cheque") label = "Cheque Number";
      if (r.method === "POS / Card") label = "Card Ref No";
      return `<div class="row"><span>${label}:</span><span class="mono bold">${r.ref}</span></div>`;
    })()}
    <div class="row"><span>Status:</span><span class="bold" style="color: #15803d">PAID</span></div>
    <div style="height: 8px"></div>
    <div class="row"><span>Processed By:</span><span>Cashier - ${r.cashier}</span></div>

    <div class="hr"></div>
    <div class="section-title">VERIFICATION</div>
    
    <div class="hr"></div>
    <div class="center" style="font-size: 10px; margin-top: 16px;">
      <div style="color: #64748b; margin-bottom: 4px;">Verification ID:</div>
      <div class="mono" style="word-break: break-all;">${vId}</div>
    </div>

    <div class="hr"></div>
    <div style="margin-top: 10px; padding: 12px 0;" class="center">
      <div style="font-weight: 700;">Thank you for visiting us</div>
      <div style="font-size: 11px;">This is an official receipt</div>
    </div>

    <script>window.print();</script>
  </body></html>`;
  
  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
}
