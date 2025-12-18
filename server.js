import "dotenv/config";
import express from "express";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

/* ---------------- Cloudinary ---------------- */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const UPLOAD_FOLDER =
  process.env.CLOUDINARY_FOLDER || "warrior-joinery/gallery";

const toAutoUrl = (url = "") =>
  url.replace("/upload/", "/upload/f_auto,q_auto/");

/* ---------------- Upload ---------------- */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

/* ---------------- Admin auth ---------------- */

function requireAdmin(req, res, next) {
  const token = req.header("X-Admin-Token");
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorised" });
  }
  next();
}

/* ---------------- Contact ---------------- */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message, company } = req.body || {};
  if (company) return res.json({ ok: true });

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text: message,
    });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Email failed" });
  }
});

/* ---------------- Public gallery ---------------- */

app.get("/api/gallery", async (_req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: `${UPLOAD_FOLDER}/`,
      resource_type: "image",
      max_results: 50,
    });

    const sorted = (result.resources || []).sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    res.json({
      resources: sorted.map((r) => ({
        public_id: r.public_id,
        secure_url: toAutoUrl(r.secure_url),
        width: r.width,
        height: r.height,
        format: r.format,
        created_at: r.created_at,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load gallery" });
  }
});

/* ---------------- Admin ---------------- */

app.get("/api/admin/list", requireAdmin, async (_req, res) => {
  const result = await cloudinary.api.resources({
    type: "upload",
    prefix: `${UPLOAD_FOLDER}/`,
    resource_type: "image",
    max_results: 100,
  });
  res.json(result);
});

app.post(
  "/api/admin/upload",
  requireAdmin,
  upload.single("file"),
  async (req, res) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: UPLOAD_FOLDER,
        resource_type: "image",
        transformation: [{ fetch_format: "auto", quality: "auto" }],
      },
      (err, uploaded) => {
        if (err) return res.status(500).json({ error: "Upload failed" });
        res.json({ ok: true, secure_url: toAutoUrl(uploaded.secure_url) });
      }
    );
    stream.end(req.file.buffer);
  }
);

app.delete("/api/admin/delete/:public_id", requireAdmin, async (req, res) => {
  await cloudinary.uploader.destroy(req.params.public_id);
  res.json({ ok: true });
});

/* ---------------- SPA ---------------- */

const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

app.get("/healthz", (_req, res) =>
  res.json({ ok: true, ts: new Date().toISOString() })
);

app.use((_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

/* ---------------- Server ---------------- */

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
