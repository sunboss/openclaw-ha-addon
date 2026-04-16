#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

function fail(message) {
  console.error(`[patch-openclaw-source] ${message}`);
  process.exit(1);
}

const rootDir = process.argv[2];
if (!rootDir) {
  fail("usage: node patch-openclaw-source.mjs <openclaw-source-dir>");
}

function replaceExact(source, before, after, label) {
  if (!source.includes(before)) {
    fail(`missing expected snippet for ${label}`);
  }
  return source.replace(before, after);
}

function patchFile(relativePath, transform) {
  const filePath = path.join(rootDir, relativePath);
  const original = readFileSync(filePath, "utf8");
  const next = transform(original);
  if (next !== original) {
    writeFileSync(filePath, next, "utf8");
    console.error(`[patch-openclaw-source] patched ${relativePath}`);
  } else {
    console.error(`[patch-openclaw-source] unchanged ${relativePath}`);
  }
}

patchFile("src/channels/plugins/setup-wizard-helpers.ts", (source) =>
  replaceExact(
    source,
    `  const promptToken = async (): Promise<string> =>
    (
      await params.prompter.text({
        message: params.inputPrompt,
        validate: (value) => (value?.trim() ? undefined : "Required"),
      })
    ).trim();
`,
    `  const promptToken = async (): Promise<string> => {
    const input = await params.prompter.text({
      message: params.inputPrompt,
      validate: (value) => (value?.trim() ? undefined : "Required"),
    });
    return typeof input === "string" ? input.trim() : "";
  };
`,
    "setup-wizard-helpers promptToken",
  ),
);

patchFile("src/channels/plugins/setup-wizard.ts", (source) =>
  replaceExact(
    source,
    "          const trimmedValue = rawValue.trim();\n",
    '          const trimmedValue = typeof rawValue === "string" ? rawValue.trim() : "";\n',
    "setup-wizard rawValue trim",
  ),
);

patchFile("src/commands/onboard-custom.ts", (source) => {
  let next = replaceExact(
    source,
    `async function promptCustomApiModelId(prompter: WizardPrompter): Promise<string> {
  return (
    await prompter.text({
      message: "Model ID",
      placeholder: "e.g. llama3, claude-3-7-sonnet",
      validate: (val) => (val.trim() ? undefined : "Model ID is required"),
    })
  ).trim();
}
`,
    `async function promptCustomApiModelId(prompter: WizardPrompter): Promise<string> {
  const input = await prompter.text({
    message: "Model ID",
    placeholder: "e.g. llama3, claude-3-7-sonnet",
    validate: (val) => (val?.trim() ? undefined : "Model ID is required"),
  });
  return typeof input === "string" ? input.trim() : "";
}
`,
    "onboard-custom model id",
  );
  next = replaceExact(
    next,
    "  const baseUrl = baseUrlInput.trim();\n",
    '  const baseUrl = typeof baseUrlInput === "string" ? baseUrlInput.trim() : "";\n',
    "onboard-custom base url",
  );
  return next;
});

patchFile("src/commands/onboard-remote.ts", (source) => {
  let next = replaceExact(
    source,
    `      token = (
        await prompter.text({
          message: "Gateway token",
          initialValue: typeof token === "string" ? token : undefined,
          validate: (value) => (value?.trim() ? undefined : "Required"),
        })
      ).trim();
`,
    `      const tokenInput = await prompter.text({
        message: "Gateway token",
        initialValue: typeof token === "string" ? token : undefined,
        validate: (value) => (value?.trim() ? undefined : "Required"),
      });
      token = typeof tokenInput === "string" ? tokenInput.trim() : "";
`,
    "onboard-remote token",
  );
  next = replaceExact(
    next,
    `      password = (
        await prompter.text({
          message: "Gateway password",
          initialValue: typeof password === "string" ? password : undefined,
          validate: (value) => (value?.trim() ? undefined : "Required"),
        })
      ).trim();
`,
    `      const passwordInput = await prompter.text({
        message: "Gateway password",
        initialValue: typeof password === "string" ? password : undefined,
        validate: (value) => (value?.trim() ? undefined : "Required"),
      });
      password = typeof passwordInput === "string" ? passwordInput.trim() : "";
`,
    "onboard-remote password",
  );
  return next;
});

patchFile("src/wizard/setup.ts", (source) =>
  replaceExact(
    source,
    "  const workspaceDir = resolveUserPath(workspaceInput.trim() || onboardHelpers.DEFAULT_WORKSPACE);\n",
    '  const workspaceDir = resolveUserPath((typeof workspaceInput === "string" ? workspaceInput.trim() : "") || onboardHelpers.DEFAULT_WORKSPACE);\n',
    "wizard setup workspace",
  ),
);

patchFile("src/wizard/setup.plugin-config.ts", (source) => {
  const before = /const trimmed = input\.trim\(\);/g;
  const after = 'const trimmed = typeof input === "string" ? input.trim() : "";';
  const occurrences = source.match(before)?.length ?? 0;
  if (occurrences !== 2) {
    fail(`expected 2 input.trim() occurrences in wizard/setup.plugin-config.ts, found ${occurrences}`);
  }
  return source.replace(before, after);
});
