import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(root, fileName), "utf8"));
}

function normalizeVersion(value, label) {
  const version = String(value || "").trim().replace(/^v/i, "");

  if (!/^\d+(?:\.\d+){0,2}$/.test(version)) {
    throw new Error(`${label} must be numeric version like 1, 1.0, or 1.0.0`);
  }

  const parts = version.split(".");
  while (parts.length < 3) {
    parts.push("0");
  }

  return parts.join(".");
}

const tag = process.argv[2] || process.env.GITHUB_REF_NAME;

if (!tag) {
  throw new Error("Release tag is required. Pass it as an argument or set GITHUB_REF_NAME.");
}

const manifest = readJson("manifest.json");
const packageJson = readJson("package.json");
const tagVersion = normalizeVersion(tag, "Release tag");
const manifestVersion = normalizeVersion(manifest.version, "manifest.json version");
const packageVersion = normalizeVersion(packageJson.version, "package.json version");

if (manifestVersion !== packageVersion) {
  throw new Error(`manifest.json version ${manifest.version} does not match package.json version ${packageJson.version}`);
}

if (tagVersion !== manifestVersion) {
  throw new Error(`release tag ${tag} resolves to ${tagVersion}, but project version is ${manifestVersion}`);
}

process.stdout.write(`Release version OK: ${tag} -> ${manifestVersion}\n`);
