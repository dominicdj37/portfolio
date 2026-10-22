import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ArrowLink } from "@/components/ui/arrow-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { DeviceFrame } from "@/components/ui/device-frame";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { StatTile } from "@/components/ui/stat-tile";
import { Tag } from "@/components/ui/tag";

// Q7: kept in production, noindex and never linked. It's also the
// visual-regression target for tokens and primitives.
export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const COLOURS = [
  ["--bg", "Page background"],
  ["--surface", "Cards, panels"],
  ["--surface-raised", "Elevated tiles, hover"],
  ["--text", "Body and headings"],
  ["--text-muted", "Secondary text"],
  ["--accent", "Links, focus, filled buttons"],
  ["--accent-strong", "Glows, gradients"],
  ["--accent-soft", "Fine accents, chip fills"],
  ["--border", "Dividers (decorative)"],
  ["--success", "Live on Play Store"],
] as const;

const TYPE = [
  ["text-display-2xl", "Display 2XL"],
  ["text-display-xl", "Display XL"],
  ["text-display-lg", "Display LG"],
  ["text-heading", "Heading"],
  ["text-body-lg", "Body LG"],
  ["text-body", "Body"],
  ["text-label", "LABEL"],
] as const;

const RADII = ["--radius-sm", "--radius-md", "--radius-lg", "--radius-xl"];

const MOTION = [
  "--dur-fast",
  "--dur-base",
  "--dur-slow",
  "--dur-hero",
  "--ease-out",
  "--ease-in-out",
  "--ease-spring",
];

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-line py-10">
      <h3 className="text-heading font-mono font-semibold text-fg">{title}</h3>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <>
      <PageHeader
        eyebrow="Styleguide"
        title="Tokens and components"
        lead="Every token and primitive in the current colour scheme."
      />
      <Container className="py-12">
        <h2 className="text-display-lg font-semibold text-fg">Tokens</h2>

        <Block title="Colour">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {COLOURS.map(([token, use]) => (
              <li key={token}>
                <div
                  className="h-16 rounded-md border border-line"
                  style={{ background: `var(${token})` }}
                />
                <code className="mt-2 block font-mono text-sm text-fg">
                  {token}
                </code>
                <p className="text-sm text-muted">{use}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Type">
          <ul className="flex flex-col gap-4">
            {TYPE.map(([utility, label]) => (
              <li key={utility} className="flex flex-col gap-1">
                <code className="font-mono text-sm text-muted">{utility}</code>
                <span
                  className={`${utility} ${utility.startsWith("text-display") ? "font-display font-semibold" : ""} text-fg`}
                >
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Radius">
          <ul className="flex flex-wrap gap-6">
            {RADII.map((token) => (
              <li key={token} className="flex flex-col items-center gap-2">
                <div
                  className="h-20 w-20 border border-accent bg-surface-raised"
                  style={{ borderRadius: `var(${token})` }}
                />
                <code className="font-mono text-sm text-fg">{token}</code>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Motion">
          <ul className="grid gap-2 sm:grid-cols-2">
            {MOTION.map((token) => (
              <li key={token}>
                <code className="font-mono text-sm text-fg">{token}</code>
              </li>
            ))}
          </ul>
        </Block>

        <h2 className="text-display-lg mt-12 font-semibold text-fg">
          Components
        </h2>

        <Block title="Container">
          <div className="rounded-md border border-dashed border-line">
            <Container>
              <p className="py-4 text-muted">
                max-w-6xl with 16 / 24 / 32 px gutters
              </p>
            </Container>
          </div>
        </Block>

        <Block title="Section">
          <div className="rounded-md border border-dashed border-line">
            <Section
              id="sample-section"
              number="00"
              eyebrow="Sample"
              title="A section title"
              intro="An optional intro line under the title."
              className="py-8 md:py-10"
            />
          </div>
        </Block>

        <Block title="Button">
          <div className="flex flex-wrap gap-3">
            <Button href="/styleguide#button-primary">Primary</Button>
            <Button href="/styleguide#button-secondary" variant="secondary">
              Secondary
            </Button>
            <Button href="/styleguide#button-ghost" variant="ghost">
              Ghost
            </Button>
            <Button type="button">Native button</Button>
          </div>
        </Block>

        <Block title="ArrowLink">
          <div className="flex flex-wrap gap-6">
            <ArrowLink href="/styleguide#arrow">Internal link</ArrowLink>
            <ArrowLink href="https://github.com/dominicdj37" external>
              External link
            </ArrowLink>
          </div>
        </Block>

        <Block title="Tag">
          <div className="flex flex-wrap gap-2">
            <Tag>Kotlin</Tag>
            <Tag status="live">Live on Play Store</Tag>
            <Tag status="prototype">Prototype</Tag>
          </div>
        </Block>

        <Block title="Card">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <p className="text-fg">A plain card.</p>
            </Card>
            <Card spotlight data-pointer="">
              <p className="text-fg">A spotlight card (hover on desktop).</p>
            </Card>
          </div>
        </Block>

        <Block title="StatTile">
          <div className="grid max-w-xl grid-cols-2 gap-3">
            <div className="surface rounded-lg p-5">
              <StatTile count={7} display="7+" label="Counts up" />
            </div>
            <div className="surface rounded-lg p-5">
              <StatTile display="AR/XR" label="Text value" />
            </div>
          </div>
        </Block>

        <Block title="DeviceFrame">
          <div className="max-w-[14rem]">
            <DeviceFrame label="An empty device frame">
              <div className="h-full" />
            </DeviceFrame>
          </div>
        </Block>
      </Container>
    </>
  );
}
