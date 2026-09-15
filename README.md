# IRC Taxi — booking website

A small Node/Express site for IRC Taxi: services, packages, working hours,
and a booking form. There's no database — every booking is sent straight
to the driver, either as a pre-filled **WhatsApp** message or a real
**email**, depending on what the customer picks on the form.

```
irc-taxi-node/
├── server.js           Express server + the two API routes
├── package.json
├── .env.example         Copy this to .env and fill in real values
└── public/
    ├── index.html        The page itself
    ├── css/style.css      All styling, light + dark theme
    └── js/main.js          Theme toggle, form logic, talks to the server
```

## 1. Install

You need [Node.js](https://nodejs.org) 18 or newer installed. Then, inside
this folder:

```bash
npm install
```

## 2. Add the driver's phone number and email

The site reads its contact details from a `.env` file — you never have to
touch the code to change them.

1. Make a copy of `.env.example` and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` in any text editor and fill in:

   **WhatsApp number** — the number that receives bookings when a customer
   chooses "Send via WhatsApp":
   ```
   WHATSAPP_NUMBER=250780557704
   ```
   Use the country code, no `+`, no spaces, and no leading `0`. For a
   Rwandan number like `0780 557 704`, that becomes `250780557704`.

   **Recipient email** — the inbox that receives bookings when a customer
   chooses "Send via Email":
   ```
   RECIPIENT_EMAIL=owner@example.com
   ```

3. To actually *send* that email, the server needs to log in to a mailbox.
   The easiest option is a Gmail account:
   - Turn on 2-Step Verification on that Google account.
   - Go to **Google Account → Security → App passwords**, and create one
     (choose "Mail" as the app). Google gives you a 16-character password.
   - Put that in `.env`:
     ```
     SMTP_USER=your-sending-account@gmail.com
     SMTP_PASS=the16characterapppassword
     ```
   - Leave `SMTP_HOST`, `SMTP_PORT`, and `SMTP_SECURE` as they are — those
     are already set for Gmail.

   Using a different email provider (Outlook, a custom domain, etc.) works
   too — just change `SMTP_HOST`/`SMTP_PORT` to that provider's SMTP
   details and use the matching login.

   If you skip this step, the WhatsApp option still works fine on its
   own — email bookings will just show an error until SMTP is configured.

## 3. Run it

```bash
npm start
```

Then open **http://localhost:3000** in a browser.

For local development with auto-restart on file changes:

```bash
npm run dev
```

## How a booking is sent

- **WhatsApp**: the server builds a `wa.me` link with the booking details
  pre-filled and sends it back to the browser, which opens WhatsApp. The
  customer still taps "send" themselves inside WhatsApp — nothing is sent
  automatically, since real automatic WhatsApp sending requires the paid
  WhatsApp Business API.
- **Email**: the server sends the email itself, silently, using the SMTP
  details in `.env`. The customer doesn't need an email app open — it's
  a normal server-side send, and the reply-to address is set to whatever
  email the customer typed in, so replying from the inbox goes straight
  back to them.

Nothing is written to a database or file — each booking only exists for
the moment it's being sent.

## Deploying

This is a normal Express app, so it runs on any Node host (Render,
Railway, a VPS, etc.). Whatever platform you use, set the same variables
from `.env` in that platform's environment variable settings — don't
upload the `.env` file itself.

## Customizing

- Colors, fonts, and layout live in `public/css/style.css` — the gold
  accent color is the `--gold` / `--gold-bright` variables near the top.
- Services, packages, and working hours are plain HTML in
  `public/index.html` — edit the text directly.
- The music-genre list on the booking form is in the `#musicOptions`
  block in `public/index.html`.
