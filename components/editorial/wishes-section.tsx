"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X } from "lucide-react";

const hotspots = [
  { id: "rituals", label: "01 RITUALS", x: 32, y: 28, desc: "Religious and cultural ceremonies that honor your beliefs and traditions." },
  { id: "ceremony", label: "02 CEREMONY", x: 58, y: 22, desc: "The structure and flow of your memorial or funeral service." },
  { id: "music", label: "03 MUSIC", x: 22, y: 55, desc: "Songs, hymns, or instrumental pieces that hold meaning for you." },
  { id: "flowers", label: "04 FLOWERS", x: 72, y: 48, desc: "Floral arrangements, colors, and styles you prefer." },
  { id: "clothing", label: "05 CLOTHING", x: 45, y: 68, desc: "Attire preferences for yourself and requests for guests." },
  { id: "location", label: "06 LOCATION", x: 80, y: 72, desc: "Venue preferences, whether church, chapel, or outdoor setting." },
  { id: "services", label: "07 SERVICES", x: 15, y: 78, desc: "Specific providers and services you want to engage." },
  { id: "message", label: "08 PERSONAL MESSAGE", x: 62, y: 85, desc: "Words you want to leave behind for your loved ones." },
];

export function WishesSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const activeHotspot = hotspots.find((h) => h.id === activeId);

  return (
    <section ref={ref} className="relative py-32 md:py-48 bg-ground overflow-hidden">
      <div className="section-padding max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <h2 className="font-display text-step-3 md:text-step-4 font-black text-snow-100">
            YOUR WISHES,
            <br />
            EVERY DETAIL.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative aspect-[16/10] bg-surface border border-line overflow-hidden"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center image-editorial"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-ground/50" />

          {/* Hotspots */}
          {hotspots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => setActiveId(activeId === spot.id ? null : spot.id)}
              className="absolute z-10 group"
              style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: "translate(-50%, -50%)" }}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-action rounded-full animate-pulse" />
                <div className="absolute inset-0 w-4 h-4 bg-action rounded-full animate-ping opacity-30" />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-widest text-snow-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-ground/80 px-2 py-1">
                  {spot.label}
                </span>
              </div>
            </button>
          ))}

          {/* Popover */}
          <AnimatePresence>
            {activeHotspot && (
              <motion.div
                initial={{ clipPath: "inset(100% 0 0 0)", opacity: 0 }}
                animate={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
                exit={{ clipPath: "inset(100% 0 0 0)", opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-0 left-0 right-0 z-20 bg-surface/95 backdrop-blur-md border-t border-line p-6 md:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs text-action font-bold block mb-2">
                      {activeHotspot.label}
                    </span>
                    <p className="text-step-0 text-snow-100/80 max-w-2xl">
                      {activeHotspot.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveId(null)}
                    className="p-2 text-snow-100/60 hover:text-snow-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
