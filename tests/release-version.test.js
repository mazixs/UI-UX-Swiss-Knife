const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");

test("release tag v1.1.1 matches the project version", () => {
  const result = spawnSync(process.execPath, ["scripts/validate-release-version.mjs", "v1.1.1"], {
    cwd: root,
    encoding: "utf8"
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("release workflow validates the tag version before packaging", () => {
  const workflow = fs.readFileSync(path.join(root, ".github", "workflows", "release.yml"), "utf8");
  const checkIndex = workflow.indexOf("npm run release:check");
  const packIndex = workflow.indexOf("npm run pack:extension");

  assert.ok(checkIndex >= 0, "release workflow should run npm run release:check");
  assert.ok(checkIndex < packIndex, "release version check should happen before packaging");
});
