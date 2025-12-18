export type GalleryResource = {
    public_id: string;
    secure_url: string;
    width?: number;
    height?: number;
    format?: string;
    created_at?: string;
    context?: Record<string, any> | null;
  };
  
  /* ---------------- PUBLIC ---------------- */
  
  export async function fetchGallery(): Promise<GalleryResource[]> {
    const res = await fetch("/api/gallery");
    if (!res.ok) throw new Error(`Gallery fetch failed (${res.status})`);
    const json = await res.json();
    return json.resources ?? [];
  }
  
  /* ---------------- ADMIN ---------------- */
  
  export async function adminList(token: string): Promise<GalleryResource[]> {
    const res = await fetch("/api/admin/list", {
      headers: { "X-Admin-Token": token },
    });
    if (!res.ok) throw new Error("Admin list failed");
    const json = await res.json();
    return json.resources ?? json;
  }
  
  export async function adminUpload(token: string, file: File) {
    const fd = new FormData();
    fd.append("file", file);
  
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "X-Admin-Token": token },
      body: fd,
    });
  
    if (!res.ok) throw new Error("Upload failed");
  }
  
  export async function adminDelete(token: string, public_id: string) {
    const res = await fetch(`/api/admin/delete/${public_id}`, {
      method: "DELETE",
      headers: { "X-Admin-Token": token },
    });
  
    if (!res.ok) throw new Error("Delete failed");
  }
  