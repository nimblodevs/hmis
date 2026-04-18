export const T = {
  navy: "#071828",
  navyM: "#0d2744",
  navyL: "#0f3460",
  cyan: "#00bcd4",
  cyanD: "#0097a7",
  white: "#ffffff",
  bg: "#f1f5f9",
  card: "#ffffff",
  slate: "#475569",
  slateL: "#94a3b8",
  border: "#e2e8f0",
  green: "#059669",
  red: "#dc2626",
  amber: "#d97706",
  orange: "#ea580c",
  blue: "#1d4ed8",
  purple: "#7c3aed",
  teal: "#0e7490",
};

export const ICD10 = [
  { code: "I10", desc: "Essential hypertension" },
  { code: "E11.9", desc: "Type 2 diabetes mellitus" },
  { code: "N39.0", desc: "Urinary tract infection" },
  { code: "J03.0", desc: "Acute streptococcal tonsillitis" },
  { code: "B50.9", desc: "Plasmodium falciparum malaria" },
  { code: "I21.0", desc: "Anterior STEMI" },
  { code: "J18.9", desc: "Pneumonia, unspecified" },
  { code: "K29.7", desc: "Gastritis, unspecified" },
  { code: "M79.3", desc: "Panniculitis" },
  { code: "R51", desc: "Headache" },
  { code: "R50.9", desc: "Fever, unspecified" },
  { code: "R10.4", desc: "Other and unspecified abdominal pain" },
];

export const LAB_TESTS = [
  { id: "l1", name: "Full Blood Count (FBC)", cat: "Haematology", specimen: "EDTA", container: "Purple Top", colour: "#7c3aed", vol: "3mL" },
  { id: "l2", name: "ESR", cat: "Haematology", specimen: "EDTA", container: "Purple Top", colour: "#7c3aed", vol: "2mL" },
  { id: "l4", name: "Fasting Blood Sugar (FBS)", cat: "Biochemistry", specimen: "Fluoride", container: "Grey Top", colour: "#64748b", vol: "2mL" },
  { id: "l5", name: "HbA1c", cat: "Biochemistry", specimen: "EDTA", container: "Purple Top", colour: "#7c3aed", vol: "2mL" },
  { id: "l6", name: "Lipid Profile", cat: "Biochemistry", specimen: "SST", container: "Gold Top", colour: "#d97706", vol: "5mL" },
  { id: "l7", name: "Liver Function Tests (LFT)", cat: "Biochemistry", specimen: "SST", container: "Gold Top", colour: "#d97706", vol: "5mL" },
  { id: "l8", name: "Renal Function Tests (RFT)", cat: "Biochemistry", specimen: "SST", container: "Gold Top", colour: "#d97706", vol: "5mL" },
  { id: "l9", name: "Serum Electrolytes", cat: "Biochemistry", specimen: "Heparin", container: "Green Top", colour: "#059669", vol: "3mL" },
  { id: "l10", name: "Blood Culture", cat: "Microbiology", specimen: "Culture", container: "Culture Btl", colour: "#dc2626", vol: "10mL" },
  { id: "l11", name: "Urine Culture & Sensitivity", cat: "Microbiology", specimen: "MSU", container: "Urine Cup", colour: "#0369a1", vol: "10mL" },
  { id: "l16", name: "Malaria RDT", cat: "Parasitology", specimen: "EDTA", container: "Purple Top", colour: "#7c3aed", vol: "1mL" },
  { id: "l17", name: "Blood Film for Malaria", cat: "Parasitology", specimen: "EDTA", container: "Purple Top", colour: "#7c3aed", vol: "1mL" },
  { id: "l18", name: "Urinalysis (UA)", cat: "Urine", specimen: "Urine", container: "Urine Cup", colour: "#0369a1", vol: "5mL" },
  { id: "l20", name: "Troponin I (Cardiac)", cat: "Cardiac", specimen: "SST", container: "Gold Top", colour: "#d97706", vol: "3mL" },
  { id: "l22", name: "Thyroid Function (TSH/FT4)", cat: "Endocrine", specimen: "SST", container: "Gold Top", colour: "#d97706", vol: "3mL" },
];

export const LAB_REF = {
  l1_hb: { name: "Haemoglobin", unit: "g/dL", type: "num", mLo: 13.0, mHi: 17.0, fLo: 12.0, fHi: 16.0, cLo: 7.0, cHi: 20.0 },
  l1_wbc: { name: "WBC", unit: "x10⁹/L", type: "num", lo: 4.0, hi: 11.0, cLo: 2.0, cHi: 30.0 },
  l1_plt: { name: "Platelets", unit: "x10⁹/L", type: "num", lo: 150, hi: 400, cLo: 50, cHi: 1000 },
  l1_pcv: { name: "PCV/Haematocrit", unit: "%", type: "num", mLo: 40, mHi: 52, fLo: 36, fHi: 48, cLo: 20, cHi: 60 },
  l1_mcv: { name: "MCV", unit: "fL", type: "num", lo: 80, hi: 100 },
  l1_mchc: { name: "MCHC", unit: "g/dL", type: "num", lo: 32, hi: 36 },
  l4_fbs: { name: "Fasting Blood Sugar", unit: "mmol/L", type: "num", lo: 3.9, hi: 5.6, cLo: 2.8, cHi: 22 },
  l5_hba1c: { name: "HbA1c", unit: "%", type: "num", lo: 4.0, hi: 5.7, cHi: 15 },
  l6_tc: { name: "Total Cholesterol", unit: "mmol/L", type: "num", lo: 0, hi: 5.2, cHi: 9 },
  l6_ldl: { name: "LDL", unit: "mmol/L", type: "num", lo: 0, hi: 3.4 },
  l6_hdl: { name: "HDL", unit: "mmol/L", type: "num", mLo: 1.0, mHi: 99, fLo: 1.3, fHi: 99 },
  l6_trig: { name: "Triglycerides", unit: "mmol/L", type: "num", lo: 0, hi: 1.7, cHi: 6 },
  l7_alt: { name: "ALT", unit: "U/L", type: "num", mLo: 0, mHi: 40, fLo: 0, fHi: 32, cHi: 1000 },
  l7_ast: { name: "AST", unit: "U/L", type: "num", mLo: 0, mHi: 40, fLo: 0, fHi: 32, cHi: 1000 },
  l7_tbil: { name: "Total Bilirubin", unit: "µmol/L", type: "num", lo: 0, hi: 21, cHi: 340 },
  l7_alb: { name: "Albumin", unit: "g/L", type: "num", lo: 35, hi: 50, cLo: 20 },
  l8_crea: { name: "Creatinine", unit: "µmol/L", type: "num", mLo: 62, mHi: 115, fLo: 44, fHi: 97, cHi: 1000 },
  l8_urea: { name: "Urea (BUN)", unit: "mmol/L", type: "num", lo: 2.5, hi: 7.1, cHi: 36 },
  l8_egfr: { name: "eGFR", unit: "mL/min", type: "num", lo: 60, hi: 999, cLo: 15 },
  l9_na: { name: "Sodium", unit: "mmol/L", type: "num", lo: 136, hi: 145, cLo: 120, cHi: 160 },
  l9_k: { name: "Potassium", unit: "mmol/L", type: "num", lo: 3.5, hi: 5.0, cLo: 2.8, cHi: 6.5 },
  l9_cl: { name: "Chloride", unit: "mmol/L", type: "num", lo: 98, hi: 107 },
  l9_bicarb: { name: "Bicarbonate", unit: "mmol/L", type: "num", lo: 22, hi: 29, cLo: 10 },
  l11_uc: { name: "Urine Culture", unit: "", type: "qual", opts: ["No significant growth", "Significant growth - see sensitivity", "Mixed growth - repeat"] },
  l16_rdt: { name: "Malaria RDT", unit: "", type: "qual", opts: ["Negative", "Positive - P. falciparum", "Positive - P. vivax", "Positive - Mixed"] },
  l17_bf: { name: "Blood Film", unit: "", type: "qual", opts: ["No malaria parasites seen", "P. falciparum + (low)", "P. falciparum ++ (moderate)", "P. falciparum +++ (high)"] },
  l18_ua: { name: "Urinalysis", unit: "", type: "desc" },
  l20_trop: { name: "Troponin I", unit: "ng/mL", type: "num", lo: 0, hi: 0.04, cHi: 0.4 },
};

export const TEST_SUBS = {
  l1: ["l1_hb", "l1_wbc", "l1_plt", "l1_pcv", "l1_mcv", "l1_mchc"],
  l4: ["l4_fbs"], l5: ["l5_hba1c"],
  l6: ["l6_tc", "l6_ldl", "l6_hdl", "l6_trig"],
  l7: ["l7_alt", "l7_ast", "l7_tbil", "l7_alb"],
  l8: ["l8_crea", "l8_urea", "l8_egfr"],
  l9: ["l9_na", "l9_k", "l9_cl", "l9_bicarb"],
  l11: ["l11_uc"], l16: ["l16_rdt"], l17: ["l17_bf"],
  l18: ["l18_ua"], l20: ["l20_trop"],
};

export const SERVICES = [
  { id: "s1", name: "Consultation - General", price: 2500, cat: "consultation" },
  { id: "s2", name: "Consultation - Specialist", price: 4500, cat: "consultation" },
  { id: "s3", name: "Consultation - Emergency", price: 3500, cat: "consultation" },
  { id: "s4", name: "ECG", price: 2000, cat: "procedure" },
  { id: "s5", name: "Laboratory - Basic Panel", price: 3500, cat: "lab" },
  { id: "s6", name: "Laboratory - Full Panel", price: 7500, cat: "lab" },
  { id: "s7", name: "Laboratory - Single Test", price: 1500, cat: "lab" },
  { id: "s8", name: "Radiology - Chest X-Ray", price: 3000, cat: "radiology" },
  { id: "s9", name: "Radiology - Ultrasound", price: 4500, cat: "radiology" },
  { id: "s10", name: "Pharmacy - Dispensing Fee", price: 500, cat: "pharmacy" },
  { id: "s11", name: "Pharmacy - Medications", price: 0, cat: "pharmacy" },
  { id: "s12", name: "Wound Dressing", price: 1500, cat: "procedure" },
  { id: "s13", name: "IV Fluid Administration", price: 2000, cat: "procedure" },
];

export const TRIAGE_LEVELS = [
  { lv: "1", label: "Resuscitation", col: "#fff", bg: "#dc2626", desc: "Immediate life threat" },
  { lv: "2", label: "Emergent", col: "#fff", bg: "#ea580c", desc: "High risk, 15 min" },
  { lv: "3", label: "Urgent", col: "#fff", bg: "#d97706", desc: "Stable, 30 min" },
  { lv: "4", label: "Semi-urgent", col: "#1e293b", bg: "#fde047", desc: "Less urgent, 60 min" },
  { lv: "5", label: "Non-urgent", col: "#fff", bg: "#22c55e", desc: "Routine, 120 min" },
];

export const FLOW = [
  { key: "queue", lbl: "Queue", icon: "🎫" },
  { key: "triage", lbl: "Triage", icon: "🩺" },
  { key: "register", lbl: "Register", icon: "📝" },
  { key: "billing", lbl: "Billing", icon: "💳" },
  { key: "doctor", lbl: "Doctor", icon: "🩻" },
  { key: "lab", lbl: "Laboratory", icon: "🧪" },
  { key: "pharmacy", lbl: "Pharmacy", icon: "💊" },
];

export const STATUS_META = {
  "Queued": { bg: "#f1f5f9", col: "#475569", dot: "#94a3b8" },
  "Triaged": { bg: "#ffedd5", col: "#c2410c", dot: "#f97316" },
  "Registered": { bg: "#fef9c3", col: "#854d0e", dot: "#eab308" },
  "Billed": { bg: "#dbeafe", col: "#1d4ed8", dot: "#3b82f6" },
  "With Doctor": { bg: "#f3e8ff", col: "#7c3aed", dot: "#a855f7" },
  "Lab Pending": { bg: "#fef3c7", col: "#b45309", dot: "#f59e0b" },
  "With Doctor (Post-Lab)": { bg: "#cffafe", col: "#0e7490", dot: "#06b6d4" },
  "Completed": { bg: "#dcfce7", col: "#15803d", dot: "#22c55e" },
  "Pending Admission": { bg: "#fce7f3", col: "#9d174d", dot: "#ec4899" },
};

export const FLAG_STYLE = {
  normal: { bg: "#f0fdf4", bd: "#86efac", tx: "#15803d", tag: "Normal", tBg: "#dcfce7", tTx: "#166534" },
  low: { bg: "#fffbeb", bd: "#fcd34d", tx: "#b45309", tag: "↓ Low", tBg: "#fef3c7", tTx: "#92400e" },
  high: { bg: "#fff7ed", bd: "#fdba74", tx: "#c2410c", tag: "↑ High", tBg: "#ffedd5", tTx: "#9a3412" },
  critical: { bg: "#fef2f2", bd: "#fca5a5", tx: "#dc2626", tag: "🔴 Critical", tBg: "#fee2e2", tTx: "#991b1b" },
  empty: { bg: "#fff", bd: "#e2e8f0", tx: "#1e293b", tag: "", tBg: "#f1f5f9", tTx: "#64748b" },
};

export const CASH_METHODS = ["Cash", "M-Pesa", "POS / Card", "Bank Transfer"];
export const INS_PROVIDERS = ["SHA", "NHIF", "AAR", "Jubilee", "Britam", "Madison", "CIC", "GA Insurance", "Resolution", "Pacis"];
export const CORP_ORGS = ["Mater Hospital", "KCB Group", "Safaricom", "Kenya Airways", "Nation Media", "Equity Bank", "Standard Chartered", "EABL", "BAT Kenya"];
export const COUNTIES = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Kitale", "Malindi", "Garissa", "Nyeri"];

export const REG_TABS = ["Personal Info", "Contact", "Emergency Contact", "Insurance & Payment"];
