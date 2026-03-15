const mongoose = require('mongoose');

const WalkInSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  phone:     { type: String, required: true },
  gender:    { type: String, enum: ['Male', 'Female', 'Other', ''] },
  isWalkIn:  { type: Boolean, default: true },
  registeredAt: { type: Date, default: Date.now },
  fullyRegistered: { type: Boolean, default: false }, // set true when promoted to full Patient
}, { timestamps: true });

module.exports = mongoose.model('WalkIn', WalkInSchema);
