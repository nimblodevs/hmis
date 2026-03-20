const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  uhid: { type: String, required: true, unique: true }, // Universal Health ID / MRN
  title: { type: String },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  marital: { type: String },
  religion: { type: String },
  nationality: { type: String, default: 'Kenyan' },
  idType: { type: String, default: 'national' },
  idNumber: { type: String, unique: true, sparse: true },

  // Contact & Residence
  phone: { type: String, required: true },
  phone2: { type: String },
  email: { type: String },
  county: { type: String },
  subCounty: { type: String },
  address: { type: String },

  // Next of Kin (Step 2)
  kinFirstName: { type: String },
  kinMiddleName: { type: String },
  kinLastName: { type: String },
  kinRelation: { type: String },
  kinCounty: { type: String },
  kinPhone: { type: String },
  kinPhone2: { type: String },
  kinEmail: { type: String },
  kinAddress: { type: String },

  // Emergency Contact (Step 3)
  emergencyFirstName: { type: String },
  emergencyMiddleName: { type: String },
  emergencyLastName: { type: String },
  emergencyRelation: { type: String },
  emergencyCounty: { type: String },
  emergencyPhone: { type: String },
  emergencyPhone2: { type: String },
  emergencyAddress: { type: String },
  emergencySameAsNOK: { type: Boolean, default: false },

  // Employer & Consent (Step 4)
  employerName: { type: String },
  jobTitle: { type: String },
  employerAddress: { type: String },
  consentHMIS: { type: Boolean, default: true },
  consentSMS: { type: Boolean, default: false },
  consentDHIS: { type: Boolean, default: false },

  // Administrative
  suspended: { type: Boolean, default: false },
  suspensionReason: { type: String },
  status: { type: String, enum: ['Active', 'Inactive', 'Deceased'], default: 'Active' },
  branch: { type: String, default: 'Mater Hospital' },
  registeredBy: { type: String, default: 'Clerk 01' },
  registeredOn: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
