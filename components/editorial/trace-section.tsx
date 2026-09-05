"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

export function TraceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  const labels = [
    { text: "CLARITY", x: 15, y: 85 },
    { text: "TRUST", x: 40, y: 55 },
    { text: "DOCUMENTATION", x: 65, y: 35 },
    { text: "ACCESS", x: 88, y: 15 },
  ];

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
            THE PLAN,
            <br />
            TRACE BY TRACE.
          </h2>
        </motion.div>

        <div className="relative">
          <svg
            viewBox="0 0 1200 460"
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="traceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D7FF3E" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#D7FF3E" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#D7FF3E" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Background path */}
            <path
              d="M80 392 C150 340, 190 262, 240 200 C300 128, 330 158, 370 214 C400 258, 430 206, 470 172 C540 112, 610 126, 690 154 C760 180, 800 154, 860 124 C930 90, 1000 66, 1120 56"
              fill="none"
              stroke="rgba(238,243,248,0.1)"
              strokeWidth="2"
            />

            {/* Animated path */}
            <motion.path
              ref={pathRef}
              d="M80 392 C150 340, 190 262, 240 200 C300 128, 330 158, 370 214 C400 258, 430 206, 470 172 C540 112, 610 126, 690 154 C760 180, 800 154, 860 124 C930 90, 1000 66, 1120 56"
              fill="none"
              stroke="url(#traceGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ strokeDasharray: pathLength, strokeDashoffset: pathLength }}
              animate={isInView ? { strokeDashoffset: 0 } : {}}
              transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            />

            {/* Labels */}
            {labels.map((label, i) => (
              <motion.g
                key={label.text}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.3 }}
              >
                <circle
                  cx={`${label.x}%`}
                  cy={`${label.y}%`}
                  r="6"
                  fill="#0B0E12"
                  stroke="#D7FF3E"
                  strokeWidth="2"
                />
                <text
                  x={`${label.x}%`}
                  y={`${label.y - 5}%`}
                  textAnchor="middle"
                  fill="#EEF3F8"
                  fontSize="14"
                  fontFamily="Martian Mono, monospace"
                  fontWeight="bold"
                  letterSpacing="0.1em"
                >
                  {label.text}
                </text>
              </motion.g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
