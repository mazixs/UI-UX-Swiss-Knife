const test = require("node:test");
const assert = require("node:assert/strict");

const geometry = require("../src/core/geometry");
const color = require("../src/core/color");
const labels = require("../src/core/element-labels");
const fonts = require("../src/core/font");

function fakeElement({ tag = "div", id = "", className = "", attrs = {}, parentElement = null } = {}) {
  const classes = className.split(/\s+/).filter(Boolean);
  return {
    tagName: tag.toUpperCase(),
    id,
    className,
    classList: classes,
    parentElement,
    getAttribute(name) {
      return attrs[name] || "";
    }
  };
}

test("measurementFromPoints returns CSS pixel distance and dx/dy", () => {
  const measurement = geometry.measurementFromPoints({ x: 10, y: 20 }, { x: 40, y: 60 }, false);

  assert.equal(measurement.distance, 50);
  assert.equal(measurement.label, "50 px");
  assert.equal(measurement.dx, 30);
  assert.equal(measurement.dy, 40);
});

test("snapPoint aligns a near-horizontal drag to a clean horizontal line", () => {
  const snapped = geometry.snapPoint({ x: 100, y: 100 }, { x: 240, y: 108 }, true);

  assert.equal(Math.round(snapped.y), 100);
  assert.ok(snapped.x > 239);
});

test("measurementFromPoints keeps free diagonal movement when snapping is disabled", () => {
  const measurement = geometry.measurementFromPoints({ x: 0, y: 0 }, { x: 100, y: 80 }, false);

  assert.equal(measurement.end.x, 100);
  assert.equal(measurement.end.y, 80);
});

test("rgbToHex formats uppercase six-digit colors", () => {
  assert.equal(color.rgbToHex(12, 128, 255), "#0C80FF");
});

test("sampleImageData returns the selected pixel color", () => {
  const imageData = {
    width: 2,
    height: 2,
    data: new Uint8ClampedArray([
      255, 0, 0, 255,
      0, 255, 0, 255,
      0, 0, 255, 255,
      18, 52, 86, 255
    ])
  };

  assert.deepEqual(color.sampleImageData(imageData, 1, 1), {
    r: 18,
    g: 52,
    b: 86,
    a: 255,
    hex: "#123456",
    rgb: "rgb(18, 52, 86)"
  });
});

test("formatColorOptions returns useful copy formats for a picked color", () => {
  const options = color.formatColorOptions({ r: 18, g: 52, b: 86, a: 255, hex: "#123456", rgb: "rgb(18, 52, 86)" });
  const byLabel = Object.fromEntries(options.map((option) => [option.label, option.value]));

  assert.equal(byLabel.HEX, "#123456");
  assert.equal(byLabel.RGB, "rgb(18, 52, 86)");
  assert.equal(byLabel.RGBA, "rgba(18, 52, 86, 1)");
  assert.equal(byLabel.HSL, "hsl(210, 65%, 20%)");
  assert.equal(byLabel.CSS, "color: #123456;");
});

test("extractElementLabels includes code-like DOM names and selector", () => {
  const section = fakeElement({ tag: "section", id: "hero" });
  const h1 = fakeElement({
    tag: "h1",
    className: "hero-h1 headline",
    attrs: { "data-testid": "hero-title" },
    parentElement: section
  });

  const extracted = labels.extractElementLabels(h1, ["HeroTitle"]);
  const values = extracted.map((item) => `${item.label}:${item.value}`);

  assert.ok(values.includes("Class:hero-h1"));
  assert.ok(values.includes("data-testid:hero-title"));
  assert.ok(values.includes("Component:HeroTitle"));
  assert.ok(values.includes("Selector:#hero > h1[data-testid=\"hero-title\"].hero-h1.headline"));
});

test("copyableElementLabels formats labels as menu rows", () => {
  const copyable = labels.copyableElementLabels([
    { type: "class", label: "Class", value: "hero-h1" },
    { type: "selector", label: "Selector", value: "#hero > .hero-h1" }
  ]);

  assert.deepEqual(copyable, [
    { type: "class", label: "Class", value: "hero-h1", copyText: "hero-h1" },
    { type: "selector", label: "Selector", value: "#hero > .hero-h1", copyText: "#hero > .hero-h1" }
  ]);
});

test("extractFontInfo returns detailed computed typography fields", () => {
  const computed = {
    fontFamily: '"Inter", Arial, sans-serif',
    fontSize: "64px",
    lineHeight: "70px",
    fontWeight: "700",
    fontStyle: "italic",
    letterSpacing: "0.2px",
    textTransform: "uppercase",
    color: "rgb(18, 52, 86)",
    fontStretch: "100%",
    fontVariationSettings: '"wght" 700',
    fontFeatureSettings: '"kern"',
    textAlign: "center",
    textDecorationLine: "underline"
  };

  const info = fonts.extractFontInfo(computed, ["Inter", "Arial"]);
  const byLabel = Object.fromEntries(info.map((item) => [item.label, item.value]));

  assert.equal(byLabel.Family, '"Inter", Arial, sans-serif');
  assert.equal(byLabel.Size, "64px");
  assert.equal(byLabel.Weight, "700");
  assert.equal(byLabel.Style, "italic");
  assert.equal(byLabel["Loaded candidates"], "Inter, Arial");
  assert.equal(info.find((item) => item.label === "CSS font")?.copyText, 'font: italic 700 64px/70px "Inter", Arial, sans-serif;');
});
