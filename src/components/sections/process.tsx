import React from "react";
import Container from "../container";

const steps = [
  {
    title: "Quick quote",
    desc: "Send your door sizes or a few photos. We’ll confirm price and availability.",
  },
  {
    title: "Clean install",
    desc: "We protect floors, fit carefully, and tidy up before we leave.",
  },
  {
    title: "Check & adjust",
    desc: "Doors close smoothly and evenly — gaps and latches properly aligned.",
  },
];

export default function Process() {
  return (
    <section className="bg-white">
      <Container className="py-12">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li
              key={i}
              className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="text-sm font-semibold text-steel">
                Step {i + 1}
              </div>
              <div className="mt-1 text-lg font-semibold">{s.title}</div>
              <p className="mt-2 text-neutral-700">{s.desc}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
