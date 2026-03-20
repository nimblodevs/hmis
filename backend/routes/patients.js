const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Get all patients or search by name/UHID
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { uhid: { $regex: search, $options: 'i' } },
          { idNumber: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          {
            $expr: {
              $regexMatch: {
                input: { $concat: ["$firstName", " ", { $ifNull: ["$middleName", ""] }, " ", "$lastName"] },
                regex: search,
                options: "i"
              }
            }
          }
        ]
      };
    }

    const patients = await Patient.find(query).sort({ registeredOn: -1 }).limit( search ? 50 : 100);
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search specifically for the PatientForm lookup (simpler)
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const query = {
      $or: [
        { firstName: { $regex: q, $options: 'i' } },
        { middleName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { uhid: { $regex: q, $options: 'i' } },
        { idNumber: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ]
    };

    const patients = await Patient.find(query).limit(10);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    const { idNumber, phone, firstName, lastName } = req.body;
    
    // 1. Basic duplicate check (ID Number if provided)
    if (idNumber) {
      const existingById = await Patient.findOne({ idNumber });
      if (existingById) {
        return res.status(400).json({ 
          message: `Patient with ID ${idNumber} already registered`,
          existingPatient: { uhid: existingById.uhid, name: `${existingById.firstName} ${existingById.lastName}` }
        });
      }
    }

    // 2. Duplicate check by Phone
    const existingByPhone = await Patient.findOne({ phone });
    if (existingByPhone) {
      return res.status(400).json({ 
        message: `Phone number ${phone} is already linked to another patient`,
        existingPatient: { uhid: existingByPhone.uhid, name: `${existingByPhone.firstName} ${existingByPhone.lastName}` }
      });
    }

    // 3. Generate UHID: YYYY + Random 6 digits
    const year = new Date().getFullYear();
    let uhid;
    let uhidExists = true;
    
    while (uhidExists) {
      uhid = `HPID-${year}${Math.floor(100000 + Math.random() * 900000)}`;
      const check = await Patient.findOne({ uhid });
      if (!check) uhidExists = false;
    }
    
    const patient = new Patient({
      ...req.body,
      uhid,
      registeredOn: new Date()
    });

    const newPatient = await patient.save();
    
    // Broadcast update via Socket.io if available
    if (req.io) {
      req.io.emit('new-patient', { 
        uhid: newPatient.uhid, 
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

// Update an existing patient by UHID
router.patch('/uhid/:uhid', async (req, res) => {
  try {
    const { uhid } = req.params;
    const patient = await Patient.findOneAndUpdate(
      { uhid },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ message: `Patient with UHID ${uhid} not found` });
    }

    res.json(patient);
  } catch (error) {
    console.error('Update Error:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
