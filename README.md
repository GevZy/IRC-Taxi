# IRC Taxi — booking website

A small Node/Express site for IRC Taxi: services, packages, working hours,
and a booking form. There's no database and no email — every booking is
sent straight to the driver as a pre-filled **WhatsApp** message.

```
irc-taxi-node/
├── server.js           Express server + the booking API
├── package.json
├── .env.example         Copy this to .env and fill in real values
└── public/
    ├── index.html        The page itself
    ├── css/style.css      All styling, light + dark theme
    ├── js/main.js          Theme toggle, hero slideshow, form logic
    └── images/logo.jpeg    Company logo, used in the hero slideshow
```

## 1. Install

You need [Node.js](https://nodejs.org) 18 or newer installed. Then, inside
this folder:

```bash
npm install
```

## 2. Add the driver's WhatsApp number

The site reads its contact number from a `.env` file — you never have to
touch the code to change it.

1. Make a copy of `.env.example` and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and set:
   ```
   WHATSAPP_NUMBER=250780557704
   ```
   Use the country code, no `+`, no spaces, and no leading `0`. For a
   Rwandan number like `0780 557 704`, that becomes `250780557704`.

That's the only setting needed — every booking (and the "Chat on WhatsApp"
button in the hero) uses this number.

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

The server builds a `wa.me` link with the booking details pre-filled
(name, phone, pickup/drop-off, date, time, package, music preference,
notes) and sends it back to the browser, which opens WhatsApp. The
customer taps "send" themselves inside WhatsApp to confirm — nothing is
sent automatically, since real automatic WhatsApp sending requires the
paid WhatsApp Business API. Nothing is written to a database or file.

## Deploying

This is a normal Express app, so it runs on any Node host (Render,
Railway, a VPS, etc.). Whatever platform you use, set `WHATSAPP_NUMBER`
in that platform's environment variable settings — don't upload the
`.env` file itself.

## Customizing

- Colors, fonts, and layout live in `public/css/style.css` — the gold
  accent color is the `--gold` / `--gold-bright` variables near the top.
- Services, packages, and working hours are plain HTML in
  `public/index.html` — edit the text directly.
- The music-genre list on the booking form is in the `#musicOptions`
  block in `public/index.html`.
- The hero section crossfades between the car illustration and the
  company logo every 4.5 seconds (`showHeroSlide` in `public/js/main.js`)
  — click either dot in the top-right of that panel to switch manually.
  Swap `public/images/logo.jpeg` for a new file (keep the same name, or
  update the `src` in `index.html`) to change the logo shown.
