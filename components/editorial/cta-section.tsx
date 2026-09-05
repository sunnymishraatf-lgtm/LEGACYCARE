"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 md:py-48 bg-ground overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center image-editorial"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-ground/80" />
      </div>

      <div className="relative z-10 section-padding max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-step-4 md:text-step-5 font-black text-snow-100 mb-8">
            MAKE YOUR WISHES CLEAR.
          </h2>
          <p className="text-step-1 text-snow-100/80 mb-12 max-w-xl mx-auto leading-relaxed">
            Plan today. Give your family clarity tomorrow.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-10 py-5 text-sm font-bold uppercase tracking-widest bg-action text-ground hover:bg-snow-100 transition-colors"
          >
            Create My Plan
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
