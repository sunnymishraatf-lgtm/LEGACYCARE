"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const stages = [
  {
    id: 1,
    title: "PERSONAL",
    description: "Document your basic information, contact details, and location preferences.",
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1200&q=80",
  },
  {
    id: 2,
    title: "FUNERAL",
    description: "Specify your preferred funeral type, location, and any special arrangements.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80",
  },
  {
    id: 3,
    title: "RITUALS",
    description: "Detail religious, cultural, or personal rituals that matter to you.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",
  },
  {
    id: 4,
    title: "CEREMONY",
    description: "Choose music, flowers, decorations, and the atmosphere you envision.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
  },
  {
    id: 5,
    title: "SERVICES",
    description: "Browse and select trusted service providers in your area.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
  },
  {
    id: 6,
    title: "DOCUMENTS",
    description: "Securely upload and store important documents and instructions.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80",
  },
  {
    id: 7,
    title: "NOMINEE",
    description: "Add trusted people who can access your plan when the time comes.",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&q=80",
  },
  {
    id: 8,
    title: "FINALIZE",
    description: "Review everything, make it official, and rest easy knowing it's done.",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&q=80",
  },
];

export function PlanScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const index = Math.min(
        Math.floor(v * stages.length),
        stages.length - 1
      );
      setActiveIndex(index);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section ref={containerRef} className="relative" style={{ height: `${stages.length * 100}vh` }}>
      <div className="sticky top-0 h-svh overflow-hidden bg-ground">
        {/* Background Images */}
        <div className="absolute inset-0">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.id}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: i === activeIndex ? 1 : 0,
                scale: i === activeIndex ? 1 : 1.05,
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center image-editorial"
                style={{ backgroundImage: `url('${stage.image}')` }}
              />
              <div className="absolute inset-0 bg-ground/70" />
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center section-padding">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Progress Index */}
            <div className="lg:col-span-3 hidden lg:flex flex-col gap-4">
              {stages.map((stage, i) => (
                <div
                  key={stage.id}
                  className={`flex items-center gap-4 transition-all duration-500 ${
                    i === activeIndex ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <span
                    className={`font-mono text-sm font-bold ${
                      i === activeIndex ? "text-action" : "text-snow-100/50"
                    }`}
                  >
                    {String(stage.id).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${
                      i === activeIndex ? "text-snow-100" : "text-snow-100/50"
                    }`}
                  >
                    {stage.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Stage Content */}
            <div className="lg:col-span-6">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="font-mono text-step-2 text-action font-bold block mb-4">
                  {String(stages[activeIndex].id).padStart(2, "0")}
                </span>
                <h3 className="font-display text-step-3 md:text-step-4 font-black text-snow-100 mb-6">
                  {stages[activeIndex].title}
                </h3>
                <p className="text-step-1 text-snow-100/80 leading-relaxed max-w-xl">
                  {stages[activeIndex].description}
                </p>
              </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="lg:col-span-3 flex lg:justify-end">
              <div className="flex items-center gap-4">
                <div className="w-32 h-1 bg-line overflow-hidden">
                  <motion.div
                    className="h-full bg-action"
                    style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
                  />
                </div>
                <span className="font-mono text-sm text-snow-100/60">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
