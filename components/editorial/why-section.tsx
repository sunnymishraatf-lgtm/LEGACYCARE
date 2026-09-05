"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function WhySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 md:py-48 bg-ground overflow-hidden">
      <div className="section-padding max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-display text-step-4 md:text-step-5 font-black text-snow-100 leading-none">
              WHEN THE MOMENT COMES,
              <br />
              YOUR FAMILY SHOULDN&apos;T
              <br />
              HAVE TO GUESS.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="space-y-8"
          >
            <p className="text-step-1 text-snow-100/80 leading-relaxed">
              LegacyCare helps you prepare clear, thoughtful instructions in
              advance — so the people you trust know what matters.
            </p>
            <p className="text-step-0 text-snow-100/60 leading-relaxed">
              From funeral preferences to cultural rituals, from trusted nominees
              to important documents, everything is organized in one secure place.
              Your wishes, your way.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="h-px flex-1 bg-line" />
              <span className="font-mono text-xs text-snow-100/40 uppercase tracking-widest">
                Prepare what matters
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
