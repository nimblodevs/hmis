import React, { useState, useEffect } from "react";

// ─── Kenya data ───────────────────────────────────────────────────────────────
const KENYA_COUNTIES = [
  "Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa",
  "Homa Bay","Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi",
  "Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos",
  "Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a",
  "Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri","Samburu",
  "Siaya","Taita-Taveta","Tana River","Tharaka-Nithi","Trans Nzoia",
  "Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot"
];

const INSURANCE_COMPANIES = [
  "AAR Insurance","Jubilee Health","CIC Insurance","Britam",
  "Madison Insurance","Resolution Insurance","UAP Old Mutual",
  "GA Insurance","Pacis Insurance","ICEA Lion","Other"
];

const REFERRAL_SOURCES = [
  "Self / Walk-in","Community Health Promoter (CHP)","Level 2 Dispensary",
  "Level 3 Health Centre","Level 4 Sub-County Hospital",
  "Level 5 County Hospital","Private clinic / doctor","Other hospital"
];

const CHRONIC_CONDITIONS = [
  "Diabetes (DM)","Hypertension (HTN)","HIV/AIDS","Tuberculosis (TB)",
  "Asthma / COPD","Sickle cell disease","Epilepsy","Mental health condition",
  "Pregnancy","Previous surgery","Cancer","Kidney disease","Heart disease"
];

// ─── Fee schedule (KES) ───────────────────────────────────────────────────────
const FEE_SCHEDULE = {
  opd:        { label: "OPD Consultation", amount: 500 },
  ipd:        { label: "IPD Admission fee", amount: 2000 },
  emergency:  { label: "Emergency / Casualty fee", amount: 1500 },
  maternity:  { label: "Maternity (ANC/delivery)", amount: 1200 },
  reg:        { label: "Registration fee", amount: 200 },
  file:       { label: "File / records fee", amount: 100 },
};

const SERVICES = [
  { id: "lab_malaria",  cat: "Laboratory", name: "Malaria RDT",           price: 350 },
  { id: "lab_cbc",      cat: "Laboratory", name: "Full Blood Count (CBC)", price: 800 },
  { id: "lab_rbs",      cat: "Laboratory", name: "Random Blood Sugar",     price: 250 },
  { id: "lab_urine",    cat: "Laboratory", name: "Urinalysis",             price: 400 },
  { id: "lab_hiv",      cat: "Laboratory", name: "HIV Rapid Test",         price: 200 },
  { id: "rad_xray",     cat: "Radiology",  name: "Chest X-Ray",            price: 1200 },
  { id: "rad_us",       cat: "Radiology",  name: "Ultrasound (abdominal)", price: 2500 },
  { id: "proc_dress",   cat: "Procedure",  name: "Wound dressing",         price: 500 },
  { id: "proc_inject",  cat: "Procedure",  name: "Injection / IV line",    price: 300 },
  { id: "drug_panadol", cat: "Pharmacy",   name: "Paracetamol 500mg × 10", price: 80 },
  { id: "drug_amox",    cat: "Pharmacy",   name: "Amoxicillin 500mg × 21", price: 350 },
  { id: "drug_ctrim",   cat: "Pharmacy",   name: "Co-trimoxazole × 28",    price: 180 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function genInvNo() {
  const d = new Date();
  return `INV-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}-${Math.floor(1000+Math.random()*9000)}`;
}
function calcAge(dob) {
  if (!dob) return null;
  const d = new Date(dob), now = new Date();
  let yrs = now.getFullYear() - d.getFullYear();
  let mths = now.getMonth() - d.getMonth();
  if (now.getDate() < d.getDate()) mths--;
  if (mths < 0) { yrs--; mths += 12; }
  return { years: Math.max(0, yrs), months: Math.max(0, mths) };
}
function fmtAge(dob) {
  const a = calcAge(dob);
  if (!a) return "";
  if (a.years === 0) return `${a.months} month${a.months !== 1 ? "s" : ""}`;
  return `${a.years} yr${a.years !== 1 ? "s" : ""}, ${a.months} month${a.months !== 1 ? "s" : ""}`;
}
function fmtKES(n) {
  return "KES " + Number(n).toLocaleString("en-KE", { minimumFractionDigits: 2 });
}
function today() { return new Date().toISOString().split("T")[0]; }

// ─── Print form ───────────────────────────────────────────────────────────────
function printRegistrationForm() {
  const w = window.open("", "_blank", "width=900,height=1200");
  w.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Patient Registration Form — Mater Hospital</title>
<style>
  @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 9.5pt; color: #111; background: #fff; }

  /* Header */
  .header { display: flex; align-items: flex-start; justify-content: space-between;
    border-bottom: 2.5px solid #1B6E3F; padding-bottom: 10px; margin-bottom: 14px; }
  .header-left { display: flex; align-items: center; gap: 12px; }
  .logo-box { width: 44px; height: 44px; border: 2px solid #1B6E3F; border-radius: 6px;
    display: flex; align-items: center; justify-content: center; font-size: 22px; }
  .facility-name { font-size: 15pt; font-weight: 700; color: #1B6E3F; line-height: 1.2; }
  .facility-sub { font-size: 8pt; color: #555; margin-top: 2px; }
  .header-right { text-align: right; font-size: 8pt; color: #555; }
  .header-right strong { font-size: 9pt; color: #111; display: block; }
  .form-title { font-size: 12pt; font-weight: 700; color: #1B6E3F; text-align: center;
    letter-spacing: 1px; text-transform: uppercase; margin-bottom: 14px;
    border: 1.5px solid #1B6E3F; padding: 5px; border-radius: 4px; }

  /* Sections */
  .section { margin-bottom: 14px; break-inside: avoid; }
  .section-title { font-size: 8pt; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.8px; color: #fff; background: #1B6E3F;
    padding: 4px 8px; margin-bottom: 8px; border-radius: 3px; }

  /* Grid */
  .grid { display: grid; gap: 8px 14px; }
  .g2 { grid-template-columns: 1fr 1fr; }
  .g3 { grid-template-columns: 1fr 1fr 1fr; }
  .g4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
  .span2 { grid-column: span 2; }
  .span3 { grid-column: span 3; }
  .span4 { grid-column: span 4; }

  /* Field */
  .field { display: flex; flex-direction: column; gap: 3px; }
  .field label { font-size: 7.5pt; font-weight: 700; color: #555;
    text-transform: uppercase; letter-spacing: 0.3px; }
  .field label .req { color: #BE0027; }
  .field .line { border: none; border-bottom: 1px solid #888;
    height: 20px; width: 100%; background: transparent; }
  .field .box { border: 1px solid #888; border-radius: 3px;
    height: 20px; width: 100%; background: transparent; }

  /* Checkbox / radio rows */
  .options { display: flex; flex-wrap: wrap; gap: 6px 16px; margin-top: 2px; }
  .opt { display: flex; align-items: center; gap: 4px; font-size: 8.5pt; }
  .opt .sq { width: 11px; height: 11px; border: 1px solid #555; border-radius: 2px; flex-shrink: 0; }
  .opt .ci { width: 11px; height: 11px; border: 1px solid #555; border-radius: 50%; flex-shrink: 0; }

  /* Consent */
  .consent-item { display: flex; align-items: flex-start; gap: 7px;
    font-size: 8pt; color: #333; margin-bottom: 6px; }
  .consent-item .sq { width: 12px; height: 12px; border: 1px solid #555;
    border-radius: 2px; flex-shrink: 0; margin-top: 1px; }

  /* Footer */
  .footer { border-top: 1px solid #ccc; margin-top: 16px; padding-top: 8px;
    display: flex; justify-content: space-between; font-size: 7.5pt; color: #777; }
  .sig-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 10px; }
  .sig-block { border-top: 1px solid #555; padding-top: 4px; font-size: 8pt; color: #555; }

  /* Stamp box */
  .stamp-box { border: 1px dashed #999; border-radius: 4px; width: 100%; height: 52px;
    display: flex; align-items: center; justify-content: center;
    font-size: 8pt; color: #aaa; letter-spacing: 0.5px; }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>

<!-- Print toolbar (hidden on print) -->
<div class="no-print" style="background:#1B6E3F;color:#fff;padding:10px 20px;
  display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
  <span style="font-weight:700;font-size:14px">🖨️ Patient Registration Form — Print Preview</span>
  <div style="display:flex;gap:10px">
    <button onclick="window.print()" style="background:#fff;color:#1B6E3F;border:none;
      padding:7px 18px;border-radius:6px;font-weight:700;cursor:pointer;font-size:13px">
      Print / Save PDF
    </button>
    <button onclick="window.close()" style="background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.5);
      padding:7px 14px;border-radius:6px;cursor:pointer;font-size:13px">
      Close
    </button>
  </div>
</div>

<div style="max-width:760px;margin:0 auto;padding:0 10px">

<!-- Header -->
<div class="header">
  <div class="header-left">
    <div class="logo-box">🏥</div>
    <div>
      <div class="facility-name">Mater Hospital</div>
      <div class="facility-sub">MFL Code: 13104 &nbsp;|&nbsp; Level 5 &nbsp;|&nbsp; Nairobi, Makadara Sub-County</div>
      <div class="facility-sub">P.O. Box 30325-00100, Nairobi &nbsp;|&nbsp; Tel: +254 20 6903000</div>
    </div>
  </div>
  <div class="header-right">
    <strong>Registration No.</strong>
    <div style="border-bottom:1px solid #888;width:120px;height:18px;margin-top:3px;"></div>
    <div style="margin-top:6px"><strong>Date</strong></div>
    <div style="border-bottom:1px solid #888;width:120px;height:18px;margin-top:3px;"></div>
    <div style="margin-top:6px"><strong>Desk / Clerk</strong></div>
    <div style="border-bottom:1px solid #888;width:120px;height:18px;margin-top:3px;"></div>
  </div>
</div>

<div class="form-title">Patient Registration Form</div>

<!-- 1. Personal Details -->
<div class="section">
  <div class="section-title">1. Personal Details</div>
  <div class="grid g4" style="margin-bottom:8px">
    <div class="field">
      <label>Title <span class="req">*</span></label>
      <div class="options">
        ${[ "Mr.","Mrs.","Ms.","Dr.","Prof." ].map(t=>`<span class="opt"><span class="sq"></span>${t}</span>`).join("")}
      </div>
    </div>
    <div class="field">
      <label>Gender <span class="req">*</span></label>
      <div class="options">
        ${[ "Male","Female","Other" ].map(g=>`<span class="opt"><span class="ci"></span>${g}</span>`).join("")}
      </div>
    </div>
    <div class="field">
      <label>Marital status <span class="req">*</span></label>
      <div class="options" style="flex-direction:column;gap:3px">
        ${[ "Single","Married","Separated","Divorced","Widowed" ].map(m=>`<span class="opt"><span class="sq"></span>${m}</span>`).join("")}
      </div>
    </div>
    <div class="field">
      <label>Nationality <span class="req">*</span></label>
      <div class="box" style="height:20px"></div>
    </div>
  </div>
  <div class="grid g3">
    <div class="field span3" style="grid-column:span 1">
      <label>First name <span class="req">*</span></label><div class="line"></div>
    </div>
    <div class="field">
      <label>Middle name <span class="req">*</span></label><div class="line"></div>
    </div>
    <div class="field">
      <label>Last / Surname <span class="req">*</span></label><div class="line"></div>
    </div>
    <div class="field">
      <label>Date of birth <span class="req">*</span></label>
      <div style="display:flex;gap:6px;align-items:center">
        <div style="flex:1;border-bottom:1px solid #888;height:20px"></div>
        <span style="font-size:8pt;color:#888">DD / MM / YYYY</span>
      </div>
    </div>
    <div class="field">
      <label>Age <span style="font-size:7pt;color:#888;font-weight:400">(e.g. 32 yrs, 4 months)</span></label>
      <div class="line"></div>
    </div>
    <div class="field">
      <label>Religion <span class="req">*</span></label><div class="line"></div>
    </div>
    <div class="field">
      <label>Occupation</label><div class="line"></div>
    </div>
  </div>
</div>

<!-- 2. National Identification -->
<div class="section">
  <div class="section-title">2. National Identification</div>
  <div class="grid g4">
    <div class="field">
      <label>ID type <span class="req">*</span></label>
      <div class="options" style="flex-direction:column;gap:3px">
        ${[ "National ID","Passport","Birth Cert.","Alien ID" ].map(t=>`<span class="opt"><span class="ci"></span>${t}</span>`).join("")}
      </div>
    </div>
    <div class="field span3">
      <label>ID / Document number <span class="req">*</span></label>
      <div class="line"></div>
      <div style="margin-top:8px">
        <label>Issuing country / authority</label>
        <div class="line"></div>
      </div>
    </div>
  </div>
</div>

<!-- 3. Contact & Residence -->
<div class="section">
  <div class="section-title">3. Contact & Residence</div>
  <div class="grid g2">
    <div class="field">
      <label>Primary phone (M-Pesa) <span class="req">*</span></label>
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:8.5pt;font-weight:700;border:1px solid #888;padding:2px 5px;border-radius:3px">+254</span>
        <div class="line" style="flex:1"></div>
      </div>
    </div>
    <div class="field">
      <label>Alternative phone <span class="req">*</span></label>
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:8.5pt;font-weight:700;border:1px solid #888;padding:2px 5px;border-radius:3px">+254</span>
        <div class="line" style="flex:1"></div>
      </div>
    </div>
    <div class="field">
      <label>Email address <span class="req">*</span></label><div class="line"></div>
    </div>
    <div class="field">
      <label>County <span class="req">*</span></label><div class="line"></div>
    </div>
    <div class="field">
      <label>Sub-county / Town <span class="req">*</span></label><div class="line"></div>
    </div>
    <div class="field">
      <label>Physical address <span class="req">*</span></label><div class="line"></div>
    </div>
  </div>
</div>

<!-- 4. Next of Kin & Emergency Contact -->
<div class="section">
  <div class="section-title">4. Next of Kin & Emergency Contact</div>
  <div class="grid g3" style="margin-bottom:8px">
    <div class="field">
      <label>First name <span class="req">*</span></label><div class="line"></div>
    </div>
    <div class="field">
      <label>Middle name <span class="req">*</span></label><div class="line"></div>
    </div>
    <div class="field">
      <label>Last / Surname <span class="req">*</span></label><div class="line"></div>
    </div>
  </div>
  <div class="grid g4">
    <div class="field">
      <label>Relationship <span class="req">*</span></label><div class="line"></div>
    </div>
    <div class="field">
      <label>County of residence <span class="req">*</span></label><div class="line"></div>
    </div>
    <div class="field span2">
      <label>Physical address <span class="req">*</span></label><div class="line"></div>
    </div>
    <div class="field span2">
      <label>Emergency phone <span class="req">*</span></label>
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:8.5pt;font-weight:700;border:1px solid #888;padding:2px 5px;border-radius:3px">+254</span>
        <div class="line" style="flex:1"></div>
      </div>
    </div>
    <div class="field span2">
      <label>Alternative phone <span class="req">*</span></label>
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:8.5pt;font-weight:700;border:1px solid #888;padding:2px 5px;border-radius:3px">+254</span>
        <div class="line" style="flex:1"></div>
      </div>
    </div>
    <div class="field span4">
      <label>Email address <span class="req">*</span></label><div class="line"></div>
    </div>
  </div>
</div>

<!-- 5. Emergency Contact -->
<div class="section">
  <div class="section-title">5. Emergency Contact</div>
  <div style="font-size:7.5pt;color:#888;margin-bottom:6px">Optional — may differ from next of kin</div>
  <div class="grid g4" style="margin-bottom:8px">
    <div class="field span2">
      <label>Full name</label><div class="line"></div>
    </div>
    <div class="field">
      <label>Relationship</label><div class="line"></div>
    </div>
    <div class="field">
      <label>County</label><div class="line"></div>
    </div>
    <div class="field span2">
      <label>Primary phone</label>
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:8.5pt;font-weight:700;border:1px solid #888;padding:2px 5px;border-radius:3px">+254</span>
        <div class="line" style="flex:1"></div>
      </div>
    </div>
    <div class="field span2">
      <label>Alternative phone</label>
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:8.5pt;font-weight:700;border:1px solid #888;padding:2px 5px;border-radius:3px">+254</span>
        <div class="line" style="flex:1"></div>
      </div>
    </div>
    <div class="field span4">
      <label>Physical address</label><div class="line"></div>
    </div>
  </div>
</div>

<!-- 6. Employer Details -->
<div class="section">
  <div class="section-title">6. Employer Details</div>
  <div style="font-size:7.5pt;color:#888;margin-bottom:6px">Optional</div>
  <div class="grid g4">
    <div class="field span2">
      <label>Employer / organisation name</label><div class="line"></div>
    </div>
    <div class="field span2">
      <label>Job title / designation</label><div class="line"></div>
    </div>
    <div class="field span4">
      <label>Employer physical address</label><div class="line"></div>
    </div>
  </div>
</div>

<!-- 7. Consent & Data Protection -->
<div class="section">
  <div class="section-title">7. Consent & Data Protection</div>
  <div style="font-size:8pt;color:#444;margin-bottom:6px">
    Please read each statement carefully and tick the box to indicate your agreement.
  </div>
  <div class="consent-item">
    <span class="sq"></span>
    <span>I consent to my health information being stored in this facility's Health Management Information System (HMIS) as required by the <em>Kenya Health Act, 2017</em> and the <em>Data Protection Act, 2019</em>. <strong>*</strong></span>
  </div>
  <div class="consent-item">
    <span class="sq"></span>
    <span>I consent to receiving SMS / M-Pesa notifications for appointment reminders and billing on the mobile number provided above.</span>
  </div>
  <div class="consent-item">
    <span class="sq"></span>
    <span>I agree to the sharing of anonymised health data with the county health department for public health reporting through DHIS2 / KHIS.</span>
  </div>
</div>

<!-- 6. Signatures -->
<div class="section">
  <div class="section-title">8. Declaration & Signatures</div>
  <div style="font-size:8pt;color:#333;margin-bottom:10px;line-height:1.5">
    I declare that the information provided above is true and correct to the best of my knowledge. I understand that providing false information may affect the quality of care I receive.
  </div>
  <div class="sig-row">
    <div>
      <div class="sig-block">Patient / Guardian signature &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      <div style="margin-top:8px;font-size:8pt;color:#555">
        Name (if guardian): <div class="line"></div>
      </div>
      <div style="margin-top:6px;font-size:8pt;color:#555">
        Date: <div style="display:inline-block;border-bottom:1px solid #888;width:100px;height:16px;vertical-align:bottom"></div>
      </div>
    </div>
    <div>
      <div class="sig-block">Registration clerk &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      <div style="margin-top:8px;font-size:8pt;color:#555">
        Staff ID: <div class="line"></div>
      </div>
      <div style="margin-top:6px;display:flex;gap:14px;align-items:flex-end">
        <div style="font-size:8pt;color:#555">
          Date: <div style="display:inline-block;border-bottom:1px solid #888;width:100px;height:16px;vertical-align:bottom"></div>
        </div>
        <div class="stamp-box" style="width:90px;height:40px;font-size:7pt">FACILITY STAMP</div>
      </div>
    </div>
  </div>
</div>

</div><!-- /container -->

<div class="footer no-print" style="max-width:760px;margin:16px auto 0;padding:0 10px">
  <span>Mater Hospital · MFL 13104 · Nairobi</span>
  <span>KHIS / DHIS2 compliant · Kenya Health Act 2017</span>
  <span>Form version: REG-DEMO-v3</span>
</div>
<div class="footer" style="max-width:760px;margin:0 auto;padding:0 10px">
  <span>Mater Hospital · MFL 13104 · Nairobi</span>
  <span>KHIS / DHIS2 compliant · Kenya Health Act 2017</span>
  <span>Form version: REG-DEMO-v3</span>
</div>

</body></html>`);
  w.document.close();
}

// ─── Shared UI atoms ──────────────────────────────────────────────────────────
const Field = ({ label, required, hint, error, children }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
    <label style={{ fontSize:11, fontWeight:600, color:"#6B6B6B", letterSpacing:"0.4px", textTransform:"uppercase" }}>
      {label}{required && <span style={{ color:"#BE0027", marginLeft:2 }}>*</span>}
    </label>
    {children}
    {hint && <span style={{ fontSize:10, color:"#6B6B6B" }}>{hint}</span>}
    {error && <span style={{ fontSize:10, color:"#BE0027" }}>{error}</span>}
  </div>
);

const Input = ({ style, ...props }) => (
  <input {...props} style={{
    fontFamily:"inherit", fontSize:13, color:"#1A1A1A",
    background:"#fff", border:"1px solid #D8D8D2", borderRadius:8,
    padding:"8px 11px", outline:"none", width:"100%",
    ...style
  }}
  onFocus={e => { e.target.style.borderColor="#2A8A52"; e.target.style.boxShadow="0 0 0 3px rgba(27,110,63,0.1)"; }}
  onBlur={e => { e.target.style.borderColor="#D8D8D2"; e.target.style.boxShadow="none"; }}
  />
);

const Select = ({ children, style, ...props }) => (
  <div style={{ position:"relative" }}>
    <select {...props} style={{
      fontFamily:"inherit", fontSize:13, color:"#1A1A1A",
      background:"#fff", border:"1px solid #D8D8D2", borderRadius:8,
      padding:"8px 28px 8px 11px", outline:"none", width:"100%",
      appearance:"none", cursor:"pointer", ...style
    }}
    onFocus={e => { e.target.style.borderColor="#2A8A52"; }}
    onBlur={e => { e.target.style.borderColor="#D8D8D2"; }}>
      {children}
    </select>
    <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)",
      width:0, height:0, borderLeft:"4px solid transparent", borderRight:"4px solid transparent",
      borderTop:"5px solid #6B6B6B", pointerEvents:"none" }} />
  </div>
);

const PhoneInput = ({ value, onChange }) => (
  <div style={{ display:"flex", gap:6 }}>
    <div style={{ background:"#F7F7F4", border:"1px solid #D8D8D2", borderRadius:8,
      padding:"8px 10px", fontSize:13, fontWeight:600, whiteSpace:"nowrap",
      display:"flex", alignItems:"center", gap:5 }}>
      🇰🇪 +254
    </div>
    <Input type="tel" value={value} onChange={onChange} placeholder="7XX XXX XXX" maxLength={10}
      style={{ flex:1 }} />
  </div>
);

const RadioChip = ({ name, value, checked, onChange, label: lbl }) => (
  <label style={{ cursor:"pointer" }}>
    <input type="radio" name={name} value={value} checked={checked} onChange={onChange} style={{ display:"none" }} />
    <span style={{
      fontSize:12, fontWeight:500, padding:"5px 12px", borderRadius:20,
      border:`1px solid ${checked ? "#1B6E3F" : "#D8D8D2"}`,
      background: checked ? "#E8F5EE" : "#F7F7F4",
      color: checked ? "#1B6E3F" : "#1A1A1A",
      display:"inline-block", transition:"all .15s", userSelect:"none"
    }}>{lbl}</span>
  </label>
);

const CheckChip = ({ checked, onChange, label: lbl }) => (
  <label style={{ cursor:"pointer" }}>
    <input type="checkbox" checked={checked} onChange={onChange} style={{ display:"none" }} />
    <span style={{
      fontSize:12, fontWeight:500, padding:"5px 12px", borderRadius:20,
      border:`1px solid ${checked ? "#1B6E3F" : "#D8D8D2"}`,
      background: checked ? "#E8F5EE" : "#F7F7F4",
      color: checked ? "#1B6E3F" : "#1A1A1A",
      display:"inline-block", transition:"all .15s", userSelect:"none"
    }}>{checked && "✓ "}{lbl}</span>
  </label>
);

const Divider = ({ children }) => (
  <div style={{
    fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px",
    color:"#6B6B6B", display:"flex", alignItems:"center", gap:8,
    gridColumn:"1/-1", margin:"4px 0"
  }}>
    {children}
    <span style={{ flex:1, height:1, background:"#D8D8D2" }} />
  </div>
);

const Alert = ({ type="info", children }) => {
  const styles = {
    info:  { bg:"#EFF8FF", color:"#1E6FA8", border:"#B5D4F4" },
    warn:  { bg:"#FDF6E3", color:"#7A5200", border:"#F2C96A" },
    success:{ bg:"#E8F5EE", color:"#1B6E3F", border:"#96DDB4" },
    danger:{ bg:"#FFF0F3", color:"#BE0027", border:"#FFBFCC" },
  };
  const s = styles[type];
  return (
    <div style={{ borderRadius:8, padding:"10px 12px", fontSize:12,
      display:"flex", gap:8, alignItems:"flex-start", marginBottom:14,
      background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>
      <span style={{ fontSize:14, flexShrink:0 }}>
        {type==="warn"?"⚠️":type==="success"?"✅":type==="danger"?"🚨":"ℹ️"}
      </span>
      <span>{children}</span>
    </div>
  );
};

const Btn = ({ variant="primary", onClick, disabled, children, style }) => {
  const vars = {
    primary: { bg:"#1B6E3F", color:"#fff", border:"#1B6E3F" },
    ghost:   { bg:"transparent", color:"#6B6B6B", border:"#D8D8D2" },
    danger:  { bg:"#FFF0F3", color:"#BE0027", border:"#FFBFCC" },
    success: { bg:"#E8F5EE", color:"#1B6E3F", border:"#96DDB4" },
  };
  const v = vars[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      fontFamily:"inherit", fontSize:13, fontWeight:600,
      padding:"9px 18px", borderRadius:8, border:`1px solid ${v.border}`,
      background:v.bg, color:v.color, cursor:disabled?"not-allowed":"pointer",
      display:"inline-flex", alignItems:"center", gap:6,
      opacity:disabled?.5:1, transition:"all .15s",
      ...style
    }}>{children}</button>
  );
};

const Card = ({ title, subtitle, icon, children }) => (
  <div style={{ background:"#fff", border:"1px solid #D8D8D2", borderRadius:12,
    overflow:"hidden", marginBottom:16 }}>
    <div style={{ padding:"14px 20px", borderBottom:"1px solid #D8D8D2",
      display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ width:28, height:28, borderRadius:6, background:"#E8F5EE",
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize:13, fontWeight:600 }}>{title}</div>
        {subtitle && <div style={{ fontSize:11, color:"#6B6B6B", marginTop:1 }}>{subtitle}</div>}
      </div>
    </div>
    <div style={{ padding:20 }}>{children}</div>
  </div>
);

const FormGrid = ({ cols=2, children }) => (
  <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:14 }}>
    {children}
  </div>
);

// ─── Step components ──────────────────────────────────────────────────────────

// Mock patient records for search
const MOCK_PATIENTS = [
  { hpid:"HPID-1023456", firstName:"Amina", middleName:"Njeri", lastName:"Wanjiku", dob:"1990-04-12", gender:"Female", phone:"0712345678", idNumber:"12345678" },
  { hpid:"HPID-2034567", firstName:"John",  middleName:"Kamau", lastName:"Mwangi",  dob:"1985-08-22", gender:"Male",   phone:"0723456789", idNumber:"23456789" },
  { hpid:"HPID-3045678", firstName:"Grace", middleName:"Auma",  lastName:"Otieno",  dob:"2001-01-30", gender:"Female", phone:"0734567890", idNumber:"34567890" },
  { hpid:"HPID-4056789", firstName:"Peter", middleName:"",      lastName:"Kariuki",  dob:"1978-11-05", gender:"Male",   phone:"0745678901", idNumber:"45678901" },
];

// ─── Step 1: Patient Demographics ────────────────────────────────────────────
function Step1Demographics({ data, onChange }) {
  const set = (k) => (e) => onChange({ ...data, [k]: e.target.value });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchDone, setSearchDone] = useState(false);

  const handleSearch = () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;
    const results = MOCK_PATIENTS.filter(p =>
      `${p.firstName} ${p.middleName} ${p.lastName}`.toLowerCase().includes(q) ||
      p.hpid.toLowerCase().includes(q) ||
      p.idNumber.includes(q) ||
      p.phone.includes(q)
    );
    setSearchResults(results);
    setSearchDone(true);
  };

  const loadPatient = (p) => {
    onChange({
      ...data,
      firstName: p.firstName, middleName: p.middleName, lastName: p.lastName,
      dob: p.dob, gender: p.gender, phone: p.phone.replace(/^0/,""),
      idNumber: p.idNumber,
    });
    setSearchQuery("");
    setSearchResults([]);
    setSearchDone(false);
  };

  const age = calcAge(data.dob);

  return (
    <Card title="Patient Demographics" subtitle="Personal details, identification & contact" icon="👤">
      <Alert type="info">
        All fields marked <strong>*</strong> are mandatory per Kenya Health Information System (KHIS) standards.
      </Alert>

      {/* ── Patient lookup & ID ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:600, color:"#6B6B6B", letterSpacing:"0.4px",
            textTransform:"uppercase", marginBottom:4 }}>Search existing patient</div>
          <div style={{ display:"flex", gap:6 }}>
            <input
              value={searchQuery}
              onChange={e=>{ setSearchQuery(e.target.value); setSearchDone(false); setSearchResults([]); }}
              onKeyDown={e=>e.key==="Enter"&&handleSearch()}
              placeholder="Name, HPID, ID no. or phone…"
              style={{ fontFamily:"inherit", fontSize:13, color:"#1A1A1A", flex:1,
                background:"#fff", border:"1px solid #D8D8D2", borderRadius:8,
                padding:"8px 11px", outline:"none" }}
              onFocus={e=>{ e.target.style.borderColor="#2A8A52"; e.target.style.boxShadow="0 0 0 3px rgba(27,110,63,0.1)"; }}
              onBlur={e=>{ e.target.style.borderColor="#D8D8D2"; e.target.style.boxShadow="none"; }}
            />
            <button onClick={handleSearch} style={{
              fontFamily:"inherit", fontSize:13, fontWeight:600, padding:"8px 14px",
              borderRadius:8, background:"#1B6E3F", color:"#fff", border:"none", cursor:"pointer",
              whiteSpace:"nowrap" }}>🔍 Search</button>
          </div>
          {searchDone && (
            <div style={{ marginTop:4, border:"1px solid #D8D8D2", borderRadius:8,
              background:"#fff", overflow:"hidden" }}>
              {searchResults.length === 0 ? (
                <div style={{ padding:"10px 12px", fontSize:12, color:"#6B6B6B" }}>
                  No matching patient found. Fill in details below to register new patient.
                </div>
              ) : searchResults.map(p=>(
                <div key={p.hpid} onClick={()=>loadPatient(p)}
                  style={{ padding:"9px 12px", cursor:"pointer", borderBottom:"1px solid #D8D8D2",
                    fontSize:12, display:"flex", justifyContent:"space-between", alignItems:"center",
                    transition:"background .12s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#E8F5EE"}
                  onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                  <div>
                    <div style={{ fontWeight:600, color:"#1A1A1A" }}>
                      {[p.firstName, p.middleName, p.lastName].filter(Boolean).join(" ")}
                    </div>
                    <div style={{ color:"#6B6B6B", marginTop:1 }}>
                      ID: {p.idNumber} &nbsp;·&nbsp; DOB: {p.dob.split("-").reverse().join("/")} &nbsp;·&nbsp; {p.gender}
                    </div>
                  </div>
                  <span style={{ fontSize:11, fontWeight:600, color:"#1B6E3F",
                    background:"#E8F5EE", padding:"2px 8px", borderRadius:20, whiteSpace:"nowrap" }}>
                    {p.hpid}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div style={{ fontSize:11, fontWeight:600, color:"#6B6B6B", letterSpacing:"0.4px",
            textTransform:"uppercase", marginBottom:4 }}>Patient ID (HPID)</div>
          <div style={{ display:"flex", alignItems:"center", gap:8,
            background:"#F7F7F4", border:"1px dashed #D8D8D2", borderRadius:8,
            padding:"8px 12px", height:38 }}>
            <span style={{ fontSize:16 }}>🏥</span>
            <span style={{ fontFamily:"monospace", fontSize:13, color:"#888780", letterSpacing:"0.5px" }}>
              Assigned by system on registration
            </span>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        <Divider>Personal details</Divider>
        <Field label="Title" required>
          <Select value={data.title||""} onChange={set("title")}>
            <option value="">— select —</option>
            {["Mr.","Mrs.","Ms.","Dr.","Prof."].map(t=>(<option key={t}>{t}</option>))}
          </Select>
        </Field>
        <Field label="Gender" required>
          <Select value={data.gender||""} onChange={set("gender")}>
            <option value="">— select —</option>
            {["Male","Female","Other"].map(g=><option key={g}>{g}</option>)}
          </Select>
        </Field>
        <div style={{ gridColumn:"span 2" }}>
          <Field label="Marital status" required>
            <Select value={data.marital||""} onChange={set("marital")}>
              <option value="">— select —</option>
              {["Single","Married","Separated","Divorced","Widowed"].map(m=>(<option key={m}>{m}</option>))}
            </Select>
          </Field>
        </div>
        <div style={{ gridColumn:"span 2" }}>
          <Field label="First name" required><Input value={data.firstName||""} onChange={set("firstName")} /></Field>
        </div>
        <div style={{ gridColumn:"span 2" }}>
          <Field label="Middle name" required><Input value={data.middleName||""} onChange={set("middleName")} /></Field>
        </div>
        <div style={{ gridColumn:"span 2" }}>
          <Field label="Last / Surname" required><Input value={data.lastName||""} onChange={set("lastName")} /></Field>
        </div>
        <Field label="Date of birth" required><Input type="date" value={data.dob||""} onChange={set("dob")} /></Field>
        <Field label="Age" hint="Auto-calculated">
          <div style={{ background:"#F7F7F4", border:"1px solid #D8D8D2", borderRadius:8, padding:"8px 11px", height:38, display:"flex", alignItems:"center" }}>
            {age ? `${age.years} yrs, ${age.months} months` : "—"}
          </div>
        </Field>
      </div>
    </Card>
  );
}

function Step2NextOfKin({ data, onChange }) {
  const set = (k) => (e) => onChange({ ...data, [k]: e.target.value });
  return (
    <Card title="Next of Kin" subtitle="Primary legal contact" icon="👨👩👧">
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        <div style={{ gridColumn:"span 2" }}><Field label="First name" required><Input value={data.kinFirstName||""} onChange={set("kinFirstName")} /></Field></div>
        <div style={{ gridColumn:"span 2" }}><Field label="Last / Surname" required><Input value={data.kinLastName||""} onChange={set("kinLastName")} /></Field></div>
        <Field label="Relationship" required>
          <Select value={data.kinRelation||""} onChange={set("kinRelation")}>
            <option value="">— select —</option>
            {["Spouse","Mother","Father","Son","Daughter","Other"].map(r=>(<option key={r}>{r}</option>))}
          </Select>
        </Field>
        <div style={{ gridColumn:"span 3" }}><Field label="Kin Phone" required><PhoneInput value={data.kinPhone||""} onChange={set("kinPhone")} /></Field></div>
      </div>
    </Card>
  );
}

function Step3EmergencyContact({ data, onChange }) {
  const set = (k) => (e) => onChange({ ...data, [k]: e.target.value });
  return (
    <Card title="Emergency Contact" subtitle="Optional secondary contact" icon="🚨">
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        <div style={{ gridColumn:"span 2" }}><Field label="Full name"><Input value={data.emergencyName||""} onChange={set("emergencyName")} /></Field></div>
        <Field label="Relationship"><Input value={data.emergencyRelation||""} onChange={set("emergencyRelation")} /></Field>
        <Field label="Phone"><PhoneInput value={data.emergencyPhone||""} onChange={set("emergencyPhone")} /></Field>
      </div>
    </Card>
  );
}

function Step4EmployerConsent({ data, onChange }) {
  const toggle = (k) => onChange({ ...data, [k]: !data[k] });
  return (
    <Card title="Consent & Data Protection" icon="🏢">
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {[
          { k:"consentHMIS", label:"I consent to digitised health record storage." },
          { k:"consentSMS",  label:"I consent to SMS notifications." },
        ].map(({ k, label }) => (
          <label key={k} style={{ display:"flex", gap:10, fontSize:13, cursor:"pointer" }}>
            <input type="checkbox" checked={data[k]||false} onChange={()=>toggle(k)} style={{ accentColor:"#1B6E3F" }} />
            {label}
          </label>
        ))}
      </div>
    </Card>
  );
}

export default function PatientRegistration() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [demo, setDemo] = useState({ nationality:"Kenyan", idType:"national", consentHMIS:true });

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) return <div style={{ padding:40, textAlign:"center" }}><h2>Registration Complete</h2><Btn onClick={()=>setSubmitted(false)}>Back</Btn></div>;

  return (
    <div style={{ minHeight:"100vh", background:"#F7F7F4", padding:24 }}>
      <div style={{ maxWidth:760, margin:"0 auto" }}>
        <div style={{ marginBottom:24, display:"flex", justifyContent:"space-between" }}>
          <div><h1>New Patient Registry</h1><p>Step {step} of 4</p></div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn variant="ghost" onClick={printRegistrationForm}>Print Form</Btn>
            {step > 1 && <Btn variant="ghost" onClick={()=>setStep(step-1)}>Back</Btn>}
            {step < 4 ? <Btn onClick={()=>setStep(step+1)}>Continue</Btn> : <Btn onClick={handleSubmit}>Register</Btn>}
          </div>
        </div>
        {step===1 && <Step1Demographics data={demo} onChange={setDemo} />}
        {step===2 && <Step2NextOfKin    data={demo} onChange={setDemo} />}
        {step===3 && <Step3EmergencyContact data={demo} onChange={setDemo} />}
        {step===4 && <Step4EmployerConsent  data={demo} onChange={setDemo} />}
      </div>
    </div>
  );
}
