require('dotenv').config();
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Frontend asks this for the WhatsApp number so it never has to be hardcoded in the HTML/JS.
app.get('/api/config', (req, res) => {
  res.json({
    whatsappNumber: process.env.WHATSAPP_NUMBER || ''
  });
});

function formatBookingText(b) {
  return [
    'New IRC Taxi booking',
    '',
    `Package: ${b.package || '—'} (${b.price || '—'})`,
    `Name: ${b.name || '—'}`,
    `Phone: ${b.phone || '—'}`,
    `Pickup: ${b.pickup || '—'}`,
    `Drop-off: ${b.dropoff || '—'}`,
    `Date: ${b.date || '—'}`,
    `Time: ${b.time || '—'}`,
    `Music preference: ${b.music || '—'}`,
    `Notes: ${b.notes || '—'}`
  ].join('\n');
}

// Booking submissions land here. Nothing is stored — the request is
// handed back as a WhatsApp link for the browser to open.
app.post('/api/book', (req, res) => {
  const booking = req.body || {};
  const number = process.env.WHATSAPP_NUMBER;

  if (!number) {
    return res.status(500).json({ ok: false, error: 'WHATSAPP_NUMBER is not set in .env' });
  }

  const text = formatBookingText(booking);
  const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  return res.json({ ok: true, url });
});

app.listen(PORT, () => {
  console.log(`IRC Taxi site running at http://localhost:${PORT}`);
});
