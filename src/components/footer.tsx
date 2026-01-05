import { NavLink } from "react-router-dom";

export default function Footer() {
  const linkClass = "hover:text-neutral-900 transition-colors";

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="container-safe py-6 text-sm text-neutral-600">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          
          {/* Left */}
          <p>
            © {new Date().getFullYear()} Warrior Joinery. All rights reserved.
          </p>

          {/* Right */}
          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-4">
              {/* Internal links */}
              <li>
                <NavLink to="/privacy" className={linkClass}>
                  Privacy
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={linkClass}>
                  Contact
                </NavLink>
              </li>

              {/* Divider */}
              <li className="hidden sm:block text-neutral-300">|</li>

              {/* Social links */}
              <li>
                <a
                  href="https://www.linkedin.com/in/brandon-warrior-713314304"
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  LinkedIn
                </a>
              </li>

              {/* add later
              <li>
                <a
                  href="https://www.instagram.com/myhandle"
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  Instagram
                </a>
              </li>
              */}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
