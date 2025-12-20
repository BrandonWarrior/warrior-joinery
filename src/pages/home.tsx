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
                I provide neat, reliable work at sensible prices. I fit new internal
                doors, repair sticking or rubbing doors, and sort latches, handles,
                and hinges.
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
                <span>✓ Clean, tidy finish</span>
                <span>✓ Clear communication</span>
                <span>✓ Done properly</span>
              </div>
            </div>

            {/* Right: proof panel */}
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-medium">What I do</h2>

              <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                <li>• Internal door fitting & repairs</li>
                <li>• Hinges, handles & latches</li>
                <li>• Fire door installation (L2)</li>
                <li>• Fitted furniture & finish carpentry</li>
              </ul>

              <div className="mt-6 border-t border-black/5 pt-4">
                <p className="text-sm font-medium">Why choose Warrior Joinery</p>
                <p className="mt-2 text-sm text-neutral-600">
                  Over 7 years’ experience, tidy workmanship, and a straightforward,
                  no-nonsense approach from start to finish.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="border-t border-black/5 py-12">
        <Container>
          <h2 className="text-xl font-semibold">Services</h2>
          <p className="mt-2 text-sm text-neutral-600">
            A few of the most common jobs I’m booked for.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-black/10 p-5">
              <h3 className="font-medium">Internal doors</h3>
              <p className="mt-2 text-sm text-neutral-700">
                Fitting, trimming, hinges, handles, latches, and repairs.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 p-5">
              <h3 className="font-medium">Fitted furniture</h3>
              <p className="mt-2 text-sm text-neutral-700">
                Wardrobes, alcove units, shelving, and made-to-measure storage.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 p-5">
              <h3 className="font-medium">Finish carpentry</h3>
              <p className="mt-2 text-sm text-neutral-700">
                Skirting, architrave, boxing-in, and clean finishing details.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* TRUST STRIP */}
      <section className="py-12">
        <Container>
          <div className="grid gap-8 md:grid-cols-[160px_1fr] md:items-center">
            <div className="flex justify-center md:justify-start">
              <div className="rounded-full p-1 ring-1 ring-black/10 shadow-sm">
                <img
                  src="/images/profile-pic.jpg"
                  alt="Brandon Warrior – Founder of Warrior Joinery"
                  className="h-28 w-28 rounded-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Built properly, finished cleanly.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-700">
                I’m Brandon, a multi-skilled joiner with over seven years’ experience.
                I take pride in tidy workmanship, clear communication, and doing things
                properly from start to finish.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link to="/about" className="link text-neutral-800 text-sm">
                  Read more about me →
                </Link>
                <Link to="/gallery" className="link text-neutral-800 text-sm">
                  View recent work →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
