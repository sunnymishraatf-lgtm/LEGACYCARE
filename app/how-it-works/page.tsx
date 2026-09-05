import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Create Your Account", desc: "Sign up and verify your identity. Choose whether you're planning for yourself or registering as a service provider." },
  { num: "02", title: "Build Your Plan", desc: "Walk through our guided 10-step wizard. Document your funeral preferences, rituals, ceremony details, and budget." },
  { num: "03", title: "Add Trusted People", desc: "Invite family members and nominees. Set precise access levels so the right people see the right information." },
  { num: "04", title: "Connect Providers", desc: "Browse verified funeral homes, florists, clergy, and transport services. Request quotes and manage bookings." },
  { num: "05", title: "Upload Documents", desc: "Securely store important files. Control who can access what with granular permissions." },
  { num: "06", title: "Finalize & Rest Easy", desc: "Review everything, lock in your plan, and know your wishes are documented and accessible when needed." },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-paper pt-24 pb-12">
      <div className="section-padding max-w-4xl mx-auto">
        <div className="mb-16">
          <h1 className="font-display text-step-4 font-black text-ink mb-4">How It Works</h1>
          <p className="text-ink-secondary text-step-1">Six simple steps to give your family clarity.</p>
        </div>

        <div className="space-y-0">
          {steps.map((step, i) => (
            <div key={step.num} className="flex gap-8 py-8 border-b border-paper-raised last:border-0">
              <span className="font-mono text-step-2 font-bold text-action flex-shrink-0 w-16">{step.num}</span>
              <div>
                <h3 className="font-display text-step-1 font-bold text-ink mb-2">{step.title}</h3>
                <p className="text-ink-secondary leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-paper-soft border border-paper-raised">
          <h3 className="font-display text-step-1 font-bold text-ink mb-4">Important Note</h3>
          <p className="text-ink-secondary leading-relaxed">
            LegacyCare is a planning and coordination platform. It does not replace a legally valid will, 
            legal advice, medical advice, or official government processes. Users are responsible for ensuring 
            their instructions comply with applicable local laws.
          </p>
        </div>
      </div>
    </div>
  );
}
