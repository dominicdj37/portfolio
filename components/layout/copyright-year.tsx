import { cacheLife } from "next/cache";

/** The current year, cached so prerendering stays deterministic (cacheComponents). */
export async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
