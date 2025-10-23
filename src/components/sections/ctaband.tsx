import React, { useState, useEffect, useMemo, useRef } from "react";
import Container from "../container";
import { Link } from "react-router-dom";

export default function CtaBand() {
  return (
    <section className="bg-steel">
      <Container className="py-10">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Ready for a quick quote?</h2>
            <p className="mt-1 text-white/90">
              Send sizes or a few photos. We’ll confirm price and availability.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/contact" className="btn-primary bg-white text-neutral-900">
              Get a Free Quote
            </Link>
            <a href="tel:+44" className="btn-primary bg-white/10 text-white">
              Call Now
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
