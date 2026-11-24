import express from "express";
import cors from "cors";
import { Resend } from "resend";
import { validateInquiry, buildInquiryHtml } from "./contact.js";

const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM, ALLOWED_ORIGIN, PORT = "5000" } = process.env;
const missing = ["RESEND_API_KEY", "CONTACT_TO", "CONTACT_FROM"].filter((name) => !process.env[name]);
if (missing.length) {
  console.error(`Missing required environment variable(s): ${missing.join(", ")}. See .env.example.`);
  process.exit(1);
}

const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN ? ALLOWED_ORIGIN.split(",") : "http://localhost:5173" }));
app.use(express.json({ limit: "20kb" }));

const resend = new Resend(RESEND_API_KEY);

app.post("/api/contact", async (req, res) => {
  const result = validateInquiry(req.body);
  if (!result.ok) return res.status(400).json({ success: false, errors: result.errors });

  try {
    await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: result.data.email,
      subject: "New Facility Inquiry",
      html: buildInquiryHtml(result.data),
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Failed to send inquiry email:", err?.message ?? err);
    res.status(502).json({ success: false });
  }
});

app.listen(Number(PORT), () => console.log(`Contact API listening on http://localhost:${PORT}`));
