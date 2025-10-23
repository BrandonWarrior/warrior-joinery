// server.js
import express from "express";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// ---- Gmail SMTP transporter ----
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g. brandon.warriorr@gmail.com
    pass: process.env.EMAIL_PASS, // 16-char app password
  },
});

// ---- Contact endpoint ----
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message, company } = req.body || {};

  // Honeypot: silently ignore bots
  if (company && company.trim() !== "") return res.json({ ok: true });

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const plain = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "—"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <table style="max-width:560px;width:100%;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;border-collapse:collapse">
      <tr><td style="padding:16px 0;font-size:18px;font-weight:600;">New enquiry – Warrior Joinery</td></tr>
      <tr><td style="padding:8px 0"><strong>Name:</strong> ${escapeHtml(name)}</td></tr>
      <tr><td style="padding:8px 0"><strong>Email:</strong> <a href="mailto:${escapeAttr(
        email
      )}">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding:8px 0"><strong>Phone:</strong> ${escapeHtml(phone || "—")}</td></tr>
      <tr><td style="padding:8px 0"><strong>Message:</strong><br>${nl2br(
        escapeHtml(message)
      )}</td></tr>
      <tr><td style="padding-top:16px;color:#6b7280;font-size:12px">
        Sent from warrior-joinery.co.uk contact form
      </td></tr>
    </table>
  `;

  try {
    // 1️⃣ Send to you
    await transporter.sendMail({
      from: process.env.MAIL_FROM,  // "Warrior Joinery <brandon.warriorr@gmail.com>"
      to: process.env.MAIL_TO,      // your inbox
      replyTo: email,               // ✅ makes reply go to sender
      subject: `New enquiry from ${name}`,
      text: plain,
      html,
    });

    // 2️⃣ (Optional) Auto-acknowledgement email to sender
    try {
      await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: "Thanks for your enquiry – Warrior Joinery",
        text: `Hi ${name},

Thanks for getting in touch. I’ve received your message and will reply as soon as I can.

— Brandon
Warrior Joinery`,
        html: `
          <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5">
            <p>Hi ${escapeHtml(name)},</p>
            <p>Thanks for getting in touch. I’ve received your message and will reply as soon as I can.</p>
            <p>— Brandon<br/>Warrior Joinery</p>
          </div>
        `,
      });
    } catch (ackErr) {
      console.warn("⚠️ Auto-reply failed:", ackErr?.message || ackErr);
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("❌ Email send error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

// ---- Helpers to keep HTML safe ----
function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function escapeAttr(s = "") {
  return escapeHtml(s).replace(/"/g, "&quot;");
}
function nl2br(s = "") {
  return String(s).replace(/\n/g, "<br>");
}

// ---- Static SPA (React build) ----
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// Health check (optional)
app.get("/healthz", (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// SPA fallback
app.use((_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`[server] Serving static from: ${distPath}`);
});
