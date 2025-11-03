import { useEffect, useState } from "react";
import Container from "../components/container";
import SEO from "../components/seo";
import GalleryGrid, { type GalleryItem } from "../components/gallerygrid";

export default function GalleryPage() {
  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://warrior-joinery-eb793f26e853.herokuapp.com";

  // Local fallback (works even if API is down)
  const fallbackItems: GalleryItem[] = [
    { src: "/images/doors/door-01.jpg", alt: "Oak internal door freshly hung with brushed handle." },
    { src: "/images/doors/door-02.jpg", alt: "White panel door aligned with clean gaps." },
    { src: "/images/doors/door-03.jpg", alt: "Glazed internal door with tidy hinges and latch." },
    { src: "/images/doors/door-04.jpg", alt: "Oak door close-up showing clean chiselling and finish." },
    { src: "/images/doors/door-05.jpg", alt: "Re-hung door closing smoothly without rubbing." },
    { src: "/images/doors/door-06.jpg", alt: "Handle and latch fitted neatly on newly installed door." },
  ];

  const [items, setItems] = useState<GalleryItem[]>(fallbackItems);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/gallery", { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const j = await res.json();
        if (Array.isArray(j?.items) && j.items.length) {
          setItems(j.items);
        }
      } catch (e: any) {
        if (e?.name !== "AbortError") setErr("Couldn’t load latest photos. Showing local examples.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
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
          <h1 className="text-3xl font-semibold">Recent Work</h1>
          <p className="mt-3 max-w-prose text-neutral-700">
            A few examples of neat, reliable door fitting and repairs.
          </p>

          {/* Status */}
          <div className="mt-4" aria-live="polite">
            {loading && (
              <p className="text-sm text-neutral-600">Loading photos…</p>
            )}
            {!loading && err && (
              <p className="text-sm text-amber-700">{err}</p>
            )}
          </div>

          <div className="mt-8">
            <GalleryGrid items={items} />
          </div>
        </Container>
      </section>
    </>
  );
}
