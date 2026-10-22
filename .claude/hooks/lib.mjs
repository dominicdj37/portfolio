// Shared helpers for the hooks in this folder. Node built-ins only, so they
// load before `pnpm install`.
import { realpathSync } from "node:fs";
import { posix } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Lower-cased, forward-slash path with `.`/`..` resolved. Git Bash drive paths
 * (`/d/x`) become `d:/x`, so Windows and POSIX inputs compare the same way.
 * @param {string} path
 */
export function normalizePath(path) {
  const slashed = path.replace(/\\/g, "/").replace(/^\/([a-z])(\/|$)/i, "$1:/");
  return posix.normalize(slashed).replace(/\/+$/, "").toLowerCase();
}

/**
 * The path relative to the project root, or null if it's outside the project.
 * Relative inputs are taken as relative to the root.
 * @param {string} path
 * @param {string} projectDir
 */
export function projectRelative(path, projectDir) {
  const file = normalizePath(path);
  const root = normalizePath(projectDir);
  if (file === root) return "";
  if (file.startsWith(`${root}/`)) return file.slice(root.length + 1);
  if (isAbsolute(file)) return null;
  return file.replace(/^\.\//, "");
}

/** @param {string} normalized */
function isAbsolute(normalized) {
  return normalized.startsWith("/") || /^[a-z]:/.test(normalized);
}

/** Parsed hook input from stdin. */
export async function readHookInput() {
  let raw = "";
  for await (const chunk of process.stdin) raw += chunk;
  return JSON.parse(raw);
}

/**
 * True when the module was run directly (`node hook.mjs`), not imported by a test.
 * @param {string} moduleUrl
 */
export function isMain(moduleUrl) {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return realpathSync(fileURLToPath(moduleUrl)) === realpathSync(entry);
  } catch {
    return false;
  }
}
