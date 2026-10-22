import type { Metadata } from "next";

import { ContactLinks } from "@/components/ui/contact-links";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { site } from "@/data/site";
import { resumeAvailable } from "@/lib/resume";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email, phone, LinkedIn and GitHub for Daniel Dominic.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Contact"
        lead={site.contactHeadline}
      />
      <Container className="py-12 md:py-16">
        <ContactLinks
          className="max-w-3xl"
          channels={[
            "email",
            "phone",
            "linkedin",
            "github",
            ...(resumeAvailable ? (["resume"] as const) : []),
          ]}
        />
      </Container>
    </>
  );
}
