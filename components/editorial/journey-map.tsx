"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const zones = [
  {
    id: "A",
    title: "PLAN",
    subtitle: "Document Your Wishes",
    description: "Create a comprehensive plan covering funeral type, rituals, ceremony details, and personal preferences. Every detail matters.",
    steps: "08",
    status: "READY",
    color: "#D7FF3E",
  },
  {
    id: "B",
    title: "PEOPLE",
    subtitle: "Add Trusted Nominees",
    description: "Invite family members and trusted individuals. Set precise access levels so the right people have the right information.",
    steps: "∞",
    status: "FLEXIBLE",
    color: "#EEF3F8",
  },
  {
    id: "C",
    title: "SERVICES",
    subtitle: "Connect With Providers",
    description: "Browse verified funeral homes, florists, clergy, and transport services. Request quotes and manage bookings.",
    steps: "10+",
    status: "GROWING",
    color: "#FF6B3D",
  },
  {
    id: "D",
    title: "READY",
    subtitle: "Finalize & Rest Easy",
    description: "Review everything, finalize your plan, and know that your wishes are documented, secure, and accessible when needed.",
    steps: "01",
    status: "COMPLETE",
    color: "#D7FF3E",
  },
];

export function JourneyMap() {
  const [activeZone, setActiveZone] = useState("A");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const zone = zones.find((z) => z.id === activeZone)!;

  const transforms: Record<string, { fz: number; tx: number; ty: number }> = {
    A: { fz: 1, tx: 0, ty: 0 },
    B: { fz: 1.1, tx: -5, ty: -3 },
    C: { fz: 1.15, tx: -8, ty: -5 },
    D: { fz: 1.2, tx: -12, ty: -8 },
  };

  return (
    <section ref={ref} className="relative py-32 md:py-48 bg-ground overflow-hidden">
      <div className="section-padding max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-24"
        >
          <h2 className="font-display text-step-3 md:text-step-4 font-black text-snow-100">
            THE JOURNEY,
            <br />
            ZONE BY ZONE.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Map Area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="lg:col-span-8 relative aspect-[4/3] bg-surface border border-line overflow-hidden"
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: transforms[activeZone].fz,
                x: `${transforms[activeZone].tx}%`,
                y: `${transforms[activeZone].ty}%`,
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center image-editorial"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80')`,
                }}
              />
              <div className="absolute inset-0 bg-ground/60" />

              {/* Zone markers */}
              {zones.map((z, i) => {
                const positions = [
                  { x: 25, y: 30 },
                  { x: 55, y: 25 },
                  { x: 70, y: 55 },
                  { x: 40, y: 70 },
                ];
                const pos = positions[i];
                return (
                  <button
                    key={z.id}
                    onClick={() => setActiveZone(z.id)}
                    className="absolute group"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div
                      className={`w-12 h-12 md:w-16 md:h-16 border-2 flex items-center justify-center transition-all duration-300 ${
                        activeZone === z.id
                          ? "bg-action/20 border-action scale-110"
                          : "bg-surface/80 border-snow-100/30 hover:border-snow-100/60"
                      }`}
                    >
                      <span
                        className={`font-mono text-sm md:text-base font-bold ${
                          activeZone === z.id ? "text-action" : "text-snow-100"
                        }`}
                      >
                        {z.id}
                      </span>
                    </div>
                    <span
                      className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-opacity ${
                        activeZone === z.id ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                      }`}
                    >
                      {z.title}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </motion.div>

          {/* HUD Panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:col-span-4 flex flex-col"
          >
            <div className="border border-line bg-surface p-6 md:p-8 flex-1">
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-xs text-snow-100/40 uppercase tracking-widest">
                  Zone {zone.id}
                </span>
                <span
                  className="font-mono text-xs font-bold uppercase tracking-widest px-2 py-1"
                  style={{
                    backgroundColor: `${zone.color}15`,
                    color: zone.color,
                  }}
                >
                  {zone.status}
                </span>
              </div>

              <h3 className="font-display text-step-2 font-black text-snow-100 mb-2">
                {zone.title}
              </h3>
              <p className="text-step--1 text-snow-100/60 uppercase tracking-widest mb-6">
                {zone.subtitle}
              </p>

              <p className="text-step-0 text-snow-100/80 leading-relaxed mb-8">
                {zone.description}
              </p>

              <div className="border-t border-line pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-step-2 font-bold text-action block">
                      {zone.steps}
                    </span>
                    <span className="text-xs text-snow-100/40 uppercase tracking-widest">
                      {zone.id === "B" ? "People" : zone.id === "C" ? "Categories" : "Steps"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs text-snow-100/40 uppercase tracking-widest block">
                      Status
                    </span>
                    <span className="text-sm font-bold text-snow-100">{zone.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
