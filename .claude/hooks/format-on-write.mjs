// PostToolUse hook (S8-AC1). Formats the file Claude just wrote: ESLint --fix
// then Prettier for code, Prettier only for docs, styles and config. ESLint
// problems that --fix can't solve go back to Claude (exit 2 + stderr).
import { readFileSync, writeFileSync } from "node:fs";
import { join, posix } from "node:path";

import { isMain, projectRelative, readHookInput } from "./lib.mjs";

const ESLINT_AND_PRETTIER = new Set([".ts", ".tsx", ".js", ".mjs"]);
const PRETTIER_ONLY = new Set([
  ".md",
  ".mdx",
  ".css",
  ".json",
  ".yml",
  ".yaml",
]);

/**
 * What to run on a file, or null to leave it alone.
 * @param {string} filePath
 * @param {string} projectDir
 * @returns {{ eslint: boolean, prettier: boolean } | null}
 */
export function planFor(filePath, projectDir) {
  const relative = projectRelative(filePath, projectDir);
  if (relative === null || relative.split("/").includes("node_modules"))
    return null;
  const ext = posix.extname(relative);
  if (ESLINT_AND_PRETTIER.has(ext)) return { eslint: true, prettier: true };
  if (PRETTIER_ONLY.has(ext)) return { eslint: false, prettier: true };
  return null;
}

/**
 * ESLint's remaining messages as one line each. Warnings count too, because
 * `pnpm lint` fails on any warning.
 * @param {string} label
 * @param {{ line?: number, column?: number, severity: number, ruleId?: string | null, message: string }[]} messages
 */
export function formatEslintMessages(label, messages) {
  return messages
    .map((m) => {
      const level = m.severity === 2 ? "error" : "warning";
      const rule = m.ruleId ? ` (${m.ruleId})` : "";
      return `${label}:${m.line ?? 0}:${m.column ?? 0} ${level} ${m.message}${rule}`;
    })
    .join("\n");
}

/**
 * @param {string} file
 * @param {string} projectDir
 * @returns {Promise<string>} remaining ESLint problems, or "" if none
 */
async function format(file, projectDir) {
  const plan = planFor(file, projectDir);
  if (!plan) return "";

  let remaining = "";
  if (plan.eslint) {
    const { ESLint } = await import("eslint");
    const eslint = new ESLint({ cwd: projectDir, fix: true });
    if (!(await eslint.isPathIgnored(file))) {
      const results = await eslint.lintFiles([file]);
      await ESLint.outputFixes(results);
      const label = projectRelative(file, projectDir) ?? file;
      remaining = formatEslintMessages(
        label,
        results.flatMap((r) => r.messages),
      );
    }
  }

  if (plan.prettier) {
    const prettier = await import("prettier");
    const ignorePath = [
      join(projectDir, ".gitignore"),
      join(projectDir, ".prettierignore"),
    ];
    const info = await prettier.getFileInfo(file, { ignorePath });
    if (!info.ignored && info.inferredParser) {
      const source = readFileSync(file, "utf8");
      const options = await prettier.resolveConfig(file);
      const output = await prettier.format(source, {
        ...options,
        filepath: file,
      });
      if (output !== source) writeFileSync(file, output);
    }
  }

  return remaining;
}

if (isMain(import.meta.url)) {
  try {
    const input = await readHookInput();
    const file = input.tool_input?.file_path;
    const projectDir =
      process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd();
    const remaining =
      typeof file === "string" ? await format(file, projectDir) : "";
    if (remaining) {
      console.error(`ESLint problems left after --fix:\n${remaining}`);
      process.exit(2);
    }
  } catch (error) {
    // A broken formatter must not block work: exit 1 shows it to Daniel only.
    console.error(
      `format-on-write: ${error instanceof Error ? error.message : error}`,
    );
    process.exit(1);
  }
}
