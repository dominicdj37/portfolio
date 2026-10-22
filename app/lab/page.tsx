import type { Metadata } from "next";

import { LabPreview } from "@/components/lab/lab-preview";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Lab",
  description: "Engineering Lab: interactive experiments, coming soon.",
};

export default function LabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Lab"
        title="Engineering Lab"
        lead="Interactive experiments, coming soon."
      />
      <Container className="py-12 md:py-16">
        <LabPreview />
        <div className="mt-8">
          <ArrowLink href="/work">Back to Work</ArrowLink>
        </div>
      </Container>
    </>
  );
}
