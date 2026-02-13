# SMS server (Twilio) for Valentine page

This small server receives a POST request and forwards the message via Twilio SMS. It is intended as a secure backend; do NOT expose Twilio credentials in client-side code.

Setup

1. Create a `.env` file in the `valentine` folder (copy `.env.example`) and fill values.

2. Install dependencies (in the `valentine` folder):

```bash
npm init -y
npm install express cors body-parser twilio dotenv
```

3. Run the server:

```bash
node sms-server.js
```

4. From the client, POST to `http://localhost:3000/send-sms` with JSON body `{ "message": "..." }`.

Security notes

- Twilio credentials must be kept secret. Use environment variables and never commit `.env` to source control.
- Add authentication and rate-limiting in production so external users cannot spam SMS.
- Twilio costs money per message — use sparingly.
