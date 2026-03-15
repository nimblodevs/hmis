const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  mrn: { type: String, required: true, unique: true }, // Medical Record Number
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  age: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  nationalId: { type: String, unique: true, sparse: true },
  idType: { 
    type: String, 
    enum: ['National ID', 'Passport', 'Alien ID', 'Military ID', 'None'], 
    default: 'None' 
  },
  maritalStatus: { type: String },
  religion: { type: String },
  nationality: { type: String, default: 'Kenyan' },

  // Contact Information
  contactNumber: { type: String, required: true },
  email: { type: String },
  address: {
    county: { type: String },
    estate: { type: String },
    fullAddress: { type: String }
  },

  // Next of Kin
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    relation: { type: String, required: true },
    altPhone: { type: String },
    county: { type: String },
    estate: { type: String }
  },

  // Insurance & Billing
  paymentType: { type: String, enum: ['Cash', 'Insurance', 'Corporate', 'SHA'], default: 'Cash' },
  insuranceDetails: {
    provider: { type: String },
    memberNumber: { type: String },
    schemeName: { type: String },
    principalMember: { type: String }
  },

  // Clinical Alerts
  bloodGroup: { type: String },
  allergies: { type: [String], default: [] },
  chronicConditions: { type: [String], default: [] },
  medicalNotes: { type: String },

  // Administrative
  status: { type: String, enum: ['Active', 'Inactive', 'Suspended', 'Deceased'], default: 'Active' },
  branch: { type: String, default: 'Main Branch' },
  registeredBy: { type: String },
  registrationDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
