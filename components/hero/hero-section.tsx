"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative min-h-svh flex items-center justify-center overflow-hidden bg-ground">
      {/* Background Image Plate */}
      <motion.div
        initial={{ scale: 1.14 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center image-editorial"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-ground/60" />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 section-padding w-full max-w-7xl mx-auto py-24 md:py-28">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-16 items-center">
          {/* Left: Wordmark & Text */}
          <div className="min-w-0 space-y-8">
            <div className="w-full overflow-hidden">
              <motion.h1
                initial={{ y: "112%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.55,
                }}
                className="w-full max-w-full font-display text-step-4 sm:text-step-5 font-black text-snow-100 leading-[0.9]"
              >
                <span className="block whitespace-nowrap">LEGACY</span>
                <span className="block whitespace-nowrap">CARE</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ y: 70, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.95,
              }}
              className="text-step-1 md:text-step-2 font-body text-snow-100/90 max-w-lg leading-snug"
            >
              Plan with dignity.
              <br />
              Give your family clarity.
            </motion.p>

            <motion.div
              initial={{ y: 70, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
                delay: 1.25,
              }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-widest bg-action text-ground hover:bg-snow-100 transition-colors"
              >
                Create My Plan
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-widest border-2 border-snow-100/30 text-snow-100 hover:border-snow-100 hover:bg-snow-100/10 transition-all"
              >
                How It Works
              </Link>
            </motion.div>
          </div>

          {/* Right: Statistics */}
          <motion.div
            initial={{ y: 70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: 1.35,
            }}
            className="min-w-0 grid grid-cols-2 gap-6"
          >
            {[
              { num: "01", label: "Plan" },
              { num: "08", label: "Steps" },
              { num: "04", label: "Access Zones" },
              { num: "∞", label: "Updates" },
            ].map((stat, i) => (
              <div
                key={i}
                className="border border-line p-6 md:p-8 bg-surface/50 backdrop-blur-sm"
              >
                <span className="font-mono text-step-3 md:text-step-4 font-bold text-action block">
                  {stat.num}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-snow-100/60 mt-2 block">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ground to-transparent z-10" />
    </section>
  );
}
