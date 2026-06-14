const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");

function readWorkflow(fileName) {
  return fs.readFileSync(path.join(root, ".github", "workflows", fileName), "utf8");
}

test("CI checks, tests, packages, and uploads the extension on pushes and pull requests", () => {
  const workflow = readWorkflow("ci.yml");

  assert.match(workflow, /\bpush:/);
  assert.match(workflow, /\bpull_request:/);
  assert.match(workflow, /npm run check/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run pack:extension/);
  assert.match(workflow, /actions\/upload-artifact@/);
  assert.match(workflow, /dist\/\*\.zip/);
});

test("release workflow creates a GitHub release from git tag history", () => {
  const workflow = readWorkflow("release.yml");

  assert.match(workflow, /\btags:/);
  assert.match(workflow, /- "\*"/);
  assert.match(workflow, /fetch-depth:\s*0/);
  assert.match(workflow, /npm run check/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run pack:extension/);
  assert.match(workflow, /git describe --tags --abbrev=0/);
  assert.match(workflow, /git log/);
  assert.match(workflow, /CHANGELOG\.md/);
  assert.match(workflow, /gh release create/);
  assert.match(workflow, /dist\/\*\.zip/);
});
