# Apex Global landing page

Marketing site for a facility-management company: a React 19 + Vite single-page site (Tailwind, Framer Motion) with a small Express endpoint that emails contact-form inquiries through [Resend](https://resend.com).

## Structure

- `src/App.jsx`: page sections and the contact form
- `server.js`: `POST /api/contact` (validates input, emails the inquiry)
- `contact.js`: input validation and HTML escaping, kept dependency-free so it is unit-testable

## Running locally

```bash
npm install
cp .env.example .env      # add your own Resend API key and addresses
npm run server            # contact API on :5000
npm run dev               # site on :5173
npm test                  # contact validation tests (node:test)
```

| Variable | Where | Purpose |
|---|---|---|
| `RESEND_API_KEY` | server | Resend API key (required; never exposed to the browser) |
| `CONTACT_TO`, `CONTACT_FROM` | server | recipient and verified sender (required) |
| `ALLOWED_ORIGIN` | server | comma-separated origins allowed by CORS |
| `VITE_CONTACT_API_URL` | build | base URL of the contact API used by the form |

## Security

- The API key comes from the environment; the server refuses to start without it.
- All form fields are length-limited and HTML-escaped before being placed in the email, so a submission cannot inject markup or links into the message.
- CORS is restricted to configured origins and request bodies are capped at 20 KB.
- There is no rate limiting yet; add one (for example `express-rate-limit`) before relying on the endpoint publicly.
