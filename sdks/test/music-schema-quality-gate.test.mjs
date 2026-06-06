import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

function runNode(args) {
  return spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
  });
}

test("music schema quality gate uses generated OpenAPI defaults", () => {
  const exportResult = runNode(["tools/music_openapi_export.mjs"]);
  assert.equal(exportResult.status, 0, exportResult.stderr);

  const gateResult = runNode(["tools/music_schema_quality_gate.mjs"]);
  assert.equal(gateResult.status, 0, gateResult.stderr);
  assert.match(gateResult.stdout, /ok app=37 backend=45/u);
});
