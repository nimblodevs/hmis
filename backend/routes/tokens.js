const express = require('express');
const router = express.Router();
const Token = require('../models/Token');

// POST /api/tokens - Issue a new token
router.post('/', async (req, res) => {
  try {
    const {
      patientRef,
      patientId,
      patientName,
      patientPhone,
      visitType,
      service,
      specialty,
      queueDept,
      paymentMethod,
      ticketIdPrefix
    } = req.body;

    // Generate ticketId: PREFIX-XXX
    // In a real system, we might want to reset this daily
    const ticketNumber = Math.floor(Math.random() * 900) + 100;
    const ticketId = `${ticketIdPrefix}-${ticketNumber}`;

    const token = new Token({
      ticketId,
      patientRef,
      patientId,
      patientName,
      patientPhone,
      visitType,
      service,
      specialty,
      queueDept,
      paymentMethod,
    });

    await token.save();

    // Broadcast real-time update if io is available
    if (req.io) {
      req.io.emit('token:new', token);
    }

    res.status(201).json(token);
  } catch (err) {
    console.error('Error issuing token:', err);
    res.status(500).json({ error: 'Failed to issue token' });
  }
});

// GET /api/tokens/stats - Aggregate queue stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await Token.aggregate([
      { $match: { status: 'waiting' } },
      { $group: { _id: '$queueDept', count: { $sum: 1 } } }
    ]);
    
    // Format as { OPD: 5, Laboratory: 2, ... }
    const formatted = stats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/tokens - Get queue for a department
router.get('/', async (req, res) => {
  try {
    const { dept, status } = req.query;
    const filter = {};
    if (dept) filter.queueDept = dept;
    if (status) filter.status = status;

    const tokens = await Token.find(filter).sort({ createdAt: 1 });
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tokens' });
  }
});

// PATCH /api/tokens/:id/call - Call a patient
router.patch('/:id/call', async (req, res) => {
  try {
    const token = await Token.findByIdAndUpdate(
      req.params.id,
      { status: 'called', calledAt: new Date() },
      { new: true }
    );

    if (!token) return res.status(404).json({ error: 'Token not found' });

    if (req.io) {
      req.io.emit('token:called', token);
    }

    res.json(token);
  } catch (err) {
    res.status(500).json({ error: 'Failed to call token' });
  }
});

// PATCH /api/tokens/:id/complete - Mark encounter as done/transferred
router.patch('/:id/complete', async (req, res) => {
  try {
    const { status = 'done', nextServicePoint } = req.body;
    const token = await Token.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        completedAt: new Date(),
        nextServicePoint
      },
      { new: true }
    );

    if (!token) return res.status(404).json({ error: 'Token not found' });

    if (req.io) {
      req.io.emit('token:completed', token);
    }

    res.json(token);
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete token' });
  }
});

module.exports = router;
