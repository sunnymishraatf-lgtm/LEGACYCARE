import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Terms of Service | LegacyCare" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      introduction="These terms apply to your use of the LegacyCare demonstration website and its planning, provider, signup, and login experiences."
      sections={[
        {
          title: "Demonstration use",
          paragraphs: [
            "The current website is a product demonstration. Features, provider listings, accounts, availability, reviews, prices, and planning records may contain fictional or temporary information and should not be relied upon for real-world arrangements.",
          ],
        },
        {
          title: "Acceptable use",
          paragraphs: [
            "You may use the site to evaluate and demonstrate its interface. You must not misuse the service, attempt unauthorized access, disrupt its operation, or submit unlawful or harmful content.",
            "Because demo registrations are stored in browser storage, you should use sample information and a password that you do not use for any real account.",
          ],
        },
        {
          title: "Provider information",
          paragraphs: [
            "Demo provider profiles are illustrative only. LegacyCare does not guarantee that a displayed provider, service, price, review, rating, verification label, or availability is real or currently offered.",
          ],
        },
        {
          title: "No professional relationship",
          paragraphs: [
            "Using LegacyCare does not create a legal, medical, fiduciary, funeral-service, or other professional relationship. Obtain qualified professional advice for decisions that require it.",
          ],
        },
        {
          title: "Availability and changes",
          paragraphs: [
            "The demo is provided as available and may be changed, suspended, reset, or removed without notice. Locally stored demo accounts and data may be lost when browser storage is cleared or the implementation changes.",
          ],
        },
      ]}
    />
  );
}
