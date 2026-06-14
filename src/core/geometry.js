(function exposeGeometry(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.SiteKnifeGeometry = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createGeometry() {
  function distance(a, b) {
    return Math.hypot(b.x - a.x, b.y - a.y);
  }

  function roundPixel(value) {
    return Math.round(value * 10) / 10;
  }

  function snapPoint(start, current, enabled) {
    if (!enabled) return { x: current.x, y: current.y };

    const dx = current.x - start.x;
    const dy = current.y - start.y;
    const length = Math.hypot(dx, dy);
    if (length === 0) return { x: start.x, y: start.y };

    const angle = Math.atan2(dy, dx);
    const increment = Math.PI / 4;
    const snappedAngle = Math.round(angle / increment) * increment;

    return {
      x: start.x + Math.cos(snappedAngle) * length,
      y: start.y + Math.sin(snappedAngle) * length
    };
  }

  function measurementFromPoints(start, current, snapEnabled) {
    const end = snapPoint(start, current, snapEnabled);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const px = distance(start, end);

    return {
      start: { x: start.x, y: start.y },
      end,
      dx,
      dy,
      distance: px,
      label: `${roundPixel(px)} px`
    };
  }

  function midpoint(a, b) {
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2
    };
  }

  return {
    distance,
    measurementFromPoints,
    midpoint,
    roundPixel,
    snapPoint
  };
});
