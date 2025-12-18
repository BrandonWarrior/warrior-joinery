import { useEffect, useMemo, useState } from "react";
import Container from "../components/container";
import SEO from "../components/seo";
import {
  adminDelete,
  adminList,
  adminUpload,
  type GalleryResource,
} from "../lib/gallery-api";

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
      setError(e?.message || "Failed to load images.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // no auto-load (token stays private)
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
      await adminUpload(token.trim(), file);
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
      setItems((prev) =>
        prev ? prev.filter((x) => x.public_id !== public_id) : prev
      );
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
          <p className="mt-2 text-neutral-700">
            Upload and delete gallery images.
          </p>

          {/* AUTH */}
          <div className="mt-6 grid gap-4 rounded-xl border bg-white p-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium">Admin token</span>
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste ADMIN_TOKEN"
                className="rounded-lg border px-3 py-2"
              />
            </label>

            <div className="flex items-center gap-3">
              <button
                onClick={load}
                disabled={!canLoad || loading}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-white disabled:opacity-50"
              >
                {loading ? "Loading…" : authed ? "Refresh list" : "Load images"}
              </button>

              {authed && (
                <span className="text-sm text-green-700">
                  Token accepted
                </span>
              )}
            </div>

            {error && (
              <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-red-800">
                {error}
              </div>
            )}

            {notice && (
              <div className="rounded border border-green-200 bg-green-50 px-3 py-2 text-green-800">
                {notice}
              </div>
            )}
          </div>

          {/* UPLOAD */}
          <div className="mt-8 grid gap-4 rounded-xl border bg-white p-4">
            <h2 className="text-lg font-semibold">Upload</h2>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            <button
              onClick={onUpload}
              disabled={loading || !token.trim() || !file}
              className="w-fit rounded-lg bg-steel px-4 py-2 text-white disabled:opacity-50"
            >
              {loading ? "Uploading…" : "Upload"}
            </button>

            <p className="text-sm text-neutral-600">
              HEIC uploads are fine — images are delivered as browser-friendly formats.
            </p>
          </div>

          {/* IMAGES */}
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
                  const isBusy = busyId === r.public_id;

                  return (
                    <li
                      key={r.public_id}
                      className="overflow-hidden rounded-xl border bg-white shadow-sm"
                    >
                      <div className="aspect-[4/5] bg-neutral-100">
                        <img
                          src={r.secure_url}
                          alt="Gallery image"
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <div className="p-3">
                        <div className="mb-2 text-xs text-neutral-600 break-all">
                          {r.public_id}
                        </div>

                        <button
                          onClick={() => onDelete(r.public_id)}
                          disabled={isBusy}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 disabled:opacity-50"
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
