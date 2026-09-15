require('dotenv').config();
const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---- mailer (only built if SMTP credentials are present) ----
function buildTransport() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || 'true') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}
const transporter = buildTransport();

// Frontend asks this for the WhatsApp number so it never has to be hardcoded in the HTML/JS.
app.get('/api/config', (req, res) => {
  res.json({
    whatsappNumber: process.env.WHATSAPP_NUMBER || '',
    emailConfigured: Boolean(transporter)
  });
});

function formatBookingText(b) {
  return [
    'New IRC Taxi booking',
    '',
    `Package: ${b.package || '—'} (${b.price || '—'})`,
    `Name: ${b.name || '—'}`,
    `Phone: ${b.phone || '—'}`,
    `Email: ${b.email || '—'}`,
    `Pickup: ${b.pickup || '—'}`,
    `Drop-off: ${b.dropoff || '—'}`,
    `Date: ${b.date || '—'}`,
    `Time: ${b.time || '—'}`,
    `Music preference: ${b.music || '—'}`,
    `Notes: ${b.notes || '—'}`
  ].join('\n');
}

// Booking submissions land here. Nothing is stored — the request is
// either emailed immediately or handed back as a WhatsApp link to open.
app.post('/api/book', async (req, res) => {
  const booking = req.body || {};
  const method = booking.method === 'email' ? 'email' : 'whatsapp';
  const text = formatBookingText(booking);

  if (method === 'whatsapp') {
    const number = process.env.WHATSAPP_NUMBER;
    if (!number) {
      return res.status(500).json({ ok: false, error: 'WHATSAPP_NUMBER is not set in .env' });
    }
    const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    return res.json({ ok: true, method: 'whatsapp', url });
  }

  // method === 'email'
  if (!transporter) {
    return res.status(500).json({
      ok: false,
      error: 'Email is not configured yet — add SMTP_USER and SMTP_PASS to .env (see README).'
    });
  }
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.RECIPIENT_EMAIL,
      replyTo: booking.email || undefined,
      subject: `IRC Taxi booking — ${booking.name || 'New request'}`,
      text
    });
    return res.json({ ok: true, method: 'email' });
  } catch (err) {
    console.error('Email send failed:', err.message);
    return res.status(500).json({ ok: false, error: 'Could not send the email. Check SMTP settings in .env.' });
  }
});

app.listen(PORT, () => {
  console.log(`IRC Taxi site running at http://localhost:${PORT}`);
});
