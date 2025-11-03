import { useState } from "react";
import Container from "../components/container";
import SEO from "../components/seo";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!file) return setStatus("Please choose an image.");

    const fd = new FormData();
    fd.append("file", file);
    if (caption.trim()) fd.append("caption", caption.trim());

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-token": token },
        body: fd,
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Upload failed");
      setStatus(`✅ Uploaded: ${j.url}`);
      setFile(null);
      setCaption("");
    } catch (err: any) {
      setStatus(`❌ ${err.message}`);
    }
  }

  return (
    <>
      <SEO title="Admin" description="Upload new gallery images." />
      <section className="py-10 sm:py-14">
        <Container>
          <h1 className="text-3xl font-semibold">Admin — Upload Image</h1>
          <form onSubmit={onSubmit} className="mt-6 max-w-md space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Admin token</span>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-neutral-300 p-2"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Image file</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                className="mt-1 block w-full"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Caption (optional)</span>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Solid oak door, Bradford"
                className="mt-1 w-full rounded-lg border border-neutral-300 p-2"
              />
            </label>

            <button type="submit" className="btn-primary">Upload</button>
            {status && <p className="text-sm mt-2">{status}</p>}
          </form>
        </Container>
      </section>
    </>
  );
}
