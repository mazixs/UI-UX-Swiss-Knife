const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const iconSizes = [16, 32, 48, 128];

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(root, fileName), "utf8"));
}

function readPngSize(fileName) {
  const buffer = fs.readFileSync(path.join(root, fileName));
  assert.equal(buffer.toString("ascii", 1, 4), "PNG");

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

test("manifest references real icon assets for the extension and action", () => {
  const manifest = readJson("manifest.json");

  for (const size of iconSizes) {
    const key = String(size);
    const expectedPath = `icons/icon-${size}.png`;

    assert.equal(manifest.icons[key], expectedPath);
    assert.equal(manifest.action.default_icon[key], expectedPath);
    assert.deepEqual(readPngSize(expectedPath), { width: size, height: size });
  }
});

test("package script includes icon assets in the release zip", () => {
  const packScript = fs.readFileSync(path.join(root, "scripts", "pack-extension.mjs"), "utf8");

  for (const size of iconSizes) {
    assert.match(packScript, new RegExp(`"icons/icon-${size}\\.png"`));
  }
});
