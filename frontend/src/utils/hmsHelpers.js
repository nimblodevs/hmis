import { LAB_REF } from './hmsConstants';

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
