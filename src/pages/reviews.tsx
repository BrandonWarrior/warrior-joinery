import React from "react";
import Container from "../components/container";
import SEO from "../components/seo";
import TestimonialCard from "../components/testimonialcard";

export default function Reviews() {
  return (
    <>
      <SEO title="Reviews" description="What customers say about my work." />
      <section className="bg-white">
        <Container className="py-12">
          <h1 className="text-3xl font-semibold">Reviews</h1>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <TestimonialCard
              quote="Turned up on time, fitted two doors, and left the place spotless. Both close perfectly."
              name="Sophie M."
              location="Leeds"
            />
            <TestimonialCard
              quote="Rehung three doors after new carpets — neat job and sensible price."
              name="David R."
              location="Morley"
            />
            <TestimonialCard
              quote="Sorted a sticky latch and replaced hinges. Quick, tidy, and polite."
              name="Hannah P."
              location="Horsforth"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
