/** A tilted dot plane, like ARCore plane detection, with a slow pulse. */
export function PlaneGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -bottom-10 h-56 [perspective:420px]"
    >
      <div className="absolute inset-x-[-20%] bottom-0 h-full origin-bottom [transform:rotateX(62deg)] bg-[radial-gradient(var(--accent)_1.2px,transparent_1.6px)] [background-size:22px_22px] opacity-60 [mask-image:linear-gradient(to_top,black,transparent)] motion-safe:animate-[pulse_6s_ease-in-out_infinite]" />
    </div>
  );
}
