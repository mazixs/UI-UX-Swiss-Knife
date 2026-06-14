(function exposeFont(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.SiteKnifeFont = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createFont() {
  function value(computed, key, fallback) {
    if (!computed) return fallback || "";
    return computed[key] || (typeof computed.getPropertyValue === "function" ? computed.getPropertyValue(key) : "") || fallback || "";
  }

  function cssFontShorthand(computed) {
    const style = value(computed, "fontStyle", "normal");
    const weight = value(computed, "fontWeight", "400");
    const size = value(computed, "fontSize", "16px");
    const lineHeight = value(computed, "lineHeight", "normal");
    const family = value(computed, "fontFamily", "sans-serif");
    return `font: ${style} ${weight} ${size}/${lineHeight} ${family};`;
  }

  function extractFontInfo(computed, loadedCandidates) {
    const info = [
      { label: "Family", value: value(computed, "fontFamily") },
      { label: "Size", value: value(computed, "fontSize") },
      { label: "Line height", value: value(computed, "lineHeight") },
      { label: "Weight", value: value(computed, "fontWeight") },
      { label: "Style", value: value(computed, "fontStyle") },
      { label: "Letter spacing", value: value(computed, "letterSpacing") },
      { label: "Transform", value: value(computed, "textTransform") },
      { label: "Color", value: value(computed, "color") },
      { label: "Stretch", value: value(computed, "fontStretch") },
      { label: "Variation", value: value(computed, "fontVariationSettings") },
      { label: "Features", value: value(computed, "fontFeatureSettings") },
      { label: "Align", value: value(computed, "textAlign") },
      { label: "Decoration", value: value(computed, "textDecorationLine") }
    ].filter((item) => item.value && item.value !== "normal normal");

    if (loadedCandidates?.length) {
      info.push({ label: "Loaded candidates", value: loadedCandidates.join(", ") });
    }

    info.push({ label: "CSS font", value: cssFontShorthand(computed), copyText: cssFontShorthand(computed) });

    return info.map((item) => ({
      ...item,
      copyText: item.copyText || item.value
    }));
  }

  function splitFontFamilies(fontFamily) {
    if (!fontFamily) return [];
    return fontFamily
      .split(",")
      .map((family) => family.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  return {
    cssFontShorthand,
    extractFontInfo,
    splitFontFamilies
  };
});
