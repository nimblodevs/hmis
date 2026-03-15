const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Get all patients or search by name/MRN
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { mrn: { $regex: search, $options: 'i' } },
          { nationalId: { $regex: search, $options: 'i' } },
          {
            $expr: {
              $regexMatch: {
                input: { $concat: ["$firstName", " ", "$lastName"] },
                regex: search,
                options: "i"
              }
            }
          }
        ]
      };
    }

    const patients = await Patient.find(query).sort({ registrationDate: -1 }).limit( search ? 50 : 100);
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single patient
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new patient (Registration)
router.post('/', async (req, res) => {
  try {
    const { nationalId, contactNumber, firstName, lastName } = req.body;
    
    // 1. Basic duplicate check (National ID if provided)
    if (nationalId) {
      const existingById = await Patient.findOne({ nationalId });
      if (existingById) {
        return res.status(400).json({ 
          message: `Patient with ID ${nationalId} already registered`,
          existingPatient: { mrn: existingById.mrn, name: `${existingById.firstName} ${existingById.lastName}` }
        });
      }
    }

    // 2. Duplicate check by Phone (Optional safeguard)
    const existingByPhone = await Patient.findOne({ contactNumber });
    if (existingByPhone) {
      // In some systems this might just be a warning, but for now we'll block
      return res.status(400).json({ 
        message: `Phone number ${contactNumber} is already linked to another patient`,
        existingPatient: { mrn: existingByPhone.mrn, name: `${existingByPhone.firstName} ${existingByPhone.lastName}` }
      });
    }

    // 3. Generate MRN: YYYY + Random 6 digits
    const year = new Date().getFullYear();
    let mrn;
    let mrnExists = true;
    
    // Ensure MRN uniqueness
    while (mrnExists) {
      mrn = `${year}-${Math.floor(100000 + Math.random() * 900000)}`;
      const check = await Patient.findOne({ mrn });
      if (!check) mrnExists = false;
    }
    
    const patient = new Patient({
      ...req.body,
      mrn,
      registrationDate: new Date()
    });

    const newPatient = await patient.save();
    
    // Broadcast update via Socket.io if available
    if (req.io) {
      req.io.emit('new-patient', { 
        mrn: newPatient.mrn, 
        name: `${newPatient.firstName} ${newPatient.lastName}`,
        branch: newPatient.branch
      });
    }

    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
