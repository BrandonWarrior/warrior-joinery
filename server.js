// src/pages/admin.tsx
import { useEffect, useState } from "react";
import Container from "../components/container";
import SEO from "../components/seo";

type CloudinaryAdminItem = {
  public_id: string;
  secure_url: string;
  context?: { custom?: { caption?: string } };
  width?: number;
  height?: number;
  format?: string;
  created_at?: string;
};

export default function AdminPage() {
  const [token, setToken] = useState<string>(() => localStorage.getItem("adminToken") || "");
  const [items, setItems] = useState<CloudinaryAdminItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");

  // Persist token
  useEffect(() => {
    localStorage.setItem("adminToken", token || "");
  }, [token]);

  async function loadList() {
    if (!token) {
      setError("Enter your admin token to continue.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/list", {
        headers: { "X-Admin-Token": token },
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Failed to fetch list");
      const mapped: CloudinaryAdminItem[] = (j.resources || j?.resources?.resources || j?.resources || []).map(
        (r: any) => ({
          public_id: r.public_id,
          secure_url: r.secure_url,
          context: r.context || null,
          width: r.width,
          height: r.height,
          format: r.format,
          created_at: r.created_at,
        })
      );
      setItems(mapped);
    } catch (e: any) {
      setError(e.message || "Failed to load images");
    } finally {
      setLoading(false);
    }
  }

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return setError("Enter your admin token first.");
    if (!file) return setError("Choose a file to upload.");

    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (caption) fd.append("caption", caption);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "X-Admin-Token": token },
        body: fd,
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j?.error || "Upload failed");

      // Prepend the new image
      setItems((prev) => [
        { public_id: j.public_id, secure_url: j.secure_url, context: caption ? { custom: { caption } } : undefined },
        ...prev,
      ]);
      setFile(null);
      setCaption("");
      (document.getElementById("file") as HTMLInputElement)?.value && ((document.getElementById("file") as HTMLInputElement).value = "");
      alert("✅ Upload complete");
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(public_id: string) {
    if (!token) return setError("Enter your admin token first.");
    if (!confirm("Delete this image? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/delete/${encodeURIComponent(public_id)}`, {
        method: "DELETE",
        headers: { "X-Admin-Token": token },
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j?.error || "Delete failed");
      setItems((prev) => prev.filter((x) => x.public_id !== public_id));
      alert("✅ Deleted");
    } catch (e: any) {
      setError(e.message || "Delete failed");
    }
  }

  return (
    <>
      <SEO title="Admin" description="Manage gallery images." />

      <section className="py-10 sm:py-14">
        <Container>
          <h1 className="text-3xl font-semibold">Admin – Gallery</h1>
          <p className="mt-2 text-neutral-700">
            Upload new images and remove old ones. Images go to Cloudinary and appear on the Gallery page automatically.
          </p>

          {/* Token */}
          <div className="mt-6 rounded-xl border p-4">
            <label htmlFor="token" className="block text-sm font-medium">
              Admin token
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="token"
                type="password"
                placeholder="Paste your ADMIN_TOKEN"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 p-2 focus:border-steel focus:ring-steel"
              />
              <button
                type="button"
                onClick={loadList}
                className="btn-primary whitespace-nowrap"
                disabled={!token || loading}
              >
                {loading ? "Loading…" : "Load images"}
              </button>
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              Tip: token is stored locally in your browser only.
            </p>
          </div>

          {/* Upload */}
          <form onSubmit={onUpload} className="mt-6 rounded-xl border p-4 space-y-3">
            <h2 className="text-lg font-semibold">Upload</h2>
            <div>
              <label htmlFor="file" className="block text-sm font-medium">
                File (JPG/PNG/WebP, up to 10MB)
              </label>
              <input
                id="file"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-1 w-full rounded-lg border border-neutral-300 p-2 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-200 file:px-3 file:py-2"
              />
            </div>

            <div>
              <label htmlFor="caption" className="block text-sm font-medium">
                Caption (optional)
              </label>
              <input
                id="caption"
                type="text"
                maxLength={200}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 p-2"
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary" disabled={uploading || !token || !file}>
                {uploading ? "Uploading…" : "Upload"}
              </button>
              <button
                type="button"
                onClick={loadList}
                className="btn-secondary"
                disabled={loading || !token}
              >
                Refresh list
              </button>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>

          {/* Grid */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Images</h2>
            {items.length === 0 ? (
              <p className="text-neutral-600">No images yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((it) => (
                  <figure key={it.public_id} className="rounded-lg overflow-hidden border relative group">
                    <img
                      src={it.secure_url}
                      alt={it.context?.custom?.caption || "Uploaded image"}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    {it.context?.custom?.caption && (
                      <figcaption className="p-2 text-sm">{it.context.custom.caption}</figcaption>
                    )}
                    <button
                      type="button"
                      onClick={() => onDelete(it.public_id)}
                      className="absolute top-2 right-2 hidden group-hover:block bg-red-600 text-white rounded-md px-2 py-1 text-xs shadow"
                    >
                      Delete
                    </button>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
