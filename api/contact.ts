import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { name, email, phone, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: "Missing fields" });

  // Placeholder: send email via your provider (Resend/SendGrid/etc.)
  console.log("📩 New contact submission:", { name, email, phone, message });

  return res.status(200).json({ ok: true });
}
