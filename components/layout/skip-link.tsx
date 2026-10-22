/** The first focusable element on every page. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only fixed top-3 left-3 z-[60] rounded-md bg-accent px-4 py-3 font-medium text-on-accent focus:not-sr-only"
    >
      Skip to content
    </a>
  );
}
