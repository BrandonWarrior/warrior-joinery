import React from "react";
import Container from "../container";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-white">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          {/* Text content */}
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Internal Door Installation & Repairs
            </h1>
            <p className="mt-4 max-w-prose text-neutral-700">
              Neat, reliable work at sensible prices. New doors fitted, sticking
              doors sorted, and hinges replaced.{" "}
              <span className="whitespace-nowrap">
                Made to Measure, Done Properly.
              </span>
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/contact" className="btn-primary">
                Get a Free Quote
              </Link>
              <Link
                to="/services"
                className="link text-sm font-medium text-neutral-800"
              >
                View Services
              </Link>
            </div>
          </div>

          {/* Temporary visual placeholder (replace with photo later) */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-cream">
            <svg
              viewBox="0 0 400 300"
              className="h-full w-full"
              role="img"
              aria-label="Illustration of an internal door"
            >
              <rect width="400" height="300" fill="#F5F3EF" />
              <rect
                x="120"
                y="40"
                width="160"
                height="220"
                rx="8"
                fill="#2C5E7A"
                opacity="0.15"
              />
              <circle cx="265" cy="150" r="6" fill="#2C5E7A" opacity="0.6" />
              <text
                x="200"
                y="285"
                textAnchor="middle"
                fontSize="14"
                fill="#6B7280"
              >
                Door fitting & repairs
              </text>
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
}
