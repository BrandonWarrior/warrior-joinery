import React from "react";
import Container from "../components/Container";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <SEO title="Page not found" />
      <section className="py-16">
        <Container>
          <h1 className="text-2xl font-semibold">404 — Page not found</h1>
          <p className="mt-2 text-neutral-700">That page doesn’t exist.</p>
          <Link to="/" className="btn-primary mt-6 inline-flex">Back to Home</Link>
        </Container>
      </section>
    </>
  );
}
