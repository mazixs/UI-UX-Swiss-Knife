import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
const dist = path.join(root, "dist");
const fileName = `ui-ux-swiss-knife-v${manifest.version}.zip`;
const output = path.join(dist, fileName);

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const files = [
  "manifest.json",
  "background.js",
  "content.js",
  "src",
  "demo",
  "README.md",
  "LICENSE",
  "package.json"
];

const result = spawnSync("zip", ["-r", output, ...files], {
  cwd: root,
  encoding: "utf8"
});

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  process.stderr.write(result.stderr);
  process.exit(result.status || 1);
}

process.stdout.write(`Created ${path.relative(root, output)}\n`);
