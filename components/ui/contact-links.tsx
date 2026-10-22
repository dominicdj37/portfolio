import { site } from "@/data/site";
import { cn } from "@/lib/cn";

type Channel = "email" | "phone" | "linkedin" | "github" | "resume";

const CHANNELS: Record<
  Channel,
  { label: string; value: string; href: string; external?: boolean }
> = {
  email: {
    label: "Email",
    value: site.contact.email,
    href: `mailto:${site.contact.email}`,
  },
  phone: {
    label: "Phone",
    value: site.contact.phone,
    href: site.contact.phoneHref,
  },
  linkedin: {
    label: "LinkedIn",
    value: "daniel-dominic",
    href: site.contact.linkedin,
    external: true,
  },
  github: {
    label: "GitHub",
    value: "dominicdj37",
    href: site.contact.github,
    external: true,
  },
  resume: {
    label: "Resume",
    value: "PDF",
    href: site.resumePath,
    external: true,
  },
};

/** Large tappable contact cards; the first is the magnetic primary (M10). */
export function ContactLinks({
  channels,
  className,
}: {
  channels: Channel[];
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {channels.map((channel, i) => {
        const { label, value, href, external } = CHANNELS[channel];
        return (
          <li key={channel}>
            <a
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : undefined)}
              {...(i === 0 ? { "data-pointer": "", "data-magnetic": "" } : {})}
              className={cn(
                "ripple flex min-h-20 flex-col justify-center gap-1 rounded-lg px-5 py-4 transition-colors duration-150",
                i === 0
                  ? "magnetic bg-accent text-on-accent hover:bg-accent/90"
                  : "surface text-fg hover:border-accent/60",
              )}
            >
              <span
                className={cn(
                  "text-label font-mono tracking-[0.08em] uppercase",
                  i === 0 ? "opacity-80" : "text-muted",
                )}
              >
                {label}
              </span>
              <span className="text-body-lg font-medium break-all">
                {value}
              </span>
              {external ? (
                <span className="sr-only"> (opens in new tab)</span>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
