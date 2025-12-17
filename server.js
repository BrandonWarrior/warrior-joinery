// server.js
import "dotenv/config";
import express from "express";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

// Cloudinary + uploads
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

/* --------------------------------------------------
   Cloudinary config
-------------------------------------------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const UPLOAD_FOLDER = process.env.CLOUDINARY_FOLDER || "warrior-joinery/gallery";

/** Make Cloudinary deliver a browser-friendly format (webp/jpg) + good quality */
const toAutoUrl = (url = "") => url.replace("/upload/", "/upload/f_auto,q_auto/");

/* --------------------------------------------------
   Multer (memory upload)
-------------------------------------------------- */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/* --------------------------------------------------
   Admin auth middleware
-------------------------------------------------- */
function requireAdmin(req, res, next) {
  const token = req.header("X-Admin-Token");

  if (!process.env.ADMIN_TOKEN) {
    return res.status(500).json({ error: "ADMIN_TOKEN not set" });
  }

  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorised" });
  }

  next();
}

/* --------------------------------------------------
   Email (Gmail SMTP)
-------------------------------------------------- */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* --------------------------------------------------
   Contact form
-------------------------------------------------- */
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message, company } = req.body || {};

  // Honeypot
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
    // To you
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text: plain,
      html,
    });

    // Auto-acknowledgement (best-effort)
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

/* --------------------------------------------------
   ✅ Public gallery (Admin API + auto format URLs)
-------------------------------------------------- */
app.get("/api/gallery", async (_req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: `${UPLOAD_FOLDER}/`,
      resource_type: "image",
      max_results: 50,
    });

    const resources = (result.resources || []).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    res.json({
      resources: resources.map((r) => ({
        public_id: r.public_id,
        secure_url: toAutoUrl(r.secure_url), // ✅ browser-friendly even for HEIC
        width: r.width,
        height: r.height,
        format: r.format,
        created_at: r.created_at,
        context: r.context || null,
      })),
    });
  } catch (err) {
    console.error("❌ /api/gallery error:", err);
    res.status(500).json({
      error: "Failed to load gallery",
      message: err?.error?.message || err?.message || String(err),
    });
  }
});

/* --------------------------------------------------
   Admin: list images
-------------------------------------------------- */
app.get("/api/admin/list", requireAdmin, async (_req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: `${UPLOAD_FOLDER}/`,
      resource_type: "image",
      max_results: 100,
    });
    res.json(result);
  } catch (err) {
    console.error("❌ /api/admin/list error", err);
    res.status(500).json({
      error: "Failed to load admin list",
      message: err?.error?.message || err?.message || String(err),
    });
  }
});

/* --------------------------------------------------
   Admin: upload image (force conversion to JPG for future uploads)
-------------------------------------------------- */
app.post("/api/admin/upload", requireAdmin, upload.single("file"), async (req, res) => {
  try {
    const fileBuffer = req.file?.buffer;
    if (!fileBuffer) return res.status(400).json({ error: "No file uploaded" });

    const caption = String(req.body.caption || "").slice(0, 200);

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: UPLOAD_FOLDER,
        resource_type: "image",

        // ✅ Ensure future uploads are browser-friendly
        format: "jpg",
        transformation: [{ quality: "auto", fetch_format: "jpg" }],

        context: caption ? { caption } : undefined,
      },
      (error, uploaded) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          return res.status(500).json({
            error: "Upload failed",
            message: error?.message || String(error),
          });
        }

        return res.json({
          ok: true,
          public_id: uploaded.public_id,
          secure_url: toAutoUrl(uploaded.secure_url),
        });
      }
    );

    stream.end(fileBuffer);
  } catch (err) {
    console.error("❌ /api/admin/upload error", err);
    res.status(500).json({
      error: "Failed to upload",
      message: err?.message || String(err),
    });
  }
});

/* --------------------------------------------------
   Admin: delete image
-------------------------------------------------- */
app.delete("/api/admin/delete/:public_id", requireAdmin, async (req, res) => {
  const { public_id } = req.params;
  if (!public_id) return res.status(400).json({ error: "Missing public_id" });

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    if (result.result !== "ok") {
      console.warn("⚠️ Cloudinary delete failed:", result);
      return res.status(400).json({ error: "Failed to delete image" });
    }
    res.json({ ok: true, result });
  } catch (err) {
    console.error("❌ /api/admin/delete error", err);
    res.status(500).json({
      error: "Delete failed",
      message: err?.message || String(err),
    });
  }
});

/* --------------------------------------------------
   Helpers
-------------------------------------------------- */
function escapeHtml(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(s = "") {
  return escapeHtml(s).replace(/"/g, "&quot;");
}
function nl2br(s = "") {
  return String(s).replace(/\n/g, "<br>");
}

/* --------------------------------------------------
   Static SPA
-------------------------------------------------- */
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

app.get("/healthz", (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.use((_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

/* --------------------------------------------------
   Server
-------------------------------------------------- */
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`[server] Serving static from: ${distPath}`);
});
