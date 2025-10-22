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
app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, message, company, submittedAt, mountedAt } = req.body || {};
  
      // Honeypot: any value means bot
      if (company && String(company).trim() !== "") {
        console.warn("[spam] honeypot tripped");
        return res.status(200).json({ ok: true }); // pretend success
      }
  
      // Timing guard: at least ~2s between mount and submit
      const now = Date.now();
      const mounted = Number(mountedAt) || now - 2000;
      const submitted = Number(submittedAt) || now;
      if (submitted - mounted < 1500) {
        console.warn("[spam] too fast submit");
        return res.status(200).json({ ok: true });
      }
  
      // Basic validation
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Missing fields" });
      }
  
      if (!MAIL_TO || !MAIL_FROM || !process.env.RESEND_API_KEY) {
        console.error("[email] Missing config (MAIL_TO, MAIL_FROM, RESEND_API_KEY)");
        return res.status(500).json({ error: "Email not configured" });
      }
  
      const subject = `New enquiry from ${name}`;
      const text = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "—"}`,
        "",
        "Message:",
        message,
      ].join("\n");
  
      const html = `
        <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#111">
          <h2 style="margin:0 0 8px 0">New enquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone || "—")}</p>
          <p><strong>Message:</strong></p>
          <pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px">${escapeHtml(message)}</pre>
          <hr style="margin:16px 0;border:0;border-top:1px solid #e5e7eb" />
          <p style="color:#6b7280;font-size:12px">Submitted at ${new Date().toISOString()}</p>
        </div>
      `;
  
      const result = await resend.emails.send({
        from: MAIL_FROM,
        to: MAIL_TO,
        reply_to: email,
        subject,
        text,
        html,
      });
  
      if (result?.error) {
        console.error("[email] Resend error:", result.error);
        return res.status(500).json({ error: "Failed to send email" });
      }
  
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("[email] Server error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
  // helper to avoid HTML injection in the email
  function escapeHtml(str = "") {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }  

// --- Static SPA (Vite build) ---
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// SPA fallback for React Router
app.use((_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });  

// --- Start ---
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
