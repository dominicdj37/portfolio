import { Capabilities } from "@/components/home/capabilities";
import { CareerSnapshot } from "@/components/home/career-snapshot";
import { ContactCta } from "@/components/home/contact-cta";
import { FeaturedWork } from "@/components/home/featured-work";
import { Hero } from "@/components/home/hero";
import { LabTeaser } from "@/components/home/lab-teaser";
import { ProofBento } from "@/components/home/proof-bento";
import { TechMarquee } from "@/components/home/tech-marquee";
import { resumeAvailable } from "@/lib/resume";

export default function Home() {
  return (
    <>
      <Hero resumeAvailable={resumeAvailable} />
      <ProofBento />
      <FeaturedWork />
      <Capabilities />
      <TechMarquee />
      <CareerSnapshot />
      <LabTeaser />
      <ContactCta resumeAvailable={resumeAvailable} />
    </>
  );
}
