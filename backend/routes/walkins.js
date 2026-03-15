const express = require('express');
const router = express.Router();
const WalkIn = require('../models/WalkIn');

// POST /api/walkins - Quick register a walk-in patient
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, phone, gender } = req.body;
    
    // Generate a temporary Walk-in ID
    const tempId = `WALK-${Math.floor(Math.random() * 9000) + 1000}`;

    const walkIn = new WalkIn({
      patientId: tempId,
      firstName,
      lastName,
      phone,
      gender
    });

    await walkIn.save();
    res.status(201).json(walkIn);
  } catch (err) {
    console.error('Error registering walk-in:', err);
    res.status(500).json({ error: 'Failed to register walk-in patient' });
  }
});

module.exports = router;
