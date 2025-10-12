require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const Inquiry = require('./models/Inquiry');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    console.log('Database Name:', mongoose.connection.name);
  })
  .catch(err => console.error('❌ Mongo error:', err));
  
// ✅ Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ POST route for form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, project, budget, selectedPlan, serviceType } = req.body;

    // Save in MongoDB
    const inquiry = new Inquiry({ name, email, phone, project, budget, selectedPlan, serviceType });
    await inquiry.save();

    // Email to Admin
    await transporter.sendMail({
      from: `"Vopender Visuals Inquiry" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Inquiry from ${name}`,
      text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone || 'N/A'}
      Type: ${serviceType || 'N/A'}
      Selected Plan: ${selectedPlan || 'N/A'}
      Budget: ${budget || 'N/A'}

      Project Details:
      ${project}
      `
    });

    // Confirmation email to user
    await transporter.sendMail({
      from: `"Vopender Visuals" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting Vopender Visuals!",
      html: `
        <p>Hi ${name},</p>
        <p>Thanks for reaching out! We received your ${serviceType} inquiry for <b>${selectedPlan}</b>.</p>
        <p>We'll get back to you within 24 hours.</p>
        <p>— Vopender Visuals Team 🎬</p>
      `
    });

    res.json({ success: true, message: 'Inquiry submitted successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/next', (req, res) => {
  // You can send a JSON response or plain text
  res.json({
    message: "Hello from /nextja endpoint!",
    status: "success"
  });
});

app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
