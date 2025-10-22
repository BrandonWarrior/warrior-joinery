import React from "react";
import Container from "../components/container";
import SEO from "../components/seo";
import CtaBand from "../components/sections/ctaband";

export default function Services() {
  return (
    <>
      <SEO
        title="Internal Door Installation & Repair"
        description="Expert internal door fitting and repairs. Made to measure, done properly."
      />

      {/* Intro */}
      <section className="bg-white">
        <Container className="py-12">
          <h1 className="text-3xl font-semibold">Internal Door Services</h1>
          <p className="mt-3 max-w-prose text-neutral-700">
            I specialise in internal doors only, so you get a tidy finish and a
            door that closes as it should.
          </p>
        </Container>
      </section>

      {/* What I do */}
      <section className="bg-white">
        <Container className="pb-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold">New doors supplied & fitted</h3>
              <p className="mt-2 text-neutral-700">
                Standard sizes or made-to-measure. Gaps even, latches aligned,
                smooth close.
              </p>
            </article>
            <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold">Repairs & adjustments</h3>
              <p className="mt-2 text-neutral-700">
                Trimming, rehanging, or fixing doors that rub, stick, or won’t
                latch properly.
              </p>
            </article>
            <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold">Hardware & fire doors</h3>
              <p className="mt-2 text-neutral-700">
                Handles, hinges, and latches replaced. Advice on FD30 fire-rated
                doors available.
              </p>
            </article>
          </div>
        </Container>
      </section>

      {/* What’s included */}
      <section className="bg-white">
        <Container className="py-8">
          <h2 className="text-2xl font-semibold">What’s included</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            <li className="rounded-lg border border-neutral-200 bg-white p-4">
              Precise measuring and tidy trimming
            </li>
            <li className="rounded-lg border border-neutral-200 bg-white p-4">
              Floor protection and a clean workspace
            </li>
            <li className="rounded-lg border border-neutral-200 bg-white p-4">
              Latch, keep, and hinge alignment
            </li>
            <li className="rounded-lg border border-neutral-200 bg-white p-4">
              Vacuum and tidy before I leave
            </li>
          </ul>
        </Container>
      </section>

      {/* Straightforward pricing */}
      <section className="bg-white">
        <Container className="py-8">
          <h2 className="text-2xl font-semibold">Straightforward pricing</h2>
          <p className="mt-2 max-w-prose text-neutral-700">
            I keep pricing clear and fair. Final price confirmed after a quick
            chat and a couple of photos.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-steel">Guide price</div>
              <div className="mt-1 text-lg font-semibold">Standard internal door</div>
              <p className="mt-1 text-neutral-700">£40 per door – supplied & fitted</p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-steel">Guide price</div>
              <div className="mt-1 text-lg font-semibold">Solid oak internal door</div>
              <p className="mt-1 text-neutral-700">£85 per door – supplied & fitted</p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-steel">Guide price</div>
              <div className="mt-1 text-lg font-semibold">Rehang or adjustment</div>
              <p className="mt-1 text-neutral-700">£30 per door</p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-steel">Guide price</div>
              <div className="mt-1 text-lg font-semibold">
                Handle, hinge, or latch replacement
              </div>
              <p className="mt-1 text-neutral-700">£20 per door</p>
            </div>
          </div>

          <p className="mt-2 text-sm text-neutral-500">
            Discounts available for multiple doors fitted or repaired in one visit.
          </p>
        </Container>
      </section>

      {/* Areas covered */}
      <section className="bg-white">
        <Container className="py-8">
          <h2 className="text-2xl font-semibold">Areas covered</h2>
          <p className="mt-2 text-neutral-700">
            Leeds and surrounding West Yorkshire — Horsforth, Morley, Pudsey,
            and nearby. If you’re just outside, get in touch.
          </p>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
