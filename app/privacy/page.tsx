import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Privacy Policy | LegacyCare" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      introduction="This policy explains how the LegacyCare demonstration website handles information when you explore providers, create a demo account, or use the planning interface."
      sections={[
        {
          title: "Demo information",
          paragraphs: [
            "LegacyCare is currently presented as a demonstration. Demo signup details are stored only in your browser's local storage and are not sent to or retained in a production user database.",
            "Do not enter real passwords, confidential documents, medical information, financial information, or other sensitive personal data into the demo.",
          ],
        },
        {
          title: "Information used by the site",
          paragraphs: [
            "The demo may use the name, email address, account type, and temporary password you provide solely to demonstrate signup and login behavior on your device.",
            "Provider profiles shown on the website are fictional demonstration data. They do not represent endorsements or verified commercial listings.",
          ],
        },
        {
          title: "Cookies and sessions",
          paragraphs: [
            "The login flow uses a session cookie so the navigation and dashboard can display your demo login state. The cookie is used only for essential session functionality.",
          ],
        },
        {
          title: "Data control",
          paragraphs: [
            "You can remove locally stored demo registration data by clearing this site's browser storage. Signing out removes the active session state according to the browser and session settings.",
          ],
        },
        {
          title: "Future production services",
          paragraphs: [
            "If LegacyCare later introduces persistent accounts, document storage, payments, analytics, or third-party services, this policy should be updated before those services are made available.",
          ],
        },
      ]}
    />
  );
}
