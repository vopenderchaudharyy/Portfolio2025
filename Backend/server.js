require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);
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
    const { name, email, phone, project, budget, serviceType, currencyCode, currencyRate } = req.body;

    // helpers for formatting
    const symbols = { USD: '$', INR: '₹', EUR: '€', GBP: '£', AED: 'د.إ', KWD: 'د.ك' };
    const locales = { USD: 'en-US', INR: 'en-IN', EUR: 'de-DE', GBP: 'en-GB', AED: 'ar-AE', KWD: 'ar-KW' };
    const sym = symbols[currencyCode] || '$';
    const loc = locales[currencyCode] || 'en-US';
    const fmt = (n) => {
      try{ return new Intl.NumberFormat(loc, { maximumFractionDigits: 0 }).format(Number(n || 0)); }
      catch(e){ return String(n || ''); }
    };
    const budgetDisplay = budget ? `${sym}${fmt(budget)}` : 'N/A';

    // Save in MongoDB
    const inquiry = new Inquiry({ name, email, phone, project, budget, serviceType, currencyCode, currencyRate });
    await inquiry.save();

    // Email to Admin (HTML)
    await transporter.sendMail({
      from: `"Vopender Chaudhary Inquiry" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Inquiry from ${name}`,
      html: `
        <div style="background:#000000;padding:24px;margin:0;font-family:Inter,Arial,sans-serif;color:#e6eef6">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width:600px;margin:0 auto">
            <tr>
              <td style="padding:0 0 16px 0;text-align:center">
                <div style="display:inline-flex;align-items:center;gap:12px">
                  <div>
                    <div style="font-weight:800;font-size:16px;color:#ffffff">Vopender Chaudhary</div>
                    <div style="font-size:12px;color:#808080;letter-spacing:0.5px;text-transform:uppercase">Professional Video Editing</div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#0a0a0a;border:1px solid rgba(76,187,23,0.25);border-radius:12px;padding:24px">
                <h2 style="margin:0 0 8px 0;color:#ffffff;font-size:18px">New Inquiry Received</h2>
                <p style="margin:0 0 16px 0;color:#808080;font-size:14px">A new lead submitted the contact form. Details are below.</p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 16px 0">
                  <tr>
                    <td style="padding:8px 0;color:#4CBB17;font-weight:700;width:160px">Name</td>
                    <td style="padding:8px 0;color:#e6eef6">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#4CBB17;font-weight:700">Email</td>
                    <td style="padding:8px 0"><a href="mailto:${email}" style="color:#e6eef6;text-decoration:none">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#4CBB17;font-weight:700">Phone</td>
                    <td style="padding:8px 0"><a href="tel:${phone || ''}" style="color:#e6eef6;text-decoration:none">${phone || 'N/A'}</a></td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#4CBB17;font-weight:700">Type</td>
                    <td style="padding:8px 0;color:#e6eef6">${serviceType || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#4CBB17;font-weight:700">Currency</td>
                    <td style="padding:8px 0;color:#e6eef6">${currencyCode || 'USD'}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#4CBB17;font-weight:700">Budget</td>
                    <td style="padding:8px 0;color:#e6eef6">${budgetDisplay}</td>
                  </tr>
                </table>

                <div style="background:rgba(76,187,23,0.08);border:1px solid rgba(76,187,23,0.25);border-radius:10px;padding:16px">
                  <div style="color:#4CBB17;font-weight:700;margin:0 0 8px 0">Project Details</div>
                  <div style="color:#cfd6dd;line-height:1.6;font-size:14px;white-space:pre-wrap">${project}</div>
                </div>

                <div style="text-align:center;margin-top:20px">
                  <a href="mailto:${email}" style="display:inline-block;background:#4CBB17;color:#000;text-decoration:none;font-weight:800;padding:12px 18px;border-radius:8px">Reply to ${name}</a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="text-align:center;color:#808080;font-size:12px;padding:16px 0">© Vopender Chaudhary • Satna, MP</td>
            </tr>
          </table>
        </div>
      `
    });

    // Confirmation email to user (HTML)
    await transporter.sendMail({
      from: `"Vopender Chaudhary" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thanks! We've received your inquiry",
      html: `
        <div style="background:#000000;padding:24px;margin:0;font-family:Inter,Arial,sans-serif;color:#e6eef6">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width:600px;margin:0 auto">
            <tr>
              <td style="padding:0 0 16px 0;text-align:center">
                <div style="display:inline-flex;align-items:center;gap:12px">
                  <div>
                    <div style="font-weight:800;font-size:16px;color:#ffffff">Vopender Chaudhary</div>
                    <div style="font-size:12px;color:#808080;letter-spacing:0.5px;text-transform:uppercase">Professional Video Editing</div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#0a0a0a;border:1px solid rgba(76,187,23,0.25);border-radius:12px;padding:24px">
                <h1 style="margin:0 0 8px 0;color:#ffffff;font-size:20px">Thanks, ${name}!</h1>
                <p style="margin:0 0 12px 0;color:#cfd6dd;font-size:14px">We’ve received your inquiry and will get back to you within 24 hours.</p>

                <div style="margin:12px 0 18px 0;padding:12px;background:rgba(76,187,23,0.08);border:1px solid rgba(76,187,23,0.25);border-radius:10px;color:#e6eef6">
                  <div style="font-weight:800;color:#4CBB17;margin-bottom:6px">Summary</div>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding:6px 0;color:#808080;width:160px">Service Type</td>
                      <td style="padding:6px 0;color:#e6eef6">${serviceType || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#808080">Budget</td>
                      <td style="padding:6px 0;color:#e6eef6">${budget || 'N/A'}</td>
                    </tr>
                  </table>
                </div>

                <div style="margin:0 0 16px 0;color:#cfd6dd;line-height:1.6;font-size:14px">
                  <div style="font-weight:800;color:#4CBB17;margin-bottom:6px">Your Message</div>
                  <div style="white-space:pre-wrap">${project}</div>
                </div>

                <div style="text-align:center;margin-top:20px">
                  <a href="https://wa.me/918894616815" style="display:inline-block;background:#4CBB17;color:#000;text-decoration:none;font-weight:800;padding:12px 18px;border-radius:8px">Chat on WhatsApp</a>
                </div>

                <p style="margin:16px 0 0 0;color:#808080;font-size:12px;text-align:center">Need to add details? Reply to this email: <a href="mailto:vopenderchaudhary@gmail.com" style="color:#e6eef6;text-decoration:none">vopenderchaudhary@gmail.com</a></p>
              </td>
            </tr>
            <tr>
              <td style="text-align:center;color:#808080;font-size:12px;padding:16px 0">© Vopender Chaudhary • Satna, MP</td>
            </tr>
          </table>
        </div>
      `
    });

    res.json({ success: true, message: 'Inquiry submitted successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/', (req, res) => {
  // You can send a JSON response or plain text
  res.json({
    message: "Hello from /next.js endpoint!",
    status: "success"
  });
});

app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
