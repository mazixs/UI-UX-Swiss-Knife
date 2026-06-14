(function exposeColor(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.SiteKnifeColor = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createColor() {
  function channelToHex(value) {
    return Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0").toUpperCase();
  }

  function rgbToHex(r, g, b) {
    return `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`;
  }

  function formatRgb(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`;
  }

  function formatRgba(r, g, b, a) {
    const alpha = Math.round((a / 255) * 1000) / 1000;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function rgbToHsl(r, g, b) {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const lightness = (max + min) / 2;

    if (max === min) {
      return { h: 0, s: 0, l: Math.round(lightness * 100) };
    }

    const delta = max - min;
    const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    let hue;

    if (max === red) {
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
    } else if (max === green) {
      hue = (blue - red) / delta + 2;
    } else {
      hue = (red - green) / delta + 4;
    }

    return {
      h: Math.round(hue * 60),
      s: Math.round(saturation * 100),
      l: Math.round(lightness * 100)
    };
  }

  function formatHsl(r, g, b) {
    const hsl = rgbToHsl(r, g, b);
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }

  function formatColorOptions(sample) {
    if (!sample) return [];
    const alpha = typeof sample.a === "number" ? sample.a : 255;
    const hex = sample.hex || rgbToHex(sample.r, sample.g, sample.b);
    const rgb = sample.rgb || formatRgb(sample.r, sample.g, sample.b);
    const rgba = formatRgba(sample.r, sample.g, sample.b, alpha);
    const hsl = formatHsl(sample.r, sample.g, sample.b);

    return [
      { label: "HEX", value: hex },
      { label: "RGB", value: rgb },
      { label: "RGBA", value: rgba },
      { label: "HSL", value: hsl },
      { label: "CSS", value: `color: ${hex};` }
    ];
  }

  function sampleImageData(imageData, x, y) {
    const clampedX = Math.max(0, Math.min(imageData.width - 1, Math.round(x)));
    const clampedY = Math.max(0, Math.min(imageData.height - 1, Math.round(y)));
    const index = (clampedY * imageData.width + clampedX) * 4;
    const r = imageData.data[index];
    const g = imageData.data[index + 1];
    const b = imageData.data[index + 2];
    const a = imageData.data[index + 3];

    return {
      r,
      g,
      b,
      a,
      hex: rgbToHex(r, g, b),
      rgb: formatRgb(r, g, b)
    };
  }

  return {
    formatColorOptions,
    formatHsl,
    formatRgb,
    formatRgba,
    rgbToHex,
    rgbToHsl,
    sampleImageData
  };
});
