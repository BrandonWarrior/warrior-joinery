import React from "react";
import Container from "../components/Container";
import SEO from "../components/SEO";

export default function Privacy() {
  return (
    <>
      <SEO title="Privacy" />
      <section className="py-12">
        <Container>
          <h1 className="text-2xl font-semibold">Privacy Policy</h1>
          <p className="mt-2 text-neutral-700">
            We only use your details to respond to your enquiry and to provide quotes.
          </p>
        </Container>
      </section>
    </>
  );
}
