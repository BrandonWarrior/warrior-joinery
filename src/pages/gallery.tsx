import { useEffect, useState } from "react";
import Container from "../components/container";
import SEO from "../components/seo";
import GalleryGrid, { type GalleryItem } from "../components/gallerygrid";
import { fetchGallery, type GalleryResource } from "../lib/gallery-api";

export default function GalleryPage() {
  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://warrior-joinery-eb793f26e853.herokuapp.com";

  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const resources: GalleryResource[] = await fetchGallery();

        const mapped: GalleryItem[] = resources.map((r) => ({
          src: r.secure_url,
          alt: "Work example",
          width: r.width ?? 900,
          height: r.height ?? 1200,
        }));

        setItems(mapped);
      } catch (e: any) {
        console.error("[gallery] load error", e);
        setError("Could not load gallery right now.");
      }
    })();
  }, []);

  return (
    <>
      <SEO
        title="Gallery"
        description="A selection of internal door installations and repairs completed across West Yorkshire."
        canonical={`${siteUrl}/gallery`}
      />

      <section className="py-10 sm:py-14">
        <Container>
          <h1 className="text-3xl font-semibold">Gallery</h1>
          <p className="mt-3 max-w-prose text-neutral-700">
            A few examples of recent work. Click any image to enlarge.
          </p>

          <div className="mt-8">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-800">
                {error}
              </div>
            )}

            {!items && !error && (
              <p className="text-neutral-500">Loading images…</p>
            )}

            {items && <GalleryGrid items={items} />}
          </div>
        </Container>
      </section>
    </>
  );
}
