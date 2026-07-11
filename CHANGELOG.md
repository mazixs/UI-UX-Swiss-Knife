# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-07-11

### Added
- **Keyboard Shortcut / Горячие клавиши**: Added activation via `Ctrl+Shift+K` (`Command+Shift+K` on macOS) in `manifest.json` using Chrome Commands. Allows toggling the extension without losing focus on the page, keeping active popups and dropdowns open.
- **Chrome EyeDropper API**: Integrated Chromium's native `EyeDropper` API for instant, low-overhead color picking. The legacy screenshot-based capture remains active as a fallback for unsupported browsers.

### Changed
- **Non-blocking Canvas Overlay / Прозрачный холст**: Switched `.plane` canvas overlay to `pointer-events: none`. Pointer events now pass through to page elements, preserving CSS `:hover` states, tooltips, and JS hover menus while the extension is active.
- **Event Interception on Page / Блокировка действий страницы**: Intercepted `pointerdown`, `pointerup`, `mousedown`, `mouseup`, and `click` events on the `window` in the capture phase to prevent click side-effects on page elements when tools are active.
- **Dynamic Resize Listeners**: Window resize/drag listeners are now added dynamically on resize handles and removed immediately when dragging ends, eliminating idle performance overhead.

### Optimized
- **Inspector Caching / Устранение Layout Thrashing**: Cached the hovered element during inspector and typography detection (`updateHoverElement` / `updateHoverFont`). Heavy style computations (`getComputedStyle` and `document.fonts.check`) are skipped if the cursor moves within the same element, completely eliminating mousemove performance bottlenecks.
- **Code Deduplication / Дедупликация кода**: Unified redundant drawing blocks into a single `drawHighlightRect` utility and merged mousedown/mouseup/click blockages into a single `preventPageClick` handler.
