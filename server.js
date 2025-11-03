// server.js
import express from "express";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// ---- Gmail SMTP transporter (unchanged) ----
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g. brandon.warriorr@gmail.com
    pass: process.env.EMAIL_PASS, // 16-char app password
  },
});

// ---- Contact endpoint (unchanged) ----
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message, company } = req.body || {};
  if (company && company.trim() !== "") return res.json({ ok: true }); // honeypot

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const plain = [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone || "—"}`, "", "Message:", message].join("\n");

  const html = `
    <table style="max-width:560px;width:100%;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;border-collapse:collapse">
      <tr><td style="padding:16px 0;font-size:18px;font-weight:600;">New enquiry – Warrior Joinery</td></tr>
      <tr><td style="padding:8px 0"><strong>Name:</strong> ${escapeHtml(name)}</td></tr>
      <tr><td style="padding:8px 0"><strong>Email:</strong> <a href="mailto:${escapeAttr(email)}">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding:8px 0"><strong>Phone:</strong> ${escapeHtml(phone || "—")}</td></tr>
      <tr><td style="padding:8px 0"><strong>Message:</strong><br>${nl2br(escapeHtml(message))}</td></tr>
      <tr><td style="padding-top:16px;color:#6b7280;font-size:12px">
        Sent from warrior-joinery.co.uk contact form
      </td></tr>
    </table>
  `;

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text: plain,
      html,
    });

    // Optional auto-ack
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

// ---- Helpers ----
function escapeHtml(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(s = "") {
  return escapeHtml(s).replace(/"/g, "&quot;");
}
function nl2br(s = "") {
  return String(s).replace(/\n/g, "<br>");
}

// ================= Cloudinary Admin & Gallery =================

// Token guard
const requireAdmin = (req, res, next) => {
  const token = req.header("x-admin-token");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorised" });
  }
  next();
};

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload (memory), max 15MB
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

// Admin upload (supports optional caption + tags)
app.post("/api/admin/upload", requireAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });
    const folder = process.env.CLOUDINARY_FOLDER || "warrior-joinery/gallery";
    const caption = req.body?.caption || "";
    const tags = (req.body?.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          overwrite: false,
          context: caption ? { caption } : undefined,
          tags: tags.length ? tags : undefined,
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    res.json({
      ok: true,
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
      width: uploaded.width,
      height: uploaded.height,
      caption,
      tags,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Admin list (includes public_id, tags, caption)
app.get("/api/admin/list", requireAdmin, async (req, res) => {
  try {
    const folder = process.env.CLOUDINARY_FOLDER || "warrior-joinery/gallery";
    const max = Math.min(Number(req.query.limit) || 100, 200);
    const r = await cloudinary.search
      .expression(`folder="${folder}" AND resource_type:image`)
      .sort_by("created_at", "desc")
      .max_results(max)
      .execute();

    const items = (r.resources || []).map((it) => ({
      public_id: it.public_id,
      url: it.secure_url,
      width: it.width,
      height: it.height,
      caption: it.context?.custom?.caption || "",
      tags: it.tags || [],
      created_at: it.created_at,
    }));

    res.json({ items });
  } catch (err) {
    console.error("❌ Admin list error:", err);
    res.status(500).json({ error: "Failed to fetch admin list" });
  }
});

// Admin delete by public_id (safer than path param with slashes)
app.post("/api/admin/delete", requireAdmin, async (req, res) => {
  try {
    const { public_id } = req.body || {};
    if (!public_id) return res.status(400).json({ error: "Missing public_id" });

    const result = await cloudinary.uploader.destroy(public_id, { resource_type: "image" });
    if (result.result !== "ok" && result.result !== "not found") {
      // "not found" is OK to consider as success from UX perspective
      return res.status(500).json({ error: "Cloudinary deletion failed" });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// Public gallery (unchanged)
app.get("/api/gallery", async (_req, res) => {
  try {
    const folder = process.env.CLOUDINARY_FOLDER || "warrior-joinery/gallery";
    const r = await cloudinary.search
      .expression(`folder="${folder}" AND resource_type:image`)
      .sort_by("created_at", "desc")
      .max_results(50)
      .execute();

    const items = (r.resources || []).map((it) => ({
      src: it.secure_url,
      alt: "Warrior Joinery — recent work",
      width: it.width,
      height: it.height,
      caption: it.context?.custom?.caption || "",
      srcSet: [
        { src: it.secure_url.replace(/\/upload\/v\d+\//, "/upload/q_auto,f_auto,w_600/"), width: 600 },
        { src: it.secure_url.replace(/\/upload\/v\d+\//, "/upload/q_auto,f_auto,w_900/"), width: 900 },
        { src: it.secure_url.replace(/\/upload\/v\d+\//, "/upload/q_auto,f_auto,w_1400/"), width: 1400 },
      ],
    }));

    res.json({ items });
  } catch (err) {
    console.error("❌ List error:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// ================= Static SPA (React build) =================
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

app.get("/healthz", (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.use((_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`[server] Serving static from: ${distPath}`);
});
