import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { WorkFilter } from "@/components/work/work-filter";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Android, AR/XR, backend and cross-platform projects by Daniel Dominic.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Projects"
        lead="Android, AR/XR, backend and cross-platform work, from first commit to the Play Store."
      />
      <Container className="py-12 md:py-16">
        <WorkFilter />
      </Container>
    </>
  );
}
