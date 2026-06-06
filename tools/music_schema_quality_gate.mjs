#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete"]);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, "..");
const generatedOpenapiDir = path.join(workspaceRoot, "generated", "openapi");

function fail(message) {
  process.stderr.write(`[music_schema_quality_gate] ${message}\n`);
  process.exit(1);
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    fail(`missing OpenAPI file: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function operations(document) {
  return Object.entries(document.paths ?? {}).flatMap(([pathKey, pathItem]) =>
    Object.entries(pathItem ?? {})
      .filter(([method]) => HTTP_METHODS.has(method))
      .map(([method, operation]) => ({ method, operation, pathKey })),
  );
}

function checkDocument(filePath, authority, prefix, sourceRouteCrate) {
  const document = readJson(filePath);
  if (document.openapi !== "3.1.2") {
    fail(`${filePath} must use OpenAPI 3.1.2`);
  }
  if (document["x-sdkwork-owner"] !== "sdkwork-music") {
    fail(`${filePath} owner drift`);
  }
  if (document["x-sdkwork-api-authority"] !== authority) {
    fail(`${filePath} authority drift`);
  }
  for (const { operation, pathKey } of operations(document)) {
    if (!pathKey.startsWith(prefix)) {
      fail(`${filePath} has invalid path prefix ${pathKey}`);
    }
    for (const segment of pathKey.split("/").filter(Boolean)) {
      if (segment.startsWith("{") && segment.endsWith("}")) {
        continue;
      }
      if (!/^[a-z][a-z0-9_]*$/u.test(segment)) {
        fail(`${filePath} path segment must be lower_snake_case: ${segment}`);
      }
    }
    if (operation["x-sdkwork-owner"] !== "sdkwork-music") {
      fail(`${filePath} operation owner drift ${pathKey}`);
    }
    if (operation["x-sdkwork-api-authority"] !== authority) {
      fail(`${filePath} operation authority drift ${pathKey}`);
    }
    if (operation["x-sdkwork-domain"] !== "music") {
      fail(`${filePath} operation domain drift ${pathKey}`);
    }
    if (!operation["x-sdkwork-resource"]) {
      fail(`${filePath} operation missing resource ${pathKey}`);
    }
    if (!operation["x-sdkwork-permission"]) {
      fail(`${filePath} operation missing permission ${pathKey}`);
    }
    if (operation["x-sdkwork-tenant-scope"] !== "tenant" && operation["x-sdkwork-tenant-scope"] !== "user") {
      fail(`${filePath} operation tenant scope drift ${pathKey}`);
    }
    if (typeof operation["x-sdkwork-idempotent"] !== "boolean") {
      fail(`${filePath} operation idempotency marker drift ${pathKey}`);
    }
    if (JSON.stringify(operation.tags) !== JSON.stringify(["music"])) {
      fail(`${filePath} operation tag drift ${pathKey}`);
    }
    if (!/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/u.test(operation.operationId ?? "")) {
      fail(`${filePath} invalid operationId ${operation.operationId}`);
    }
    for (const parameter of operation.parameters ?? []) {
      if (parameter.in === "query" && !/^[a-z][a-z0-9_]*$/u.test(parameter.name)) {
        fail(`${filePath} query parameter must be lower_snake_case: ${parameter.name}`);
      }
    }
    if (JSON.stringify(operation.security) !== JSON.stringify([{ AuthToken: [], AccessToken: [] }])) {
      fail(`${filePath} operation security drift ${pathKey}`);
    }
    if (operation["x-sdkwork-source"] !== "rust-route-manifest") {
      fail(`${filePath} operation source drift ${pathKey}`);
    }
    if (operation["x-sdkwork-source-route-crate"] !== sourceRouteCrate) {
      fail(`${filePath} operation source route crate drift ${pathKey}`);
    }
  }
  return operations(document).length;
}

function getArg(args, name, defaultValue) {
  const index = args.indexOf(name);
  if (index === -1) {
    return defaultValue;
  }
  return args[index + 1] || "";
}

const args = process.argv.slice(2);
const app = getArg(args, "--app-openapi", path.join(generatedOpenapiDir, "music-app-api.openapi.json"));
const backend = getArg(args, "--backend-openapi", path.join(generatedOpenapiDir, "music-backend-api.openapi.json"));

const counts = {
  app: checkDocument(app, "sdkwork-music-app-api", "/app/v3/api", "sdkwork-routes-music-app-api"),
  backend: checkDocument(backend, "sdkwork-music-backend-api", "/backend/v3/api", "sdkwork-routes-music-backend-api"),
};

if (counts.app !== 37 || counts.backend !== 45) {
  fail(`unexpected route counts ${JSON.stringify(counts)}`);
}

process.stdout.write(`[music_schema_quality_gate] ok app=${counts.app} backend=${counts.backend}\n`);
