import { Fragment, type CSSProperties } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroStage } from "@/components/ui/hero-stage";
import { Tag } from "@/components/ui/tag";
import { site } from "@/data/site";

export function Hero({ resumeAvailable }: { resumeAvailable: boolean }) {
  const words = site.headline.split(" ");

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-[4.75rem] pb-16 sm:pt-28 md:pt-36 md:pb-28"
    >
      <div aria-hidden="true" className="aurora" />
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          {site.availability.enabled ? (
            <div className="mb-5">
              <Tag status="live">{site.availability.text}</Tag>
            </div>
          ) : null}
          <p
            data-eyebrow=""
            className="text-label font-mono font-medium tracking-[0.08em] text-accent uppercase"
          >
            {site.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="text-display-2xl mt-3 font-semibold text-fg"
          >
            {words.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                <span
                  data-word=""
                  className="hero-word"
                  style={{ "--i": i } as CSSProperties}
                >
                  {word}
                </span>
                {i < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </h1>
          <p
            data-intro=""
            className="sm:text-body-lg mt-4 max-w-prose text-muted sm:mt-6"
          >
            {site.intro}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <Button href="/#work" magnetic>
              Explore my work
            </Button>
            {resumeAvailable ? (
              <Button href={site.resumePath} external variant="secondary">
                Resume{" "}
                <span className="text-label font-mono text-muted">PDF</span>
              </Button>
            ) : (
              <Button href="/contact" variant="secondary">
                Let&apos;s connect
              </Button>
            )}
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="mx-auto w-[70%] max-w-xs lg:w-full">
            <HeroStage />
          </div>
        </div>
      </Container>
    </section>
  );
}
