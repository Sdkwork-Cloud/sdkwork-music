import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const musicRoot = path.resolve(import.meta.dirname, "..");
const corePcReactRoot = path.resolve(musicRoot, "../sdkwork-core/sdkwork-core-pc-react");

function collectFiles(root) {
  const result = [];
  const stack = [root];

  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if ([".git", "node_modules"].includes(entry.name)) {
          continue;
        }
        stack.push(absolute);
        continue;
      }
      result.push(absolute);
    }
  }

  return result;
}

test("sdkwork-music tests consume the real core pc react package without a shim", () => {
  const vitestConfig = readFileSync(path.join(musicRoot, "vitest.config.ts"), "utf8");

  assert.equal(
    existsSync(path.join(musicRoot, "tests/shims/sdkwork-core-pc-react.ts")),
    false,
    "sdkwork-music must not keep a local @sdkwork/core-pc-react test shim",
  );
  assert.doesNotMatch(
    vitestConfig,
    /tests\/shims\/sdkwork-core-pc-react|tests\\shims\\sdkwork-core-pc-react/u,
    "Vitest must not alias @sdkwork/core-pc-react to a local test shim",
  );
  assert.match(
    vitestConfig,
    /sdkwork-core\/sdkwork-core-pc-react\/dist\/index\.js/u,
    "Vitest should resolve @sdkwork/core-pc-react to the real built package",
  );
});

test("core pc react build output does not depend on the retired IM SDK runtime", () => {
  const distRoot = path.join(corePcReactRoot, "dist");
  assert.equal(existsSync(distRoot), true, "core pc react dist should be built");

  const offenders = collectFiles(distRoot)
    .filter((filePath) => /\.(?:js|cjs|mjs|d\.ts|map)$/.test(filePath))
    .flatMap((filePath) => {
      const contents = readFileSync(filePath, "utf8");
      const matches = [
        /@sdkwork\/im-sdk/u,
        /\bImSdkClient\b/u,
      ].filter((pattern) => pattern.test(contents));

      return matches.map((pattern) => `${path.relative(corePcReactRoot, filePath)}: ${pattern.source}`);
    });

  assert.deepEqual(
    offenders,
    [],
    `@sdkwork/core-pc-react dist must not depend on @sdkwork/im-sdk.\n${offenders.join("\n")}`,
  );
});
