import { existsSync } from "node:fs";
import { join } from "node:path";

import { site } from "@/data/site";

// Q12: Daniel adds the PDF to public/resume/. Until then every resume link is
// omitted (AC47), so this is checked once, at build time, on the server.
export const resumeAvailable = existsSync(
  join(process.cwd(), "public", site.resumePath),
);
