import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daniel Dominic — portfolio coming soon",
  description: "The portfolio of Daniel Dominic is coming soon.",
  // Site-wide until Phase 5 (Sprint 0 Q5): every page inherits it from here.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        {children}
      </body>
    </html>
  );
}
