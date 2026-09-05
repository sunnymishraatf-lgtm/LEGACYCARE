"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Is LegacyCare legally binding?",
    a: "No. LegacyCare is a planning and coordination platform. It does not replace a legally valid will, legal advice, or official government processes. We recommend consulting with a legal professional for binding documents.",
  },
  {
    q: "Who can access my plan?",
    a: "Only you and the nominees you explicitly invite can access your plan. You control permission levels: View Only, Full Access, or Execution Access. All access is logged for security.",
  },
  {
    q: "How is my data protected?",
    a: "We use industry-standard encryption, secure authentication, and role-based access control. Sensitive documents are stored securely and never exposed through public URLs. All access is audited.",
  },
  {
    q: "Can I update my plan after finalizing?",
    a: "Yes. You can update your plan at any time. Major changes create version history, so previous versions are never lost. We recommend reviewing your plan every 6 months.",
  },
  {
    q: "Does LegacyCare verify deaths?",
    a: "No. LegacyCare does not provide legal death verification. Our platform manages authorized access to your instructions. Death verification must be handled through official channels.",
  },
  {
    q: "What happens if I forget to update my plan?",
    a: "We send customizable reminders to review your plan, documents, and nominees. You can set recurring reminders (e.g., every 6 months) to keep everything current.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 md:py-48 bg-paper text-ink overflow-hidden">
      <div className="section-padding max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-24"
        >
          <h2 className="font-display text-step-3 md:text-step-4 font-black">
            QUESTIONS?
            <br />
            ANSWERS.
          </h2>
        </motion.div>

        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              className="border-b border-paper-raised"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-6 md:py-8 text-left group"
              >
                <span className="font-display text-step-0 md:text-step-1 font-bold pr-8 group-hover:text-editorial-red transition-colors">
                  {faq.q}
                </span>
                <span className="flex-shrink-0">
                  {openIndex === i ? (
                    <Minus className="w-5 h-5 text-ink-secondary" />
                  ) : (
                    <Plus className="w-5 h-5 text-ink-secondary" />
                  )}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 md:pb-8 text-step-0 text-ink-secondary leading-relaxed max-w-2xl">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
