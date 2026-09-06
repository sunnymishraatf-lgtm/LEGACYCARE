import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Disclaimer | LegacyCare" };

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      introduction="LegacyCare helps demonstrate how personal wishes and end-of-life planning information could be organized. It is not a substitute for professional or legally recognized services."
      sections={[
        {
          title: "Not legal advice",
          paragraphs: [
            "Content entered into or displayed by LegacyCare is not a will, trust, advance directive, power of attorney, contract, or other legally binding instrument. Consult a qualified lawyer about the requirements in your jurisdiction.",
          ],
        },
        {
          title: "Not medical advice",
          paragraphs: [
            "LegacyCare does not provide medical advice, diagnosis, emergency assistance, or healthcare instructions. Discuss medical decisions and advance-care planning with qualified healthcare professionals.",
          ],
        },
        {
          title: "Demo providers and pricing",
          paragraphs: [
            "Provider names, profiles, reviews, verification labels, service descriptions, availability, and prices in this demo are fictional examples. Do not use them to make purchases or contact real service providers.",
          ],
        },
        {
          title: "No emergency use",
          paragraphs: [
            "Do not use this website for emergencies or time-critical arrangements. Contact local emergency services, authorities, healthcare providers, or licensed funeral professionals as appropriate.",
          ],
        },
        {
          title: "No warranty",
          paragraphs: [
            "The demonstration is provided for evaluation purposes without guarantees of accuracy, completeness, continuous availability, data retention, or fitness for a particular purpose.",
          ],
        },
      ]}
    />
  );
}
