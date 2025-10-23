import { Link } from "react-router-dom";
import Container from "../components/container";
import SEO from "../components/seo";

export default function Home() {
  return (
    <>
      <SEO
        title="Home"
        description="Specialist in internal door installation and repairs across West Yorkshire."
      />
      <section className="py-16">
        <Container>
          <h1 className="text-3xl font-semibold">Internal Door Installation & Repairs</h1>
          <p className="mt-3 max-w-prose text-neutral-700">
            I provide neat, reliable work at sensible prices. I fit new internal doors,
            repair sticking or rubbing doors, and sort latches, handles, and hinges.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/contact" className="btn-primary inline-flex">Get a Free Quote</Link>
            <Link to="/services" className="link text-neutral-800">View Services</Link>
          </div>
        </Container>
      </section>
    </>
  );
}
