import React, { useState, useEffect, useMemo, useRef } from "react";

type LightboxProps = {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
};

export default function Lightbox({ isOpen, onClose, src, alt }: LightboxProps) {
  if (!isOpen) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <figure
        className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-contain"
          loading="eager"
          decoding="async"
        />
        <figcaption className="p-3 text-center text-sm text-white/90">{alt}</figcaption>
      </figure>
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-md bg-white/90 px-3 py-1 text-sm font-medium text-neutral-900 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
      >
        Close
      </button>
    </div>
  );
}
