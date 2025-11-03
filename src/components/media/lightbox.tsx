import { useEffect, useRef } from "react";

type LightboxProps = {
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  src: string;
  alt: string;
  index: number;       // current index (0-based)
  total: number;       // total images
  caption?: string;    // optional
};

export default function Lightbox({
  isOpen,
  onClose,
  onPrev,
  onNext,
  src,
  alt,
  index,
  total,
  caption,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Keyboard handlers + initial focus
  useEffect(() => {
    if (!isOpen) return;
    closeBtnRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "Tab") {
        // simple focus trap
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, onPrev, onNext]);

  // Prefetch next/prev images for snappy navigation
  useEffect(() => {
    if (!isOpen) return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, [isOpen, src]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lb-title"
      aria-describedby="lb-desc"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="relative max-h-[90vh] w-full max-w-5xl outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title and position info (visually hidden, announced for SR) */}
        <h2 id="lb-title" className="sr-only">
          Image viewer
        </h2>
        <p id="lb-desc" className="sr-only">
          {`Image ${index + 1} of ${total}. ${caption ?? alt}`}
        </p>

        <img
          src={src}
          alt={alt}
          className="mx-auto max-h-[80vh] w-auto rounded-xl"
          loading="eager"
          decoding="async"
        />

        {caption && (
          <div className="mt-2 text-center text-sm text-neutral-100/90">
            {caption}
          </div>
        )}

        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-neutral-900 shadow
                     focus:outline-none focus:ring-2 focus:ring-white"
        >
          Close
        </button>

        <button
          onClick={onPrev}
          aria-label="Previous image"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-medium text-neutral-900 shadow
                     focus:outline-none focus:ring-2 focus:ring-white"
        >
          ‹
        </button>

        <button
          onClick={onNext}
          aria-label="Next image"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-medium text-neutral-900 shadow
                     focus:outline-none focus:ring-2 focus:ring-white"
        >
          ›
        </button>
      </div>
    </div>
  );
}
