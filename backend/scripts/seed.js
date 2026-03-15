require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const Token = require('../models/Token');

const patients = [
  {
    patientId: 'PT-100235',
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: new Date('1992-05-15'),
    gender: 'Female',
    contactNumber: '+254712345678',
    address: 'Hurlingham, Nairobi',
    status: 'Outpatient'
  },
  {
    patientId: 'PT-100234',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1985-08-22'),
    gender: 'Male',
    contactNumber: '+254700000001',
    address: 'Kileleshwa, Nairobi',
    status: 'Outpatient'
  },
  {
    patientId: 'PT-100451',
    firstName: 'Alice',
    lastName: 'Wambui',
    dateOfBirth: new Date('2000-01-10'),
    gender: 'Female',
    contactNumber: '+254711122233',
    address: 'Westlands, Nairobi',
    status: 'Outpatient'
  }
];

const tokens = [
  {
    ticketId: 'OPD-742',
    patientId: 'PT-100235',
    patientName: 'Jane Smith',
    patientPhone: '+254712345678',
    visitType: 'existing',
    service: 'opd',
    queueDept: 'OPD',
    paymentMethod: 'cash',
    status: 'waiting'
  },
  {
    ticketId: 'LAB-102',
    patientId: 'WALK-5542',
    patientName: 'Samuel Kamau',
    patientPhone: '+254722334455',
    visitType: 'new',
    service: 'lab',
    queueDept: 'Laboratory',
    paymentMethod: 'cash',
    status: 'waiting'
  },
  {
    ticketId: 'RAD-991',
    patientId: 'PT-100451',
    patientName: 'Alice Wambui',
    patientPhone: '+254711122233',
    visitType: 'existing',
    service: 'rad',
    queueDept: 'Radiology',
    paymentMethod: 'credit',
    status: 'called',
    calledAt: new Date()
  },
  {
    ticketId: 'SPC-341',
    patientId: 'PT-100234',
    patientName: 'John Doe',
    patientPhone: '+254700000001',
    visitType: 'review',
    service: 'specialist',
    specialty: 'Cardiology',
    queueDept: 'OPD',
    paymentMethod: 'cash',
    status: 'waiting'
  }
];

const seedDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://nimblodevs:Raje1680@cluster0.tactq7g.mongodb.net/hms';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Patient.deleteMany({});
    await Token.deleteMany({});
    console.log('Cleared existing Patient and Token collections.');

    // Seed Patients
    await Patient.insertMany(patients);
    console.log(`Seeded ${patients.length} patients.`);

    // Seed Tokens
    await Token.insertMany(tokens);
    console.log(`Seeded ${tokens.length} tokens.`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
