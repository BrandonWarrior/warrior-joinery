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
  const { name, email, phone, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM, // "Warrior Joinery <your@gmail.com>"
      to: process.env.MAIL_TO,     // your inbox
      subject: `New enquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "—"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error("❌ Email send error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

// ---- Static SPA ----
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// Health check (optional)
app.get("/healthz", (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// Express v5-compatible SPA fallback
app.get("/*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`[server] Serving static from: ${distPath}`);
});
