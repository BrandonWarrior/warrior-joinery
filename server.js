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

const UPLOAD_FOLDER = process.env.CLOUDINARY_FOLDER || "warrior-joinery/gallery";

const toAutoUrl = (url = "") =>
  url.replace("/upload/", "/upload/f_auto,q_auto/");

/* ---------------- Upload ---------------- */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

/* ---------------- Basic Auth (Admin) ---------------- */

function requireBasicAuth(req, res, next) {
  const user = process.env.ADMIN_BASIC_USER;
  const pass = process.env.ADMIN_BASIC_PASS;

  // If you forget to set these, don't accidentally lock yourself out silently
  if (!user || !pass) {
    return res.status(500).json({ error: "Admin basic auth not configured" });
  }

  const header = req.headers.authorization || "";
  const [scheme, encoded] = header.split(" ");

  if (scheme !== "Basic" || !encoded) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin"');
    return res.status(401).send("Authentication required.");
  }

  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const sep = decoded.indexOf(":");
  const u = sep >= 0 ? decoded.slice(0, sep) : "";
  const p = sep >= 0 ? decoded.slice(sep + 1) : "";

  if (u !== user || p !== pass) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin"');
    return res.status(401).send("Invalid credentials.");
  }

  next();
}

/* ---------------- Token Auth (Admin API) ---------------- */

function requireAdminToken(req, res, next) {
  const token = req.header("X-Admin-Token");

  if (!process.env.ADMIN_TOKEN) {
    return res.status(500).json({ error: "ADMIN_TOKEN not set" });
  }
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
  if (company && String(company).trim() !== "") return res.json({ ok: true });

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text: message,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("❌ Email error:", err);
    res.status(500).json({ error: "Failed to send email" });
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
    console.error("❌ /api/gallery error:", err);
    res.status(500).json({ error: "Failed to load gallery" });
  }
});

/* ---------------- Admin API (Basic Auth + Token) ---------------- */

// Basic auth for all admin API endpoints
app.use("/api/admin", requireBasicAuth);

app.get("/api/admin/list", requireAdminToken, async (_req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: `${UPLOAD_FOLDER}/`,
      resource_type: "image",
      max_results: 100,
    });

    const resources = (result.resources || []).sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    res.json({
      resources: resources.map((r) => ({
        public_id: r.public_id,
        secure_url: toAutoUrl(r.secure_url),
        width: r.width,
        height: r.height,
        format: r.format,
        created_at: r.created_at,
      })),
    });
  } catch (err) {
    console.error("❌ admin list error:", err);
    res.status(500).json({ error: "Failed to load admin list" });
  }
});

app.post(
  "/api/admin/upload",
  requireAdminToken,
  upload.single("file"),
  async (req, res) => {
    if (!req.file?.buffer) return res.status(400).json({ error: "No file uploaded" });

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: UPLOAD_FOLDER,
        resource_type: "image",
        transformation: [{ fetch_format: "auto", quality: "auto" }],
      },
      (err, uploaded) => {
        if (err) return res.status(500).json({ error: "Upload failed" });
        res.json({ ok: true, secure_url: toAutoUrl(uploaded.secure_url), public_id: uploaded.public_id });
      }
    );

    stream.end(req.file.buffer);
  }
);

app.delete("/api/admin/delete/:public_id", requireAdminToken, async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.public_id);
    res.json({ ok: true });
  } catch (err) {
    console.error("❌ delete error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

/* ---------------- SPA ---------------- */

const distPath = path.join(__dirname, "dist");

// Protect /admin route (page load) with Basic Auth
app.get("/admin", requireBasicAuth, (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.use(express.static(distPath));

app.get("/healthz", (_req, res) =>
  res.json({ ok: true, ts: new Date().toISOString() })
);

app.use((_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

/* ---------------- Server ---------------- */

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
