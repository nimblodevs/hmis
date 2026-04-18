import { useState, useRef, useEffect } from "react";

/* ══════════════════════════════════════════════
   MOCK DATABASE
══════════════════════════════════════════════ */
const MOCK_DB = [
    {
        patientNo: "P-001001", surname: "Ochieng", firstName: "Amara", otherNames: "Wanjiku",
        patientType: "outpatient", memberAc: "MA-2001", memberAcName: "Jubilee Insurance", memberNo: "JB-447821", relation: "Self",
        staffNo: "", policyNo: "POL-2024-001", lpoNo: "",
        gender: "female", religion: "christian", maritalStatus: "married", email: "amara.ochieng@email.com",
        dob: "1990-03-15", occupation: "Teacher", idCardNo: "28475619", houseNo: "14A", nationality: "Kenyan",
        telephone: "+254722100001", nhifNo: "00284756", nhifNotificationNo: "NHF-28475",
        county: "Nairobi", estate: "Lavington", streetRoad: "Gitanga Road", postalBox: "12345", postalCode: "00100",
        bloodGroup: "O+", category: "Normal", copayCategory: "Cat-A",
        ward: "", bed: "", admissionDate: "", medicalDischarge: "", release: "",
        lastVisitDate: "2024-11-20", acNotes: "Regular patient. Hypertensive.", suspended: false, suspendReason: "",
        materVisit: false, reserveOpInvoice: false, invNarration: "TMH KASARANI CLINIC",
        smartPool: "", visitNo: "V-10091", sladeVisitExpiry: "", biometric: false, biometricReason: "", biometricComment: "",
        nokName: "Grace Kamau", nokRelation: "Spouse", nokPhone: "+254722200001",
        kraPin: "A002847561B", nhifMemberNo: "00284756"
    },

    {
        patientNo: "P-001002", surname: "Mwangi", firstName: "James", otherNames: "",
        patientType: "inpatient", memberAc: "MA-2002", memberAcName: "AAR Healthcare", memberNo: "AAR-112233", relation: "Self",
        staffNo: "ST-0045", policyNo: "POL-2024-002", lpoNo: "LPO-0023",
        gender: "male", religion: "christian", maritalStatus: "single", email: "james.mwangi@gmail.com",
        dob: "1975-11-22", occupation: "Engineer", idCardNo: "12345678", houseNo: "", nationality: "Kenyan",
        telephone: "+254711200002", nhifNo: "00123456", nhifNotificationNo: "NHF-12345",
        county: "Kiambu", estate: "Thika Town", streetRoad: "Kenyatta Avenue", postalBox: "54321", postalCode: "01000",
        bloodGroup: "A+", category: "VIP", copayCategory: "Cat-B",
        ward: "Ward 3", bed: "Bed 12", admissionDate: "2024-12-01", medicalDischarge: "2024-12-05", release: "",
        lastVisitDate: "2024-12-01", acNotes: "Admitted for appendectomy.", suspended: false, suspendReason: "",
        materVisit: false, reserveOpInvoice: true, invNarration: "TMH KASARANI CLINIC",
        smartPool: "SP-A", visitNo: "V-10092", sladeVisitExpiry: "2025-06-30", biometric: true, biometricReason: "", biometricComment: "Enrolled",
        nokName: "Mary Mwangi", nokRelation: "Parent", nokPhone: "+254720200002",
        kraPin: "A001234567B", nhifMemberNo: "00123456"
    },

    {
        patientNo: "P-001003", surname: "Hassan", firstName: "Fatuma", otherNames: "Aisha",
        patientType: "outpatient", memberAc: "", memberAcName: "", memberNo: "", relation: "",
        staffNo: "", policyNo: "", lpoNo: "",
        gender: "female", religion: "muslim", maritalStatus: "single", email: "",
        dob: "2005-07-04", occupation: "Student", idCardNo: "BC20050704001", houseNo: "22", nationality: "Kenyan",
        telephone: "+254700300003", nhifNo: "", nhifNotificationNo: "",
        county: "Mombasa", estate: "Old Town", streetRoad: "Mbarak Hinawy Rd", postalBox: "80100", postalCode: "80100",
        bloodGroup: "B+", category: "Normal", copayCategory: "Cat-C",
        ward: "", bed: "", admissionDate: "", medicalDischarge: "", release: "",
        lastVisitDate: "2024-10-15", acNotes: "", suspended: true, suspendReason: "Outstanding debt / billing dispute",
        materVisit: false, reserveOpInvoice: false, invNarration: "TMH KASARANI CLINIC",
        smartPool: "", visitNo: "V-10093", sladeVisitExpiry: "", biometric: false, biometricReason: "", biometricComment: "",
        nokName: "Ahmed Hassan", nokRelation: "Parent", nokPhone: "+254722300003",
        kraPin: "", nhifMemberNo: ""
    },

    {
        patientNo: "P-001004", surname: "Odhiambo", firstName: "Peter", otherNames: "Otieno",
        patientType: "outpatient", memberAc: "MA-2004", memberAcName: "NHIF", memberNo: "NHIF-456789", relation: "Self",
        staffNo: "", policyNo: "POL-2024-004", lpoNo: "",
        gender: "male", religion: "christian", maritalStatus: "married", email: "",
        dob: "1958-01-30", occupation: "Farmer", idCardNo: "04567890", houseNo: "", nationality: "Kenyan",
        telephone: "+254700400004", nhifNo: "00456789", nhifNotificationNo: "NHF-45678",
        county: "Kisumu", estate: "Kolwa", streetRoad: "Kisumu-Busia Road", postalBox: "40100", postalCode: "40100",
        bloodGroup: "AB-", category: "Senior", copayCategory: "Cat-A",
        ward: "", bed: "", admissionDate: "", medicalDischarge: "", release: "",
        lastVisitDate: "2024-09-10", acNotes: "Diabetic. Refer to endocrinology.", suspended: false, suspendReason: "",
        materVisit: false, reserveOpInvoice: false, invNarration: "TMH KASARANI CLINIC",
        smartPool: "", visitNo: "V-10094", sladeVisitExpiry: "", biometric: false, biometricReason: "", biometricComment: "",
        nokName: "Rose Odhiambo", nokRelation: "Spouse", nokPhone: "+254720400004",
        kraPin: "A000456789C", nhifMemberNo: "00456789"
    },

    {
        patientNo: "P-001005", surname: "Njoroge", firstName: "Esther", otherNames: "",
        patientType: "staff", memberAc: "MA-2005", memberAcName: "Sanlam", memberNo: "SL-998877", relation: "Self",
        staffNo: "ST-0091", policyNo: "POL-2024-005", lpoNo: "LPO-0031",
        gender: "female", religion: "christian", maritalStatus: "divorced", email: "esther.njoroge@hospital.go.ke",
        dob: "1993-09-18", occupation: "Nurse", idCardNo: "33445566", houseNo: "Block C", nationality: "Kenyan",
        telephone: "+254733500005", nhifNo: "00334455", nhifNotificationNo: "NHF-33445",
        county: "Nakuru", estate: "Section 58", streetRoad: "Nakuru-Nairobi Hwy", postalBox: "20100", postalCode: "20100",
        bloodGroup: "O-", category: "Staff", copayCategory: "Staff",
        ward: "", bed: "", admissionDate: "", medicalDischarge: "", release: "",
        lastVisitDate: "2024-11-30", acNotes: "Staff patient. Waiver applies.", suspended: false, suspendReason: "",
        materVisit: false, reserveOpInvoice: false, invNarration: "TMH KASARANI CLINIC",
        smartPool: "SP-B", visitNo: "V-10095", sladeVisitExpiry: "2025-12-31", biometric: true, biometricReason: "", biometricComment: "Active",
        nokName: "John Njoroge", nokRelation: "Sibling", nokPhone: "+254711500005",
        kraPin: "A003344556B", nhifMemberNo: "00334455"
    },
];

const MOCK_VISITS = {
    "P-001001": [
        {
            visitNo: "V-10091", date: "2024-11-20", type: "OPD", department: "General Medicine", clinic: "TMH Main Clinic", doctor: "Dr. Kamau", diagnosis: "Hypertension review", status: "Completed",
            lastVisitDate: "2024-11-20", admissionDate: "", medicalDischarge: "", release: "",
            vitals: { bp: "148/92 mmHg", pulse: "78 bpm", temp: "36.8°C", weight: "74 kg", height: "165 cm" },
            complaints: "Patient reports persistent headaches and dizziness for 3 days.",
            examination: "BP elevated. Heart sounds normal. No oedema.",
            treatment: "Amlodipine 10mg OD continued. Lifestyle counselling given.",
            notes: "Review in 4 weeks. Monitor BP daily.", prescriptions: ["Amlodipine 10mg OD × 30 days", "Aspirin 75mg OD × 30 days"]
        },
        {
            visitNo: "V-9981", date: "2024-08-05", type: "OPD", department: "General Medicine", clinic: "TMH Main Clinic", doctor: "Dr. Kamau", diagnosis: "Flu / Upper respiratory", status: "Completed",
            lastVisitDate: "2024-08-05", admissionDate: "", medicalDischarge: "", release: "",
            vitals: { bp: "130/80 mmHg", pulse: "88 bpm", temp: "37.9°C", weight: "73 kg", height: "165 cm" },
            complaints: "Sore throat, runny nose, mild fever for 2 days.",
            examination: "Throat mildly erythematous. Lungs clear.",
            treatment: "Symptomatic treatment. Adequate hydration advised.",
            notes: "Rest for 3 days. Return if fever persists.", prescriptions: ["Paracetamol 500mg TDS × 5 days", "Amoxicillin 500mg TDS × 7 days"]
        },
        {
            visitNo: "V-9802", date: "2024-03-12", type: "OPD", department: "Cardiology", clinic: "TMH Heart Centre", doctor: "Dr. Maina", diagnosis: "ECG – Routine check", status: "Completed",
            lastVisitDate: "2024-03-12", admissionDate: "", medicalDischarge: "", release: "",
            vitals: { bp: "145/90 mmHg", pulse: "72 bpm", temp: "36.5°C", weight: "74 kg", height: "165 cm" },
            complaints: "Routine cardiac review as referred by GP.",
            examination: "ECG: Sinus rhythm, no ST changes. Echo: Normal LV function EF 62%.",
            treatment: "Continue antihypertensives. Dietary modification advised.",
            notes: "Annual echo follow-up. Stress ECG if symptomatic.", prescriptions: ["Amlodipine 10mg OD × 90 days"]
        },
    ],
    "P-001002": [
        {
            visitNo: "V-10092", date: "2024-12-01", type: "IPD", department: "Surgery", clinic: "TMH Surgical Ward", doctor: "Dr. Otieno", diagnosis: "Appendicitis – Laparoscopic appendectomy", status: "Admitted",
            lastVisitDate: "2024-12-01", admissionDate: "2024-12-01", medicalDischarge: "2024-12-05", release: "2024-12-05",
            vitals: { bp: "122/78 mmHg", pulse: "96 bpm", temp: "38.4°C", weight: "80 kg", height: "178 cm" },
            complaints: "Severe right iliac fossa pain for 18 hours. Nausea and vomiting.",
            examination: "Guarding and rebound tenderness at McBurney's point. Elevated WBC 16.2×10⁹/L.",
            treatment: "Laparoscopic appendectomy performed under GA. Uneventful procedure. Discharged day 4 post-op.",
            notes: "Wound review in 7 days. No strenuous activity for 4 weeks.", prescriptions: ["Ceftriaxone 1g IV BD × 3 days", "Metronidazole 500mg IV TDS × 3 days", "Tramadol 50mg PRN", "Omeprazole 20mg OD × 7 days"]
        },
        {
            visitNo: "V-9990", date: "2024-07-22", type: "OPD", department: "General Surgery", clinic: "TMH Main Clinic", doctor: "Dr. Otieno", diagnosis: "Abdominal pain workup", status: "Completed",
            lastVisitDate: "2024-07-22", admissionDate: "", medicalDischarge: "", release: "",
            vitals: { bp: "118/76 mmHg", pulse: "80 bpm", temp: "36.9°C", weight: "81 kg", height: "178 cm" },
            complaints: "Intermittent right-sided abdominal pain for 2 weeks.",
            examination: "Mild tenderness RIF. No guarding. Bowel sounds normal.",
            treatment: "Ultrasound ordered – normal. Advised conservative management.",
            notes: "Return if pain worsens. Follow-up in 4 weeks.", prescriptions: ["Buscopan 10mg TDS × 5 days"]
        },
    ],
    "P-001003": [
        {
            visitNo: "V-10093", date: "2024-10-15", type: "OPD", department: "Paediatrics", clinic: "TMH Paediatric Clinic", doctor: "Dr. Wanjiru", diagnosis: "Malaria – Plasmodium falciparum", status: "Completed",
            lastVisitDate: "2024-10-15", admissionDate: "", medicalDischarge: "", release: "",
            vitals: { bp: "—", pulse: "102 bpm", temp: "39.2°C", weight: "42 kg", height: "158 cm" },
            complaints: "High grade fever, chills and headache for 3 days.",
            examination: "Pallor noted. Spleen mildly enlarged. Malaria RDT positive.",
            treatment: "Artemether-Lumefantrine prescribed. Oral rehydration advised.",
            notes: "Review in 3 days. Return immediately if vomiting persists.", prescriptions: ["Coartem (AL) 4 tablets BD × 3 days", "Paracetamol 500mg TDS × 3 days"]
        },
    ],
    "P-001004": [
        {
            visitNo: "V-10094", date: "2024-09-10", type: "OPD", department: "Endocrinology", clinic: "TMH Diabetes Clinic", doctor: "Dr. Achieng", diagnosis: "Type 2 DM – Routine management", status: "Completed",
            lastVisitDate: "2024-09-10", admissionDate: "", medicalDischarge: "", release: "",
            vitals: { bp: "138/84 mmHg", pulse: "74 bpm", temp: "36.7°C", weight: "88 kg", height: "170 cm" },
            complaints: "Routine diabetes review. Reports increased thirst and nocturia.",
            examination: "BMI 30.5. Feet exam – no neuropathy. HbA1c: 8.4%.",
            treatment: "Metformin dose increased to 1g BD. Dietary counselling.",
            notes: "HbA1c target < 7%. Review in 3 months.", prescriptions: ["Metformin 1g BD × 90 days", "Atorvastatin 20mg OD × 90 days"]
        },
        {
            visitNo: "V-9700", date: "2024-01-18", type: "OPD", department: "General Medicine", clinic: "TMH Main Clinic", doctor: "Dr. Kamau", diagnosis: "Annual checkup", status: "Completed",
            lastVisitDate: "2024-01-18", admissionDate: "", medicalDischarge: "", release: "",
            vitals: { bp: "140/88 mmHg", pulse: "76 bpm", temp: "36.5°C", weight: "89 kg", height: "170 cm" },
            complaints: "Annual review. No specific complaints.",
            examination: "Overweight. BP slightly elevated. All systems normal.",
            treatment: "Lifestyle modification advised. Blood tests ordered.",
            notes: "Refer to endocrinology for diabetes review.", prescriptions: ["Aspirin 75mg OD × 30 days"]
        },
    ],
    "P-001005": [
        {
            visitNo: "V-10095", date: "2024-11-30", type: "OPD", department: "Occupational Health", clinic: "TMH Staff Clinic", doctor: "Dr. Oloo", diagnosis: "Annual staff health check", status: "Completed",
            lastVisitDate: "2024-11-30", admissionDate: "", medicalDischarge: "", release: "",
            vitals: { bp: "118/74 mmHg", pulse: "68 bpm", temp: "36.4°C", weight: "62 kg", height: "162 cm" },
            complaints: "Annual staff medical fitness assessment.",
            examination: "All systems clinically normal. Vision 6/6 bilaterally. Audiometry normal.",
            treatment: "Medically fit for duty.",
            notes: "Annual review due Nov 2025.", prescriptions: []
        },
    ],
};

/* ── Active / Ongoing Visits ── */
const MOCK_ACTIVE_VISITS = {
    "P-001001": {
        visitNo: "V-10112", date: "2026-04-04", type: "OPD", department: "General Medicine",
        clinic: "TMH Main Clinic", doctor: "Dr. Kamau", status: "In Progress",
        triageTime: "08:45", seenTime: "", estimatedWait: "~20 min",
        chiefComplaint: "Persistent headache and elevated BP reading at home.",
        triageVitals: { bp: "156/96 mmHg", pulse: "82 bpm", temp: "36.9°C", weight: "74 kg", spo2: "98%" },
        ward: "", bed: "", admissionDate: "", medicalDischarge: "", release: "",
        attendingNurse: "Nurse Wanjiku", attendingDoctor: "Dr. Kamau",
        notes: "Patient arrived at OPD. Triage complete. Awaiting doctor review.",
        invoiceNo: "INV-2026-10112", invoiceStatus: "Open", invoiceAmount: 3500,
    },
    "P-001002": {
        visitNo: "V-10113", date: "2026-04-04", type: "IPD", department: "Surgery",
        clinic: "TMH Surgical Ward", doctor: "Dr. Otieno", status: "Admitted",
        triageTime: "06:30", seenTime: "07:15", estimatedWait: "",
        chiefComplaint: "Post-operative day 2 monitoring following laparoscopic cholecystectomy.",
        triageVitals: { bp: "118/74 mmHg", pulse: "76 bpm", temp: "37.1°C", weight: "80 kg", spo2: "99%" },
        ward: "Ward 3", bed: "Bed 07", admissionDate: "2026-04-03", medicalDischarge: "", release: "",
        attendingNurse: "Nurse Omollo", attendingDoctor: "Dr. Otieno",
        notes: "Stable post-op. IV fluids running. Tolerating sips of water. Wound site clean.",
        invoiceNo: "INV-2026-10113", invoiceStatus: "Open", invoiceAmount: 145000,
    },
    "P-001003": null,  // no active visit
    "P-001004": {
        visitNo: "V-10114", date: "2026-04-04", type: "OPD", department: "Endocrinology",
        clinic: "TMH Diabetes Clinic", doctor: "Dr. Achieng", status: "In Progress",
        triageTime: "09:10", seenTime: "09:45", estimatedWait: "",
        chiefComplaint: "Routine 3-month diabetes review. Reports increased fatigue.",
        triageVitals: { bp: "142/86 mmHg", pulse: "78 bpm", temp: "36.6°C", weight: "87 kg", spo2: "97%" },
        ward: "", bed: "", admissionDate: "", medicalDischarge: "", release: "",
        attendingNurse: "Nurse Achieng", attendingDoctor: "Dr. Achieng",
        notes: "HbA1c drawn. Awaiting results. Counselling on diet compliance in progress.",
        invoiceNo: "INV-2026-10114", invoiceStatus: "Open", invoiceAmount: 4100,
    },
    "P-001005": null,  // no active visit
};

const MOCK_INVOICES = {
    "P-001001": [
        { invoiceNo: "INV-2024-10091", date: "2024-11-20", amount: 3500, paid: 3500, balance: 0, status: "Paid", items: "Consultation, BP meds" },
        { invoiceNo: "INV-2024-09981", date: "2024-08-05", amount: 1800, paid: 1800, balance: 0, status: "Paid", items: "Consultation, Amoxicillin" },
        { invoiceNo: "INV-2024-09802", date: "2024-03-12", amount: 8500, paid: 8500, balance: 0, status: "Paid", items: "ECG, Consultation, Echo" },
    ],
    "P-001002": [
        { invoiceNo: "INV-2024-10092", date: "2024-12-01", amount: 145000, paid: 50000, balance: 95000, status: "Partial", items: "Surgery, Anaesthesia, Ward 3×5 days, Theatre" },
        { invoiceNo: "INV-2024-09990", date: "2024-07-22", amount: 4200, paid: 4200, balance: 0, status: "Paid", items: "Consultation, Ultrasound, Lab" },
    ],
    "P-001003": [
        { invoiceNo: "INV-2024-10093", date: "2024-10-15", amount: 2800, paid: 0, balance: 2800, status: "Unpaid", items: "Consultation, Malaria test, Coartem" },
    ],
    "P-001004": [
        { invoiceNo: "INV-2024-10094", date: "2024-09-10", amount: 4100, paid: 4100, balance: 0, status: "Paid", items: "Consultation, HbA1c, Metformin" },
    ],
    "P-001005": [
        { invoiceNo: "INV-2024-10095", date: "2024-11-30", amount: 6000, paid: 6000, balance: 0, status: "Paid", items: "Health check panel – Staff waiver applied" },
    ],
};

const MOCK_UPLOADS = {
    "P-001001": [
        { name: "Referral_Letter_Nov2024.pdf", type: "Referral", date: "2024-11-20", size: "142 KB", uploader: "System · 20 Nov 2024, 09:14" },
        { name: "BP_Chart_2024.pdf", type: "Clinical", date: "2024-08-05", size: "88 KB", uploader: "System · 5 Aug 2024, 11:32" },
    ],
    "P-001002": [
        { name: "Surgical_Consent_Form.pdf", type: "Consent", date: "2024-12-01", size: "210 KB", uploader: "System · 1 Dec 2024, 08:55" },
        { name: "Pre-Op_Labs.pdf", type: "Labs", date: "2024-11-30", size: "305 KB", uploader: "System · 30 Nov 2024, 16:20" },
        { name: "Insurance_Preauth.pdf", type: "Insurance", date: "2024-12-01", size: "180 KB", uploader: "System · 1 Dec 2024, 10:05" },
    ],
    "P-001003": [
        { name: "NHIF_Exemption.pdf", type: "Insurance", date: "2024-10-15", size: "95 KB", uploader: "System · 20 Nov 2024, 09:14" },
    ],
    "P-001004": [],
    "P-001005": [
        { name: "Staff_Health_Clearance_2024.pdf", type: "Clearance", date: "2024-11-30", size: "260 KB", uploader: "System · 30 Nov 2024, 14:47" },
    ],
};

/* ── Colours ── */
const C = {
    bg: "#f0f4f8", card: "#ffffff",
    border: "#d1dce6", borderFocus: "#1a7fa8", borderError: "#dc2626",
    accent: "#1a7fa8", accentDark: "#0e6a8f", accentLight: "#e8f4f9", accentMid: "#c2e0ed",
    label: "#4a6070", placeholder: "#9ab0be", text: "#1a2e3b", muted: "#6b8494",
    danger: "#dc2626", dangerLight: "#fef2f2", dangerMid: "#fca5a5", dangerDark: "#991b1b",
    success: "#16a34a", successLight: "#dcfce7",
    warning: "#d97706", warningLight: "#fffbeb", warningMid: "#fde68a",
    sectionRule: "#dde8ef", headerBg: "#1a2e3b",
    shadow: "0 1px 3px rgba(26,46,59,0.08)",
    shadowMd: "0 4px 16px rgba(26,46,59,0.1)",
    shadowLg: "0 16px 48px rgba(26,46,59,0.13)",
};

const COUNTIES = ["", "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"];

const SUSPENSION_REASONS = ["", "Fraudulent identity documents", "Repeated no-show (3+ times)", "Aggressive / abusive behaviour", "Outstanding debt / billing dispute", "Duplicate registration detected", "Court order / legal hold", "Insurance fraud investigation", "Breach of hospital policy", "Other (specify in notes)"];

const MAIN_TABS = [
    { id: "Patient Details (a)", icon: "👤" },
    { id: "Next of Kin", icon: "👨‍👩‍👧" },
    { id: "Payer Details", icon: "💳" },
    { id: "Previous Visits", icon: "📋" },
    { id: "Available Visit(s)", icon: "🟢" },
    { id: "Previous Invoices", icon: "🧾" },
    { id: "Upload(s)", icon: "📎" },
];

const fmt = d => new Date(d).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" });
const fmtD = d => d ? new Date(d).toLocaleDateString("en-KE", { dateStyle: "medium" }) : "—";

const BLANK = {
    counter: "", ticket: "", telephone: "", surname: "", firstName: "", otherNames: "",
    patientType: "outpatient", patientNo: "", memberAc: "", memberAcName: "", memberNo: "", relation: "",
    staffNo: "", policyNo: "", lpoNo: "",
    gender: "", religion: "", maritalStatus: "", email: "", dob: "", occupation: "", idCardNo: "",
    houseNo: "", nationality: "Kenyan", nhifNo: "", nhifNotificationNo: "",
    county: "", estate: "", streetRoad: "", postalBox: "", postalCode: "", bloodGroup: "",
    category: "", copayCategory: "",
    ward: "", bed: "", admissionDate: "", medicalDischarge: "", release: "",
    lastVisitDate: "", acNotes: "",
    suspended: false, suspendReason: "", suspendNotes: "", suspendedBy: "", suspendedAt: "",
    materVisit: false, reserveOpInvoice: false, invNarration: "TMH KASARANI CLINIC",
    smartPool: "", visitNo: "", sladeVisitExpiry: "",
    biometric: false, biometricReason: "", biometricComment: "",
    nokName: "", nokRelation: "", nokPhone: "", nokAddress: "",
    payerName: "", payerType: "", payerPhone: "", payerEmail: "", payerAddress: "",
    kraPin: "", nhifMemberNo: "",
};

/* ── Helpers ── */
function Highlight({ text, query }) {
    if (!query || !text) return <span>{text || ""}</span>;
    const i = String(text).toLowerCase().indexOf(query.toLowerCase());
    if (i === -1) return <span>{text}</span>;
    const s = String(text);
    return <span>{s.slice(0, i)}<mark style={{ background: "#fef08a", color: C.text, borderRadius: 2, padding: "0 1px" }}>{s.slice(i, i + query.length)}</mark>{s.slice(i + query.length)}</span>;
}

/* ── Field Components ── */
function F({ label, value, onChange, type = "text", placeholder, req, error, tip, maxLen, readOnly, half }) {
    const [foc, setFoc] = useState(false);
    const hasVal = value !== undefined && value !== null && String(value).length > 0;
    return (
        <div className={`mb-3 ${half ? "" : "w-full"}`}>
            <label className="block text-xs font-bold tracking-wider uppercase mb-1" style={{ color: error ? C.danger : C.label }}>
                {label}{req && <span style={{ color: C.danger }}> *</span>}{tip && <span title={tip} className="ml-1 cursor-help text-xs" style={{ color: C.accentMid }}>ⓘ</span>}
            </label>
            <div className="relative">
                <input type={type} placeholder={placeholder || ""} value={value || ""} onChange={onChange}
                    maxLength={maxLen} readOnly={readOnly}
                    className="w-full rounded-lg border text-sm outline-none transition-all duration-150"
                    style={{
                        background: readOnly ? "#f8fafc" : error ? C.dangerLight : foc ? C.inputBgHover : C.card,
                        borderColor: error ? C.borderError : foc ? C.borderFocus : C.border,
                        color: C.text, padding: "8px 10px" + (hasVal && !readOnly ? " 8px 28px" : ""),
                        fontFamily: "'DM Sans',sans-serif",
                        boxShadow: foc ? `0 0 0 2px ${C.accentMid}` : C.shadow,
                    }}
                    onFocus={() => { if (!readOnly) setFoc(true) }} onBlur={() => setFoc(false)} />
                {hasVal && !error && !readOnly && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-500 text-xs">✓</span>}
            </div>
            {error && <p className="text-xs mt-0.5 flex gap-1 items-center" style={{ color: C.danger }}>⚠ {error}</p>}
            {maxLen && hasVal && <p className="text-xs mt-0.5 text-right" style={{ color: C.placeholder }}>{String(value).length}/{maxLen}</p>}
        </div>
    );
}

function S({ label, value, onChange, options, req, error }) {
    const [foc, setFoc] = useState(false);
    return (
        <div className="mb-3">
            <label className="block text-xs font-bold tracking-wider uppercase mb-1" style={{ color: error ? C.danger : C.label }}>
                {label}{req && <span style={{ color: C.danger }}> *</span>}
            </label>
            <div className="relative">
                <select value={value || ""} onChange={onChange}
                    className="w-full rounded-lg border text-sm outline-none appearance-none cursor-pointer transition-all duration-150"
                    style={{
                        background: error ? C.dangerLight : foc ? "#f5fafd" : C.card,
                        borderColor: error ? C.borderError : foc ? C.borderFocus : C.border,
                        color: value ? C.text : C.placeholder, padding: "8px 28px 8px 10px",
                        fontFamily: "'DM Sans',sans-serif", boxShadow: foc ? `0 0 0 2px ${C.accentMid}` : C.shadow,
                    }}
                    onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}>
                    {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs" style={{ color: C.muted }}>▾</span>
                {value && !error && <span className="absolute right-6 top-1/2 -translate-y-1/2 text-green-500 text-xs">✓</span>}
            </div>
            {error && <p className="text-xs mt-0.5" style={{ color: C.danger }}>⚠ {error}</p>}
        </div>
    );
}

function CB({ label, checked, onChange, small }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={!!checked} onChange={onChange} style={{ accentColor: C.accent, width: 14, height: 14 }} />
            <span className={small ? "text-xs" : "text-sm"} style={{ color: C.label, fontFamily: "'DM Sans',sans-serif" }}>{label}</span>
        </label>
    );
}

function SectionHead({ children, icon }) {
    return (
        <div className="flex items-center gap-2 mb-3 mt-4">
            <div className="w-1 h-5 rounded-full" style={{ background: C.accent }} />
            {icon && <span className="text-sm">{icon}</span>}
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: C.accent }}>{children}</span>
            <div className="flex-1 h-px" style={{ background: C.sectionRule }} />
        </div>
    );
}

/* ── Patient Search ── */
function PatientSearch({ onSelect }) {
    const [q, setQ] = useState("");
    const [res, setRes] = useState([]);
    const [open, setOpen] = useState(false);
    const [foc, setFoc] = useState(false);
    const [loading, setLoading] = useState(false);
    const ref = useRef(null);

    const search = val => {
        setQ(val);
        if (val.trim().length < 2) { setRes([]); setOpen(false); return; }
        setLoading(true);
        setTimeout(() => {
            const lq = val.toLowerCase();
            setRes(MOCK_DB.filter(p =>
                `${p.surname} ${p.firstName} ${p.otherNames}`.toLowerCase().includes(lq) ||
                p.patientNo.toLowerCase().includes(lq) ||
                p.telephone.replace(/\s/g, "").includes(lq.replace(/\s/g, "")) ||
                p.idCardNo.toLowerCase().includes(lq) ||
                p.nhifNo.includes(lq) || p.memberNo.toLowerCase().includes(lq)
            ));
            setOpen(true); setLoading(false);
        }, 160);
    };

    useEffect(() => {
        const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    const pick = p => { setQ(`${p.surname}, ${p.firstName}  ·  ${p.patientNo}`); setOpen(false); onSelect(p); };
    const clear = () => { setQ(""); setRes([]); setOpen(false); onSelect(null); };

    return (
        <div ref={ref} className="relative">
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: foc ? C.accent : C.muted }}>🔍</span>
                <input value={q} onChange={e => search(e.target.value)}
                    onFocus={() => { setFoc(true); if (res.length > 0) setOpen(true); }}
                    onBlur={() => setFoc(false)}
                    placeholder="Search patient by Surname, First Name, Patient No., ID, Phone, NHIF, Member No…"
                    className="w-full rounded-xl border text-sm outline-none transition-all duration-200"
                    style={{
                        padding: "11px 44px 11px 36px", fontFamily: "'DM Sans',sans-serif",
                        background: foc ? "#fafcff" : C.card,
                        borderColor: foc ? C.borderFocus : C.border, color: C.text,
                        boxShadow: foc ? `0 0 0 3px ${C.accentMid},${C.shadowMd}` : C.shadowMd
                    }} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {loading && <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: C.accentMid, borderTopColor: C.accent }} />}
                    {q && !loading && <button onClick={clear} className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: C.border, color: C.muted }}>✕</button>}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: C.accentLight, color: C.accent }}>{MOCK_DB.length} records</span>
                </div>
            </div>

            {open && (
                <div className="absolute z-50 w-full mt-1.5 rounded-2xl overflow-hidden"
                    style={{ background: C.card, border: `1px solid ${C.accentMid}`, boxShadow: "0 20px 60px rgba(26,46,59,0.2)" }}>
                    {res.length === 0
                        ? <div className="px-5 py-6 text-center">
                            <p className="text-2xl mb-1">🔎</p>
                            <p className="text-sm font-semibold" style={{ color: C.muted }}>No patients found</p>
                            <p className="text-xs mt-1" style={{ color: C.placeholder }}>Try a different search term</p>
                        </div>
                        : <>
                            <div className="px-4 py-2 flex items-center justify-between" style={{ background: C.accentLight, borderBottom: `1px solid ${C.accentMid}` }}>
                                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: C.accent }}>{res.length} result{res.length > 1 ? "s" : ""}</span>
                                <span className="text-xs" style={{ color: C.muted }}>Click row to populate form</span>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {res.map((p, i) => (
                                    <button key={p.patientNo} onClick={() => pick(p)}
                                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-100"
                                        style={{ borderBottom: i < res.length - 1 ? `1px solid ${C.sectionRule}` : "none", background: "transparent" }}
                                        onMouseEnter={e => e.currentTarget.style.background = C.accentLight}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                            style={{ background: p.gender === "female" ? "#fce7f3" : C.accentLight, color: p.gender === "female" ? "#9d174d" : C.accent, border: `2px solid ${p.gender === "female" ? "#fbcfe8" : C.accentMid}` }}>
                                            {p.surname[0]}{p.firstName[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-sm font-bold" style={{ color: C.text }}>
                                                    <Highlight text={`${p.surname}, ${p.firstName} ${p.otherNames}`.trim()} query={q} />
                                                </span>
                                                <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: C.accentMid, color: C.accentDark }}>{p.patientNo}</span>
                                                {p.suspended && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: "#fee2e2", color: C.dangerDark }}>🚫 Suspended</span>}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs" style={{ color: C.muted }}>
                                                <Highlight text={p.idCardNo} query={q} /><span>·</span>
                                                <Highlight text={p.telephone} query={q} /><span>·</span>
                                                <span>{p.county}</span><span>·</span>
                                                <span style={{ textTransform: "capitalize" }}>{p.patientType}</span>
                                            </div>
                                        </div>
                                        {p.bloodGroup && <span className="text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: "#fee2e2", color: C.dangerDark }}>{p.bloodGroup}</span>}
                                        <span style={{ color: C.accentMid }}>→</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    }
                </div>
            )}
        </div>
    );
}

/* ── Suspend Modal ── */
function SuspendModal({ patientName, onConfirm, onCancel }) {
    const [officer, setOfficer] = useState(""); const [reason, setReason] = useState(""); const [notes, setNotes] = useState(""); const [err, setErr] = useState({});
    const submit = () => { const e = {}; if (!officer.trim()) e.officer = "Required"; if (!reason) e.reason = "Required"; if (!notes.trim()) e.notes = "Required"; if (Object.keys(e).length) { setErr(e); return; } onConfirm({ officer: officer.trim(), reason, notes: notes.trim(), timestamp: new Date().toISOString() }); };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,20,30,0.6)", backdropFilter: "blur(4px)" }}>
            <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: C.card, boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
                <div className="px-6 py-4 flex items-center gap-3" style={{ background: "#7f1d1d" }}>
                    <span className="text-xl">🚫</span>
                    <div><p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#fca5a5" }}>Suspend Account</p><p className="text-sm font-semibold text-white">{patientName}</p></div>
                    <button onClick={onCancel} className="ml-auto text-white opacity-50 text-xl">✕</button>
                </div>
                <div className="px-6 py-5 space-y-4">
                    {[["Officer Name *", officer, setOfficer, err.officer, "👤"], ["", "", "", "", ""]].slice(0, 1).map(([l, v, sv, er, ic]) => (
                        <div key={l}>
                            <label className="block text-xs font-bold tracking-wider uppercase mb-1" style={{ color: er ? C.danger : C.label }}>{l}</label>
                            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: C.placeholder }}>{ic}</span>
                                <input value={v} onChange={e => sv(e.target.value)} placeholder="e.g. Dr. Achieng / Admin Kamau" className="w-full rounded-lg border text-sm outline-none" style={{ padding: "9px 10px 9px 34px", fontFamily: "'DM Sans',sans-serif", borderColor: er ? C.borderError : C.border, background: er ? C.dangerLight : C.card, color: C.text, boxShadow: C.shadow }} /></div>
                            {er && <p className="text-xs mt-1" style={{ color: C.danger }}>⚠ {er}</p>}
                        </div>
                    ))}
                    <div>
                        <label className="block text-xs font-bold tracking-wider uppercase mb-1" style={{ color: err.reason ? C.danger : C.label }}>Suspension Reason *</label>
                        <div className="relative"><select value={reason} onChange={e => setReason(e.target.value)} className="w-full rounded-lg border text-sm outline-none appearance-none cursor-pointer" style={{ padding: "9px 28px 9px 10px", fontFamily: "'DM Sans',sans-serif", borderColor: err.reason ? C.borderError : C.border, background: err.reason ? C.dangerLight : C.card, color: reason ? C.text : C.placeholder, boxShadow: C.shadow }}>{SUSPENSION_REASONS.map(r => <option key={r} value={r}>{r || "Select reason…"}</option>)}</select><span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs" style={{ color: C.muted }}>▾</span></div>
                        {err.reason && <p className="text-xs mt-1" style={{ color: C.danger }}>⚠ {err.reason}</p>}
                    </div>
                    <div>
                        <div className="flex justify-between mb-1"><label className="text-xs font-bold tracking-wider uppercase" style={{ color: err.notes ? C.danger : C.label }}>Notes *</label><span className="text-xs" style={{ color: C.placeholder }}>{notes.length}/500</span></div>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} maxLength={500} placeholder="Detailed suspension notes…" className="w-full rounded-lg border text-sm outline-none resize-none" style={{ padding: "9px 10px", fontFamily: "'DM Sans',sans-serif", borderColor: err.notes ? C.borderError : C.border, background: err.notes ? C.dangerLight : C.card, color: C.text, boxShadow: C.shadow, lineHeight: 1.6 }} />
                        {err.notes && <p className="text-xs mt-1" style={{ color: C.danger }}>⚠ {err.notes}</p>}
                    </div>
                </div>
                <div className="px-6 pb-5 flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "#f1f5f9", border: `1px solid ${C.border}`, color: C.muted }}>Cancel</button>
                    <button onClick={submit} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#dc2626,#991b1b)", boxShadow: "0 4px 14px rgba(220,38,38,0.35)" }}>🚫 Confirm Suspension</button>
                </div>
            </div>
        </div>
    );
}

/* ── Badge ── */
const Badge = ({ children, color, bg }) => <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: bg, color }}>{children}</span>;

/* ══════════════════════════════════ MAIN ══════════════════════════════════ */
export default function App() {
    const [form, setForm] = useState({ ...BLANK });
    const [activeTab, setActiveTab] = useState("Patient Details (a)");
    const [loaded, setLoaded] = useState(null);
    const [errors, setErrors] = useState({});
    const [saved, setSaved] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [showPrintCard, setShowPrintCard] = useState(false);
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [auditLog, setAuditLog] = useState([]);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [viewingInvoice, setViewingInvoice] = useState(null);
    const [viewingVisit, setViewingVisit] = useState(null);
    const [showActiveVisitDetail, setShowActiveVisitDetail] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadForm, setUploadForm] = useState({ fileName: "", fileType: "", file: null });
    const [uploadErrors, setUploadErrors] = useState({});
    const [populatedBanner, setPopulatedBanner] = useState(false);
    const fileInputRef = useRef(null);

    const u = f => e => { setForm(p => ({ ...p, [f]: e.target.value })); setIsDirty(true); };
    const uc = f => e => { setForm(p => ({ ...p, [f]: e.target.checked })); setIsDirty(true); };

    /* Keyboard shortcut: Ctrl+S to save */
    useEffect(() => {
        const handler = e => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                handleSave();
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    /* Search select */
    const handleSelect = (p) => {
        if (!p) { setForm({ ...BLANK }); setLoaded(null); setAuditLog([]); setUploadFiles([]); return; }
        const { patientNo, ...rest } = p;
        setForm(prev => ({ ...prev, ...rest, patientNo }));
        setLoaded(patientNo);
        setIsDirty(false);
        setLastSaved(null);
        setAuditLog(p.suspended ? [{ type: "suspend", officer: "System", reason: p.suspendReason, notes: "Pre-existing suspension loaded from record.", timestamp: new Date(Date.now() - 86400000 * 3).toISOString() }] : []);
        setUploadFiles(MOCK_UPLOADS[patientNo] || []);
        setViewingInvoice(null);
        setViewingVisit(null);
        setShowActiveVisitDetail(false);
        setPopulatedBanner(true);
        setSaved(false);
        setTimeout(() => setPopulatedBanner(false), 5000);
    };

    const handleSuspend = data => {
        setForm(p => ({ ...p, suspended: true, suspendReason: data.reason, suspendedBy: data.officer, suspendedAt: data.timestamp }));
        setAuditLog(l => [{ type: "suspend", ...data }, ...l]);
        setShowSuspendModal(false);
    };

    const handleReinstate = () => {
        setForm(p => ({ ...p, suspended: false, suspendReason: "", suspendedBy: "", suspendedAt: "" }));
        setAuditLog(l => [{ type: "reinstate", officer: "Current User", notes: "Reinstated via form.", timestamp: new Date().toISOString() }, ...l]);
    };

    const handleSave = () => {
        setSaved(true);
        setLastSaved(new Date());
        setIsDirty(false);
        setTimeout(() => setSaved(false), 4000);
    };

    const handleClear = () => {
        setForm({ ...BLANK }); setLoaded(null); setAuditLog([]); setUploadFiles([]); setErrors({});
        setSaved(false); setLastSaved(null); setIsDirty(false); setPopulatedBanner(false);
        setViewingInvoice(null);
        setShowUploadModal(false); setUploadForm({ fileName: "", fileType: "", file: null }); setUploadErrors({});
        if (activeTab === "Payer Details") setActiveTab("Patient Details (a)");
        setShowActiveVisitDetail(false);
        setShowPrintCard(false);
    };


    const visits = loaded ? (MOCK_VISITS[loaded] || []) : [];
    const invoices = loaded ? (MOCK_INVOICES[loaded] || []) : [];
    const activeVisit = loaded
        ? (() => { const v = MOCK_ACTIVE_VISITS[loaded] || null; return v && v.type === "OPD" ? v : null; })()
        : null;
    const patientAge = form.dob ? Math.floor((new Date() - new Date(form.dob)) / (365.25 * 24 * 3600 * 1000)) : null;

    const patientName = [form.surname, form.firstName].filter(Boolean).join(", ") || "Patient";

    return (
        <div className="min-h-screen" style={{ background: C.bg, fontFamily: "'DM Sans',sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <style>{`input::placeholder,select option[value=""]{color:#9ab0be} input[type=date]::-webkit-calendar-picker-indicator{opacity:0.5;cursor:pointer} @keyframes fadeSlide{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>

            {showSuspendModal && <SuspendModal patientName={patientName} onConfirm={handleSuspend} onCancel={() => setShowSuspendModal(false)} />}

            {/* ── HEADER ── */}
            <div className="px-6 py-3 flex items-center justify-between" style={{ background: C.headerBg, boxShadow: C.shadowMd }}>
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🏥</span>
                    <div>
                        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#7ecbea" }}>National Referral Hospital · Tier III</p>
                        <h1 className="text-xl font-semibold text-white" style={{ fontFamily: "'Cormorant Garamond',serif" }}>Patient Details</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Unsaved changes indicator */}
                    {isDirty && !saved && (
                        <span className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                            style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#fbbf24" }} />
                            Unsaved changes
                        </span>
                    )}
                    {/* Save success flash */}
                    {saved && (
                        <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "#166534", color: "#86efac", animation: "fadeSlide 0.3s ease" }}>
                            ✓ Saved
                        </span>
                    )}
                    {/* Last saved timestamp */}
                    {lastSaved && !saved && !isDirty && (
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                            Last saved {lastSaved.toLocaleTimeString("en-KE", { timeStyle: "short" })}
                        </span>
                    )}
                    {form.suspended && (
                        <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "#7f1d1d", color: "#fca5a5" }}>🚫 SUSPENDED</span>
                    )}
                    {/* Print patient card */}
                    {loaded && (
                        <button onClick={() => setShowPrintCard(true)}
                            className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5"
                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)" }}>
                            🪪 Patient Card
                        </button>
                    )}
                    <button onClick={handleSave}
                        className="px-5 py-2 rounded-xl text-sm font-bold text-white flex items-center gap-2"
                        style={{ background: `linear-gradient(135deg,${C.accent},${C.accentDark})`, boxShadow: "0 3px 10px rgba(26,127,168,0.35)" }}>
                        💾 Save
                        <span className="text-xs opacity-60 hidden sm:inline">Ctrl+S</span>
                    </button>
                    <button onClick={handleClear}
                        className="px-4 py-2 rounded-xl text-sm font-semibold"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}>
                        🗑 Clear
                    </button>
                </div>
            </div>

            <div className="px-6 py-4 max-w-7xl mx-auto">

                {/* ── SEARCH ── */}
                <div className="mb-4">
                    <PatientSearch onSelect={handleSelect} />
                </div>

                {/* ── PATIENT SUMMARY STRIP (shown when patient is loaded) ── */}
                {loaded && (
                    <div className="mb-4 rounded-2xl px-5 py-3.5 flex items-center gap-5"
                        style={{
                            background: form.suspended ? "#1c0a0a" : C.card,
                            border: `1px solid ${form.suspended ? "#7f1d1d" : C.accentMid}`,
                            boxShadow: C.shadowMd
                        }}>

                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                            style={{
                                background: form.suspended ? "#7f1d1d" : form.gender === "female" ? "#fce7f3" : C.accentLight,
                                color: form.suspended ? "#fca5a5" : form.gender === "female" ? "#9d174d" : C.accent,
                                border: `2px solid ${form.suspended ? "#991b1b" : form.gender === "female" ? "#fbcfe8" : C.accentMid}`,
                                fontFamily: "'Cormorant Garamond',serif",
                            }}>
                            {form.suspended ? "🚫" : `${form.surname?.[0] || ""}${form.firstName?.[0] || ""}`}
                        </div>

                        {/* Name + ID */}
                        <div className="flex-shrink-0">
                            <p className="text-sm font-bold" style={{ color: form.suspended ? "#fca5a5" : C.text }}>
                                {form.surname}{form.firstName ? `, ${form.firstName}` : ""}{form.otherNames ? ` ${form.otherNames}` : ""}
                            </p>
                            <p className="text-xs" style={{ color: C.muted }}>{loaded}</p>
                        </div>

                        <div className="w-px h-8 flex-shrink-0" style={{ background: C.border }} />

                        {/* Key info pills */}
                        {[
                            patientAge !== null ? [`${patientAge} yrs`, (patientAge < 18 ? "#fef3c7" : patientAge >= 60 ? "#ede9fe" : C.accentLight), (patientAge < 18 ? C.warning : patientAge >= 60 ? "#6b21a8" : C.accent)] : null,
                            form.gender ? [form.gender.charAt(0).toUpperCase() + form.gender.slice(1), form.gender === "female" ? "#fce7f3" : "#e8f4f9", form.gender === "female" ? "#9d174d" : C.accent] : null,
                            form.bloodGroup ? [form.bloodGroup, "#fee2e2", C.dangerDark] : null,
                            form.patientType ? [form.patientType.charAt(0).toUpperCase() + form.patientType.slice(1), "#f3f4f6", C.muted] : null,
                            form.category ? [form.category, C.accentLight, C.accent] : null,
                        ].filter(Boolean).map(([label, bg, color], i) => (
                            <span key={i} className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                                style={{ background: bg, color }}>{label}</span>
                        ))}

                        {form.idCardNo && (
                            <>
                                <div className="w-px h-8 flex-shrink-0" style={{ background: C.border }} />
                                <div className="flex-shrink-0">
                                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: C.muted }}>ID</p>
                                    <p className="text-xs font-semibold" style={{ color: C.text }}>{form.idCardNo}</p>
                                </div>
                            </>
                        )}

                        {form.telephone && (
                            <>
                                <div className="w-px h-8 flex-shrink-0" style={{ background: C.border }} />
                                <div className="flex-shrink-0">
                                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: C.muted }}>Phone</p>
                                    <p className="text-xs font-semibold" style={{ color: C.text }}>{form.telephone}</p>
                                </div>
                            </>
                        )}

                        {form.memberAcName && (
                            <>
                                <div className="w-px h-8 flex-shrink-0" style={{ background: C.border }} />
                                <div className="flex-shrink-0">
                                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: C.muted }}>Insurer</p>
                                    <p className="text-xs font-semibold" style={{ color: C.text }}>{form.memberAcName}</p>
                                </div>
                            </>
                        )}

                        {activeVisit && (
                            <>
                                <div className="w-px h-8 flex-shrink-0" style={{ background: C.border }} />
                                <div className="flex-shrink-0 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#16a34a" }} />
                                    <span className="text-xs font-bold" style={{ color: C.success }}>Active OPD · {activeVisit.visitNo}</span>
                                </div>
                            </>
                        )}

                        <div className="flex-1" />

                        {/* Strip actions */}
                        <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => setShowPrintCard(true)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                                style={{ background: C.accentLight, color: C.accent, border: `1px solid ${C.accentMid}` }}>
                                🪪 Print Card
                            </button>
                            {isDirty && (
                                <button onClick={handleSave}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1"
                                    style={{ background: `linear-gradient(135deg,${C.accent},${C.accentDark})` }}>
                                    💾 Save
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* ── PRINT PATIENT CARD MODAL ── */}
                {showPrintCard && loaded && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: "rgba(10,20,30,0.55)", backdropFilter: "blur(5px)" }}>
                        <div className="w-full max-w-md rounded-2xl overflow-hidden"
                            style={{ background: C.card, boxShadow: "0 32px 80px rgba(0,0,0,0.35)" }}>

                            {/* Modal header */}
                            <div className="px-6 py-4 flex items-center gap-3" style={{ background: C.headerBg }}>
                                <span className="text-xl">🪪</span>
                                <div>
                                    <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#7ecbea" }}>Patient ID Card</p>
                                    <p className="text-sm font-semibold text-white">{patientName}</p>
                                </div>
                                <button onClick={() => setShowPrintCard(false)}
                                    className="ml-auto w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontSize: "1.1rem" }}>✕</button>
                            </div>

                            {/* Card preview */}
                            <div className="p-6">
                                <div className="rounded-2xl overflow-hidden print-card"
                                    style={{ background: `linear-gradient(135deg,#1a2e3b 0%, #0e4a6e 100%)`, boxShadow: "0 8px 32px rgba(26,46,59,0.4)" }}>

                                    {/* Card top bar */}
                                    <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">🏥</span>
                                            <div>
                                                <p className="text-xs font-bold text-white" style={{ letterSpacing: "0.05em" }}>NATIONAL REFERRAL HOSPITAL</p>
                                                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Tier III · Ministry of Health Kenya</p>
                                            </div>
                                        </div>
                                        {form.suspended && (
                                            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#7f1d1d", color: "#fca5a5" }}>SUSPENDED</span>
                                        )}
                                    </div>

                                    {/* Card body */}
                                    <div className="px-5 py-4 flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
                                            style={{
                                                background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.2)",
                                                color: "white", fontFamily: "'Cormorant Garamond',serif"
                                            }}>
                                            {`${form.surname?.[0] || ""}${form.firstName?.[0] || ""}`}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xl font-bold text-white mb-0.5" style={{ fontFamily: "'Cormorant Garamond',serif" }}>
                                                {form.surname}{form.firstName ? `, ${form.firstName}` : ""}
                                            </p>
                                            <p className="text-2xl font-bold mb-2" style={{ color: "#7ecbea", letterSpacing: "0.12em", fontFamily: "'Cormorant Garamond',serif" }}>
                                                {loaded}
                                            </p>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                                {[
                                                    ["DOB", form.dob ? `${fmtD(form.dob)}${patientAge !== null ? ` (${patientAge}y)` : ""}` : "—"],
                                                    ["Gender", form.gender || "—"],
                                                    ["ID No.", form.idCardNo || "—"],
                                                    ["NHIF", form.nhifNo || "—"],
                                                ].map(([k, v]) => (
                                                    <div key={k}>
                                                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{k}: </span>
                                                        <span className="text-xs font-semibold text-white">{v}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card footer */}
                                    <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)" }}>
                                        <div>
                                            <p className="text-xs font-semibold text-white">{form.nokName || "—"}</p>
                                            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Next of Kin · {form.nokPhone || "—"}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                                                Issued {new Date().toLocaleDateString("en-KE", { dateStyle: "medium" })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-6 pb-5 flex gap-3">
                                <button onClick={() => setShowPrintCard(false)}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                                    style={{ background: "#f1f5f9", border: `1px solid ${C.border}`, color: C.muted }}>
                                    Close
                                </button>
                                <button onClick={() => window.print()}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                                    style={{ background: `linear-gradient(135deg,${C.accent},${C.accentDark})`, boxShadow: "0 4px 14px rgba(26,127,168,0.3)" }}>
                                    🖨️ Print Card
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* populated banner */}
                {populatedBanner && loaded && (
                    <div className="mb-4 px-4 py-3 rounded-xl flex items-center gap-3" style={{ background: "#f0fdf4", border: "2px solid #86efac", animation: "fadeSlide 0.3s ease" }}>
                        <span className="text-lg">✅</span>
                        <div className="flex-1">
                            <p className="text-sm font-bold" style={{ color: C.success }}>Record loaded — {patientName} · {loaded}</p>
                            <p className="text-xs mt-0.5" style={{ color: C.muted }}>All fields have been populated. Review and update as needed, then click Save.</p>
                        </div>
                        <button onClick={() => setPopulatedBanner(false)} className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: "#bbf7d0", color: C.success }}>✕</button>
                    </div>
                )}

                {/* ── TOP INTAKE BAR ── */}
                <div className="rounded-2xl mb-4 overflow-hidden"
                    style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadowMd }}>

                    {/* Bar header */}
                    <div className="px-5 py-2.5 flex items-center gap-2"
                        style={{ background: C.accentLight, borderBottom: `1px solid ${C.accentMid}` }}>
                        <span className="text-sm">📋</span>
                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.accent }}>Patient Registration</p>
                        {form.patientNo && (
                            <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full"
                                style={{ background: C.accent, color: "#fff" }}>{form.patientNo}</span>
                        )}
                    </div>

                    <div className="px-5 py-4 space-y-3">
                        {/* Row 1: Admin fields */}
                        <div className="grid grid-cols-12 gap-3 items-end">
                            <div className="col-span-2"><F label="Counter" value={form.counter} onChange={u("counter")} placeholder="Counter no." /></div>
                            <div className="col-span-2"><F label="Ticket" value={form.ticket} onChange={u("ticket")} placeholder="Ticket no." /></div>
                            <div className="col-span-3"><F label="Telephone" value={form.telephone} onChange={u("telephone")} placeholder="+254 700 000 000" /></div>
                            <div className="col-span-2"><S label="Patient Type" value={form.patientType} onChange={u("patientType")} options={[{ value: "outpatient", label: "Outpatient" }, { value: "inpatient", label: "Inpatient" }, { value: "staff", label: "Staff" }, { value: "emergency", label: "Emergency" }, { value: "maternity", label: "Maternity" }]} /></div>
                            <div className="col-span-3"><F label="Patient No." value={form.patientNo} onChange={u("patientNo")} placeholder="Auto-generated" readOnly /></div>
                        </div>

                        {/* Row 2: Name */}
                        <div className="grid grid-cols-3 gap-3">
                            <F label="Surname *" value={form.surname} onChange={u("surname")} placeholder="Last name" req error={errors.surname} />
                            <F label="First Name *" value={form.firstName} onChange={u("firstName")} placeholder="First name" req error={errors.firstName} />
                            <F label="Other Names" value={form.otherNames} onChange={u("otherNames")} placeholder="Middle / other name" />
                        </div>

                        {/* Row 3: Insurance / Policy */}
                        <div className="pt-1 pb-0.5">
                            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Insurance / Scheme</p>
                            <div className="grid grid-cols-12 gap-3 items-end">
                                <div className="col-span-2"><F label="Member A/c" value={form.memberAc} onChange={u("memberAc")} placeholder="Acc. no." /></div>
                                <div className="col-span-3"><F label="Insurer / Scheme" value={form.memberAcName} onChange={u("memberAcName")} placeholder="e.g. Jubilee Insurance" /></div>
                                <div className="col-span-2"><F label="Member No." value={form.memberNo} onChange={u("memberNo")} placeholder="Member no." /></div>
                                <div className="col-span-2"><F label="Relation" value={form.relation} onChange={u("relation")} placeholder="Self / Dependent" /></div>
                                <div className="col-span-1"><F label="Staff No." value={form.staffNo} onChange={u("staffNo")} /></div>
                                <div className="col-span-1"><F label="Policy No." value={form.policyNo} onChange={u("policyNo")} /></div>
                                <div className="col-span-1"><F label="L.P.O. No." value={form.lpoNo} onChange={u("lpoNo")} /></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── MAIN TABS ── */}
                <div className="rounded-2xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadowLg }}>
                    {/* Tab bar */}
                    <div className="flex overflow-x-auto border-b" style={{ borderColor: C.border, background: "#f8fafc" }}>
                        {MAIN_TABS.filter(tab => tab.id !== "Payer Details" || !!loaded).map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className="flex-shrink-0 px-4 py-3 text-xs font-semibold transition-all duration-150 border-b-2 whitespace-nowrap flex items-center gap-1.5"
                                style={{ borderBottomColor: activeTab === tab.id ? C.accent : "transparent", color: activeTab === tab.id ? C.accent : C.muted, background: activeTab === tab.id ? C.accentLight : "transparent" }}>
                                <span className="text-sm">{tab.icon}</span>
                                {tab.id}
                                {tab.id === "Previous Visits" && visits.length > 0 && <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: C.accentMid, color: C.accentDark }}>{visits.length}</span>}
                                {tab.id === "Available Visit(s)" && activeVisit && <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: "#dcfce7", color: "#15803d" }}>● Live</span>}
                                {tab.id === "Previous Invoices" && invoices.length > 0 && <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: C.accentMid, color: C.accentDark }}>{invoices.length}</span>}
                                {tab.id === "Upload(s)" && uploadFiles.length > 0 && <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: C.accentMid, color: C.accentDark }}>{uploadFiles.length}</span>}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">

                        {/* ══ TAB: Patient Details (a) ══ */}
                        {activeTab === "Patient Details (a)" && (
                            <div className="space-y-5">

                                {/* ── Suspended alert ── */}
                                {form.suspended && (
                                    <div className="px-5 py-4 rounded-2xl flex items-center gap-4"
                                        style={{ background: "#fef2f2", border: "2px solid #fca5a5" }}>
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                            style={{ background: "#fee2e2" }}>🚫</div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold" style={{ color: C.dangerDark }}>Account Suspended</p>
                                            {form.suspendedBy && <p className="text-xs mt-0.5" style={{ color: C.danger }}>
                                                By: <strong>{form.suspendedBy}</strong>
                                                {form.suspendedAt && <> · {fmt(form.suspendedAt)}</>}
                                                {form.suspendReason && <> · <em>{form.suspendReason}</em></>}
                                            </p>}
                                        </div>
                                        <button onClick={handleReinstate}
                                            className="px-4 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0"
                                            style={{ background: `linear-gradient(135deg,${C.success},#15803d)`, boxShadow: "0 3px 10px rgba(22,163,74,0.3)" }}>
                                            ✅ Reinstate
                                        </button>
                                    </div>
                                )}

                                {/* ── ROW 1: Bio Data ── */}
                                <div className="rounded-2xl overflow-hidden"
                                    style={{ border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                                    <div className="px-5 py-3 flex items-center gap-2"
                                        style={{ background: C.accentLight, borderBottom: `1px solid ${C.accentMid}` }}>
                                        <span className="text-sm">👤</span>
                                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.accent }}>Bio Data</p>
                                    </div>
                                    <div className="px-5 py-5 grid grid-cols-4 gap-x-5 gap-y-0">
                                        <S label="Gender *" value={form.gender} onChange={u("gender")} req error={errors.gender}
                                            options={[{ value: "", label: "Select" }, { value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" }]} />
                                        <S label="Marital Status" value={form.maritalStatus} onChange={u("maritalStatus")}
                                            options={[{ value: "", label: "Select" }, { value: "single", label: "Single" }, { value: "married", label: "Married" }, { value: "divorced", label: "Divorced" }, { value: "widowed", label: "Widowed" }, { value: "separated", label: "Separated" }]} />
                                        <S label="Religion" value={form.religion} onChange={u("religion")}
                                            options={[{ value: "", label: "Select" }, { value: "christian", label: "Christian" }, { value: "muslim", label: "Muslim" }, { value: "hindu", label: "Hindu" }, { value: "traditionalist", label: "Traditionalist" }, { value: "other", label: "Other" }]} />
                                        <F label="Nationality *" value={form.nationality} onChange={u("nationality")} req />
                                    </div>
                                    {/* DOB + Age on their own row */}
                                    <div className="px-5 pb-5 grid grid-cols-4 gap-x-5">
                                        <F label="Date of Birth *" value={form.dob} onChange={u("dob")} type="date" req error={errors.dob} />
                                        <div className="mb-3">
                                            <label className="block text-xs font-bold tracking-wider uppercase mb-1" style={{ color: C.label }}>Age</label>
                                            <div className="rounded-lg border text-sm flex items-center px-3"
                                                style={{ background: "#f8fafc", borderColor: C.border, fontFamily: "'DM Sans',sans-serif", boxShadow: C.shadow, height: "36px" }}>
                                                {patientAge !== null && patientAge >= 0 ? (
                                                    <div className="flex items-center gap-1.5 w-full">
                                                        <span className="font-bold text-base" style={{ color: C.accent }}>{patientAge}</span>
                                                        <span className="text-xs" style={{ color: C.muted }}>yrs</span>
                                                        {patientAge < 18 && <span className="ml-auto px-1.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: "#fef3c7", color: "#92400e" }}>Minor</span>}
                                                        {patientAge >= 60 && <span className="ml-auto px-1.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: "#ede9fe", color: "#5b21b6" }}>Senior</span>}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs" style={{ color: C.placeholder }}>Auto-calculated</span>
                                                )}
                                            </div>
                                        </div>
                                        <S label="Category *" value={form.category} onChange={u("category")} req
                                            options={[{ value: "", label: "Select" }, { value: "Normal", label: "Normal" }, { value: "VIP", label: "VIP" }, { value: "Staff", label: "Staff" }, { value: "Senior", label: "Senior" }, { value: "Child", label: "Child" }]} />
                                        {/* spacer */}
                                        <div />
                                    </div>
                                </div>

                                {/* ── ROW 2: Contact & Identification ── */}
                                <div className="grid grid-cols-2 gap-5">

                                    {/* Contact */}
                                    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                                        <div className="px-5 py-3 flex items-center gap-2"
                                            style={{ background: "#f8fafc", borderBottom: `1px solid ${C.border}` }}>
                                            <span className="text-sm">📞</span>
                                            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.label }}>Contact Details</p>
                                        </div>
                                        <div className="px-5 py-5 grid grid-cols-2 gap-x-5">
                                            <F label="Telephone No. *" value={form.telephone} onChange={u("telephone")} req placeholder="+254 700 000 000" />
                                            <F label="Email" value={form.email} onChange={u("email")} type="email" placeholder="patient@email.com" />
                                            <F label="County" value={form.county} onChange={u("county")} placeholder="e.g. Nairobi" />
                                            <F label="Estate / Village" value={form.estate} onChange={u("estate")} placeholder="e.g. Lavington" />
                                        </div>
                                    </div>

                                    {/* Identification */}
                                    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                                        <div className="px-5 py-3 flex items-center gap-2"
                                            style={{ background: "#f8fafc", borderBottom: `1px solid ${C.border}` }}>
                                            <span className="text-sm">🪪</span>
                                            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.label }}>Identification</p>
                                        </div>
                                        <div className="px-5 py-5 grid grid-cols-2 gap-x-5">
                                            <F label="ID Card No. *" value={form.idCardNo} onChange={u("idCardNo")} req placeholder="National ID / Passport" error={errors.idCardNo} />
                                            <F label="NHIF No. *" value={form.nhifNo} onChange={u("nhifNo")} req placeholder="Member number" />
                                            <F label="NHIF Notification No." value={form.nhifNotificationNo} onChange={u("nhifNotificationNo")} placeholder="NHF-XXXXX" />
                                            <div />
                                        </div>
                                    </div>
                                </div>

                                {/* ── ROW 3: Account Notes ── */}
                                <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                                    <div className="px-5 py-3 flex items-center gap-2"
                                        style={{ background: "#f8fafc", borderBottom: `1px solid ${C.border}` }}>
                                        <span className="text-sm">📝</span>
                                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.label }}>Account Notes</p>
                                    </div>
                                    <div className="px-5 py-4">
                                        <textarea value={form.acNotes} onChange={e => { u("acNotes")(e); setIsDirty(true); }} rows={3}
                                            placeholder="Clinical observations, account instructions, or any relevant notes…"
                                            className="w-full rounded-lg border text-sm outline-none resize-none"
                                            style={{
                                                padding: "9px 12px", fontFamily: "'DM Sans',sans-serif",
                                                borderColor: C.border, background: C.card, color: C.text,
                                                boxShadow: C.shadow, lineHeight: 1.7
                                            }}
                                            onFocus={e => { e.target.style.borderColor = C.borderFocus; e.target.style.boxShadow = `0 0 0 2px ${C.accentMid}`; }}
                                            onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = C.shadow; }} />
                                    </div>
                                </div>

                                {/* ── ROW 4: Suspension + Visit Flags + Biometric (3 equal cards) ── */}
                                <div className="grid grid-cols-3 gap-5">

                                    {/* Suspension */}
                                    <div className="rounded-2xl overflow-hidden"
                                        style={{ border: `1px solid ${form.suspended ? C.dangerMid : C.border}`, boxShadow: C.shadow }}>
                                        <div className="px-5 py-3 flex items-center justify-between"
                                            style={{ background: form.suspended ? "#fef2f2" : "#f8fafc", borderBottom: `1px solid ${form.suspended ? C.dangerMid : C.border}` }}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">🚫</span>
                                                <p className="text-xs font-bold uppercase tracking-widest"
                                                    style={{ color: form.suspended ? C.dangerDark : C.label }}>Suspension</p>
                                            </div>
                                            {form.suspended
                                                ? <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#fee2e2", color: C.dangerDark }}>ACTIVE</span>
                                                : <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: C.successLight, color: C.success }}>CLEAR</span>
                                            }
                                        </div>
                                        <div className="px-5 py-4 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <CB label="Suspended" checked={form.suspended} onChange={uc("suspended")} />
                                                {!form.suspended
                                                    ? <button onClick={() => setShowSuspendModal(true)}
                                                        className="ml-auto text-xs px-3 py-1.5 rounded-lg font-bold text-white"
                                                        style={{ background: `linear-gradient(135deg,${C.danger},${C.dangerDark})` }}>
                                                        🚫 Suspend
                                                    </button>
                                                    : <button onClick={handleReinstate}
                                                        className="ml-auto text-xs px-3 py-1.5 rounded-lg font-bold text-white"
                                                        style={{ background: `linear-gradient(135deg,${C.success},#15803d)` }}>
                                                        ✅ Reinstate
                                                    </button>
                                                }
                                            </div>
                                            <S label="Reason" value={form.suspendReason} onChange={u("suspendReason")}
                                                options={SUSPENSION_REASONS.map(r => ({ value: r, label: r || "Select reason…" }))} />
                                        </div>
                                    </div>

                                    {/* Visit Flags */}
                                    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                                        <div className="px-5 py-3 flex items-center gap-2"
                                            style={{ background: "#f8fafc", borderBottom: `1px solid ${C.border}` }}>
                                            <span className="text-sm">🏥</span>
                                            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.label }}>Visit & Billing</p>
                                        </div>
                                        <div className="px-5 py-4 space-y-3">
                                            <div className="flex items-center gap-4">
                                                <CB label="Mater Visit" checked={form.materVisit} onChange={uc("materVisit")} />
                                                <CB label="ReserveOP Invoice" checked={form.reserveOpInvoice} onChange={uc("reserveOpInvoice")} />
                                            </div>
                                            <F label="Visit No." value={form.visitNo} onChange={u("visitNo")} placeholder="Visit reference" />
                                            <F label="Inv. Narration" value={form.invNarration} onChange={u("invNarration")} />
                                        </div>
                                    </div>

                                    {/* Biometric */}
                                    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                                        <div className="px-5 py-3 flex items-center justify-between"
                                            style={{ background: "#f8fafc", borderBottom: `1px solid ${C.border}` }}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">🖐️</span>
                                                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.label }}>Biometric</p>
                                            </div>
                                            {form.biometric
                                                ? <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: C.accentMid, color: C.accentDark }}>Enrolled</span>
                                                : <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#f3f4f6", color: C.muted }}>Not enrolled</span>
                                            }
                                        </div>
                                        <div className="px-5 py-4 space-y-3">
                                            <CB label="Biometric Enrolled" checked={form.biometric} onChange={uc("biometric")} />
                                            <S label="Reason" value={form.biometricReason} onChange={u("biometricReason")}
                                                options={[{ value: "", label: "Select" }, { value: "enrolled", label: "Enrolled" }, { value: "waiver", label: "Waiver – Disability" }, { value: "other", label: "Other" }]} />
                                            <F label="By – Comment" value={form.biometricComment} onChange={u("biometricComment")} placeholder="Officer comment" />
                                        </div>
                                    </div>
                                </div>

                                {/* ── Audit Log ── */}
                                {auditLog.length > 0 && (
                                    <div className="mt-4">
                                        <SectionHead icon="📜">Suspension Audit Log</SectionHead>
                                        <div className="space-y-2">
                                            {auditLog.map((entry, i) => (
                                                <div key={i} className="px-4 py-3 rounded-xl flex items-start gap-3"
                                                    style={{ background: entry.type === "suspend" ? "#fef2f2" : "#f0fdf4", border: `1px solid ${entry.type === "suspend" ? C.dangerMid : "#bbf7d0"}` }}>
                                                    <span className="text-base flex-shrink-0">{entry.type === "suspend" ? "🚫" : "✅"}</span>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: entry.type === "suspend" ? C.dangerDark : C.success }}>
                                                                {entry.type === "suspend" ? "Suspended" : "Reinstated"}
                                                            </span>
                                                            {entry.reason && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fee2e2", color: C.dangerDark }}>{entry.reason}</span>}
                                                            <span className="ml-auto text-xs" style={{ color: C.muted }}>🕐 {fmt(entry.timestamp)}</span>
                                                        </div>
                                                        <p className="text-xs" style={{ color: C.muted }}>By: <strong style={{ color: C.text }}>{entry.officer}</strong></p>
                                                        {entry.notes && <p className="text-xs mt-1 leading-relaxed px-2 py-1 rounded-lg" style={{ color: C.text, background: "rgba(255,255,255,0.7)" }}>{entry.notes}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ══ TAB: Next of Kin ══ */}
                        {activeTab === "Next of Kin" && (
                            <div className="space-y-5">
                                {!loaded ? (
                                    <div className="text-center py-16">
                                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
                                            style={{ background: "#f8fafc", border: `2px dashed ${C.border}` }}>👨‍👩‍👧</div>
                                        <p className="text-base font-semibold" style={{ color: C.muted }}>Fill in patient details first</p>
                                        <p className="text-sm mt-1" style={{ color: C.placeholder }}>Next of Kin details can be entered after the patient record is started</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* NOK profile card */}
                                        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                                            <div className="px-5 py-3 flex items-center gap-2"
                                                style={{ background: C.accentLight, borderBottom: `1px solid ${C.accentMid}` }}>
                                                <span className="text-sm">👨‍👩‍👧</span>
                                                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.accent }}>Next of Kin Details</p>
                                                {form.nokRelation && (
                                                    <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full"
                                                        style={{ background: C.accentMid, color: C.accentDark }}>{form.nokRelation}</span>
                                                )}
                                            </div>

                                            <div className="px-5 py-5">
                                                <div className="flex items-start gap-5 mb-5">
                                                    {/* Avatar */}
                                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
                                                        style={{
                                                            background: "#f1f5f9", border: `2px solid ${C.border}`,
                                                            color: C.accent, fontFamily: "'Cormorant Garamond',serif"
                                                        }}>
                                                        {form.nokName ? form.nokName.split(" ").map(w => w[0]).slice(0, 2).join("") : "?"}
                                                    </div>
                                                    <div className="flex-1 grid grid-cols-3 gap-x-5">
                                                        <F label="Full Name *" value={form.nokName} onChange={u("nokName")} placeholder="Full legal name" req />
                                                        <S label="Relationship *" value={form.nokRelation} onChange={u("nokRelation")} req
                                                            options={[{ value: "", label: "Select" }, { value: "Spouse", label: "Spouse / Partner" }, { value: "Parent", label: "Parent" }, { value: "Child", label: "Child" }, { value: "Sibling", label: "Sibling" }, { value: "Guardian", label: "Legal Guardian" }, { value: "Friend", label: "Friend" }, { value: "Other", label: "Other" }]} />
                                                        <F label="Primary Phone *" value={form.nokPhone} onChange={u("nokPhone")} placeholder="+254 700 000 000" req />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-x-5">
                                                    <F label="Postal / Physical Address" value={form.nokAddress} onChange={u("nokAddress")} placeholder="Estate, P.O. Box, or street address" />
                                                    <div />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Emergency Contact card */}
                                        <div className="rounded-2xl overflow-hidden"
                                            style={{ border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                                            <div className="px-5 py-3 flex items-center gap-2"
                                                style={{ background: "#fff7ed", borderBottom: "1px solid #fed7aa" }}>
                                                <span className="text-sm">🚨</span>
                                                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#c2410c" }}>Emergency Contact</p>
                                                <span className="ml-auto text-xs px-2.5 py-1 rounded-full font-semibold"
                                                    style={{ background: "#fef3c7", color: "#92400e" }}>
                                                    Contact immediately in an emergency
                                                </span>
                                            </div>
                                            <div className="px-5 py-5">
                                                <div className="mb-4 px-4 py-3 rounded-xl flex items-center gap-3"
                                                    style={{ background: C.accentLight, border: `1px solid ${C.accentMid}` }}>
                                                    <span className="text-base">ℹ️</span>
                                                    <p className="text-xs" style={{ color: C.muted }}>
                                                        By default, the Next of Kin is used as the emergency contact.
                                                        The fields below are pre-filled. Update only if a different person should be contacted in emergencies.
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-3 gap-x-5">
                                                    <div>
                                                        <label className="block text-xs font-bold tracking-wider uppercase mb-1" style={{ color: C.label }}>Emergency Name</label>
                                                        <div className="rounded-lg border px-3 py-2 text-sm"
                                                            style={{ background: "#f8fafc", borderColor: C.border, color: form.nokName ? C.text : C.placeholder }}>
                                                            {form.nokName || "Same as NOK"}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold tracking-wider uppercase mb-1" style={{ color: C.label }}>Relationship</label>
                                                        <div className="rounded-lg border px-3 py-2 text-sm"
                                                            style={{ background: "#f8fafc", borderColor: C.border, color: form.nokRelation ? C.text : C.placeholder }}>
                                                            {form.nokRelation || "Same as NOK"}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold tracking-wider uppercase mb-1" style={{ color: C.label }}>Emergency Phone</label>
                                                        <div className="rounded-lg border px-3 py-2 text-sm"
                                                            style={{ background: "#f8fafc", borderColor: C.border, color: form.nokPhone ? C.text : C.placeholder }}>
                                                            {form.nokPhone || "Same as NOK"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* ══ TAB: Payer Details ══ */}
                        {activeTab === "Payer Details" && (
                            !loaded
                                ? (
                                    <div className="text-center py-16">
                                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
                                            style={{ background: "#f8fafc", border: `2px dashed ${C.border}` }}>💳</div>
                                        <p className="text-base font-semibold" style={{ color: C.muted }}>No patient loaded</p>
                                        <p className="text-sm mt-1" style={{ color: C.placeholder }}>
                                            Search and select a patient record to view or edit payer / guarantor details.
                                        </p>
                                    </div>
                                )
                                : (
                                    <div className="max-w-2xl">
                                        <SectionHead icon="💳">Payer / Guarantor Information</SectionHead>
                                        <div className="grid grid-cols-2 gap-x-6">
                                            <F label="Payer Name" value={form.payerName} onChange={u("payerName")} placeholder="Insurance / self" />
                                            <S label="Payer Type" value={form.payerType} onChange={u("payerType")} options={[{ value: "", label: "Select" }, { value: "nhif", label: "NHIF / SHA" }, { value: "insurance", label: "Private Insurance" }, { value: "corporate", label: "Corporate / Employer" }, { value: "self", label: "Self-Pay (Cash)" }, { value: "linda_mama", label: "Linda Mama" }, { value: "other", label: "Other" }]} />
                                            <F label="Phone" value={form.payerPhone} onChange={u("payerPhone")} placeholder="+254 700 000 000" />
                                            <F label="Email" value={form.payerEmail} onChange={u("payerEmail")} type="email" />
                                            <div className="col-span-2"><F label="Address" value={form.payerAddress} onChange={u("payerAddress")} placeholder="Payer address" /></div>
                                            <F label="Policy No." value={form.policyNo} onChange={u("policyNo")} />
                                            <F label="L.P.O. No." value={form.lpoNo} onChange={u("lpoNo")} />
                                            <F label="Member No." value={form.memberNo} onChange={u("memberNo")} />
                                            <F label="Member A/c" value={form.memberAc} onChange={u("memberAc")} />
                                        </div>
                                    </div>
                                )
                        )}

                        {/* ══ TAB: Previous Visits ══ */}
                        {activeTab === "Previous Visits" && (
                            <div>
                                {/* ── Visit Details Modal ── */}
                                {viewingVisit && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                                        style={{ background: "rgba(10,20,30,0.55)", backdropFilter: "blur(5px)" }}>
                                        <div className="w-full max-w-2xl rounded-2xl overflow-hidden"
                                            style={{ background: C.card, boxShadow: "0 32px 80px rgba(0,0,0,0.35)", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>

                                            {/* Header */}
                                            <div className="px-6 py-4 flex items-center gap-4 flex-shrink-0"
                                                style={{ background: viewingVisit.type === "IPD" ? "#78350f" : C.headerBg }}>
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                                    style={{ background: "rgba(255,255,255,0.1)" }}>
                                                    {viewingVisit.type === "IPD" ? "🏥" : "🩺"}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold tracking-widest uppercase"
                                                        style={{ color: viewingVisit.type === "IPD" ? "#fde68a" : "#7ecbea" }}>
                                                        {viewingVisit.type} Visit · {viewingVisit.clinic}
                                                    </p>
                                                    <p className="text-lg font-semibold text-white" style={{ fontFamily: "'Cormorant Garamond',serif" }}>
                                                        {viewingVisit.visitNo} — {viewingVisit.diagnosis}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        bg={viewingVisit.status === "Admitted" ? "#fef3c7" : viewingVisit.status === "Completed" ? "#dcfce7" : "#f3f4f6"}
                                                        color={viewingVisit.status === "Admitted" ? C.warning : viewingVisit.status === "Completed" ? C.success : C.muted}>
                                                        {viewingVisit.status}
                                                    </Badge>
                                                    <button onClick={() => setViewingVisit(null)}
                                                        className="w-8 h-8 rounded-full flex items-center justify-center ml-2"
                                                        style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontSize: "1.1rem" }}>✕</button>
                                                </div>
                                            </div>

                                            {/* Body */}
                                            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

                                                {/* Meta strip */}
                                                <div className="grid grid-cols-4 gap-3">
                                                    {[
                                                        ["Visit No.", viewingVisit.visitNo],
                                                        ["Date", fmtD(viewingVisit.date)],
                                                        ["Department", viewingVisit.department],
                                                        ["Doctor", viewingVisit.doctor],
                                                    ].map(([k, v]) => (
                                                        <div key={k} className="rounded-xl px-3 py-2.5" style={{ background: C.accentLight, border: `1px solid ${C.accentMid}` }}>
                                                            <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: C.muted }}>{k}</p>
                                                            <p className="text-sm font-semibold" style={{ color: C.text }}>{v}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* IPD admission dates */}
                                                {viewingVisit.type === "IPD" && (
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {[
                                                            ["Admission Date", fmtD(viewingVisit.admissionDate)],
                                                            ["Medical Discharge", fmtD(viewingVisit.medicalDischarge)],
                                                            ["Release Date", fmtD(viewingVisit.release)],
                                                        ].map(([k, v]) => (
                                                            <div key={k} className="rounded-xl px-3 py-2.5" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
                                                                <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: C.warning }}>{k}</p>
                                                                <p className="text-sm font-semibold" style={{ color: C.text }}>{v}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Vitals */}
                                                {viewingVisit.vitals && (
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.label }}>🩺 Vital Signs</p>
                                                        <div className="grid grid-cols-5 gap-2">
                                                            {Object.entries(viewingVisit.vitals).map(([k, v]) => (
                                                                <div key={k} className="rounded-xl px-3 py-2.5 text-center" style={{ background: "#f8fafc", border: `1px solid ${C.border}` }}>
                                                                    <p className="text-xs uppercase tracking-wide" style={{ color: C.muted }}>{k.toUpperCase()}</p>
                                                                    <p className="text-xs font-bold mt-0.5" style={{ color: C.text }}>{v}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Clinical sections */}
                                                {[
                                                    ["💬 Chief Complaints", viewingVisit.complaints],
                                                    ["🔬 Examination Findings", viewingVisit.examination],
                                                    ["💊 Treatment Given", viewingVisit.treatment],
                                                    ["📝 Clinical Notes", viewingVisit.notes],
                                                ].map(([heading, content]) => (
                                                    <div key={heading} className="rounded-xl px-4 py-3" style={{ background: "#f8fafc", border: `1px solid ${C.border}` }}>
                                                        <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: C.label }}>{heading}</p>
                                                        <p className="text-sm leading-relaxed" style={{ color: C.text }}>{content || "—"}</p>
                                                    </div>
                                                ))}

                                                {/* Prescriptions */}
                                                {viewingVisit.prescriptions && viewingVisit.prescriptions.length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.label }}>💊 Prescriptions</p>
                                                        <div className="space-y-1.5">
                                                            {viewingVisit.prescriptions.map((rx, i) => (
                                                                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: C.accentLight, border: `1px solid ${C.accentMid}` }}>
                                                                    <span className="text-sm flex-shrink-0">💊</span>
                                                                    <span className="text-xs font-semibold" style={{ color: C.text }}>{rx}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer */}
                                            <div className="px-6 py-4 flex gap-3 flex-shrink-0" style={{ borderTop: `1px solid ${C.border}`, background: "#f8fafc" }}>
                                                <button onClick={() => setViewingVisit(null)}
                                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                                                    style={{ background: C.card, border: `1px solid ${C.border}`, color: C.muted }}>
                                                    ← Back to Previous Visits
                                                </button>
                                                <button onClick={() => window.print()}
                                                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                                                    style={{ background: `linear-gradient(135deg,${C.accent},${C.accentDark})`, boxShadow: "0 4px 14px rgba(26,127,168,0.3)" }}>
                                                    🖨️ Print Visit Summary
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mb-4">
                                    <SectionHead icon="📋">Previous Visits</SectionHead>
                                    {visits.length > 0 && (
                                        <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: C.accentLight, color: C.accent }}>
                                            {visits.length} visit{visits.length > 1 ? "s" : ""}
                                        </span>
                                    )}
                                </div>

                                {!loaded
                                    ? <div className="text-center py-16">
                                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
                                            style={{ background: "#f8fafc", border: `2px dashed ${C.border}` }}>📋</div>
                                        <p className="text-base font-semibold" style={{ color: C.muted }}>No patient loaded</p>
                                        <p className="text-sm mt-1" style={{ color: C.placeholder }}>Search and select a patient to view their visit history</p>
                                    </div>
                                    : visits.length === 0
                                        ? <div className="text-center py-12">
                                            <p className="text-4xl mb-3">📭</p>
                                            <p className="text-base font-semibold" style={{ color: C.muted }}>No visit history</p>
                                        </div>
                                        : <>
                                            {/* Table header — Date, Visit No., Type, Department, Doctor, Clinic, Status, Action */}
                                            <div className="grid gap-3 px-4 py-2.5 rounded-lg mb-2 text-xs font-bold uppercase tracking-wider"
                                                style={{ gridTemplateColumns: "1.2fr 1fr 0.7fr 1.4fr 1.2fr 1.4fr 0.9fr 0.7fr", background: C.accentLight, color: C.accent }}>
                                                <span>Date</span>
                                                <span>Visit No.</span>
                                                <span>Type</span>
                                                <span>Department</span>
                                                <span>Doctor</span>
                                                <span>Clinic</span>
                                                <span>Status</span>
                                                <span></span>
                                            </div>
                                            {visits.map((v, i) => (
                                                <div key={v.visitNo}
                                                    className="grid gap-3 px-4 py-3 rounded-xl mb-2 items-center transition-all duration-150"
                                                    style={{
                                                        gridTemplateColumns: "1.2fr 1fr 0.7fr 1.4fr 1.2fr 1.4fr 0.9fr 0.7fr",
                                                        background: i % 2 === 0 ? "#f8fafc" : C.card, border: `1px solid ${C.border}`
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = C.accentLight}
                                                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#f8fafc" : C.card}>
                                                    <span className="text-xs" style={{ color: C.text }}>{fmtD(v.date)}</span>
                                                    <span className="text-xs font-semibold" style={{ color: C.accent }}>{v.visitNo}</span>
                                                    <span>
                                                        <Badge bg={v.type === "IPD" ? "#fef3c7" : "#e8f4f9"} color={v.type === "IPD" ? C.warning : C.accent}>{v.type}</Badge>
                                                    </span>
                                                    <span className="text-xs" style={{ color: C.text }}>{v.department}</span>
                                                    <span className="text-xs" style={{ color: C.muted }}>{v.doctor}</span>
                                                    <span className="text-xs" style={{ color: C.muted }}>{v.clinic}</span>
                                                    <Badge
                                                        bg={v.status === "Admitted" ? "#fef3c7" : v.status === "Completed" ? "#dcfce7" : "#f3f4f6"}
                                                        color={v.status === "Admitted" ? C.warning : v.status === "Completed" ? C.success : C.muted}>
                                                        {v.status}
                                                    </Badge>
                                                    <button
                                                        onClick={() => setViewingVisit(v)}
                                                        className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 whitespace-nowrap"
                                                        style={{ background: `linear-gradient(135deg,${C.accent},${C.accentDark})`, color: "#fff", boxShadow: "0 2px 8px rgba(26,127,168,0.25)" }}
                                                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(26,127,168,0.45)"}
                                                        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(26,127,168,0.25)"}>
                                                        👁 View
                                                    </button>
                                                </div>
                                            ))}
                                        </>
                                }
                            </div>
                        )}

                        {/* ══ TAB: Available Visit(s) — Current Ongoing Visit ══ */}
                        {activeTab === "Available Visit(s)" && (
                            <div>
                                <div className="flex items-center justify-between mb-5">
                                    <SectionHead icon="🟢">Available Visit(s)</SectionHead>
                                    {activeVisit && (
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#16a34a" }} />
                                            <span className="text-xs font-bold" style={{ color: C.success }}>Live · 1 active visit</span>
                                        </div>
                                    )}
                                </div>

                                {!loaded ? (
                                    <div className="text-center py-16">
                                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
                                            style={{ background: "#f8fafc", border: `2px dashed ${C.border}` }}>🟢</div>
                                        <p className="text-base font-semibold" style={{ color: C.muted }}>No patient loaded</p>
                                        <p className="text-sm mt-1" style={{ color: C.placeholder }}>Search and select a patient to view their current visit</p>
                                    </div>

                                ) : !activeVisit ? (
                                    <div className="text-center py-14">
                                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
                                            style={{ background: "#f0fdf4", border: `2px dashed #86efac` }}>✅</div>
                                        <p className="text-base font-semibold" style={{ color: C.muted }}>No active visit</p>
                                        <p className="text-sm mt-1 mb-5" style={{ color: C.placeholder }}>
                                            {patientName} does not have a current ongoing visit today.
                                        </p>
                                        <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                                            style={{ background: `linear-gradient(135deg,${C.accent},${C.accentDark})`, boxShadow: "0 4px 14px rgba(26,127,168,0.3)" }}>
                                            + Register New Visit
                                        </button>
                                    </div>

                                ) : (
                                    <div>
                                        {/* ── Visit Detail Modal ── */}
                                        {showActiveVisitDetail && (
                                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                                                style={{ background: "rgba(10,20,30,0.55)", backdropFilter: "blur(5px)" }}>
                                                <div className="w-full max-w-2xl rounded-2xl overflow-hidden"
                                                    style={{ background: C.card, boxShadow: "0 32px 80px rgba(0,0,0,0.35)", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>

                                                    {/* Modal header */}
                                                    <div className="px-6 py-4 flex items-center gap-4 flex-shrink-0"
                                                        style={{ background: "linear-gradient(135deg,#1a2e3b,#0e6a8f)" }}>
                                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                                            style={{ background: "rgba(255,255,255,0.1)" }}>🩺</div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#4ade80" }} />
                                                                <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#7ecbea" }}>
                                                                    Active OPD Visit · {activeVisit.clinic}
                                                                </p>
                                                            </div>
                                                            <p className="text-lg font-semibold text-white" style={{ fontFamily: "'Cormorant Garamond',serif" }}>
                                                                {activeVisit.visitNo} — {activeVisit.department}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-3 flex-shrink-0">
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                                                                style={{ background: "#dcfce7", color: "#15803d" }}>
                                                                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#16a34a" }} />
                                                                {activeVisit.status}
                                                            </span>
                                                            <button onClick={() => setShowActiveVisitDetail(false)}
                                                                className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                                                                style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>✕</button>
                                                        </div>
                                                    </div>

                                                    {/* Modal body */}
                                                    <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

                                                        {/* Meta grid */}
                                                        <div className="grid grid-cols-4 gap-3">
                                                            {[
                                                                ["Visit No.", activeVisit.visitNo],
                                                                ["Date", fmtD(activeVisit.date)],
                                                                ["Triage Time", activeVisit.triageTime || "—"],
                                                                ["Seen At", activeVisit.seenTime || "Pending"],
                                                            ].map(([label, val]) => (
                                                                <div key={label} className="rounded-xl px-3 py-2.5"
                                                                    style={{ background: C.accentLight, border: `1px solid ${C.accentMid}` }}>
                                                                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: C.muted }}>{label}</p>
                                                                    <p className="text-sm font-semibold" style={{ color: val === "Pending" ? C.warning : C.text }}>{val}</p>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Staff */}
                                                        <div className="grid grid-cols-4 gap-3">
                                                            {[
                                                                ["Doctor", activeVisit.attendingDoctor, "🩺"],
                                                                ["Nurse", activeVisit.attendingNurse, "💊"],
                                                                ["Dept.", activeVisit.department, "🏥"],
                                                                ["Clinic", activeVisit.clinic, "📍"],
                                                            ].map(([label, val, icon]) => (
                                                                <div key={label} className="rounded-xl px-3 py-2.5"
                                                                    style={{ background: "#f8fafc", border: `1px solid ${C.border}` }}>
                                                                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1" style={{ color: C.muted }}>
                                                                        <span>{icon}</span>{label}
                                                                    </p>
                                                                    <p className="text-xs font-semibold" style={{ color: C.text }}>{val}</p>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Triage Vitals */}
                                                        <div>
                                                            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.label }}>🩺 Triage Vitals</p>
                                                            <div className="grid grid-cols-5 gap-2">
                                                                {Object.entries(activeVisit.triageVitals).map(([k, v]) => (
                                                                    <div key={k} className="rounded-xl px-3 py-2.5 text-center"
                                                                        style={{ background: "#f8fafc", border: `1px solid ${C.border}` }}>
                                                                        <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: C.muted }}>{k}</p>
                                                                        <p className="text-xs font-bold mt-1" style={{ color: C.text }}>{v}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Clinical sections */}
                                                        {[
                                                            ["💬 Chief Complaint", activeVisit.chiefComplaint],
                                                            ["📝 Progress Notes", activeVisit.notes],
                                                        ].map(([heading, content]) => (
                                                            <div key={heading} className="rounded-xl px-4 py-3"
                                                                style={{ background: "#f8fafc", border: `1px solid ${C.border}` }}>
                                                                <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: C.label }}>{heading}</p>
                                                                <p className="text-sm leading-relaxed" style={{ color: C.text }}>{content || "—"}</p>
                                                            </div>
                                                        ))}

                                                        {/* Invoice */}
                                                        <div className="rounded-xl overflow-hidden"
                                                            style={{ border: `1px solid ${C.warningMid}` }}>
                                                            <div className="px-4 py-2.5 flex items-center justify-between"
                                                                style={{ background: "#fffbeb", borderBottom: `1px solid ${C.warningMid}` }}>
                                                                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: C.warning }}>🧾 Invoice</span>
                                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                                                    style={{ background: "#fef3c7", color: C.warning }}>{activeVisit.invoiceStatus}</span>
                                                            </div>
                                                            <div className="px-4 py-3 grid grid-cols-3 gap-4">
                                                                {[
                                                                    ["Invoice No.", activeVisit.invoiceNo],
                                                                    ["Estimated", "KES " + activeVisit.invoiceAmount.toLocaleString()],
                                                                    ["Balance Due", "KES " + activeVisit.invoiceAmount.toLocaleString()],
                                                                ].map(([label, val]) => (
                                                                    <div key={label}>
                                                                        <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: C.muted }}>{label}</p>
                                                                        <p className="text-sm font-semibold" style={{ color: C.text }}>{val}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Modal footer */}
                                                    <div className="px-6 py-4 flex gap-3 flex-shrink-0"
                                                        style={{ borderTop: `1px solid ${C.border}`, background: "#f8fafc" }}>
                                                        <button onClick={() => setShowActiveVisitDetail(false)}
                                                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                                                            style={{ background: C.card, border: `1px solid ${C.border}`, color: C.muted }}>
                                                            ← Close
                                                        </button>
                                                        <button onClick={() => window.print()}
                                                            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                                                            style={{ background: `linear-gradient(135deg,${C.accent},${C.accentDark})`, boxShadow: "0 4px 14px rgba(26,127,168,0.3)" }}>
                                                            🖨️ Print Visit Card
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* ── HORIZONTAL RECORD ROW ── */}
                                        <div className="rounded-2xl overflow-hidden"
                                            style={{ border: `1px solid ${C.accentMid}`, boxShadow: "0 4px 20px rgba(26,127,168,0.12)" }}>

                                            {/* Coloured top bar */}
                                            <div className="h-1.5" style={{ background: "linear-gradient(90deg,#1a7fa8,#16a34a)" }} />

                                            <div className="px-6 py-5 flex items-center gap-6">

                                                {/* Visit icon + type */}
                                                <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                                        style={{ background: C.accentLight, border: `2px solid ${C.accentMid}` }}>🩺</div>
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                                        style={{ background: C.accentMid, color: C.accentDark }}>OPD</span>
                                                </div>

                                                {/* Visit No. */}
                                                <div className="flex-shrink-0">
                                                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: C.muted }}>Visit No.</p>
                                                    <p className="text-base font-bold" style={{ color: C.accent }}>{activeVisit.visitNo}</p>
                                                </div>

                                                <div className="w-px h-10 flex-shrink-0" style={{ background: C.border }} />

                                                {/* Date */}
                                                <div className="flex-shrink-0">
                                                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: C.muted }}>Date</p>
                                                    <p className="text-sm font-semibold" style={{ color: C.text }}>{fmtD(activeVisit.date)}</p>
                                                </div>

                                                <div className="w-px h-10 flex-shrink-0" style={{ background: C.border }} />

                                                {/* Department */}
                                                <div className="flex-shrink-0">
                                                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: C.muted }}>Department</p>
                                                    <p className="text-sm font-semibold" style={{ color: C.text }}>{activeVisit.department}</p>
                                                </div>

                                                <div className="w-px h-10 flex-shrink-0" style={{ background: C.border }} />

                                                {/* Doctor */}
                                                <div className="flex-shrink-0">
                                                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: C.muted }}>Doctor</p>
                                                    <p className="text-sm font-semibold" style={{ color: C.text }}>{activeVisit.doctor}</p>
                                                </div>

                                                <div className="w-px h-10 flex-shrink-0" style={{ background: C.border }} />

                                                {/* Clinic */}
                                                <div className="flex-shrink-0">
                                                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: C.muted }}>Clinic</p>
                                                    <p className="text-sm font-semibold" style={{ color: C.text }}>{activeVisit.clinic}</p>
                                                </div>

                                                <div className="w-px h-10 flex-shrink-0" style={{ background: C.border }} />

                                                {/* Triage time */}
                                                <div className="flex-shrink-0">
                                                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: C.muted }}>Triage</p>
                                                    <p className="text-sm font-semibold" style={{ color: C.text }}>{activeVisit.triageTime || "—"}</p>
                                                </div>

                                                <div className="w-px h-10 flex-shrink-0" style={{ background: C.border }} />

                                                {/* Status */}
                                                <div className="flex-shrink-0">
                                                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: C.muted }}>Status</p>
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                                                        style={{ background: "#dcfce7", color: "#15803d" }}>
                                                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#16a34a" }} />
                                                        {activeVisit.status}
                                                    </span>
                                                </div>

                                                {/* Spacer */}
                                                <div className="flex-1" />

                                                {/* View button */}
                                                <button
                                                    onClick={() => setShowActiveVisitDetail(true)}
                                                    className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200"
                                                    style={{ background: `linear-gradient(135deg,${C.accent},${C.accentDark})`, boxShadow: "0 4px 14px rgba(26,127,168,0.3)" }}
                                                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(26,127,168,0.5)"}
                                                    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(26,127,168,0.3)"}>
                                                    👁 View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ══ TAB: Previous Invoices ══ */}
                        {activeTab === "Previous Invoices" && (
                            <div>
                                {/* Invoice View Modal */}
                                {viewingInvoice && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                                        style={{ background: "rgba(10,20,30,0.55)", backdropFilter: "blur(5px)" }}>
                                        <div className="w-full max-w-2xl rounded-2xl overflow-hidden"
                                            style={{ background: C.card, boxShadow: "0 32px 80px rgba(0,0,0,0.35)", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>

                                            {/* Modal Header */}
                                            <div className="px-6 py-4 flex items-center gap-4 flex-shrink-0"
                                                style={{ background: C.headerBg }}>
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                                    style={{ background: "rgba(255,255,255,0.08)" }}>🧾</div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#7ecbea" }}>Invoice</p>
                                                    <p className="text-lg font-semibold text-white" style={{ fontFamily: "'Cormorant Garamond',serif" }}>{viewingInvoice.invoiceNo}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => window.print()}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                                                        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)" }}>
                                                        🖨️ Print
                                                    </button>
                                                    <button onClick={() => setViewingInvoice(null)}
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                                                        style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>✕</button>
                                                </div>
                                            </div>

                                            {/* Scrollable Body */}
                                            <div className="overflow-y-auto flex-1 px-6 py-6">

                                                {/* Hospital + Patient Info */}
                                                <div className="flex justify-between mb-6">
                                                    <div>
                                                        <p className="text-base font-bold" style={{ color: C.text, fontFamily: "'Cormorant Garamond',serif" }}>TMH Kasarani Clinic</p>
                                                        <p className="text-xs" style={{ color: C.muted }}>National Referral Hospital · Tier III</p>
                                                        <p className="text-xs" style={{ color: C.muted }}>Kasarani, Nairobi · Tel: +254 700 000 000</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Invoice Date</p>
                                                        <p className="text-sm font-semibold" style={{ color: C.text }}>{fmtD(viewingInvoice.date)}</p>
                                                        <div className="mt-2">
                                                            <Badge
                                                                bg={viewingInvoice.status === "Paid" ? "#dcfce7" : viewingInvoice.status === "Partial" ? "#fef3c7" : "#fef2f2"}
                                                                color={viewingInvoice.status === "Paid" ? C.success : viewingInvoice.status === "Partial" ? C.warning : C.danger}>
                                                                {viewingInvoice.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Patient details strip */}
                                                <div className="rounded-xl px-4 py-3 mb-5 grid grid-cols-3 gap-4"
                                                    style={{ background: C.accentLight, border: `1px solid ${C.accentMid}` }}>
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: C.muted }}>Patient</p>
                                                        <p className="text-sm font-semibold" style={{ color: C.text }}>{patientName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: C.muted }}>Patient No.</p>
                                                        <p className="text-sm font-semibold" style={{ color: C.text }}>{loaded || "—"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: C.muted }}>Invoice No.</p>
                                                        <p className="text-sm font-semibold" style={{ color: C.accent }}>{viewingInvoice.invoiceNo}</p>
                                                    </div>
                                                </div>

                                                {/* Line items table */}
                                                <div className="mb-5">
                                                    <div className="grid grid-cols-12 gap-2 px-3 py-2 rounded-t-lg text-xs font-bold uppercase tracking-wider"
                                                        style={{ background: C.accentLight, color: C.accent }}>
                                                        <span className="col-span-6">Description</span>
                                                        <span className="col-span-2 text-right">Qty</span>
                                                        <span className="col-span-2 text-right">Unit (KES)</span>
                                                        <span className="col-span-2 text-right">Total (KES)</span>
                                                    </div>
                                                    {/* Parse items into rows */}
                                                    {viewingInvoice.items.split(",").map((item, idx) => {
                                                        const name = item.trim();
                                                        const unitPrice = Math.round(viewingInvoice.amount / viewingInvoice.items.split(",").length);
                                                        return (
                                                            <div key={idx} className="grid grid-cols-12 gap-2 px-3 py-2.5 items-center text-sm"
                                                                style={{ background: idx % 2 === 0 ? "#f8fafc" : C.card, borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.sectionRule}` }}>
                                                                <span className="col-span-6 text-xs" style={{ color: C.text }}>{name}</span>
                                                                <span className="col-span-2 text-right text-xs" style={{ color: C.muted }}>1</span>
                                                                <span className="col-span-2 text-right text-xs" style={{ color: C.muted }}>{unitPrice.toLocaleString()}</span>
                                                                <span className="col-span-2 text-right text-xs font-semibold" style={{ color: C.text }}>{unitPrice.toLocaleString()}</span>
                                                            </div>
                                                        );
                                                    })}
                                                    {/* Subtotal / tax / total block */}
                                                    <div className="rounded-b-lg overflow-hidden" style={{ border: `1px solid ${C.border}`, borderTop: "none" }}>
                                                        {[
                                                            ["Subtotal", viewingInvoice.amount, C.text, false],
                                                            ["VAT (0% – Exempt)", 0, C.muted, false],
                                                            ["GRAND TOTAL", viewingInvoice.amount, C.text, true],
                                                        ].map(([label, val, col, bold]) => (
                                                            <div key={label} className="flex justify-between px-3 py-2 text-xs"
                                                                style={{ background: bold ? C.accentLight : "#fafcff", borderTop: `1px solid ${C.sectionRule}` }}>
                                                                <span style={{ color: C.muted, fontWeight: bold ? 700 : 400 }}>{label}</span>
                                                                <span style={{ color: col, fontWeight: bold ? 700 : 500 }}>KES {val.toLocaleString()}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Payment summary */}
                                                <div className="grid grid-cols-3 gap-3 mb-5">
                                                    {[
                                                        ["Total Billed", "KES " + viewingInvoice.amount.toLocaleString(), C.text, "#f8fafc"],
                                                        ["Amount Paid", "KES " + viewingInvoice.paid.toLocaleString(), C.success, "#f0fdf4"],
                                                        ["Outstanding Balance", "KES " + viewingInvoice.balance.toLocaleString(), viewingInvoice.balance > 0 ? C.danger : C.success, viewingInvoice.balance > 0 ? "#fef2f2" : "#f0fdf4"],
                                                    ].map(([label, val, col, bg]) => (
                                                        <div key={label} className="rounded-xl px-4 py-3 text-center"
                                                            style={{ background: bg, border: `1px solid ${C.border}` }}>
                                                            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: C.muted }}>{label}</p>
                                                            <p className="text-lg font-bold" style={{ color: col, fontFamily: "'Cormorant Garamond',serif" }}>{val}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Payment history */}
                                                <div className="rounded-xl overflow-hidden mb-4" style={{ border: `1px solid ${C.border}` }}>
                                                    <div className="px-4 py-2.5" style={{ background: "#f8fafc", borderBottom: `1px solid ${C.border}` }}>
                                                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: C.label }}>Payment History</p>
                                                    </div>
                                                    {viewingInvoice.paid > 0
                                                        ? <div className="px-4 py-3 flex items-center justify-between">
                                                            <div>
                                                                <p className="text-xs font-semibold" style={{ color: C.text }}>Payment received</p>
                                                                <p className="text-xs" style={{ color: C.muted }}>{fmtD(viewingInvoice.date)} · Cash / Insurance</p>
                                                            </div>
                                                            <span className="text-sm font-bold" style={{ color: C.success }}>KES {viewingInvoice.paid.toLocaleString()}</span>
                                                        </div>
                                                        : <div className="px-4 py-4 text-center">
                                                            <p className="text-xs" style={{ color: C.placeholder }}>No payments recorded</p>
                                                        </div>
                                                    }
                                                </div>

                                                {/* Footer note */}
                                                <p className="text-xs text-center" style={{ color: C.placeholder }}>
                                                    This invoice was generated by TMH Kasarani Clinic · {viewingInvoice.invoiceNo} · {fmtD(viewingInvoice.date)}
                                                </p>
                                            </div>

                                            {/* Modal Footer */}
                                            <div className="px-6 py-4 flex gap-3 flex-shrink-0" style={{ borderTop: `1px solid ${C.border}`, background: "#f8fafc" }}>
                                                <button onClick={() => setViewingInvoice(null)}
                                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                                                    style={{ background: C.card, border: `1px solid ${C.border}`, color: C.muted }}>
                                                    ← Back to Invoices
                                                </button>
                                                <button onClick={() => window.print()}
                                                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                                                    style={{ background: `linear-gradient(135deg,${C.accent},${C.accentDark})`, boxShadow: "0 4px 14px rgba(26,127,168,0.3)" }}>
                                                    🖨️ Print Invoice
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mb-4">
                                    <SectionHead icon="🧾">Previous Invoices</SectionHead>
                                    {invoices.length > 0 && (
                                        <div className="flex gap-3 text-xs">
                                            <span className="px-3 py-1.5 rounded-full font-semibold" style={{ background: "#dcfce7", color: C.success }}>
                                                Paid: KES {invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.amount, 0).toLocaleString()}
                                            </span>
                                            <span className="px-3 py-1.5 rounded-full font-semibold" style={{ background: "#fef2f2", color: C.danger }}>
                                                Balance: KES {invoices.reduce((s, i) => s + i.balance, 0).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {!loaded
                                    ? <div className="text-center py-16"><p className="text-4xl mb-3">🧾</p><p className="text-base font-semibold" style={{ color: C.muted }}>Search a patient to view invoices</p></div>
                                    : invoices.length === 0
                                        ? <div className="text-center py-12"><p className="text-4xl mb-3">📭</p><p className="text-base font-semibold" style={{ color: C.muted }}>No invoices found</p></div>
                                        : <div>
                                            {/* Table header — 8 cols now to include View */}
                                            <div className="grid gap-2 px-4 py-2 rounded-lg mb-2 text-xs font-bold uppercase tracking-wider"
                                                style={{ gridTemplateColumns: "2fr 1.2fr 1.3fr 1.3fr 1.3fr 1fr 2fr 0.8fr", background: C.accentLight, color: C.accent }}>
                                                <span>Invoice No.</span><span>Date</span><span>Amount (KES)</span><span>Paid (KES)</span><span>Balance (KES)</span><span>Status</span><span>Items</span><span></span>
                                            </div>
                                            {invoices.map((inv, i) => (
                                                <div key={inv.invoiceNo}
                                                    className="grid gap-2 px-4 py-3 rounded-xl mb-2 items-center"
                                                    style={{ gridTemplateColumns: "2fr 1.2fr 1.3fr 1.3fr 1.3fr 1fr 2fr 0.8fr", background: i % 2 === 0 ? "#f8fafc" : C.card, border: `1px solid ${C.border}`, transition: "background 0.15s" }}
                                                    onMouseEnter={e => e.currentTarget.style.background = C.accentLight}
                                                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#f8fafc" : C.card}>
                                                    <span className="text-xs font-semibold" style={{ color: C.accent }}>{inv.invoiceNo}</span>
                                                    <span className="text-xs" style={{ color: C.text }}>{fmtD(inv.date)}</span>
                                                    <span className="text-xs font-semibold" style={{ color: C.text }}>{inv.amount.toLocaleString()}</span>
                                                    <span className="text-xs font-semibold" style={{ color: C.success }}>{inv.paid.toLocaleString()}</span>
                                                    <span className="text-xs font-bold" style={{ color: inv.balance > 0 ? C.danger : C.success }}>{inv.balance.toLocaleString()}</span>
                                                    <Badge
                                                        bg={inv.status === "Paid" ? "#dcfce7" : inv.status === "Partial" ? "#fef3c7" : "#fef2f2"}
                                                        color={inv.status === "Paid" ? C.success : inv.status === "Partial" ? C.warning : C.danger}>
                                                        {inv.status}
                                                    </Badge>
                                                    <span className="text-xs truncate" style={{ color: C.muted }} title={inv.items}>{inv.items}</span>
                                                    {/* ── VIEW BUTTON ── */}
                                                    <button
                                                        onClick={() => setViewingInvoice(inv)}
                                                        className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150"
                                                        style={{ background: `linear-gradient(135deg,${C.accent},${C.accentDark})`, color: "#fff", boxShadow: "0 2px 8px rgba(26,127,168,0.25)", whiteSpace: "nowrap" }}
                                                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(26,127,168,0.45)"}
                                                        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(26,127,168,0.25)"}>
                                                        👁 View
                                                    </button>
                                                </div>
                                            ))}
                                            {/* Totals */}
                                            <div className="grid gap-2 px-4 py-3 rounded-xl mt-2 text-sm font-bold"
                                                style={{ gridTemplateColumns: "2fr 1.2fr 1.3fr 1.3fr 1.3fr 1fr 2fr 0.8fr", background: C.accentLight }}>
                                                <span className="col-span-2 text-xs" style={{ color: C.accent }}>TOTALS</span>
                                                <span style={{ color: C.text }}>{invoices.reduce((s, i) => s + i.amount, 0).toLocaleString()}</span>
                                                <span style={{ color: C.success }}>{invoices.reduce((s, i) => s + i.paid, 0).toLocaleString()}</span>
                                                <span style={{ color: invoices.reduce((s, i) => s + i.balance, 0) > 0 ? C.danger : C.success }}>{invoices.reduce((s, i) => s + i.balance, 0).toLocaleString()}</span>
                                                <span className="col-span-3" />
                                            </div>
                                        </div>
                                }
                            </div>
                        )}

                        {/* ══ TAB: Upload(s) ══ */}
                        {activeTab === "Upload(s)" && (
                            <div>
                                {/* ── Upload Modal ── */}
                                {showUploadModal && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                                        style={{ background: "rgba(10,20,30,0.55)", backdropFilter: "blur(5px)" }}>
                                        <div className="w-full max-w-md rounded-2xl overflow-hidden"
                                            style={{ background: C.card, boxShadow: "0 32px 80px rgba(0,0,0,0.3)" }}>

                                            {/* Modal header */}
                                            <div className="px-6 py-4 flex items-center gap-3" style={{ background: C.headerBg }}>
                                                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                                                    style={{ background: "rgba(255,255,255,0.08)" }}>📎</div>
                                                <div>
                                                    <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#7ecbea" }}>Upload Document</p>
                                                    <p className="text-sm font-semibold text-white">Attach a new file</p>
                                                </div>
                                                <button onClick={() => { setShowUploadModal(false); setUploadForm({ fileName: "", fileType: "", file: null }); setUploadErrors({}); }}
                                                    className="ml-auto w-8 h-8 rounded-full flex items-center justify-center text-lg"
                                                    style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>✕</button>
                                            </div>

                                            <div className="px-6 py-5 space-y-4">

                                                {/* File Name */}
                                                <div>
                                                    <label className="block text-xs font-bold tracking-wider uppercase mb-1.5"
                                                        style={{ color: uploadErrors.fileName ? C.danger : C.label }}>
                                                        File Name / Label <span style={{ color: C.danger }}>*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
                                                            style={{ color: C.placeholder }}>🏷️</span>
                                                        <input
                                                            value={uploadForm.fileName}
                                                            onChange={e => setUploadForm(f => ({ ...f, fileName: e.target.value }))}
                                                            placeholder="e.g. Referral Letter – Nov 2024"
                                                            className="w-full rounded-xl border text-sm outline-none transition-all duration-150"
                                                            style={{
                                                                padding: "10px 12px 10px 36px", fontFamily: "'DM Sans',sans-serif",
                                                                borderColor: uploadErrors.fileName ? C.borderError : C.border,
                                                                background: uploadErrors.fileName ? C.dangerLight : C.card,
                                                                color: C.text, boxShadow: C.shadow
                                                            }} />
                                                    </div>
                                                    {uploadErrors.fileName && <p className="text-xs mt-1" style={{ color: C.danger }}>⚠ {uploadErrors.fileName}</p>}
                                                </div>

                                                {/* Document Type */}
                                                <div>
                                                    <label className="block text-xs font-bold tracking-wider uppercase mb-1.5"
                                                        style={{ color: uploadErrors.fileType ? C.danger : C.label }}>
                                                        Document Type <span style={{ color: C.danger }}>*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none z-10"
                                                            style={{ color: C.placeholder }}>📋</span>
                                                        <select
                                                            value={uploadForm.fileType}
                                                            onChange={e => setUploadForm(f => ({ ...f, fileType: e.target.value }))}
                                                            className="w-full rounded-xl border text-sm outline-none appearance-none cursor-pointer transition-all duration-150"
                                                            style={{
                                                                padding: "10px 32px 10px 36px", fontFamily: "'DM Sans',sans-serif",
                                                                borderColor: uploadErrors.fileType ? C.borderError : C.border,
                                                                background: uploadErrors.fileType ? C.dangerLight : C.card,
                                                                color: uploadForm.fileType ? C.text : C.placeholder, boxShadow: C.shadow
                                                            }}>
                                                            <option value="">Select document type…</option>
                                                            {["Referral", "Clinical", "Labs", "Radiology", "Consent", "Insurance", "Pre-Auth", "Discharge Summary", "Prescription", "Clearance", "Legal / Court", "Other"].map(t => (
                                                                <option key={t} value={t}>{t}</option>
                                                            ))}
                                                        </select>
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs" style={{ color: C.muted }}>▾</span>
                                                    </div>
                                                    {uploadErrors.fileType && <p className="text-xs mt-1" style={{ color: C.danger }}>⚠ {uploadErrors.fileType}</p>}
                                                </div>

                                                {/* File picker */}
                                                <div>
                                                    <label className="block text-xs font-bold tracking-wider uppercase mb-1.5"
                                                        style={{ color: uploadErrors.file ? C.danger : C.label }}>
                                                        Select File <span style={{ color: C.danger }}>*</span>
                                                    </label>
                                                    <input ref={fileInputRef} type="file" className="hidden"
                                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                        onChange={e => {
                                                            const f = e.target.files[0];
                                                            if (f) setUploadForm(prev => ({
                                                                ...prev, file: f,
                                                                fileName: prev.fileName || f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")
                                                            }));
                                                        }} />
                                                    <button onClick={() => fileInputRef.current?.click()}
                                                        className="w-full rounded-xl border-2 border-dashed py-6 flex flex-col items-center gap-2 transition-all duration-200"
                                                        style={{
                                                            borderColor: uploadErrors.file ? C.borderError : uploadForm.file ? C.accent : C.border,
                                                            background: uploadForm.file ? C.accentLight : uploadErrors.file ? "#fef9f9" : "#fafcff"
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
                                                        onMouseLeave={e => e.currentTarget.style.borderColor = uploadErrors.file ? C.borderError : uploadForm.file ? C.accent : C.border}>
                                                        {uploadForm.file ? (
                                                            <>
                                                                <span className="text-2xl">{uploadForm.file.name.endsWith(".pdf") ? "📄" : uploadForm.file.name.match(/\.(jpg|jpeg|png)$/i) ? "🖼️" : "📎"}</span>
                                                                <span className="text-xs font-semibold" style={{ color: C.accent }}>{uploadForm.file.name}</span>
                                                                <span className="text-xs" style={{ color: C.muted }}>{Math.round(uploadForm.file.size / 1024)} KB · Click to change</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="text-3xl">☁️</span>
                                                                <span className="text-sm font-semibold" style={{ color: C.muted }}>Click to browse file</span>
                                                                <span className="text-xs" style={{ color: C.placeholder }}>PDF, JPG, PNG, DOC, DOCX</span>
                                                            </>
                                                        )}
                                                    </button>
                                                    {uploadErrors.file && <p className="text-xs mt-1" style={{ color: C.danger }}>⚠ {uploadErrors.file}</p>}
                                                </div>
                                            </div>

                                            {/* Modal footer */}
                                            <div className="px-6 pb-6 flex gap-3">
                                                <button
                                                    onClick={() => { setShowUploadModal(false); setUploadForm({ fileName: "", fileType: "", file: null }); setUploadErrors({}); }}
                                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                                                    style={{ background: "#f1f5f9", border: `1px solid ${C.border}`, color: C.muted }}>
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const errs = {};
                                                        if (!uploadForm.fileName.trim()) errs.fileName = "File name / label is required";
                                                        if (!uploadForm.fileType) errs.fileType = "Please select a document type";
                                                        if (!uploadForm.file) errs.file = "Please select a file to upload";
                                                        if (Object.keys(errs).length) { setUploadErrors(errs); return; }
                                                        setUploadFiles(prev => [{
                                                            name: uploadForm.fileName.trim() + (uploadForm.file.name.match(/\.[^.]+$/) || [""])[0],
                                                            type: uploadForm.fileType,
                                                            date: new Date().toLocaleDateString("en-KE"),
                                                            size: Math.round(uploadForm.file.size / 1024) + " KB",
                                                            uploader: `System · ${new Date().toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}`,
                                                            originalName: uploadForm.file.name,
                                                        }, ...prev]);
                                                        setShowUploadModal(false);
                                                        setUploadForm({ fileName: "", fileType: "", file: null });
                                                        setUploadErrors({});
                                                    }}
                                                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                                                    style={{ background: `linear-gradient(135deg,${C.accent},${C.accentDark})`, boxShadow: "0 4px 14px rgba(26,127,168,0.3)" }}>
                                                    📎 Attach File
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tab header */}
                                <div className="flex items-center justify-between mb-5">
                                    <SectionHead icon="📎">Documents & Uploads</SectionHead>
                                    <button
                                        onClick={() => setShowUploadModal(true)}
                                        className="px-4 py-2 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all duration-200"
                                        style={{ background: `linear-gradient(135deg,${C.accent},${C.accentDark})`, boxShadow: "0 3px 10px rgba(26,127,168,0.3)" }}
                                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 5px 16px rgba(26,127,168,0.45)"}
                                        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 3px 10px rgba(26,127,168,0.3)"}>
                                        📎 Upload File
                                    </button>
                                </div>

                                {uploadFiles.length === 0
                                    ? <div className="text-center py-16">
                                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
                                            style={{ background: C.accentLight, border: `2px dashed ${C.accentMid}` }}>📁</div>
                                        <p className="text-base font-semibold" style={{ color: C.muted }}>No documents attached</p>
                                        <p className="text-sm mt-1 mb-5" style={{ color: C.placeholder }}>
                                            Attach referral letters, lab results, consent forms, insurance pre-authorisations and more
                                        </p>
                                        <button onClick={() => setShowUploadModal(true)}
                                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                                            style={{ background: `linear-gradient(135deg,${C.accent},${C.accentDark})` }}>
                                            📎 Upload First Document
                                        </button>
                                    </div>
                                    : <>
                                        {/* Table header */}
                                        <div className="grid gap-3 px-4 py-2.5 rounded-lg mb-2 text-xs font-bold uppercase tracking-wider"
                                            style={{ gridTemplateColumns: "2.5fr 1.2fr 1fr 1fr 1fr 0.6fr", background: C.accentLight, color: C.accent }}>
                                            <span>File Name</span>
                                            <span>Original File</span>
                                            <span>Type</span>
                                            <span>Date</span>
                                            <span>Size · Uploaded By</span>
                                            <span></span>
                                        </div>
                                        {uploadFiles.map((f, i) => (
                                            <div key={i}
                                                className="grid gap-3 px-4 py-3 rounded-xl mb-2 items-center transition-all duration-150"
                                                style={{
                                                    gridTemplateColumns: "2.5fr 1.2fr 1fr 1fr 1fr 0.6fr",
                                                    background: i % 2 === 0 ? "#f8fafc" : C.card, border: `1px solid ${C.border}`
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = C.accentLight}
                                                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#f8fafc" : C.card}>

                                                {/* Custom label */}
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="text-lg flex-shrink-0">
                                                        {f.name.match(/\.pdf$/i) ? "📄" : f.name.match(/\.(jpg|jpeg|png)$/i) ? "🖼️" : "📎"}
                                                    </span>
                                                    <span className="text-xs font-semibold truncate" style={{ color: C.text }} title={f.name}>{f.name}</span>
                                                </div>

                                                {/* Original filename */}
                                                <span className="text-xs truncate" style={{ color: C.muted }} title={f.originalName || f.name}>{f.originalName || f.name}</span>

                                                {/* Type badge */}
                                                <Badge bg={C.accentLight} color={C.accent}>{f.type}</Badge>

                                                {/* Date */}
                                                <span className="text-xs" style={{ color: C.muted }}>{f.date}</span>

                                                {/* Size + uploader */}
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold truncate" style={{ color: C.text }}>{f.size}</p>
                                                    <p className="text-xs truncate flex items-center gap-1" style={{ color: C.muted }}>
                                                        <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: C.accentMid, color: C.accentDark, fontSize: "10px" }}>SYSTEM</span>
                                                        {f.uploader.replace(/^System · /, "")}
                                                    </p>
                                                </div>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => setUploadFiles(prev => prev.filter((_, j) => j !== i))}
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 transition-all duration-150"
                                                    style={{ background: "#fef2f2", color: C.danger, border: `1px solid ${C.dangerMid}` }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = C.danger; e.currentTarget.style.color = "#fff"; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = C.danger; }}>
                                                    🗑
                                                </button>
                                            </div>
                                        ))}
                                    </>
                                }

                                <div className="mt-5 px-4 py-3 rounded-xl flex gap-3"
                                    style={{ background: C.accentLight, border: `1px solid ${C.accentMid}` }}>
                                    <span className="flex-shrink-0">ℹ️</span>
                                    <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
                                        Accepted formats: PDF, JPG, PNG, DOC, DOCX. Max file size: 10 MB.
                                        All uploads are stored securely under the{" "}
                                        <span style={{ color: C.accent, fontWeight: 600 }}>Kenya Data Protection Act, 2019</span>.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── FOOTER ACTION BAR ── */}
                <div className="mt-4 rounded-2xl px-6 py-4 flex items-center justify-between"
                    style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadowMd }}>
                    <div className="flex items-center gap-4">
                        <p className="text-xs" style={{ color: C.muted }}>🔒 Secured · Kenya Data Protection Act 2019</p>
                        {loaded && (
                            <>
                                <div className="w-px h-4" style={{ background: C.border }} />
                                <div className="flex items-center gap-3 flex-wrap">
                                    {visits.length > 0 && <span className="text-xs font-medium" style={{ color: C.muted }}>📋 {visits.length} visit{visits.length > 1 ? "s" : ""}</span>}
                                    {invoices.length > 0 && <span className="text-xs font-medium" style={{ color: C.muted }}>🧾 {invoices.length} invoice{invoices.length > 1 ? "s" : ""}</span>}
                                    {uploadFiles.length > 0 && <span className="text-xs font-medium" style={{ color: C.muted }}>📎 {uploadFiles.length} file{uploadFiles.length > 1 ? "s" : ""}</span>}
                                    {auditLog.length > 0 && <span className="text-xs font-medium" style={{ color: C.muted }}>📜 {auditLog.length} audit event{auditLog.length > 1 ? "s" : ""}</span>}
                                    {activeVisit && <span className="text-xs font-bold flex items-center gap-1" style={{ color: C.success }}><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Active OPD</span>}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex gap-3 items-center">
                        {isDirty && !saved && (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                                style={{ background: "#fffbeb", color: C.warning, border: `1px solid ${C.warningMid}` }}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.warning }} />
                                Unsaved changes
                            </span>
                        )}
                        {loaded && (
                            <button onClick={() => setShowPrintCard(true)}
                                className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5"
                                style={{ background: C.accentLight, border: `1px solid ${C.accentMid}`, color: C.accent }}>
                                🪪 Patient Card
                            </button>
                        )}
                        <button onClick={handleSave}
                            className="px-5 py-2 rounded-xl text-sm font-bold text-white flex items-center gap-2"
                            style={{ background: `linear-gradient(135deg,${C.accent},${C.accentDark})`, boxShadow: "0 3px 10px rgba(26,127,168,0.3)" }}>
                            💾 Save Details
                        </button>
                        <button onClick={handleClear}
                            className="px-4 py-2 rounded-xl text-sm font-semibold"
                            style={{ background: "#f1f5f9", border: `1px solid ${C.border}`, color: C.muted }}>
                            🗑 Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}