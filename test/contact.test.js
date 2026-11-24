import test from "node:test";
import assert from "node:assert/strict";
import { escapeHtml, validateInquiry, buildInquiryHtml } from "../contact.js";

const valid = { name: "Rana", email: "rana@example.com", message: "We need cleaning services." };

test("accepts a valid inquiry and trims fields", () => {
  const r = validateInquiry({ ...valid, name: "  Rana  " });
  assert.equal(r.ok, true);
  assert.equal(r.data.name, "Rana");
});

test("rejects missing name, message and bad email", () => {
  const r = validateInquiry({ email: "nope" });
  assert.equal(r.ok, false);
  assert.deepEqual(Object.keys(r.errors).sort(), ["email", "message", "name"]);
});

test("rejects oversized fields and non-string input", () => {
  assert.equal(validateInquiry({ ...valid, message: "x".repeat(5001) }).ok, false);
  assert.equal(validateInquiry({ ...valid, name: { $gt: "" } }).ok, false);
  assert.equal(validateInquiry(null).ok, false);
});

test("escapes HTML so form input cannot inject markup into the email", () => {
  const html = buildInquiryHtml({ ...valid, name: '<img src=x onerror="alert(1)">', message: "a\nb" });
  assert.ok(!html.includes("<img"));
  assert.ok(html.includes("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"));
  assert.ok(html.includes("a<br/>b"));
  assert.equal(escapeHtml("'&"), "&#39;&amp;");
});
