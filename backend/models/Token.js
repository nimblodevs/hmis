const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
  },
  // Patient reference — exists if registered patient; null for walk-ins
  patientRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    default: null,
  },
  // Mirrored fields for fast display without population
  patientId: { type: String, required: true },   // e.g. PT-100235 or WALK-4512
  patientPhone: { type: String },

  visitType: {
    type: String,
    enum: ['existing', 'new', 'review'],
    required: true,
  },

  // Service & routing
  service: {
    type: String,
    enum: ['opd', 'specialist', 'lab', 'rad', 'rx', 'physio'],
    required: true,
  },
  specialty: { type: String, default: null },   // e.g. "Cardiology"
  queueDept: {
    type: String,
    enum: ['OPD', 'Laboratory', 'Radiology', 'Pharmacy'],
    required: true,
  },

  // Payment
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit'],
    required: true,
  },

  // Lifecycle
  status: {
    type: String,
    enum: ['waiting', 'called', 'in_progress', 'done', 'transferred'],
    default: 'waiting',
  },
  priority: {
    type: String,
    enum: ['Normal', 'High', 'Emergency'],
    default: 'Normal',
  },
  calledAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  nextServicePoint: { type: String, default: null },
  notes: { type: String },

}, { timestamps: true });

// Index for fast queue queries
TokenSchema.index({ queueDept: 1, status: 1, createdAt: 1 });

module.exports = mongoose.model('Token', TokenSchema);
