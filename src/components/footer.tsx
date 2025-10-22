import React from "react";
import { NavLink } from "react-router-dom";

export default function Footer() {
  const item = "link";
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="container-safe py-6 text-sm text-neutral-600">
        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Warrior Joinery. All rights reserved.</p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-4">
              <li><NavLink to="/privacy" className={item}>Privacy</NavLink></li>
              <li><NavLink to="/contact" className={item}>Contact</NavLink></li>
              <li><NavLink to="/reviews" className={item}>Reviews</NavLink></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
