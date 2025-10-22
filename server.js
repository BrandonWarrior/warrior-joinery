// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// --- Email / contact endpoint ---
const resend = new Resend(process.env.RESEND_API_KEY);
const MAIL_TO = process.env.MAIL_TO;
const MAIL_FROM = process.env.MAIL_FROM;

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }
  if (!MAIL_TO || !MAIL_FROM) {
    console.error("Missing MAIL_TO or MAIL_FROM env");
    return res.status(500).json({ error: "Email not configured" });
  }

  try {
    const subject = `New enquiry from ${name}`;
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "—"}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const result = await resend.emails.send({
      from: MAIL_FROM,
      to: MAIL_TO,
      reply_to: email,
      subject,
      text,
    });

    if (result.error) {
      console.error(result.error);
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// --- Static SPA (Vite build) ---
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// SPA fallback for React Router
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// --- Start ---
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
