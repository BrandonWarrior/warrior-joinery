import React from "react";
import Container from "../container";

const faqs = [
  {
    q: "Do you supply doors?",
    a: "Yes — we can supply and fit, or fit doors you’ve already bought. We’ll make sure sizes are correct so nothing is over- or under-trimmed.",
  },
  {
    q: "Will there be much mess?",
    a: "Very little. We protect floors, cut carefully, and vacuum before we leave. All offcuts are removed.",
  },
  {
    q: "Which areas do you cover?",
    a: "Leeds and surrounding West Yorkshire — including Horsforth, Morley, and Pudsey. If you’re just outside, give us a ring.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-white">
      <Container className="py-12">
        <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-2 text-neutral-700">{f.a}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
