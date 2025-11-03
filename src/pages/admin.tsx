import { useEffect, useState } from "react";
import Container from "../components/container";
import SEO from "../components/seo";

type AdminItem = {
  public_id: string;
  url: string;
  width: number;
  height: number;
  caption?: string;
  tags?: string[];
  created_at?: string;
};

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState(""); // comma-separated
  const [status, setStatus] = useState<string | null>(null);

  const [items, setItems] = useState<AdminItem[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!file) return setStatus("Please choose an image.");

    const fd = new FormData();
    fd.append("file", file);
    if (caption.trim()) fd.append("caption", caption.trim());
    if (tags.trim()) fd.append("tags", tags.trim());

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
      setTags("");
      // refresh list
      await loadList(token);
    } catch (err: any) {
      setStatus(`❌ ${err.message}`);
    }
  }

  async function loadList(tok: string) {
    setLoadingList(true);
    setListError(null);
    try {
      const res = await fetch("/api/admin/list", {
        headers: { "x-admin-token": tok },
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Failed to fetch list");
      setItems(j.items || []);
    } catch (err: any) {
      setListError(err.message || "Failed to fetch list");
    } finally {
      setLoadingList(false);
    }
  }

  async function onDelete(public_id: string) {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ public_id }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Delete failed");
      setItems((prev) => prev.filter((it) => it.public_id !== public_id));
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  }

  // When token changes and looks non-empty, load list
  useEffect(() => {
    if (token.trim()) {
      loadList(token);
    } else {
      setItems([]);
    }
  }, [token]);

  return (
    <>
      <SEO title="Admin" description="Upload and manage gallery images." />
      <section className="py-10 sm:py-14">
        <Container>
          <h1 className="text-3xl font-semibold">Admin — Gallery</h1>

          {/* Token */}
          <div className="mt-4 max-w-md">
            <label className="block text-sm font-medium">Admin token</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your ADMIN_TOKEN"
              className="mt-1 w-full rounded-lg border border-neutral-300 p-2"
            />
          </div>

          {/* Upload */}
          <form onSubmit={onSubmit} className="mt-6 max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium">Image file</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-1 block w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Caption (optional)</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Solid oak door, Bradford"
                className="mt-1 w-full rounded-lg border border-neutral-300 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Tags (optional, comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. oak, repairs"
                className="mt-1 w-full rounded-lg border border-neutral-300 p-2"
              />
            </div>

            <button type="submit" className="btn-primary">Upload</button>
            {status && <p className="text-sm mt-2">{status}</p>}
          </form>

          {/* Manage list */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold">Manage images</h2>

            <div className="mt-3" aria-live="polite">
              {loadingList && <p className="text-sm text-neutral-600">Loading…</p>}
              {listError && <p className="text-sm text-red-700">Error: {listError}</p>}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((it) => (
                <div key={it.public_id} className="rounded-xl border border-neutral-200 p-3">
                  <img
                    src={it.url}
                    alt={it.caption || "Uploaded image"}
                    className="aspect-[4/5] w-full rounded-lg object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="mt-2 text-sm">
                    <div className="font-medium truncate">{it.caption || "—"}</div>
                    {it.tags && it.tags.length > 0 && (
                      <div className="mt-1 text-neutral-600">Tags: {it.tags.join(", ")}</div>
                    )}
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => onDelete(it.public_id)}
                        className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                      <a
                        href={it.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
              ))}
              {!loadingList && !listError && items.length === 0 && (
                <p className="text-sm text-neutral-600">No images yet.</p>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
