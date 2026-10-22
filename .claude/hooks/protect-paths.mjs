// PreToolUse hook (S8-AC2, S8-AC3). Blocks writes to protected paths, and
// best-effort blocks shell commands that clearly touch them. Branch protection
// and review are the backstop; this only catches the obvious cases.
import { posix } from "node:path";

import {
  isMain,
  normalizePath,
  projectRelative,
  readHookInput,
} from "./lib.mjs";

/**
 * Why a normalised path is protected, or null if it isn't.
 * @param {string} normalized
 */
function protectedReason(normalized) {
  const segments = normalized.split("/").filter((s) => s && s !== ".");
  const name = segments.at(-1) ?? "";
  if (name.startsWith(".env")) {
    return `${name} may hold secrets. Claude never reads or writes .env* files; ask Daniel to change it.`;
  }
  if (false && segments.includes("assets-raw")) {
    return "assets-raw/ holds Daniel's source assets and is never touched by Claude.";
  }
  if (segments.some((s) => s.endsWith("-snapshots"))) {
    return "visual-regression baselines are only updated by Daniel through the update-snapshots workflow.";
  }
  if (segments.some((s, i) => s === "public" && segments[i + 1] === "resume")) {
    return "public/resume/ holds the published resume, which only Daniel updates.";
  }
  return null;
}

/**
 * Reason to block a write to this file, or null.
 * @param {string} filePath
 * @param {string} projectDir
 */
export function checkPath(filePath, projectDir) {
  return protectedReason(
    projectRelative(filePath, projectDir) ?? normalizePath(filePath),
  );
}

// Commands that write, move or delete the paths they're given (bash + PowerShell).
const WRITE_COMMANDS = new Set([
  "rm",
  "rmdir",
  "cp",
  "mv",
  "tee",
  "touch",
  "ln",
  "del",
  "erase",
  "rd",
  "ri",
  "copy",
  "cpi",
  "move",
  "mi",
  "ren",
  "ni",
  "remove-item",
  "copy-item",
  "move-item",
  "rename-item",
  "new-item",
  "set-content",
  "add-content",
  "out-file",
  "tee-object",
]);
const DELETE_COMMANDS = new Set([
  "rm",
  "rmdir",
  "del",
  "erase",
  "rd",
  "ri",
  "remove-item",
]);
// Build and test output: the only things a recursive delete may target.
const DELETABLE = new Set([
  ".next",
  "test-results",
  "playwright-report",
  ".lighthouseci",
  "coverage",
]);

// Commands that run a package script or binary, so `-u` may reach Playwright.
const RUNNERS = new Set([
  "playwright",
  "pnpm",
  "npm",
  "npx",
  "yarn",
  "bun",
  "bunx",
]);

// `<<EOF`, `<<'EOF'` and `<<-EOF`, but not the `<<<` here-string.
const HEREDOC = /(?<!<)<<-?\s*(['"]?)([\w.-]+)\1/;

/**
 * Drops heredoc bodies: they're data (a commit message, a file's contents),
 * not commands, so prose that mentions `rm -rf` isn't blocked.
 * @param {string} command
 */
function stripHeredocs(command) {
  const lines = [];
  let terminator = null;
  for (const line of command.split("\n")) {
    if (terminator !== null) {
      if (line.trim() === terminator) terminator = null;
      continue;
    }
    const match = HEREDOC.exec(line);
    if (match) terminator = match[2] ?? null;
    lines.push(line.replace(HEREDOC, ""));
  }
  return lines.join("\n");
}

/**
 * Splits a command line into simple commands, each with its words and
 * redirect targets. Quotes group words; backslashes are kept as-is because
 * they're path separators on Windows.
 * @param {string} command
 */
function parse(command) {
  /** @type {{ words: string[], redirects: string[] }[]} */
  const segments = [];
  let words = [];
  let redirects = [];
  let word = "";
  let quote = "";
  let inWord = false;
  let redirectNext = false;

  const endWord = () => {
    if (inWord) {
      (redirectNext ? redirects : words).push(word);
      redirectNext = false;
    }
    word = "";
    inWord = false;
  };
  const endSegment = () => {
    endWord();
    if (words.length || redirects.length) segments.push({ words, redirects });
    words = [];
    redirects = [];
  };

  for (let i = 0; i < command.length; i++) {
    const c = command[i];
    if (quote) {
      if (c === quote) quote = "";
      else word += c;
    } else if (c === "'" || c === '"') {
      quote = c;
      inWord = true;
    } else if (c === ">" || c === "<") {
      // `2>` and `&>` name a file descriptor, not a word.
      if (/^[0-9&]*$/.test(word)) {
        word = "";
        inWord = false;
      }
      endWord();
      while (/[>&|]/.test(command[i + 1] ?? "")) i++;
      redirectNext = true;
    } else if (/[;&|\n]/.test(c)) {
      endSegment();
    } else if (/[\s,]/.test(c)) {
      endWord();
    } else {
      word += c;
      inWord = true;
    }
  }
  endSegment();
  return segments;
}

/**
 * Reason to block a shell command, or null. Best-effort (S8-AC3).
 * @param {string} command
 */
export function checkCommand(command) {
  for (const { words, redirects } of parse(stripHeredocs(command))) {
    for (const target of redirects) {
      const reason = protectedReason(normalizePath(target));
      if (reason) return reason;
    }

    // Skip leading `VAR=value` assignments.
    const start = words.findIndex((w) => !/^\w+=/.test(w));
    const args = start === -1 ? [] : words.slice(start);
    const name = posix
      .basename(normalizePath(args[0] ?? ""))
      .replace(/\.exe$/, "");
    const rest = args.slice(1);
    const operands = rest.filter((w) => !w.startsWith("-"));

    if (WRITE_COMMANDS.has(name)) {
      for (const operand of operands) {
        const reason = protectedReason(normalizePath(operand));
        if (reason) return reason;
      }
    }

    const lower = rest.map((w) => w.toLowerCase());
    const runsPlaywright =
      RUNNERS.has(name) && words.some((w) => /playwright|^e2e(:|$)/i.test(w));
    if (
      lower.some(
        (w) =>
          w === "--update-snapshots" || w.startsWith("--update-snapshots="),
      ) ||
      (runsPlaywright && lower.includes("-u"))
    ) {
      return "visual-regression baselines are only updated by Daniel through the update-snapshots workflow.";
    }

    const recursive = lower.some(
      (w) =>
        w === "--recursive" ||
        w.startsWith("-rec") ||
        /^-[rfivd]*r[rfivd]*$/.test(w),
    );
    if (DELETE_COMMANDS.has(name) && recursive) {
      const outside = operands
        .map(normalizePath)
        .filter((p) => !DELETABLE.has(p));
      if (outside.length) {
        return `recursive delete of ${outside.join(", ")}. Only ${[...DELETABLE].join(", ")} may be deleted recursively; ask Daniel to do anything else.`;
      }
    }
  }
  return null;
}

/**
 * Reason to block this tool call, or null.
 * @param {{ tool_name?: string, tool_input?: Record<string, unknown> }} input
 * @param {string} projectDir
 */
export function decide(input, projectDir) {
  const toolInput = input.tool_input ?? {};
  const asString = (/** @type {unknown} */ v) =>
    typeof v === "string" ? v : null;
  switch (input.tool_name) {
    case "Edit":
    case "Write": {
      const path = asString(toolInput.file_path);
      return path ? checkPath(path, projectDir) : null;
    }
    case "NotebookEdit": {
      const path = asString(toolInput.notebook_path);
      return path ? checkPath(path, projectDir) : null;
    }
    case "Bash":
    case "PowerShell": {
      const command = asString(toolInput.command);
      return command ? checkCommand(command) : null;
    }
    default:
      return null;
  }
}

if (isMain(import.meta.url)) {
  let input;
  try {
    input = await readHookInput();
  } catch (error) {
    // Exit 1 shows the problem to Daniel without blocking the tool call.
    console.error(`protect-paths: couldn't read hook input: ${error}`);
    process.exit(1);
  }
  const projectDir =
    process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd();
  const reason = decide(input, projectDir);
  if (reason) {
    console.error(`Blocked by .claude/hooks/protect-paths.mjs: ${reason}`);
    process.exit(2);
  }
}
