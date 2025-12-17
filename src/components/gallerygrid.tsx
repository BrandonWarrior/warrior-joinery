import { useCallback, useMemo, useState } from "react";
import Lightbox from "./media/lightbox";

export type GalleryItem = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  srcSet?: { src: string; width: number }[];
};

type Props = { items: GalleryItem[] };

export default function GalleryGrid({ items }: Props) {
  const [index, setIndex] = useState<number | null>(null);

  const open = useCallback((i: number) => setIndex(i), []);
  const close = useCallback(() => setIndex(null), []);
  const onPrev = useCallback(
    () => setIndex((i) => (i === null ? null : (i + items.length - 1) % items.length)),
    [items.length]
  );
  const onNext = useCallback(
    () => setIndex((i) => (i === null ? null : (i + 1) % items.length)),
    [items.length]
  );

  const lightboxItem = useMemo(() => (index === null ? null : items[index]), [index, items]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {items.map((item, i) => {
          const haveSet = item.srcSet && item.srcSet.length > 0;
          const srcSet = haveSet ? item.srcSet!.map((s) => `${s.src} ${s.width}w`).join(", ") : undefined;
          const sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";

          return (
            <li key={`${item.src}-${i}`}>
              <button
                onClick={() => open(i)}
                className="group block w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-steel"
              >
                <figure className="relative">
                  <img
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    decoding="async"
                    srcSet={srcSet}
                    sizes={srcSet ? sizes : undefined}
                    className="aspect-[4/5] h-auto w-full object-cover transition-transform duration-200 group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                  {item.caption && (
                    <figcaption className="absolute bottom-0 left-0 right-0 bg-black/40 px-2 py-1 text-left text-xs text-white">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              </button>
            </li>
          );
        })}
      </ul>

      {lightboxItem && (
        <Lightbox
          isOpen={index !== null}
          onClose={close}
          onPrev={onPrev}
          onNext={onNext}
          src={(lightboxItem.srcSet && lightboxItem.srcSet[lightboxItem.srcSet.length - 1]?.src) || lightboxItem.src}
          alt={lightboxItem.alt}
          caption={lightboxItem.caption}
          index={index!}
          total={items.length}
        />
      )}
    </>
  );
}
