import fs from "node:fs";
import path from "node:path";

const distDir =
  process.env.OPENCLAW_DIST_DIR || "/usr/local/lib/node_modules/openclaw/dist";

const TARGET_FILE_RE =
  /^(?:onboard-|setup(?:[.-]|$)|channel(?:\.runtime|-)|channels-|oauth|auth-choice-|resolve-channels-|chutes-oauth-)/;

function fail(message) {
  console.error(`patch-openclaw-dist: ${message}`);
  process.exit(1);
}

function listTargetFiles() {
  if (!fs.existsSync(distDir)) fail(`dist dir not found: ${distDir}`);
  const files = fs
    .readdirSync(distDir)
    .filter((name) => name.endsWith(".js") && TARGET_FILE_RE.test(name))
    .sort()
    .map((name) => path.join(distDir, name));
  if (files.length === 0) fail(`no target dist files found in ${distDir}`);
  return files;
}

function countReplace(source, pattern, replacement) {
  let count = 0;
  const updated = source.replace(pattern, (...args) => {
    count += 1;
    return typeof replacement === "function" ? replacement(...args) : replacement;
  });
  return { updated, count };
}

function ensureSafeTrimHelper(source) {
  if (source.includes("const __openclawSafeTrim =")) {
    return source;
  }
  return `const __openclawSafeTrim = (value) => typeof value === "string" ? value.trim() : \"\";\n${source}`;
}

function patchFile(filePath, tempIds) {
  const source = fs.readFileSync(filePath, "utf8");
  let updated = source;
  const changes = [];

  const entryPlaceholder = "__OPENCLAW_SAFE_ENTRY_INPUT_TRIM__";
  const entryCapture = countReplace(
    updated,
    /(?<!typeof entry\.input === "string" \? )entry\.input\.trim\(\)/g,
    entryPlaceholder
  );
  updated = entryCapture.updated;
  if (entryCapture.count > 0) changes.push(`entry.input.trim x${entryCapture.count}`);

  const inputResult = countReplace(
    updated,
    /(?<!typeof input === "string" \? )\binput\.trim\(\)/g,
    '(typeof input === "string" ? input.trim() : "")'
  );
  updated = inputResult.updated;
  if (inputResult.count > 0) changes.push(`input.trim x${inputResult.count}`);

  const entryRestore = countReplace(
    updated,
    new RegExp(entryPlaceholder, "g"),
    '(typeof entry.input === "string" ? entry.input.trim() : "")'
  );
  updated = entryRestore.updated;

  const awaitedPromptInline =
    /\(\s*(await\s+(?:(?:[A-Za-z_$][\w$]*\.)*prompter\.(?:text|password)\([\s\S]*?\)))\s*\)\.trim\(\)/g;
  const inlineResult = countReplace(
    updated,
    awaitedPromptInline,
    (_, expression) => `__openclawSafeTrim(${expression})`
  );
  updated = inlineResult.updated;
  if (inlineResult.count > 0) changes.push(`awaited prompt inline trim x${inlineResult.count}`);

  const rawValueResult = countReplace(
    updated,
    /\bconst trimmedValue = rawValue\.trim\(\);/g,
    'const trimmedValue = typeof rawValue === "string" ? rawValue.trim() : "";'
  );
  updated = rawValueResult.updated;
  if (rawValueResult.count > 0) changes.push(`rawValue.trim x${rawValueResult.count}`);

  if (changes.length > 0) {
    updated = ensureSafeTrimHelper(updated);
  }

  if (updated !== source) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log(`patched ${path.basename(filePath)}: ${changes.join(", ")}`);
    return 1;
  }

  return 0;
}

const files = listTargetFiles();
const tempIds = { value: 1 };
const touched = files.reduce((count, filePath) => count + patchFile(filePath, tempIds), 0);

if (touched === 0) fail(`no onboarding/setup/channel files were patched in ${distDir}`);

console.log(`patch-openclaw-dist: patched ${touched} file(s) in ${distDir}`);
