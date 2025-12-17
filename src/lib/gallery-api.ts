export type GalleryResource = {
    public_id: string;
    secure_url: string;
    display_url?: string;
    width?: number;
    height?: number;
    format?: string;
    created_at?: string;
    context?: Record<string, any> | null;
  };
  
  export async function fetchGallery(): Promise<GalleryResource[]> {
    const res = await fetch("/api/gallery", { credentials: "same-origin" });
    if (!res.ok) throw new Error(`Gallery fetch failed (${res.status})`);
  
    const json = await res.json();
  
    // Supports either:
    // 1) { resources: [...] }
    // 2) [...]
    const resources = Array.isArray(json) ? json : json?.resources;
  
    return (resources ?? []) as GalleryResource[];
  }
  