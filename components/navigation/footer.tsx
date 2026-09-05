"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-line">
      <div className="section-padding py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="font-display text-2xl font-bold tracking-tight text-snow-100"
            >
              LEGACYCARE
            </Link>
            <p className="mt-4 text-snow-100/60 max-w-md leading-relaxed">
              A private planning and coordination platform for documenting
              personal end-of-life and funeral preferences with dignity and
              clarity.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-snow-100/40 mb-6">
              Platform
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/plans", label: "Create Plan" },
                { href: "/providers", label: "Providers" },
                { href: "/how-it-works", label: "How It Works" },
                { href: "/about", label: "About" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-snow-100/70 hover:text-snow-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-snow-100/40 mb-6">
              Legal
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/disclaimer", label: "Disclaimer" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-snow-100/70 hover:text-snow-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-line">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-xs text-snow-100/40">
              &copy; {new Date().getFullYear()} LegacyCare. All rights reserved.
            </p>
            <p className="text-xs text-snow-100/40 max-w-lg">
              LegacyCare is a planning and coordination platform. It does not
              replace a legally valid will, legal advice, medical advice, or
              official government processes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
