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
            Send me a quick message below and I’ll reply within one working day. 
            Prefer a call? <a className="link" href="tel:+44">Call now</a> or email <a className="link" href="mailto:you@example.com">you@example.com</a>.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
          <p className="mt-6 text-sm text-neutral-500">
            Your details are used only to respond to your enquiry. No spam.
          </p>
        </Container>
      </section>
    </>
  );
}
