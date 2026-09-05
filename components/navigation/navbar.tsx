"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Shield } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/plans", label: "Plan" },
    { href: "/providers", label: "Providers" },
    { href: "/how-it-works", label: "How It Works" },
  ];

  const dashboardLink =
    session?.user?.role === "ADMIN"
      ? "/admin"
      : session?.user?.role === "PROVIDER"
      ? "/provider"
      : "/dashboard";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-ground/95 backdrop-blur-md border-b border-line"
          : "bg-transparent"
      }`}
    >
      <nav className="section-padding flex items-center justify-between h-16 md:h-20">
        <Link
          href="/"
          className="font-display text-lg md:text-xl font-bold tracking-tight text-snow-100 hover:text-action transition-colors"
        >
          LEGACYCARE
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium uppercase tracking-wider text-snow-100/80 hover:text-snow-100 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <>
              <Link
                href={dashboardLink}
                className="text-sm font-medium uppercase tracking-wider text-snow-100/80 hover:text-snow-100 transition-colors"
              >
                Dashboard
              </Link>
              {session.user?.role === "ADMIN" && (
                <Shield className="w-4 h-4 text-action" />
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium uppercase tracking-wider text-snow-100/60 hover:text-alert transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium uppercase tracking-wider text-snow-100/80 hover:text-snow-100 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-5 py-2 text-xs font-bold uppercase tracking-widest bg-action text-ground hover:bg-snow-100 transition-colors"
              >
                Create Plan
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-snow-100"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-surface border-t border-line">
          <div className="section-padding py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium uppercase tracking-wider text-snow-100/80 hover:text-snow-100 transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-line" />
            {session ? (
              <>
                <Link
                  href={dashboardLink}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium uppercase tracking-wider text-snow-100/80 hover:text-snow-100 transition-colors py-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="text-left text-sm font-medium uppercase tracking-wider text-snow-100/60 hover:text-alert transition-colors py-2"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium uppercase tracking-wider text-snow-100/80 hover:text-snow-100 transition-colors py-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center px-5 py-3 text-xs font-bold uppercase tracking-widest bg-action text-ground"
                >
                  Create Plan
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
