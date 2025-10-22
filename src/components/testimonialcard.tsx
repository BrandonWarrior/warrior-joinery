import React from "react";

type Props = {
  quote: string;
  name: string;
  location?: string;
};

export default function TestimonialCard({ quote, name, location }: Props) {
  return (
    <figure className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <blockquote className="text-neutral-800">“{quote}”</blockquote>
      <figcaption className="mt-3 text-sm text-neutral-600">
        — {name}{location ? `, ${location}` : ""}
      </figcaption>
    </figure>
  );
}
