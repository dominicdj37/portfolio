import { Container } from "@/components/ui/container";
import { ContactLinks } from "@/components/ui/contact-links";
import { Eyebrow } from "@/components/ui/eyebrow";
import { site } from "@/data/site";

export function ContactCta({ resumeAvailable }: { resumeAvailable: boolean }) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="py-24 md:py-36"
    >
      <Container>
        <div className="reveal max-w-4xl">
          <Eyebrow>05 · Contact</Eyebrow>
          <h2
            id="contact-title"
            className="text-display-xl mt-3 font-semibold text-fg"
          >
            {site.contactHeadline}
          </h2>
        </div>
        <ContactLinks
          className="mt-10 lg:grid-cols-4"
          channels={[
            "email",
            "phone",
            "linkedin",
            ...(resumeAvailable ? (["resume"] as const) : []),
          ]}
        />
      </Container>
    </section>
  );
}
