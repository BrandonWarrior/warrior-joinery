import { useEffect, useState } from "react";
import Container from "../components/container";
import SEO from "../components/seo";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch("/api/gallery");
        if (!res.ok) throw new Error("Failed to fetch gallery images");
        const data = await res.json();
        setImages(data.resources || []);
      } catch (err: any) {
        console.error("Gallery fetch failed:", err);
        setError(err.message);
      }
    }
    fetchImages();
  }, []);

  return (
    <>
      <SEO
        title="Gallery"
        description="A selection of recent internal door installations and repairs completed across West Yorkshire."
      />
      <section className="py-10 sm:py-14">
        <Container>
          <h1 className="text-3xl font-semibold mb-3">Gallery</h1>
          <p className="max-w-prose text-neutral-700 mb-6">
            A few examples of recent work. Click any image to enlarge.
          </p>

          {error && (
            <p className="text-red-600">Error: {error}</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((img) => (
              <figure
                key={img.public_id}
                className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100"
              >
                <img
                  src={img.secure_url}
                  alt={img.context?.custom?.caption || "Work example"}
                  className="w-full h-auto object-cover"
                />
                {img.context?.custom?.caption && (
                  <figcaption className="p-2 text-sm text-neutral-700">
                    {img.context.custom.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
