import { today, timeNow } from '../utils/hmsHelpers';

export const SEED = [
  {
    id: "PAT-2026-00001", mrn: "MRN-2026-00001", queueNo: "Q-001", queueTime: "08:05",
    name: "Amara Okonkwo", phone: "+254-701-234-567", registeredDate: today(),
    status: "Completed",
    firstName: "Amara", middleName: "Chidimma", lastName: "Okonkwo",
    dateOfBirth: "1990-03-15", gender: "Female", bloodGroup: "O+",
    maritalStatus: "Married", nationality: "Kenyan", occupation: "Senior Teacher",
    altPhone: "+254-701-999-888", email: "amara.okonkwo@edu.go.ke",
    address: "Apt 4B, Silver Oak Residency, Ngong Road", city: "Nairobi", county: "Nairobi", country: "Kenya",
    nokName: "Emeka Okonkwo", nokRel: "Spouse", nokPhone: "+254-702-345-678",
    ecSameNok: true, ecName: "Emeka Okonkwo", ecRel: "Spouse", ecPhone: "+254-702-345-678",
    category: "Insurance", insProvider: "SHA", insMemberNo: "SHA-2034-567890", insExpiry: "2026-12-31",
    corpOrg: "Ministry of Education", corpId: "TSC-99082",
    consentTx: true, consentData: true,
    triage: {
      lv: "3", bp: "148/92", pulse: "82", temp: "36.8", rr: "18", spo2: "98", gcs: "15", wt: "68", ht: "163",
      complaint: "Persistent headache and dizziness for 3 days", nurse: "Nurse Adaeze Eze", time: "08:18"
    },
    billing: {
      billNo: "BL-26-00001", receiptNo: "REC-26-00001", billedBy: "Jane Mwangi",
      billedAt: new Date(Date.now() - 3 * 3600000).toISOString(), paid: true, method: "SHA",
      items: [
        { id: "s1", name: "Consultation - General", price: 2500, qty: 1, cat: "consultation" },
        { id: "s5", name: "Lab - Basic Panel",       price: 3500, qty: 1, cat: "lab" },
      ],
      discount: 0, note: "",
    },
    clerking: {
      complaint: "Persistent headache and dizziness for 3 days",
      hpc: "Bilateral throbbing headache 7/10. Blurring of vision.",
      pmh: "Hypertension x5 years, poorly compliant", psh: "Appendicectomy 2012",
      meds: "Amlodipine 5mg OD (missing doses)", allergies: "Penicillin - rash",
      exam: "BP 148/92 both arms. A/V nipping bilaterally.",
      provDx: "Hypertensive urgency", provCode: "I10",
      finalDx: "Hypertensive urgency", finalCode: "I10",
      plan: "Optimise antihypertensives. Check FBC, RFT, Electrolytes, UA.", disp: "OPD Follow-up",
      doctorName: "Dr. Obinna Nwosu", doctorReg: "MDCN-2019-04521", consNo: "CONS-26-00001",
      orders: { lab: { tests: ["l1","l8","l9","l18"], urgency: "Routine", notes: "" }, rad: null, rx: { drugs: [{ id: 1, name: "Amlodipine", dose: "10mg", freq: "OD", duration: "30 days" }] } },
      labResults: { l1_hb: { value: "11.8", unit: "g/dL", flag: "low", type: "num" } },
      labNo: "LAB-26-00001", labCompletedAt: new Date().toISOString(), savedAt: new Date().toISOString()
    },
  },
  {
    id: "PAT-2026-00002", mrn: "MRN-2026-00002", queueNo: "Q-002", queueTime: "10:05",
    name: "Kofi Mensah", phone: "+254-722-654-321", registeredDate: today(),
    status: "Pending Triage",
    firstName: "Kofi", middleName: "Yaw", lastName: "Mensah",
    dateOfBirth: "1958-09-30", gender: "Male", bloodGroup: "O+",
    maritalStatus: "Married", nationality: "Kenyan", occupation: "Coffee Farmer",
    altPhone: "+254-722-999-000", email: "kofi.mensah@farm.co.ke",
    address: "Plot 14, Gatundu North, Thika Road", city: "Thika", county: "Kiambu", country: "Kenya",
    nokName: "Akosua Mensah", nokRel: "Spouse", nokPhone: "+254-722-111-222",
    ecSameNok: true, ecName: "Akosua Mensah", ecRel: "Spouse", ecPhone: "+254-722-111-222",
    category: "Cash", insProvider: "None", insMemberNo: "", insExpiry: "",
    corpOrg: "", corpId: "",
    consentTx: true, consentData: true,
    triage: null,
    billing: {
      billNo: "BL-26-00002", receiptNo: null, billedBy: "Jane Mwangi",
      billedAt: new Date().toISOString(), paid: false, method: "Cash",
      items: [{ id: "s1", name: "Consultation - General", price: 2500, qty: 1, cat: "consultation" }],
      discount: 0, note: "Patient to pay at cashier",
    },
    clerking: null,
  },
  {
    id: "PAT-2026-00003", mrn: "MRN-2026-00003", queueNo: "Q-003", queueTime: "11:20",
    name: "John Kamau", phone: "+254-711-222-333", registeredDate: today(),
    status: "Pending Doctor",
    firstName: "John", middleName: "Njuguna", lastName: "Kamau",
    dateOfBirth: "1985-05-12", gender: "Male", bloodGroup: "B+",
    maritalStatus: "Single", nationality: "Kenyan", occupation: "PSV Driver",
    altPhone: "+254-711-888-777", email: "john.kamau85@gmail.com",
    address: "House 12, Umoja Innercore Estate", city: "Nairobi", county: "Nairobi", country: "Kenya",
    nokName: "Peter Kamau", nokRel: "Brother", nokPhone: "+254-711-444-555",
    ecSameNok: true, ecName: "Peter Kamau", ecRel: "Brother", ecPhone: "+254-711-444-555",
    category: "Cash", insProvider: "None",
    consentTx: true, consentData: true,
    triage: {
      lv: "3", bp: "120/80", pulse: "72", temp: "36.5", rr: "16", spo2: "99", gcs: "15", wt: "75", ht: "175",
      complaint: "Slight fever and cough", nurse: "Nurse Sarah", time: "11:35"
    },
    billing: {
      billNo: "BL-26-00003", receiptNo: "REC-26-00003", billedBy: "Jane Mwangi",
      billedAt: new Date().toISOString(), paid: true, method: "M-Pesa",
      items: [{ id: "s1", name: "Consultation - General", price: 2000, qty: 1, cat: "consultation" }],
      discount: 0, note: "",
    },
    clerking: null,
  },
  {
    id: "PAT-2026-00004", mrn: "MRN-2026-00004", queueNo: "Q-004", queueTime: "12:00",
    name: "Sarah Wanjiku", phone: "+254-700-111-000", registeredDate: today(),
    status: "Unpaid",
    firstName: "Sarah", middleName: "Wambui", lastName: "Wanjiku",
    dateOfBirth: "1995-12-01", gender: "Female", bloodGroup: "A+",
    maritalStatus: "Single", nationality: "Kenyan", occupation: "Student (UON)",
    altPhone: "+254-700-555-444", email: "sarah.wanjiku@students.uonbi.ac.ke",
    address: "Hall 9, Rm 402, Main Campus, Kileleshwa", city: "Nairobi", county: "Nairobi", country: "Kenya",
    nokName: "Mary Wanjiku", nokRel: "Mother", nokPhone: "+254-700-222-111",
    ecSameNok: true, ecName: "Mary Wanjiku", ecRel: "Mother", ecPhone: "+254-700-222-111",
    category: "Cash", insProvider: "None",
    consentTx: true, consentData: true,
    triage: {
      lv: "3", bp: "110/70", pulse: "68", temp: "37.2", rr: "14", spo2: "100", gcs: "15", wt: "55", ht: "160",
      complaint: "Lower abdominal pain", nurse: "Nurse Sarah", time: "12:15"
    },
    billing: {
      billNo: "BL-26-00004", receiptNo: null, billedBy: "Jane Mwangi",
      billedAt: new Date().toISOString(), paid: false, method: "Cash",
      items: [
        { id: "s1", name: "Consultation - General", price: 2000, qty: 1, cat: "consultation" },
        { id: "s8", name: "Lab: Pregnancy Test", price: 500, qty: 1, cat: "lab" },
        { id: "s9", name: "Lab: Urinalysis", price: 1000, qty: 1, cat: "lab" }
      ],
      discount: 0, note: "Student discount applied for consult",
    },
    clerking: {
      complaint: "Lower abdominal pain x2 days",
      hpc: "Sharp pain in Suprapubic region. No nausea.",
      plan: "Check for UTI/Pregnancy.", disp: "OPD",
      doctorName: "Dr. Obinna Nwosu", consNo: "CONS-26-00004",
      orders: { lab: { tests: ["l18", "l19"], urgency: "Stat", notes: "" }, rad: null, rx: null },
      savedAt: new Date().toISOString()
    },
  },
  {
    id: "PAT-2026-00005", mrn: "MRN-2026-00005", queueNo: "Q-005", queueTime: "12:30",
    name: "Fatuma Ali", phone: "+254-733-999-888", registeredDate: today(),
    status: "Pending Pharmacy",
    firstName: "Fatuma", middleName: "Zahra", lastName: "Ali",
    dateOfBirth: "2000-01-01", gender: "Female", bloodGroup: "O-",
    maritalStatus: "Single", nationality: "Kenyan", occupation: "Waitress",
    altPhone: "+254-733-222-111", email: "fatuma.ali@eastleigh.com",
    address: "Block 7, 3rd Floor, Section 3, Eastleigh", city: "Nairobi", county: "Nairobi", country: "Kenya",
    nokName: "Ahmed Ali", nokRel: "Brother", nokPhone: "+254-733-111-000",
    ecSameNok: true, ecName: "Ahmed Ali", ecRel: "Brother", ecPhone: "+254-733-111-000",
    category: "Cash", insProvider: "None",
    consentTx: true, consentData: true,
    triage: {
      lv: "3", bp: "115/75", pulse: "80", temp: "38.5", rr: "18", spo2: "98", gcs: "15", wt: "60", ht: "165",
      complaint: "High fever and joint pain", nurse: "Nurse Sarah", time: "12:45"
    },
    billing: {
      billNo: "BL-26-00005", receiptNo: "REC-26-00005", billedBy: "Jane Mwangi",
      billedAt: new Date().toISOString(), paid: true, method: "M-Pesa",
      items: [
        { id: "s1", name: "Consultation - General", price: 2000, qty: 1, cat: "consultation" },
        { id: "s5", name: "Pharmacy: Antibiotics", price: 1500, qty: 1, cat: "pharmacy" }
      ],
      discount: 0, note: "",
    },
    clerking: {
      complaint: "High fever", plan: "Start antibiotics.",
      doctorName: "Dr. Obinna Nwosu", consNo: "CONS-26-00005",
      orders: { rx: { drugs: [{ id: 1, name: "Amoxicillin", dose: "500mg", freq: "TDS", duration: "5 days" }] } },
      savedAt: new Date().toISOString()
    },
  },
  {
    id: "PAT-2026-00006", mrn: "MRN-2026-00006", queueNo: "Q-006", queueTime: "13:00",
    name: "Stanley Wambua Kimanthi", phone: "+254-722-000-111", registeredDate: today(),
    status: "Pending Triage",
    firstName: "Stanley", middleName: "Wambua", lastName: "Kimanthi",
    dateOfBirth: "1978-08-20", gender: "Male", bloodGroup: "AB+",
    maritalStatus: "Married", nationality: "Kenyan", occupation: "Business Consultant",
    altPhone: "+254-722-444-555", email: "stanley.kimanthi@consult.co.ke",
    address: "Hse 22, Sunrise Estate, Kasarani", city: "Nairobi", county: "Nairobi", country: "Kenya",
    nokName: "Mercy Kimanthi", nokRel: "Spouse", nokPhone: "+254-722-222-333",
    ecSameNok: false, ecName: "David Wambua", ecRel: "Brother", ecPhone: "+254-722-333-444",
    category: "Cash",
    consentTx: true, consentData: true,
    triage: null,
    billing: {
      billNo: "BL-26-00006", receiptNo: null, billedBy: "Jane Mwangi",
      billedAt: new Date().toISOString(), paid: false, method: "Cash",
      items: [{ id: "s1", name: "Consultation - A&E", price: 1500, qty: 1, cat: "consultation" }],
      discount: 0, note: "ER Case",
    },
  },
  {
    id: "PAT-2026-00007", mrn: "MRN-2026-00007", queueNo: "Q-007", queueTime: "13:15",
    name: "Grace Nyambura", phone: "+254-710-555-666", registeredDate: today(),
    status: "Lab Pending",
    firstName: "Grace", middleName: "Muthoni", lastName: "Nyambura",
    dateOfBirth: "1965-04-10", gender: "Female", bloodGroup: "O+",
    maritalStatus: "Widowed", nationality: "Kenyan", occupation: "Retired Nurse",
    altPhone: "+254-710-111-222", email: "grace.nyambura@outlook.com",
    address: "Apartment 10, Rhapta Heights, Rhapta Road, Westlands", city: "Nairobi", county: "Nairobi", country: "Kenya",
    nokName: "James Nyambura", nokRel: "Son", nokPhone: "+254-710-888-999",
    ecSameNok: true, ecName: "James Nyambura", ecRel: "Son", ecPhone: "+254-710-888-999",
    category: "Insurance", insProvider: "AAR", insMemberNo: "AAR-7788-99", insExpiry: "2027-01-31",
    corpOrg: "Private",
    triage: { lv: "2", bp: "160/100", pulse: "95", temp: "37.0", wt: "82", ht: "158", complaint: "Chest tightness", nurse: "Nurse Adaeze", time: "13:30" },
    billing: { billNo: "BL-26-00007", receiptNo: "REC-26-00007", paid: true, method: "AAR", items: [{ name: "Consultation - Specialist", price: 5000, qty: 1 }] },
    clerking: {
      complaint: "Chest tightness x1 hour", doctorName: "Dr. Joseph Wafula",
      orders: { lab: { tests: ["l1", "l14"], urgency: "Stat" } }
    }
  }
];

export const STAFF = [
  // Doctors
  { id: "jkisavuli", name: "DR. JOSEPH WAFULA KISAVULI", role: "Specialist Physician", dept: "Clinical", code: "JKISAVULI", status: "Active" },
  { id: "skungu", name: "DR. STEPHANIE KUNGU", role: "Medical Officer", dept: "A&E", code: "SKUNGU", status: "Active" },
  { id: "onwosu", name: "DR. OBINNA NWOSU", role: "Senior Medical Officer", dept: "OPD", code: "ONWOSU", status: "Active" },
  { id: "snjoroge", name: "DR. SAMUEL NJOROGE", role: "Pediatrician", dept: "Pediatrics", code: "SNJOROGE", status: "Away" },
  
  // Nurses
  { id: "aeze", name: "Nurse Adaeze Eze", role: "Nursing Officer", dept: "Triage", status: "Active" },
  { id: "ssmith", name: "Nurse Sarah Smith", role: "Staff Nurse", dept: "OPD", status: "Active" },
  { id: "bmary", name: "Nurse Beatrice Mary", role: "ER Nurse", dept: "A&E", status: "Active" },
  
  // Finance
  { id: "jmwangi", name: "Jane Mwangi", role: "Senior Cashier", dept: "Finance", status: "Active" },
  { id: "bnight", name: "Night Officer Ben", role: "Cashier", dept: "Finance", status: "Active" },
  
  // Lab
  { id: "tafolabi", name: "MLT Tunde Afolabi", role: "Lab Scientist", dept: "Laboratory", status: "Active" },
  { id: "ckibet", name: "MLT Charles Kibet", role: "Lab Technician", dept: "Laboratory", status: "Active" },
  
  // Pharmacy
  { id: "pwanjiku", name: "Phm. Paul Wanjiku", role: "Pharmacist", dept: "Pharmacy", status: "Active" },
  { id: "emusa", name: "Phm. Esther Musa", role: "Pharm Tech", dept: "Pharmacy", status: "Active" },
];
