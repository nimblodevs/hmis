import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Hospital,
  User,
  Users,
  AlertCircle,
  Briefcase,
  Search,
  Printer,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Trash2,
  UserPlus,
  Info,
  AlertTriangle,
  Check,
  XCircle,
  Calendar,
  MapPin,
  ChevronDown,
  Loader2,
  CheckCircle2
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const API_URL = "http://localhost:5000/api/patients";

const KENYA_COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa",
  "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
  "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos",
  "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a",
  "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu",
  "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi", "Trans Nzoia",
  "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
];

// ─── Print form ───────────────────────────────────────────────────────────────
function printRegistrationForm() {
  const w = window.open("", "_blank", "width=900,height=1200");
  if (!w) return;
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

  /* Vitals strip */
  .vitals { display: grid; grid-template-columns: repeat(6,1fr); gap: 8px; }
  .vital { border: 1px solid #ccc; border-radius: 4px; padding: 5px 6px; text-align: center; }
  .vital .vl { font-size: 7pt; color: #555; text-transform: uppercase; letter-spacing: 0.3px; }
  .vital .vb { border-bottom: 1px solid #888; height: 18px; margin-top: 4px; }

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
        ${["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."].map(t => `<span class="opt"><span class="sq"></span>${t}</span>`).join("")}
      </div>
    </div>
    <div class="field">
      <label>Gender <span class="req">*</span></label>
      <div class="options">
        ${["Male", "Female", "Other"].map(g => `<span class="opt"><span class="ci"></span>${g}</span>`).join("")}
      </div>
    </div>
    <div class="field">
      <label>Marital status <span class="req">*</span></label>
      <div class="options" style="flex-direction:column;gap:3px">
        ${["Single", "Married", "Separated", "Divorced", "Widowed"].map(m => `<span class="opt"><span class="sq"></span>${m}</span>`).join("")}
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
        ${["National ID", "Passport", "Birth Cert.", "Alien ID"].map(t => `<span class="opt"><span class="ci"></span>${t}</span>`).join("")}
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

// ─── Shared UI atoms (Tailwind Port) ──────────────────────────────────────────
const Field = ({ label, required, hint, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-semibold text-clay-600 tracking-wider uppercase">
      {label}{required && <span className="text-red-600 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <span className="text-[10px] text-clay-500">{hint}</span>}
    {error && <span className="text-[10px] text-red-600">{error}</span>}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`text-[13px] text-clay-950 bg-white border border-clay-200 rounded-lg px-3 py-2 outline-none w-full focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all ${className}`}
  />
);

const Select = ({ children, className = "", ...props }) => (
  <div className="relative">
    <select
      {...props}
      className={`text-[13px] text-clay-950 bg-white border border-clay-200 rounded-lg px-3 py-2 pr-8 outline-none w-full appearance-none cursor-pointer focus:border-blue-600 transition-all ${className}`}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-clay-500 pointer-events-none" />
  </div>
);

const PhoneInput = ({ value, onChange }) => (
  <div className="flex gap-1.5">
    <div className="bg-clay-100 border border-clay-200 rounded-lg px-2.5 py-2 text-[13px] font-semibold flex items-center gap-1.5 whitespace-nowrap">
      🇰🇪 +254
    </div>
    <Input
      type="tel"
      value={value}
      onChange={onChange}
      placeholder="7XX XXX XXX"
      maxLength={10}
      className="flex-1"
    />
  </div>
);

const Divider = ({ children }) => (
  <div className="text-[10px] font-bold uppercase tracking-widest text-clay-500 flex items-center gap-2 col-span-full my-1">
    {children}
    <div className="flex-1 h-px bg-clay-200" />
  </div>
);

const Alert = ({ type = "info", children }) => {
  const styles = {
    info: "bg-blue-50 text-blue-800 border-blue-100",
    warn: "bg-yellow-50 text-yellow-800 border-yellow-100",
    success: "bg-green-50 text-green-800 border-green-100",
    danger: "bg-red-50 text-red-800 border-red-100",
  };
  const Icons = {
    info: Info,
    warn: AlertTriangle,
    success: Check,
    danger: XCircle
  };
  const IconComp = Icons[type];
  return (
    <div className={`rounded-lg p-3 text-[12px] flex gap-2.5 items-start mb-4 border ${styles[type]}`}>
      <IconComp className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
};

const Btn = ({ variant = "primary", onClick, disabled, children, className = "" }) => {
  const variants = {
    primary: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
    ghost: "bg-transparent text-clay-600 border-clay-200 hover:bg-clay-100",
    danger: "bg-red-50 text-red-600 border-red-100 hover:bg-red-100",
    success: "bg-green-50 text-green-800 border-green-100 hover:bg-green-100",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-[13px] font-semibold px-4 py-2 rounded-lg border flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ title, subtitle, icon: IconComp, children }) => (
  <div className="bg-white border border-clay-200 rounded-xl overflow-hidden mb-4 shadow-sm">
    <div className="px-5 py-3.5 border-b border-clay-100 flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
        {IconComp && <IconComp className="w-4.5 h-4.5" />}
      </div>
      <div>
        <div className="text-[13px] font-semibold text-clay-900">{title}</div>
        {subtitle && <div className="text-[11px] text-clay-500 mt-0.5">{subtitle}</div>}
      </div>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcAge(dob) {
  if (!dob) return null;
  const d = new Date(dob), now = new Date();
  if (isNaN(d.getTime())) return null;
  let yrs = now.getFullYear() - d.getFullYear();
  let mths = now.getMonth() - d.getMonth();
  if (now.getDate() < d.getDate()) mths--;
  if (mths < 0) { yrs--; mths += 12; }
  return { years: Math.max(0, yrs), months: Math.max(0, mths) };
}
function today() { return new Date().toISOString().split("T")[0]; }

// ─── Step components ──────────────────────────────────────────────────────────

function Step1Demographics({ data, onChange }) {
  const { currentUser, ROLES } = useAuth();
  const isMRO = currentUser?.role === ROLES.MEDICAL_RECORD_OFFICER || currentUser?.role === ROLES.ADMIN;
  const isRegistered = !!data.uhid;
  const canEditPersonal = !isRegistered || isMRO;

  const set = (k) => (e) => onChange({ ...data, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchDone, setSearchDone] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearching(true);
    try {
      const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(q)}`);
      const results = await res.json();
      setSearchResults(results);
      setSearchDone(true);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setSearching(false);
    }
  };

  const loadPatient = (p) => {
    onChange({
      ...data,
      ...p,
      uhid: p.uhid || p.mrn || "", // Map old MRN to UHID
      dob: p.dob ? p.dob.split("T")[0] : "", // Format for date input
      phone: p.phone ? p.phone.replace(/^0/, "") : "",
    });
    setSearchQuery("");
    setSearchResults([]);
    setSearchDone(false);
  };

  const age = calcAge(data.dob);

  return (
    <Card title="Patient Demographics" subtitle="Personal details, identification & contact" icon={User}>
      <Alert type="info">
        All fields marked <strong className="text-red-600">*</strong> are mandatory per Kenya Health Information System (KHIS) standards.
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="relative">
          <label className="text-[11px] font-semibold text-clay-600 tracking-wider uppercase mb-1 block tracking-tight">Search existing patient</label>
          <div className="flex gap-1.5">
            <Input
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setSearchDone(false); setSearchResults([]); }}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Name, UHID, ID no. or phone…"
            />
            <Btn onClick={handleSearch} disabled={searching} className="whitespace-nowrap">
              <Search className="w-4 h-4" /> {searching ? "Searching…" : "Search"}
            </Btn>
          </div>
          {searchDone && (
            <div className="absolute top-full left-0 right-0 mt-1 border border-clay-200 rounded-lg bg-white overflow-hidden shadow-xl z-50 max-h-[300px] overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="p-3 text-[12px] text-clay-500">No matching patient found.</div>
              ) : searchResults.map((p, idx) => (
                <div key={p.uhid || p.mrn || idx} onClick={() => loadPatient(p)}
                  className="p-2.5 cursor-pointer border-b border-clay-100 text-[12px] flex justify-between items-center hover:bg-blue-50 transition-colors">
                  <div>
                    <div className="font-semibold text-clay-950">
                      {[p.firstName, p.middleName, p.lastName].filter(Boolean).join(" ")}
                    </div>
                    <div className="text-clay-500 text-[11px] mt-0.5">
                      ID: {p.idNumber || p.nationalId || "N/A"} · {p.gender} · {p.dob ? new Date(p.dob).toLocaleDateString('en-GB') : "No DOB"} · {p.phone || p.contactNumber || "No Phone"}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {p.uhid || p.mrn}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-[11px] font-semibold text-clay-600 tracking-wider uppercase mb-1 block tracking-tight">UHID (HPID)</label>
          <div className="flex items-center justify-between gap-2 bg-clay-50 border border-clay-200 border-dashed rounded-lg px-3 h-[38px]">
            <div className="flex items-center gap-2">
              <Hospital className="w-4 h-4 text-clay-400" />
              <span className={`font-mono text-[13px] font-bold tracking-tight ${data.uhid ? 'text-blue-700' : 'text-clay-400'}`}>
                {data.uhid || "Auto-generated on registration"}
              </span>
            </div>
            {isRegistered && (
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="checkbox" checked={data.suspended || false} onChange={set("suspended")} className="accent-red-600 w-3.5 h-3.5 cursor-pointer" />
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-tighter group-hover:underline">Suspend</span>
              </label>
            )}
          </div>
        </div>
      </div>

      {data.suspended && (
        <div className="mb-5 animate-in slide-in-from-top-1 duration-200">
           <Field label="Suspension Reason" required hint="Required to maintain compliance">
            <Input 
              value={data.suspensionReason || ""} 
              onChange={set("suspensionReason")} 
              placeholder="e.g. Duplicate record, incorrect ID, experimental data..." 
              className="border-red-200 focus:ring-red-500 focus:border-red-500 bg-red-50/30"
            />
          </Field>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Divider>Personal details</Divider>
        <Field label="Title" required>
          <Select value={data.title || ""} onChange={set("title")} disabled={!canEditPersonal}>
            <option value="">— select —</option>
            {["Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Rev.", "Hon."].map(t => (<option key={t}>{t}</option>))}
          </Select>
        </Field>
        <Field label="Gender" required>
          <Select value={data.gender || ""} onChange={set("gender")} disabled={!canEditPersonal}>
            <option value="">— select —</option>
            {["Male", "Female", "Other"].map(g => <option key={g}>{g}</option>)}
          </Select>
        </Field>
        <div className="col-span-1">
          <Field label="Marital status" required>
            <Select value={data.marital || ""} onChange={set("marital")} disabled={!canEditPersonal}>
              <option value="">— select —</option>
              {["Single", "Married", "Separated", "Divorced", "Widowed"].map(m => (<option key={m}>{m}</option>))}
            </Select>
          </Field>
        </div>
        <div className="col-span-1">
          <Field label="Religion" required>
            <Select value={data.religion || ""} onChange={set("religion")} disabled={!canEditPersonal}>
              <option value="">— select —</option>
              {["Christianity - Catholic", "Christianity - Protestant", "Christianity - Adventists", "Islam", "Hinduism", "Atheism", "Other"].map(r => (<option key={r}>{r}</option>))}
            </Select>
          </Field>
        </div>
        <div className="col-span-1 md:col-span-2">
          <Field label="First name" required>
            <Input value={data.firstName || ""} onChange={set("firstName")} placeholder="e.g. Amina" disabled={!canEditPersonal} />
          </Field>
        </div>
        <div className="col-span-1 md:col-span-2">
          <Field label="Middle name" required>
            <Input value={data.middleName || ""} onChange={set("middleName")} placeholder="e.g. Njeri" disabled={!canEditPersonal} />
          </Field>
        </div>
        <div className="col-span-1 md:col-span-2">
          <Field label="Last / Surname" required>
            <Input value={data.lastName || ""} onChange={set("lastName")} placeholder="e.g. Wanjiku" disabled={!canEditPersonal} />
          </Field>
        </div>
        <Field label="Date of birth" required>
          <div className="relative">
            <Input type="date" value={data.dob || ""} onChange={set("dob")} max={today()} className="pl-9" disabled={!canEditPersonal} />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clay-400 pointer-events-none" />
          </div>
        </Field>
        <Field label="Age" hint="Auto-calculated">
          <div className={`text-[13px] border rounded-lg px-3 h-[38px] flex items-center transition-colors ${age ? 'text-blue-700 bg-blue-50 border-blue-200 font-semibold' : 'text-clay-400 bg-clay-50 border-clay-200'}`}>
            {age ? `${age.years} yrs, ${age.months} months` : "—"}
          </div>
        </Field>

        <Divider>National Identification</Divider>
        <Field label="ID type" required>
          <Select value={data.idType || "national"} onChange={set("idType")} disabled={!canEditPersonal}>
            <option value="national">National ID</option>
            <option value="passport">Passport</option>
            <option value="birth">Birth Certificate</option>
            <option value="alien">Alien ID</option>
          </Select>
        </Field>
        <div className="col-span-1 md:col-span-3">
          <Field label="ID number" required hint={data.idType === "national" || !data.idType ? "8-digit Kenya National ID" : "As per document"}>
            <Input value={data.idNumber || ""} onChange={set("idNumber")} placeholder={data.idType === "national" || !data.idType ? "e.g. 12345678" : "Enter number"} disabled={!canEditPersonal} />
          </Field>
        </div>

        <Divider>Contact & Residence</Divider>
        <div className="col-span-1 md:col-span-2">
          <Field label="Primary phone" required hint="M-Pesa registered number preferred">
            <PhoneInput value={data.phone || ""} onChange={set("phone")} />
          </Field>
        </div>
        <div className="col-span-1 md:col-span-2">
          <Field label="Alternative phone" required>
            <PhoneInput value={data.phone2 || ""} onChange={set("phone2")} />
          </Field>
        </div>
        <div className="col-span-1 md:col-span-2">
          <Field label="Email address" required>
            <Input type="email" value={data.email || ""} onChange={set("email")} placeholder="patient@email.com" />
          </Field>
        </div>
        <Field label="County" required>
          <Select value={data.county || ""} onChange={set("county")}>
            <option value="">— select county —</option>
            {KENYA_COUNTIES.map(c => <option key={c}>{c}</option>)}
          </Select>
        </Field>
        <Field label="Sub-county / Town" required>
          <Input value={data.subCounty || ""} onChange={set("subCounty")} placeholder="e.g. Westlands" />
        </Field>
        <div className="col-span-full">
          <Field label="Physical address" required>
            <div className="relative">
              <Input value={data.address || ""} onChange={set("address")} placeholder="Street / estate / building name" className="pl-9" />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clay-400 pointer-events-none" />
            </div>
          </Field>
        </div>
      </div>
    </Card>
  );
}

function Step2NextOfKin({ data, onChange }) {
  const set = (k) => (e) => onChange({ ...data, [k]: e.target.value });
  return (
    <Card title="Next of Kin" subtitle="Primary legal contact — required per Kenya Medical Records guidelines" icon={Users}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-2">
          <Field label="First name" required>
            <Input value={data.kinFirstName || ""} onChange={set("kinFirstName")} placeholder="e.g. James" />
          </Field>
        </div>
        <div className="col-span-1 md:col-span-2">
          <Field label="Middle name" required>
            <Input value={data.kinMiddleName || ""} onChange={set("kinMiddleName")} placeholder="e.g. Otieno" />
          </Field>
        </div>
        <div className="col-span-1 md:col-span-2">
          <Field label="Last / Surname" required>
            <Input value={data.kinLastName || ""} onChange={set("kinLastName")} placeholder="e.g. Mwangi" />
          </Field>
        </div>
        <Field label="Relationship" required>
          <Select value={data.kinRelation || ""} onChange={set("kinRelation")}>
            <option value="">— select —</option>
            {["Spouse / Partner", "Mother", "Father", "Son", "Daughter", "Brother", "Sister", "Guardian", "Friend", "Other"].map(r => (<option key={r}>{r}</option>))}
          </Select>
        </Field>
        <Field label="County of residence" required>
          <Select value={data.kinCounty || ""} onChange={set("kinCounty")}>
            <option value="">— county —</option>
            {KENYA_COUNTIES.map(c => <option key={c}>{c}</option>)}
          </Select>
        </Field>
        <div className="col-span-1 md:col-span-2">
          <Field label="Emergency phone" required>
            <PhoneInput value={data.kinPhone || ""} onChange={set("kinPhone")} />
          </Field>
        </div>
        <div className="col-span-1 md:col-span-2">
          <Field label="Alternative phone" required>
            <PhoneInput value={data.kinPhone2 || ""} onChange={set("kinPhone2")} />
          </Field>
        </div>
        <div className="col-span-1 md:col-span-2">
          <Field label="Email address" required>
            <Input type="email" value={data.kinEmail || ""} onChange={set("kinEmail")} placeholder="nok@email.com" />
          </Field>
        </div>
        <div className="col-span-full">
          <Field label="Physical address" required>
            <Input value={data.kinAddress || ""} onChange={set("kinAddress")} placeholder="Street / estate / building name" />
          </Field>
        </div>
      </div>
    </Card>
  );
}

function Step3EmergencyContact({ data, onChange }) {
  const set = (k) => (e) => onChange({ ...data, [k]: e.target.value });
  const sameAsNOK = data.emergencySameAsNOK || false;

  const handleSameAsNOK = (checked) => {
    if (checked) {
      onChange({
        ...data,
        emergencySameAsNOK: true,
        emergencyFirstName: data.kinFirstName || "",
        emergencyMiddleName: data.kinMiddleName || "",
        emergencyLastName: data.kinLastName || "",
        emergencyRelation: data.kinRelation || "",
        emergencyCounty: data.kinCounty || "",
        emergencyPhone: data.kinPhone || "",
        emergencyPhone2: data.kinPhone2 || "",
        emergencyAddress: data.kinAddress || "",
      });
    } else {
      onChange({
        ...data,
        emergencySameAsNOK: false,
        emergencyFirstName: "", emergencyMiddleName: "", emergencyLastName: "",
        emergencyRelation: "", emergencyCounty: "",
        emergencyPhone: "", emergencyPhone2: "", emergencyAddress: "",
      });
    }
  };

  return (
    <Card title="Emergency Contact" subtitle="Optional secondary contact — may differ from next of kin" icon={AlertCircle}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-full flex items-center gap-2.5 bg-blue-50 border border-blue-100 rounded-lg p-3 cursor-pointer group transition-colors hover:bg-blue-100" onClick={() => handleSameAsNOK(!sameAsNOK)}>
          <input type="checkbox" checked={sameAsNOK} onChange={e => handleSameAsNOK(e.target.checked)} className="accent-blue-600 cursor-pointer w-4 h-4" onClick={e => e.stopPropagation()} />
          <span className="text-[13px] font-medium text-blue-800">Same as next of kin contact</span>
          {sameAsNOK && <span className="text-[10px] text-blue-700 ml-auto bg-blue-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-tight">Fields Copied</span>}
        </div>
        <div className={`col-span-1 md:col-span-2 ${sameAsNOK ? 'opacity-50 pointer-events-none' : ''}`}>
          <Field label="First name">
            <Input value={data.emergencyFirstName || ""} onChange={set("emergencyFirstName")} placeholder="e.g. James" />
          </Field>
        </div>
        <div className={sameAsNOK ? 'opacity-50 pointer-events-none' : ''}>
          <Field label="Middle name">
            <Input value={data.emergencyMiddleName || ""} onChange={set("emergencyMiddleName")} placeholder="e.g. Otieno" />
          </Field>
        </div>
        <div className={sameAsNOK ? 'opacity-50 pointer-events-none' : ''}>
          <Field label="Last / Surname">
            <Input value={data.emergencyLastName || ""} onChange={set("emergencyLastName")} placeholder="e.g. Mwangi" />
          </Field>
        </div>
        <div className={sameAsNOK ? 'opacity-50 pointer-events-none' : ''}>
          <Field label="Relationship">
            <Select value={data.emergencyRelation || ""} onChange={set("emergencyRelation")}>
              <option value="">— select —</option>
              {["Spouse / Partner", "Mother", "Father", "Son", "Daughter", "Brother", "Sister", "Guardian", "Friend", "Colleague", "Other"].map(r => (<option key={r}>{r}</option>))}
            </Select>
          </Field>
        </div>
        <div className={sameAsNOK ? 'opacity-50 pointer-events-none' : ''}>
          <Field label="County">
            <Select value={data.emergencyCounty || ""} onChange={set("emergencyCounty")}>
              <option value="">— county —</option>
              {KENYA_COUNTIES.map(c => <option key={c}>{c}</option>)}
            </Select>
          </Field>
        </div>
        <div className={`col-span-1 md:col-span-2 ${sameAsNOK ? 'opacity-50 pointer-events-none' : ''}`}>
          <Field label="Primary phone">
            <PhoneInput value={data.emergencyPhone || ""} onChange={set("emergencyPhone")} />
          </Field>
        </div>
        <div className={`col-span-1 md:col-span-2 ${sameAsNOK ? 'opacity-50 pointer-events-none' : ''}`}>
          <Field label="Alternative phone">
            <PhoneInput value={data.emergencyPhone2 || ""} onChange={set("emergencyPhone2")} />
          </Field>
        </div>
        <div className={`col-span-full ${sameAsNOK ? 'opacity-50 pointer-events-none' : ''}`}>
          <Field label="Physical address">
            <Input value={data.emergencyAddress || ""} onChange={set("emergencyAddress")} placeholder="Street / estate / building name" />
          </Field>
        </div>
      </div>
    </Card>
  );
}

function Step4EmployerConsent({ data, onChange }) {
  const set = (k) => (e) => onChange({ ...data, [k]: e.target.value });
  const toggleConsent = (k) => onChange({ ...data, [k]: !data[k] });
  return (
    <Card title="Employer & Consent" subtitle="Optional employer details and data protection consent" icon={Briefcase}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Divider>Employer details</Divider>
        <div className="col-span-1 md:col-span-2">
          <Field label="Employer / organisation name">
            <Input value={data.employerName || ""} onChange={set("employerName")} placeholder="e.g. Kenya Power, Safaricom" />
          </Field>
        </div>
        <div className="col-span-1 md:col-span-2">
          <Field label="Job title / designation">
            <Input value={data.jobTitle || ""} onChange={set("jobTitle")} placeholder="e.g. Engineer, Accountant" />
          </Field>
        </div>
        <div className="col-span-full">
          <Field label="Employer physical address">
            <Input value={data.employerAddress || ""} onChange={set("employerAddress")} placeholder="Street / building / town" />
          </Field>
        </div>
        <Divider>Consent & data protection</Divider>
        <div className="col-span-full flex flex-col gap-3">
          {[
            { k: "consentHMIS", label: "I consent to my health information being stored in this facility's HMIS system as required by the Kenya Health Act, 2017 and the Data Protection Act, 2019." },
            { k: "consentSMS", label: "I consent to SMS / M-Pesa notifications for appointment reminders and billing." },
            { k: "consentDHIS", label: "I agree to share anonymised data with the county health department for public health reporting (DHIS2 / KHIS)." },
          ].map(({ k, label: lbl }) => (
            <label key={k} className="flex items-start gap-2.5 cursor-pointer text-[12px] text-clay-600 group">
              <input type="checkbox" checked={data[k] || false} onChange={() => toggleConsent(k)} className="mt-1 accent-blue-600 cursor-pointer w-4 h-4" />
              <span className="group-hover:text-blue-700 transition-colors">{lbl}</span>
            </label>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function PatientRegistration() {
  const navigate = useNavigate();
  const [resetKey, setResetKey] = useState(0);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uhid, setUhid] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState(new Date());
  const [submitted, setSubmitted] = useState(false);
  const [registeredOn, setRegisteredOn] = useState(null);
  const [demo, setDemo] = useState({ nationality: "Kenyan", idType: "national", consentHMIS: true });

  const STEPS = [
    { n: 1, label: "Demographics", sub: "Identity & contact", icon: User },
    { n: 2, label: "Next of Kin", sub: "Primary emergency contact", icon: Users },
    { n: 3, label: "Emergency Contact", sub: "Secondary contact", icon: AlertCircle },
    { n: 4, label: "Employer & Consent", sub: "Employment & data consent", icon: Briefcase },
  ];

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const navStep = (dir) => {
    const next = step + dir;
    if (next < 1 || next > STEPS.length) return;
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const isUpdate = !!demo.uhid;
      const url = isUpdate ? `${API_URL}/uhid/${demo.uhid}` : API_URL;
      const method = isUpdate ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(demo),
      });
      const result = await res.json();
      if (res.ok) {
        setUhid(result.uhid);
        setRegisteredOn(new Date(result.registeredOn || result.updatedAt));
        setSubmitted(true);
      } else {
        alert(`${isUpdate ? "Update" : "Registration"} failed: ` + result.message);
      }
    } catch (err) {
      alert("Request failed. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    const fullName = [demo.title, demo.firstName, demo.middleName, demo.lastName].filter(Boolean).join(" ");
    return (
      <div className="min-h-screen bg-clay-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-10 max-w-[500px] w-full text-center border border-clay-200 shadow-xl">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700 mb-1">Patient Registered!</div>
          <div className="text-[13px] text-clay-500 mb-6 font-medium">Record created and synced to KHIS / DHIS2</div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8 text-left">
            {[
              ["UHID", uhid],
              ["Full name", fullName || "—"],
              ["Registered on", registeredOn?.toLocaleString("en-KE")],
              ["Facility", "Mater Hospital (MFL 13104)"],
              ["Clerk", "Registration Desk 01"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-start text-[12px] py-2 border-b border-blue-100 last:border-0 border-dashed gap-3">
                <span className="text-clay-500 shrink-0 font-medium uppercase tracking-tighter text-[10px]">{k}</span>
                <span className="font-bold text-blue-800 text-right">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2.5 justify-center">
            <Btn variant="primary" onClick={printRegistrationForm}>
              <Printer className="w-4 h-4" /> Print receipt
            </Btn>
            <Btn variant="ghost" onClick={() => {
              setSubmitted(false); setStep(1); setRegisteredOn(null); setUhid(null);
              setDemo({ nationality: "Kenyan", idType: "national", consentHMIS: true });
              setResetKey(pk => pk + 1);
            }}>
              <UserPlus className="w-4 h-4" /> New patient
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clay-50 text-clay-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Stepper */}
      <nav className="bg-white border-b border-clay-200 px-6">
        <div className="flex max-w-3xl mx-auto">
          {STEPS.map(s => {
            const IconComp = s.icon;
            return (
              <div key={s.n}
                onClick={() => { if (s.n <= step) setStep(s.n); }}
                className={`flex items-center gap-3 py-4 flex-1 border-b-2 transition-all group ${step === s.n ? 'border-blue-600' : s.n < step ? 'border-blue-600 cursor-pointer' : 'border-transparent opacity-40'}`}>
                <div className={`w-8 h-8 rounded-lg text-[13px] font-bold flex items-center justify-center shrink-0 border-2 transition-all ${step === s.n ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : s.n < step ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-clay-50 border-clay-200 text-clay-500'}`}>
                  {s.n < step ? <Check className="w-4 h-4" /> : <IconComp className="w-4 h-4" />}
                </div>
                <div className="hidden sm:block">
                  <div className={`text-[12px] font-bold tracking-tight transition-colors ${step === s.n ? 'text-blue-800' : s.n < step ? 'text-blue-700' : 'text-clay-500'}`}>{s.label}</div>
                  <div className="text-[10px] text-clay-400 font-semibold uppercase tracking-widest">{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto py-10 px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-blue-800 tracking-tight">Patient Registration</h1>
            <p className="text-[13px] text-clay-500 font-medium">Step {step} of {STEPS.length}: {STEPS[step - 1]?.label}</p>
          </div>
          <div 
            onClick={() => navigate("/queues")}
            className="bg-red-50 text-red-700 text-[11px] font-bold px-3 py-1.5 rounded-full border border-red-100 flex items-center gap-2 shadow-sm shadow-red-50 cursor-pointer hover:bg-red-100 transition-colors group"
            title="View Patient Queue"
          >
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-sm shadow-red-500 group-hover:scale-110 transition-transform" />
            Walk-in Queue: 4
          </div>
        </div>

        {step === 1 && <Step1Demographics key={`s1-${resetKey}`} data={demo} onChange={setDemo} />}
        {step === 2 && <Step2NextOfKin key={`s2-${resetKey}`} data={demo} onChange={setDemo} />}
        {step === 3 && <Step3EmergencyContact key={`s3-${resetKey}`} data={demo} onChange={setDemo} />}
        {step === 4 && <Step4EmployerConsent key={`s4-${resetKey}`} data={demo} onChange={setDemo} />}
        {/* Action bar - Integrated into the form flow */}
        <div className="mt-10 pt-8 border-t border-clay-200 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-[12px] text-clay-500 flex items-center gap-3 order-2 sm:order-1">
            <div className="flex -space-x-1.5 overflow-hidden">
              {STEPS.map(s => (
                <div key={s.n} className={`w-1.5 h-1.5 rounded-full border border-white ${s.n <= step ? 'bg-blue-600' : 'bg-clay-200'}`} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <strong className="text-clay-950 font-bold">Step {step} of {STEPS.length}</strong>
              <span className="text-clay-300">|</span>
              <span className="font-bold text-[10px] text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">{STEPS[step - 1]?.label}</span>
            </div>
          </div>
          <div className="flex gap-2.5 order-1 sm:order-2 w-full sm:w-auto justify-center">
            {step === 1 && (
              <Btn variant="ghost" onClick={printRegistrationForm}>
                <Printer className="w-4 h-4" /> Print
              </Btn>
            )}
            {step > 1 && (
              <Btn variant="ghost" onClick={() => navStep(-1)}>
                <ArrowLeft className="w-4 h-4" /> Back
              </Btn>
            )}
            <Btn variant="ghost" onClick={() => {
                setDemo({ nationality: "Kenyan", idType: "national", consentHMIS: true });
                setUhid(null); setSubmitted(false);
                setStep(1); setRegisteredOn(null);
                setResetKey(pk => pk + 1);
            }}>
              <Trash2 className="w-4 h-4" /> Clear
            </Btn>
            {step < STEPS.length && (
              <Btn variant="primary" onClick={() => navStep(1)}>
                Continue <ArrowRight className="w-4 h-4" />
              </Btn>
            )}
            {step === STEPS.length && (
              <Btn variant="primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> {demo.uhid ? "Updating..." : "Registering..."}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> {demo.uhid ? "Update Patient" : "Register Patient"}
                  </>
                )}
              </Btn>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
