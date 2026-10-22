// next/font is compiled away by Next's SWC plugin; Vitest gets this stand-in.
type FontOptions = { variable?: string };

function font(options: FontOptions = {}) {
  return { className: "font", variable: options.variable ?? "", style: {} };
}

export const Space_Grotesk = font;
export const Inter = font;
export const JetBrains_Mono = font;
