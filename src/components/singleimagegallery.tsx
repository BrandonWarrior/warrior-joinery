import { useCallback, useEffect, useMemo, useState } from "react";

export type SlideItem = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  srcSet?: { src: string; width: number }[];
};

type Props = {
  items: SlideItem[];
  initialIndex?: number; // default 0
};

export default function SingleImageGallery({ items, initialIndex = 0 }: Props) {
  const [index, setIndex] = useState(() =>
    Number.isFinite(initialIndex) && initialIndex! >= 0 && initialIndex! < items.length
      ? initialIndex!
      : 0
  );

  const total = items.length;
  const current = useMemo(() => items[index], [items, index]);

  const goPrev = useCallback(() => setIndex((i) => (i + total - 1) % total), [total]);
  const goNext = useCallback(() => setIndex((i) => (i + 1) % total), [total]);

  // Keyboard arrows: ←/→
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  // Prefetch neighbours for snappy navigation
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    const next = (index + 1) % total;
    const prev = (index + total - 1) % total;
    [items[next], items[prev]].forEach((it) => {
      const l = document.createElement("link");
      l.rel = "prefetch";
      l.as = "image";
      l.href = (it.srcSet && it.srcSet[it.srcSet.length - 1]?.src) || it.src;
      document.head.appendChild(l);
      links.push(l);
    });
    return () => links.forEach((l) => document.head.removeChild(l));
  }, [index, items, total]);

  if (total === 0) {
    return (
      <div className="py-20 text-center text-neutral-600">
        No images yet. Add some to <code className="rounded bg-neutral-100 px-1">public/images/doors</code>.
      </div>
    );
  }

  const haveSet = current.srcSet && current.srcSet.length > 0;
  const srcSet = haveSet ? current.srcSet!.map((s) => `${s.src} ${s.width}w`).join(", ") : undefined;
  const sizes = "100vw"; // single hero-style image

  return (
    <div className="mx-auto max-w-5xl px-4">
      {/* Top bar: position */}
      <div className="mb-3 flex items-center justify-between text-sm text-neutral-600">
        <span>
          Image <strong>{index + 1}</strong> of <strong>{total}</strong>
        </span>
        {current.caption && <span className="truncate">{current.caption}</span>}
      </div>

      {/* Image */}
      <figure className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow">
        <img
          src={current.src}
          alt={current.alt}
          width={current.width}
          height={current.height}
          loading="eager"
          decoding="async"
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          className="mx-auto h-auto w-full max-h-[70vh] object-contain"
        />
        {current.caption && (
          <figcaption className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2 text-sm text-white">
            {current.caption}
          </figcaption>
        )}

        {/* Nav buttons */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
          <button
            onClick={goPrev}
            aria-label="Previous image"
            className="pointer-events-auto rounded-full bg-white/90 px-3 py-2 text-lg font-semibold text-neutral-900 shadow
                       focus:outline-none focus:ring-2 focus:ring-steel"
          >
            ‹
          </button>
          <button
            onClick={goNext}
            aria-label="Next image"
            className="pointer-events-auto rounded-full bg-white/90 px-3 py-2 text-lg font-semibold text-neutral-900 shadow
                       focus:outline-none focus:ring-2 focus:ring-steel"
          >
            ›
          </button>
        </div>
      </figure>

      {/* Bottom controls */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={goPrev}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-800 shadow-sm
                     hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-steel"
        >
          Previous
        </button>
        <button
          onClick={goNext}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-800 shadow-sm
                     hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-steel"
        >
          Next
        </button>
      </div>
    </div>
  );
}
