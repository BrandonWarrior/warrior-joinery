import React, { useState, useEffect, useMemo, useRef } from "react";
import { NavLink, Link } from "react-router-dom";

const linkClass =
  "text-sm font-medium text-neutral-800 hover:text-neutral-950 link";

export default function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="container-safe py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="flex items-center gap-2 link">
            <div className="h-8 w-8 rounded-md bg-steel" aria-hidden="true" />
            <div className="leading-tight">
              <p className="text-base font-semibold tracking-tight">Warrior Joinery</p>
              <p className="text-xs text-neutral-600">Made to Measure, Done Properly.</p>
            </div>
          </Link>

          <nav aria-label="Primary">
            <ul className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
              <li><NavLink to="/services" className={linkClass}>Services</NavLink></li>
              <li><NavLink to="/gallery" className={linkClass}>Gallery</NavLink></li>
              <li><NavLink to="/about" className={linkClass}>About</NavLink></li>
              <li className="md:ml-4">
                <NavLink to="/contact" className="btn-primary">Get a Free Quote</NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
