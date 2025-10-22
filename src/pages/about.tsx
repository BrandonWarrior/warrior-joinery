import React from "react";
import Container from "../components/Container";
import SEO from "../components/SEO";

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description="Straightforward joinery with a tidy finish. Internal doors done properly."
      />
      <section className="py-12">
        <Container>
          <h1 className="text-2xl font-semibold">About</h1>
          <p className="mt-2 text-neutral-700 max-w-prose">
            Warrior Joinery focuses on one thing and does it well: internal doors.
            Expect clear communication, punctual arrivals, and clean workmanship.
          </p>
        </Container>
      </section>
    </>
  );
}
