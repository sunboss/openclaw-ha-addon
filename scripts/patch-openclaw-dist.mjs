import fs from "node:fs";
import path from "node:path";

const distDir = "/usr/local/lib/node_modules/openclaw/dist";

function fail(message) {
  console.error(`patch-openclaw-dist: ${message}`);
  process.exit(1);
}

function firstFile(prefix) {
  const matches = fs
    .readdirSync(distDir)
    .filter((name) => name.startsWith(prefix) && name.endsWith(".js"))
    .sort();
  if (matches.length === 0) fail(`unable to find dist file with prefix "${prefix}"`);
  return path.join(distDir, matches[0]);
}

function fileContaining(prefix, snippet) {
  const matches = fs
    .readdirSync(distDir)
    .filter((name) => name.startsWith(prefix) && name.endsWith(".js"))
    .sort()
    .map((name) => path.join(distDir, name));
  if (matches.length === 0) fail(`unable to find dist file with prefix "${prefix}"`);

  for (const match of matches) {
    const source = fs.readFileSync(match, "utf8");
    if (source.includes(snippet)) return match;
  }

  fail(`unable to find expected snippet in dist files with prefix "${prefix}"`);
}

function replaceExact(filePath, before, after, label) {
  const source = fs.readFileSync(filePath, "utf8");
  if (!source.includes(before)) fail(`missing expected snippet for ${label} in ${filePath}`);
  const updated = source.replace(before, after);
  fs.writeFileSync(filePath, updated, "utf8");
  console.log(`patched ${label}: ${path.basename(filePath)}`);
}

const setupSurfaceFile = firstFile("setup-surface-");
replaceExact(
  setupSurfaceFile,
  `async function promptFeishuAppId(params) {\n\treturn (await params.prompter.text({\n\t\tmessage: "Enter Feishu App ID",\n\t\tinitialValue: params.initialValue,\n\t\tvalidate: (value) => value?.trim() ? void 0 : "Required"\n\t})).trim();\n}`,
  `async function promptFeishuAppId(params) {\n\tconst value = await params.prompter.text({\n\t\tmessage: "Enter Feishu App ID",\n\t\tinitialValue: params.initialValue,\n\t\tvalidate: (value) => value?.trim() ? void 0 : "Required"\n\t});\n\treturn typeof value === "string" ? value.trim() : "";\n}`,
  "setup-surface promptFeishuAppId"
);

const onboardChannelsBefore =
  `\t\t\t\t\tconst trimmedValue = (await prompter.text({\n\t\t\t\t\t\tmessage: textInput.message,\n\t\t\t\t\t\tinitialValue,\n\t\t\t\t\t\tplaceholder: textInput.placeholder,\n\t\t\t\t\t\tvalidate: (value) => {\n\t\t\t\t\t\t\tconst trimmed = normalizeOptionalString(value) ?? "";\n\t\t\t\t\t\t\tif (!trimmed && textInput.required !== false) return "Required";\n\t\t\t\t\t\t\treturn textInput.validate?.({\n\t\t\t\t\t\t\t\tvalue: trimmed,\n\t\t\t\t\t\t\t\tcfg: next,\n\t\t\t\t\t\t\t\taccountId,\n\t\t\t\t\t\t\t\tcredentialValues\n\t\t\t\t\t\t\t});\n\t\t\t\t\t\t}\n\t\t\t\t\t})).trim();`;
const onboardChannelsFile = fileContaining("onboard-channels-", onboardChannelsBefore);
replaceExact(
  onboardChannelsFile,
  onboardChannelsBefore,
  `\t\t\t\t\tconst textValue = await prompter.text({\n\t\t\t\t\t\tmessage: textInput.message,\n\t\t\t\t\t\tinitialValue,\n\t\t\t\t\t\tplaceholder: textInput.placeholder,\n\t\t\t\t\t\tvalidate: (value) => {\n\t\t\t\t\t\t\tconst trimmed = normalizeOptionalString(value) ?? "";\n\t\t\t\t\t\t\tif (!trimmed && textInput.required !== false) return "Required";\n\t\t\t\t\t\t\treturn textInput.validate?.({\n\t\t\t\t\t\t\t\tvalue: trimmed,\n\t\t\t\t\t\t\t\tcfg: next,\n\t\t\t\t\t\t\t\taccountId,\n\t\t\t\t\t\t\t\tcredentialValues\n\t\t\t\t\t\t\t});\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t\tconst trimmedValue = typeof textValue === "string" ? textValue.trim() : "";`,
  "onboard-channels text input"
);
