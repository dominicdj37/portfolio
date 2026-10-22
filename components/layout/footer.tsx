import { CopyrightYear } from "@/components/layout/copyright-year";
import { Container } from "@/components/ui/container";
import { site } from "@/data/site";

export function Footer({ resumeAvailable }: { resumeAvailable: boolean }) {
  const links = [
    { label: "LinkedIn", href: site.contact.linkedin, external: true },
    { label: "GitHub", href: site.contact.github, external: true },
    { label: "Email", href: `mailto:${site.contact.email}` },
    { label: "Phone", href: site.contact.phoneHref },
    ...(resumeAvailable
      ? [{ label: "Resume", href: site.resumePath, external: true }]
      : []),
  ];

  return (
    <footer className="mt-12 border-t border-line">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg font-semibold text-fg">
            daniel<span className="text-accent">.</span>
          </p>
          <p className="mt-2 text-muted">{site.footerLine}</p>
        </div>
        <nav aria-label="Contact and profiles">
          <ul className="flex flex-wrap gap-x-2 gap-y-1">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : undefined)}
                  className="inline-flex min-h-11 items-center px-2 text-muted underline-offset-4 hover:text-fg hover:underline"
                >
                  {link.label}
                  {link.external ? (
                    <span className="sr-only"> (opens in new tab)</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-sm text-muted">
          © <CopyrightYear /> {site.name}
        </p>
      </Container>
    </footer>
  );
}
