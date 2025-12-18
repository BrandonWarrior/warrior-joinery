import { useEffect, useMemo, useState } from "react";
import Container from "../components/container";
import SEO from "../components/seo";
import { adminDelete, adminList, adminUpload, type GalleryResource } from "../lib/gallery-api";

export default function AdminPage() {
  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://warrior-joinery-eb793f26e853.herokuapp.com";

  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);

  const [items, setItems] = useState<GalleryResource[] | null>(null);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [busyId, setBusyId] = useState<string | null>(null);

  const canLoad = useMemo(() => token.trim().length > 0, [token]);

  async function load() {
    if (!canLoad) return;
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const list = await adminList(token.trim());
      setItems(list);
      setAuthed(true);
    } catch (e: any) {
      setAuthed(false);
      setItems(null);
      setError(e?.message || "Failed to load admin list.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // no auto-load (keeps token private)
  }, []);

  async function onUpload() {
    setError(null);
    setNotice(null);

    if (!token.trim()) {
      setError("Enter your admin token first.");
      return;
    }
    if (!file) {
      setError("Choose a file to upload.");
      return;
    }

    setLoading(true);
    try {
      await adminUpload(token.trim(), file, ""); // no caption
      setFile(null);
      setNotice("Uploaded successfully.");
      await load();
    } catch (e: any) {
      setError(e?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(public_id: string) {
    setError(null);
    setNotice(null);

    if (!confirm("Delete this image? This cannot be undone.")) return;

    setBusyId(public_id);
    try {
      await adminDelete(token.trim(), public_id);
      setNotice("Deleted.");
      setItems((prev) => (prev ? prev.filter((x) => x.public_id !== public_id) : prev));
    } catch (e: any) {
      setError(e?.message || "Delete failed.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <SEO
        title="Admin"
        description="Admin upload and gallery management."
        canonical={`${siteUrl}/admin`}
      />

      <section className="py-10 sm:py-14">
        <Container>
          <h1 className="text-3xl font-semibold">Admin</h1>
          <p className="mt-2 max-w-prose text-neutral-700">
            Manage gallery images (upload, delete).
          </p>

          <div className="mt-6 grid gap-4 rounded-xl border border-neutral-200 bg-white p-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium">Admin token</span>
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste ADMIN_TOKEN"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={load}
                disabled={!canLoad || loading}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-white disabled:opacity-50"
              >
                {loading ? "Loading…" : authed ? "Refresh list" : "Load images"}
              </button>

              {authed && <span className="text-sm text-green-700">Token accepted</span>}
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-800">
                {error}
              </div>
            )}
            {notice && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-green-800">
                {notice}
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-4 rounded-xl border border-neutral-200 bg-white p-4">
            <h2 className="text-lg font-semibold">Upload</h2>

            <label className="grid gap-1">
              <span className="text-sm font-medium">Choose file</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>

            <button
              onClick={onUpload}
              disabled={loading || !token.trim() || !file}
              className="w-fit rounded-lg bg-steel px-4 py-2 text-white disabled:opacity-50"
            >
              {loading ? "Uploading…" : "Upload"}
            </button>

            <p className="text-sm text-neutral-600">
              Tip: HEIC uploads are fine — backend delivers browser-friendly formats automatically.
            </p>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold">Images</h2>

            {!items && (
              <p className="mt-3 text-neutral-600">
                Enter your token and click “Load images”.
              </p>
            )}

            {items && items.length === 0 && (
              <p className="mt-3 text-neutral-600">No images found.</p>
            )}

            {items && items.length > 0 && (
              <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((r) => {
                  const id = r.public_id;
                  const isBusy = busyId === id;

                  return (
                    <li
                      key={id}
                      className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
                    >
                      <div className="aspect-[4/5] w-full bg-neutral-100">
                        <img
                          src={r.secure_url}
                          alt="Gallery image"
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>

                      <div className="grid gap-3 p-3">
                        <div className="text-xs text-neutral-600 break-all">{id}</div>

                        <button
                          onClick={() => onDelete(id)}
                          disabled={isBusy || !token.trim()}
                          className="w-fit rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 disabled:opacity-50"
                        >
                          {isBusy ? "Working…" : "Delete"}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
