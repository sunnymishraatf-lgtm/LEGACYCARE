export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper pt-24 pb-12">
      <div className="section-padding max-w-3xl mx-auto">
        <h1 className="font-display text-step-4 font-black text-ink mb-8">About LegacyCare</h1>

        <div className="space-y-8 text-ink-secondary leading-relaxed">
          <p className="text-step-1">
            LegacyCare was built on a simple belief: when the moment comes, your family shouldn&apos;t have to guess.
          </p>

          <p>
            We provide a private, secure platform for documenting end-of-life and funeral preferences. 
            Our goal is to bring dignity, clarity, and peace of mind to one of life&apos;s most difficult conversations.
          </p>

          <p>
            Every feature is designed with sensitivity and respect. We never use fear-based messaging, 
            never pressure users into planning, and always prioritize privacy and security.
          </p>

          <div className="border-t border-paper-raised pt-8">
            <h2 className="font-display text-step-2 font-bold text-ink mb-4">What We Are Not</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>A will-writing platform</li>
              <li>A legal service</li>
              <li>A medical service</li>
              <li>A government service</li>
              <li>A death verification system</li>
              <li>An emergency service</li>
            </ul>
          </div>

          <div className="border-t border-paper-raised pt-8">
            <h2 className="font-display text-step-2 font-bold text-ink mb-4">What We Are</h2>
            <p>
              A private planning and coordination platform for documenting personal end-of-life and funeral preferences. 
              We help you organize your wishes so your loved ones have clear guidance when they need it most.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
