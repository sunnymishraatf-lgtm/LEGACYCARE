"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const nominees = [
  {
    id: "01",
    role: "TRUSTED PERSON",
    access: "FULL ACCESS",
    desc: "Can view, edit, and execute all plan details when authorized.",
    color: "#D7FF3E",
  },
  {
    id: "02",
    role: "FAMILY",
    access: "VIEW ONLY",
    desc: "Can view plan details and receive updates. Cannot make changes.",
    color: "#EEF3F8",
  },
  {
    id: "03",
    role: "NOMINEE",
    access: "EXECUTION ACCESS",
    desc: "Authorized to activate and execute the plan when the time comes.",
    color: "#FF6B3D",
  },
];

export function TrustedSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
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
            TRUSTED PEOPLE,
            <br />
            CLEAR ROLES.
          </h2>
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
          onMouseMove={handleMouseMove}
        >
          {/* Mouse follow glow (desktop only) */}
          {!isTouch && (
            <div
              className="absolute pointer-events-none z-0 w-64 h-64 rounded-full opacity-10 blur-3xl transition-transform duration-100"
              style={{
                background: "radial-gradient(circle, #D7FF3E 0%, transparent 70%)",
                left: mousePos.x - 128,
                top: mousePos.y - 128,
              }}
            />
          )}

          {nominees.map((nominee, i) => (
            <motion.div
              key={nominee.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.15 }}
              className="relative z-10 border border-line p-8 md:p-10 bg-surface/50 backdrop-blur-sm hover:border-snow-100/30 transition-colors group"
            >
              <span
                className="font-mono text-step-3 font-bold block mb-6"
                style={{ color: nominee.color }}
              >
                {nominee.id}
              </span>
              <h3 className="font-display text-step-1 font-bold text-snow-100 mb-2 uppercase">
                {nominee.role}
              </h3>
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 mb-6"
                style={{
                  backgroundColor: `${nominee.color}15`,
                  color: nominee.color,
                  border: `1px solid ${nominee.color}30`,
                }}
              >
                {nominee.access}
              </span>
              <p className="text-step--1 text-snow-100/60 leading-relaxed">
                {nominee.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
