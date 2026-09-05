import { HeroSection } from "@/components/hero/hero-section";
import { WhySection } from "@/components/editorial/why-section";
import { PlanScrollSection } from "@/components/editorial/plan-scroll";
import { TraceSection } from "@/components/editorial/trace-section";
import { WishesSection } from "@/components/editorial/wishes-section";
import { TrustedSection } from "@/components/editorial/trusted-section";
import { JourneyMap } from "@/components/editorial/journey-map";
import { FAQSection } from "@/components/editorial/faq-section";
import { CTASection } from "@/components/editorial/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhySection />
      <PlanScrollSection />
      <TraceSection />
      <WishesSection />
      <TrustedSection />
      <JourneyMap />
      <FAQSection />
      <CTASection />
    </>
  );
}
