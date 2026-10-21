"use client";

import { payload } from "./proof-of-red-data";

export function ProofOfRed() {
  // Used at runtime so the minifier can't constant-fold the string away.
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(payload)}
    >
      Copy
    </button>
  );
}
