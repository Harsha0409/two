// Simple SMS server using Twilio
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Twilio = require('twilio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, TO_NUMBER } = process.env;

if (!TWILIO_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM || !TO_NUMBER) {
  console.warn('TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM and TO_NUMBER must be set in .env');
}

const client = Twilio(TWILIO_SID || '', TWILIO_AUTH_TOKEN || '');

// Basic endpoint to send an SMS. Expects { message } in JSON body.
app.post('/send-sms', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ ok: false, error: 'Missing message' });

    const msg = await client.messages.create({
      body: message,
      from: TWILIO_FROM,
      to: TO_NUMBER,
    });

    res.json({ ok: true, sid: msg.sid });
  } catch (err) {
    console.error('send-sms error', err && err.message ? err.message : err);
    res.status(500).json({ ok: false, error: err && err.message ? err.message : String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SMS server listening on http://localhost:${PORT}`));
