type LegalSection = {
  title: string;
  paragraphs: string[];
};

export function LegalPage({
  title,
  introduction,
  sections,
}: {
  title: string;
  introduction: string;
  sections: LegalSection[];
}) {
  return (
    <div className="min-h-screen bg-paper py-16 md:py-24">
      <article className="section-padding mx-auto max-w-4xl">
        <header className="border-b border-paper-raised pb-10">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-editorial-red">
            LegacyCare Legal
          </p>
          <h1 className="font-display text-step-4 font-black text-ink">{title}</h1>
          <p className="mt-5 max-w-3xl leading-relaxed text-ink-secondary">
            {introduction}
          </p>
          <p className="mt-4 text-xs uppercase tracking-wider text-ink-tertiary">
            Last updated: September 6, 2026
          </p>
        </header>

        <div className="space-y-10 pt-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-step-1 font-bold text-ink">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed text-ink-secondary">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
