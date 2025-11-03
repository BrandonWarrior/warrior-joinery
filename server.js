// server.js
import express from "express";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

// Cloudinary + file upload
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// ---------- Cloudinary config ----------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // e.g. dgv1yketq
  api_key: process.env.CLOUDINARY_API_KEY,       // e.g. 559629487195279
  api_secret: process.env.CLOUDINARY_API_SECRET, // keep secret in Heroku config
  secure: true,
});

const UPLOAD_FOLDER = process.env.CLOUDINARY_FOLDER || "warrior-joinery/gallery";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ---------- Simple admin token middleware ----------
function requireAdmin(req, res, next) {
  const token = req.header("X-Admin-Token");
  if (!process.env.ADMIN_TOKEN) {
    return res.status(500).json({ error: "ADMIN_TOKEN not set on server" });
  }
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorised" });
  }
  next();
}

// ---------- Gmail SMTP (contact emails) ----------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g. brandon.warriorr@gmail.com
    pass: process.env.EMAIL_PASS, // 16-char app password
  },
});

// ---------- Contact endpoint ----------
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message, company } = req.body || {};

  // Honeypot: ignore obvious bots quietly
  if (company && String(company).trim() !== "") return res.json({ ok: true });

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
      <tr><td style="padding:8px 0"><strong>Email:</strong> <a href="mailto:${escapeAttr(email)}">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding:8px 0"><strong>Phone:</strong> ${escapeHtml(phone || "—")}</td></tr>
      <tr><td style="padding:8px 0"><strong>Message:</strong><br>${nl2br(escapeHtml(message))}</td></tr>
      <tr><td style="padding-top:16px;color:#6b7280;font-size:12px">
        Sent from warrior-joinery contact form
      </td></tr>
    </table>
  `;

  try {
    // 1) Send to you
    await transporter.sendMail({
      from: process.env.MAIL_FROM, // "Warrior Joinery <you@gmail.com>"
      to: process.env.MAIL_TO,     // your inbox
      replyTo: email,              // reply goes to sender
      subject: `New enquiry from ${name}`,
      text: plain,
      html,
    });

    // 2) Auto-acknowledgement (best-effort)
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

// ---------- Public gallery (Cloudinary search) ----------
app.get("/api/gallery", async (_req, res) => {
  try {
    const result = await cloudinary.search
      .expression(`folder:${UPLOAD_FOLDER} AND resource_type:image`)
      .sort_by("created_at", "desc")
      .max_results(50)
      .execute();

    res.json({
      resources: (result.resources || []).map((r) => ({
        public_id: r.public_id,
        secure_url: r.secure_url,
        width: r.width,
        height: r.height,
        format: r.format,
        created_at: r.created_at,
        context: r.context || null,
      })),
    });
  } catch (err) {
    console.error("❌ /api/gallery error", err);
    res.status(500).json({ error: "Failed to load gallery" });
  }
});

// ---------- Admin: list images ----------
app.get("/api/admin/list", requireAdmin, async (_req, res) => {
  try {
    const result = await cloudinary.search
      .expression(`folder:${UPLOAD_FOLDER} AND resource_type:image`)
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();
    res.json(result);
  } catch (err) {
    console.error("❌ /api/admin/list error", err);
    res.status(500).json({ error: "Failed to load admin list" });
  }
});

// ---------- Admin: upload image ----------
app.post("/api/admin/upload", requireAdmin, upload.single("file"), async (req, res) => {
  try {
    const fileBuffer = req.file?.buffer;
    if (!fileBuffer) return res.status(400).json({ error: "No file uploaded" });

    const caption = String(req.body.caption || "").slice(0, 200);

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: UPLOAD_FOLDER,
        resource_type: "image",
        context: caption ? { caption } : undefined,
      },
      (error, uploaded) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          return res.status(500).json({ error: "Upload failed" });
        }
        return res.json({
          ok: true,
          public_id: uploaded.public_id,
          secure_url: uploaded.secure_url,
        });
      }
    );

    stream.end(fileBuffer);
  } catch (err) {
    console.error("❌ /api/admin/upload error", err);
    res.status(500).json({ error: "Failed to upload" });
  }
});

// ---------- Helpers ----------
function escapeHtml(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(s = "") {
  return escapeHtml(s).replace(/"/g, "&quot;");
}
function nl2br(s = "") {
  return String(s).replace(/\n/g, "<br>");
}

// ---------- Static SPA (React build) ----------
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// Health check
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
