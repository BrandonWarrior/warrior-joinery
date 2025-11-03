// src/pages/admin.tsx
import { useEffect, useState } from "react";
import Container from "../components/container";
import SEO from "../components/seo";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);

  async function loadAdminList(t: string) {
    setStatus("Loading…");
    try {
      const r = await fetch("/api/admin/list", { headers: { "X-Admin-Token": t } });
      if (!r.ok) throw new Error("Failed to fetch admin list");
      const j = await r.json();
      setItems(j.resources || []);
      setStatus("Loaded");
    } catch (e: any) {
      setStatus(e.message || "Load failed");
    }
  }

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return setStatus("Enter your admin token");
    if (!file) return setStatus("Choose a file");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("caption", caption);

    setStatus("Uploading…");
    try {
      const r = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "X-Admin-Token": token },
        body: fd,
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "Upload failed");
      setStatus(`✅ Uploaded: ${j.secure_url}`);
      setFile(null);
      setCaption("");
      await loadAdminList(token);
    } catch (e: any) {
      setStatus(`❌ ${e.message || "Upload failed"}`);
    }
  }

  useEffect(() => {
    if (token) loadAdminList(token);
  }, [token]);

  return (
    <>
      <SEO title="Admin" description="Private admin uploads" />
      <section className="py-10">
        <Container>
          <h1 className="text-2xl font-semibold">Admin – Upload</h1>

          <div className="mt-4 space-y-3">
            <input
              type="password"
              placeholder="Admin token"
              className="w-full max-w-sm rounded border p-2"
              onChange={(e) => setToken(e.target.value.trim())}
              value={token}
            />
            <form onSubmit={onUpload} className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <input
                type="text"
                placeholder="Caption (optional)"
                className="w-full max-w-sm rounded border p-2"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <button className="btn-primary" type="submit">Upload</button>
            </form>

            {status && <p className="text-sm">{status}</p>}

            <hr className="my-4" />
            <h2 className="text-lg font-semibold">Manage images</h2>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {items.map((it) => (
                <figure key={it.public_id} className="rounded-lg overflow-hidden border">
                  <img src={it.secure_url} alt={it.context?.custom?.caption || "Uploaded"} />
                  {it.context?.custom?.caption && (
                    <figcaption className="p-2 text-sm">{it.context.custom.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
