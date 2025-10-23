
import Lightbox from "./media/lightbox";
import { useMemo } from "react";

export type GalleryItem = {
  id: string;
  alt: string;
  // You can later swap these for real files under /src/assets and keep the same shape.
  src: string;
  src2x?: string;
};

type Props = {
  items?: GalleryItem[];
  title?: string;
};

function placeholderSvg(label: string, w = 800, h = 600, tint = "#2C5E7A") {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>
    <rect width='100%' height='100%' fill='#F5F3EF'/>
    <rect x='40' y='40' width='${w - 80}' height='${h - 80}' rx='16' fill='${tint}' fill-opacity='0.15'/>
    <circle cx='${Math.floor(w * 0.65)}' cy='${Math.floor(h * 0.5)}' r='10' fill='${tint}' fill-opacity='0.6'/>
    <text x='50%' y='92%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, system-ui' font-size='22' fill='#6B7280'>${label}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function GalleryGrid({ items, title = "Recent work" }: Props) {
  const fallback = useMemo<GalleryItem[]>(
    () => [
      { id: "g1", alt: "Oak panel door fitted", src: placeholderSvg("Oak panel door fitted") },
      { id: "g2", alt: "Flush door rehung", src: placeholderSvg("Flush door rehung") },
      { id: "g3", alt: "Latch and hinges replaced", src: placeholderSvg("Latch & hinges replaced") },
      { id: "g4", alt: "Glazed internal door aligned", src: placeholderSvg("Glazed door aligned") },
      { id: "g5", alt: "Trimming to clear new carpet", src: placeholderSvg("Trimmed to clear carpet") },
      { id: "g6", alt: "Even gaps and smooth close", src: placeholderSvg("Even gaps, smooth close") },
    ],
    []
  );

  const data = items?.length ? items : fallback;

  const [active, setActive] = useState<GalleryItem | null>(null);

  return (
    <div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((it) => (
          <li key={it.id} className="group overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <button
              type="button"
              onClick={() => setActive(it)}
              className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-steel"
              aria-label={`Open image: ${it.alt}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.src}
                srcSet={it.src2x ? `${it.src} 1x, ${it.src2x} 2x` : undefined}
                alt={it.alt}
                className="h-56 w-full object-cover transition group-hover:scale-[1.02]"
                loading="lazy"
                decoding="async"
              />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        isOpen={!!active}
        onClose={() => setActive(null)}
        src={active?.src || ""}
        alt={active?.alt || ""}
      />
    </div>
  );
}
