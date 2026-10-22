import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Page not found",
};

/** The 404, as an Android stack trace (Q9), read as plain text. */
export default function NotFound() {
  return (
    <>
      <Container className="pt-28 pb-12 md:pt-40">
        <h1 className="text-display-xl font-semibold text-fg">
          Page not found
        </h1>
        <pre className="surface mt-8 overflow-x-auto rounded-lg p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap text-muted">
          <span className="text-accent">
            E/Router: ActivityNotFoundException: no route for this URL
          </span>
          {"\n    at daniel.portfolio.Navigation.resolve(Navigation.kt:404)"}
          {"\n    at daniel.portfolio.MainActivity.onCreate(MainActivity.kt:1)"}
        </pre>
        <p className="text-body-lg mt-8 text-muted">
          The page you asked for doesn&apos;t exist. Try one of these:
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/">Home</Button>
          <Button href="/work" variant="secondary">
            Work
          </Button>
          <Button href="/contact" variant="secondary">
            Contact
          </Button>
        </div>
      </Container>
    </>
  );
}
