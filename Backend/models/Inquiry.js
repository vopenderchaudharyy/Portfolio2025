const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  project: { type: String, required: true },
  budget: String,
  selectedPlan: String,
  serviceType: String, // ✅ added new field
  currencyCode: String,
  currencyRate: Number,
  currencyRegion: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
