/**
 * A slow strip of names (M9). The second copy makes the loop seamless and is
 * hidden from assistive tech; focus or hover pauses it, and reduced motion
 * turns it into a static wrapped list.
 */
export function Marquee({ items, label }: { items: string[]; label: string }) {
  const list = (hidden: boolean) => (
    <ul
      aria-hidden={hidden ? "true" : undefined}
      className="flex shrink-0 items-center gap-3 pr-3"
    >
      {items.map((item) => (
        <li
          key={item}
          className="text-label rounded-full border border-line px-4 py-2 font-mono whitespace-nowrap text-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      data-marquee=""
      role="region"
      aria-label={label}
      tabIndex={0}
      className="marquee py-2"
    >
      <div data-marquee-track="">
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}
