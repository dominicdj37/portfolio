import { DeviceFrame } from "@/components/ui/device-frame";

/**
 * The hero's device. Phase 4 can layer a lazily loaded 3D canvas over this
 * poster when `variant` is "interactive"; today both render the static
 * frame with a CSS UI skeleton (Q8: no screenshots until cleared).
 */
export function HeroStage({
  variant = "static",
}: {
  variant?: "static" | "interactive";
}) {
  return (
    <div data-hero-stage={variant} className="float-in relative">
      <DeviceFrame label="An Android app screen, drawn as an outline">
        <div aria-hidden="true" className="flex h-full flex-col gap-3 p-4">
          {/* App bar */}
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-md bg-accent/80" />
            <span className="h-2.5 w-24 rounded-full bg-fg/20" />
          </div>
          {/* AR viewport with a detected plane */}
          <div className="relative h-40 overflow-hidden rounded-lg border border-line bg-surface-raised">
            <div className="absolute inset-x-4 bottom-6 h-20 origin-bottom [transform:perspective(220px)_rotateX(58deg)] rounded-md border border-accent/60 bg-[radial-gradient(var(--accent)_1px,transparent_1.5px)] [background-size:12px_12px]" />
            <span className="absolute top-3 left-3 rounded-sm bg-bg/80 px-1.5 py-0.5 font-mono text-[9px] text-accent">
              PLANE · TRACKING
            </span>
          </div>
          {/* Device controls */}
          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="surface flex flex-col gap-2 rounded-md p-2.5"
              >
                <span
                  className={
                    i === 1
                      ? "h-3 w-6 rounded-full bg-success/80"
                      : "h-3 w-6 rounded-full bg-fg/15"
                  }
                />
                <span className="h-2 w-14 rounded-full bg-fg/15" />
              </div>
            ))}
          </div>
          <div className="mt-auto flex justify-around rounded-md border border-line py-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={
                  i === 0
                    ? "h-1.5 w-8 rounded-full bg-accent"
                    : "h-1.5 w-8 rounded-full bg-fg/15"
                }
              />
            ))}
          </div>
        </div>
      </DeviceFrame>
    </div>
  );
}
