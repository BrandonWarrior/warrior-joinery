import React from "react";
import Container from "../components/container";
import SEO from "../components/seo";
import ContactForm from "../components/forms/contactform";

export default function Contact() {
  return (
    <>
      <SEO title="Contact" description="Get in touch for internal door fitting or repairs." />
      <section className="bg-white">
        <Container className="py-12">
          <h1 className="text-3xl font-semibold">Get in touch</h1>
          <p className="mt-3 max-w-prose text-neutral-700">
            For quotes or questions, send me a quick message below or call directly. I aim to reply within one working day.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
