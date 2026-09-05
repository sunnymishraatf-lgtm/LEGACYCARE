import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "LegacyCare — Plan With Dignity. Give Your Family Clarity.",
  description:
    "LegacyCare is a private planning platform for documenting end-of-life and funeral preferences with dignity, clarity, and trust.",
  keywords: [
    "funeral planning",
    "end of life planning",
    "legacy planning",
    "funeral preferences",
    "advance planning",
  ],
  openGraph: {
    title: "LegacyCare — Plan With Dignity",
    description: "When the moment comes, your family shouldn't have to guess.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-ground text-snow-100 antialiased">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
