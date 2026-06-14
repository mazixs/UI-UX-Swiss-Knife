(function exposeElementLabels(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.SiteKnifeElementLabels = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createElementLabels() {
  const DATA_NAME_ATTRIBUTES = [
    "data-testid",
    "data-test",
    "data-cy",
    "data-qa",
    "data-component",
    "data-name",
    "data-block",
    "aria-label",
    "name",
    "role"
  ];

  function readAttribute(element, name) {
    if (!element || typeof element.getAttribute !== "function") return "";
    return element.getAttribute(name) || "";
  }

  function cssEscape(value) {
    return String(value)
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/(^-?\d)|[^a-zA-Z0-9_-]/g, (match, leadingDigit) => {
        if (leadingDigit) return `\\3${leadingDigit} `;
        return `\\${match}`;
      });
  }

  function tagName(element) {
    return (element?.tagName || "element").toLowerCase();
  }

  function classNames(element) {
    if (!element) return [];
    if (element.classList) return Array.from(element.classList).filter(Boolean);
    return String(element.className || "")
      .split(/\s+/)
      .filter(Boolean);
  }

  function shortSelector(element) {
    const tag = tagName(element);
    const id = element?.id;
    if (id) return `#${cssEscape(id)}`;

    const dataAttribute = DATA_NAME_ATTRIBUTES.find((name) => readAttribute(element, name));
    const dataSelector = dataAttribute ? `[${dataAttribute}="${cssEscape(readAttribute(element, dataAttribute))}"]` : "";
    const classes = classNames(element)
      .slice(0, 3)
      .map((name) => `.${cssEscape(name)}`)
      .join("");

    return `${tag}${dataSelector}${classes}`;
  }

  function buildSelectorPath(element, maxDepth) {
    const segments = [];
    let current = element;
    const limit = maxDepth || 4;

    while (current && segments.length < limit && tagName(current) !== "html") {
      const segment = shortSelector(current);
      segments.unshift(segment);
      if (current.id) break;
      current = current.parentElement;
    }

    return segments.join(" > ");
  }

  function extractElementLabels(element, frameworkHints) {
    const labels = [];
    const id = element?.id;
    const classes = classNames(element);

    if (id) labels.push({ type: "id", label: "ID", value: id });

    classes.forEach((className) => {
      labels.push({ type: "class", label: "Class", value: className });
    });

    DATA_NAME_ATTRIBUTES.forEach((name) => {
      const value = readAttribute(element, name);
      if (value) labels.push({ type: "attribute", label: name, value });
    });

    (frameworkHints || []).forEach((value) => {
      if (value) labels.push({ type: "framework", label: "Component", value });
    });

    labels.push({ type: "selector", label: "Selector", value: buildSelectorPath(element) });

    return labels;
  }

  function copyableElementLabels(labels) {
    return (labels || []).map((item) => ({
      ...item,
      copyText: item.value
    }));
  }

  return {
    DATA_NAME_ATTRIBUTES,
    buildSelectorPath,
    copyableElementLabels,
    cssEscape,
    extractElementLabels,
    shortSelector
  };
});
