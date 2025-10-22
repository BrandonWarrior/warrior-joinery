import React from "react";
import Container from "../components/container";
import SEO from "../components/seo";

export default function ThankYou() {
  return (
    <>
      <SEO title="Thank you" />
      <section className="py-12">
        <Container>
          <h1 className="text-2xl font-semibold">Thanks — we’ll be in touch shortly.</h1>
        </Container>
      </section>
    </>
  );
}
