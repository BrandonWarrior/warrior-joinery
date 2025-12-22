// src/pages/home.tsx
import { Link } from "react-router-dom";
import Container from "../components/container";
import SEO from "../components/seo";

export default function Home() {
  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://warrior-joinery-eb793f26e853.herokuapp.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Warrior Joinery",
    url: siteUrl,
    image: `${siteUrl}/favicon.ico`,
    description: "Internal door installation and repairs across West Yorkshire.",
    areaServed: "West Yorkshire",
    priceRange: "££",
    sameAs: [],
  };

  return (
    <>
      <SEO
        title="Home"
        description="Specialist in internal door installation and repairs across West Yorkshire."
        canonical={`${siteUrl}/`}
        jsonLd={jsonLd}
      />

      {/* HERO (no image) */}
      <section className="py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            {/* Left: copy */}
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Internal Door Installation &amp; Repairs
              </h1>

              <p className="max-w-prose text-lg leading-8 text-neutral-700">
                I specialise in internal doors only — neat fitting, smooth closing,
                and a tidy finish. I supply and fit new doors, repair doors that stick
                or rub, and sort handles, hinges, and latches.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to="/contact" className="btn-primary inline-flex">
                  Get a Free Quote
                </Link>
                <Link to="/services" className="link text-neutral-800">
                  View Services
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600">
                <span>✓ Doors fitted properly</span>
                <span>✓ Clean, tidy finish</span>
                <span>✓ Clear communication</span>
              </div>
            </div>

            {/* Right: proof panel */}
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-medium">Internal door services</h2>

              <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                <li>• New doors supplied &amp; fitted</li>
                <li>• Repairs &amp; adjustments (sticking, rubbing, won’t latch)</li>
                <li>• Handles, hinges &amp; latches replaced</li>
                <li>• Advice on FD30 fire-rated doors</li>
              </ul>

              <div className="mt-6 border-t border-black/5 pt-4">
                <p className="text-sm font-medium">Why choose Warrior Joinery</p>
                <p className="mt-2 text-sm text-neutral-600">
                  Straightforward pricing, tidy workmanship, and doors that close as
                  they should — no drama.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SERVICES PREVIEW (aligned to your Services page) */}
      <section className="border-t border-black/5 py-12">
        <Container>
          <h2 className="text-xl font-semibold">What I do</h2>
          <p className="mt-2 text-sm text-neutral-600">
            A few of the most common internal door jobs I’m booked for.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-black/10 p-5">
              <h3 className="font-medium">New doors supplied &amp; fitted</h3>
              <p className="mt-2 text-sm text-neutral-700">
                Standard sizes or made-to-measure. Even gaps, smooth close, tidy finish.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 p-5">
              <h3 className="font-medium">Repairs &amp; adjustments</h3>
              <p className="mt-2 text-sm text-neutral-700">
                Trimming, rehanging, or fixing doors that rub, stick, or won’t latch properly.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 p-5">
              <h3 className="font-medium">Hardware &amp; fire doors</h3>
              <p className="mt-2 text-sm text-neutral-700">
                Handles, hinges, and latches replaced. Advice on FD30 fire-rated doors available.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link to="/services" className="link text-neutral-800 text-sm">
              View all internal door services →
            </Link>
          </div>
        </Container>
      </section>

      {/* TRUST STRIP (keep it general + relevant) */}
      <section className="py-12">
        <Container>
          <div className="grid gap-8 md:grid-cols-[160px_1fr] md:items-center">
            <div className="flex justify-center md:justify-start">
              <div className="rounded-full p-1 ring-1 ring-black/10 shadow-sm">
                <img
                  src="/images/profile-pic.jpg"
                  alt="Brandon Warrior – Warrior Joinery"
                  className="h-28 w-28 rounded-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold">A tidy job, done properly.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-700">
                I’m Brandon. I focus on internal doors and take pride in doing the job
                properly — clean fitting, clear communication, and leaving your home tidy.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link to="/services" className="link text-neutral-800 text-sm">
                  See services →
                </Link>
                <Link to="/contact" className="link text-neutral-800 text-sm">
                  Get a quote →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
