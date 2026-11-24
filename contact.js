const LIMITS = { name: 120, email: 200, phone: 40, company: 160, location: 160, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Returns { ok: true, data } with trimmed fields, or { ok: false, errors }. */
export function validateInquiry(body) {
  const data = {};
  const errors = {};
  for (const [field, max] of Object.entries(LIMITS)) {
    const raw = body?.[field];
    const value = typeof raw === "string" ? raw.trim() : "";
    if (value.length > max) errors[field] = `must be at most ${max} characters`;
    data[field] = value;
  }
  if (!data.name) errors.name = "is required";
  if (!data.message) errors.message = "is required";
  if (!EMAIL_RE.test(data.email)) errors.email = "must be a valid email address";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

export function buildInquiryHtml(data) {
  const row = (label, value) => `<p><strong>${label}:</strong> ${escapeHtml(value || "-")}</p>`;
  return [
    "<h2>New Request</h2>",
    row("Name", data.name),
    row("Email", data.email),
    row("Phone", data.phone),
    row("Company", data.company),
    row("Location", data.location),
    `<p><strong>Message:</strong><br/>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p>`,
  ].join("\n");
}
