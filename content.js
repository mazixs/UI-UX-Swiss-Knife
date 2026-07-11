(function bootSiteSwissKnife() {
  const GLOBAL_KEY = "__siteSwissKnife";

  if (window[GLOBAL_KEY]) {
    window[GLOBAL_KEY].toggle();
    return;
  }

  const geometry = window.SiteKnifeGeometry;
  const colorTools = window.SiteKnifeColor;
  const elementLabels = window.SiteKnifeElementLabels;
  const fontTools = window.SiteKnifeFont;

  const host = document.createElement("div");
  host.id = "site-swiss-knife-root";
  host.setAttribute("data-site-swiss-knife", "root");
  host.style.position = "fixed";
  host.style.inset = "0";
  host.style.zIndex = "2147483647";
  host.style.pointerEvents = "none";
  host.style.colorScheme = "dark";

  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      :host {
        all: initial;
        color-scheme: dark;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .plane {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
      }

      .plane.is-active {
        pointer-events: none;
      }

      .panel {
        position: fixed;
        top: 16px;
        right: 16px;
        width: min(400px, calc(100vw - 32px));
        min-width: min(360px, calc(100vw - 32px));
        min-height: 430px;
        max-width: calc(100vw - 16px);
        max-height: calc(100vh - 32px);
        overflow: auto;
        pointer-events: auto;
        background: rgba(18, 22, 27, 0.94);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 8px;
        box-shadow: 0 18px 55px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(0, 0, 0, 0.18);
        color: #f6f7f8;
        backdrop-filter: blur(14px);
        user-select: none;
        scrollbar-width: thin;
      }

      .titlebar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 10px 10px 8px 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        cursor: grab;
      }

      .titlebar:active {
        cursor: grabbing;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 0;
      }

      .mark {
        width: 22px;
        height: 22px;
        display: grid;
        place-items: center;
        border-radius: 5px;
        background: linear-gradient(135deg, #eff4ff, #9fd9c7 48%, #ffd36a);
        color: #101317;
        font-size: 13px;
        font-weight: 900;
      }

      .window-actions {
        display: flex;
        gap: 4px;
      }

      button {
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 7px;
        background: rgba(255, 255, 255, 0.07);
        color: #f6f7f8;
        font: inherit;
        letter-spacing: 0;
        cursor: pointer;
      }

      button:hover {
        background: rgba(255, 255, 255, 0.12);
      }

      button:active {
        transform: translateY(1px);
      }

      .icon-button {
        width: 28px;
        height: 28px;
        display: grid;
        place-items: center;
        padding: 0;
        font-size: 16px;
        line-height: 1;
      }

      .body {
        display: grid;
        gap: 12px;
        padding: 12px;
      }

      .tool-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 6px;
      }

      .tool-button {
        display: grid;
        gap: 4px;
        justify-items: center;
        min-height: 64px;
        padding: 9px 4px 8px;
        font-size: 13px;
        line-height: 1.1;
        white-space: normal;
      }

      .tool-button strong {
        font-size: 19px;
        line-height: 1;
      }

      .tool-button.is-active,
      .toggle-button.is-active {
        border-color: rgba(255, 211, 106, 0.9);
        background: rgba(255, 211, 106, 0.16);
        color: #fff5d7;
      }

      .controls {
        display: grid;
        grid-template-columns: 1fr 1fr 34px;
        gap: 6px;
      }

      .toggle-button,
      .plain-button {
        min-height: 34px;
        padding: 0 9px;
        font-size: 14px;
        white-space: nowrap;
      }

      .readout {
        display: grid;
        gap: 8px;
        padding: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.055);
      }

      .readout-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        color: #aeb8c3;
        font-size: 13px;
        text-transform: uppercase;
      }

      .big-value {
        color: #ffffff;
        font-size: 25px;
        line-height: 1.05;
        font-weight: 800;
        letter-spacing: 0;
      }

      .subtle {
        color: #aeb8c3;
        font-size: 14px;
        line-height: 1.35;
      }

      .color-row {
        display: grid;
        grid-template-columns: 42px 1fr;
        gap: 9px;
        align-items: center;
      }

      .swatch {
        width: 42px;
        height: 42px;
        border-radius: 7px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        background:
          linear-gradient(45deg, #777 25%, transparent 25%),
          linear-gradient(-45deg, #777 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #777 75%),
          linear-gradient(-45deg, transparent 75%, #777 75%);
        background-color: #2d3339;
        background-position: 0 0, 0 6px, 6px -6px, -6px 0;
        background-size: 12px 12px;
      }

      .code-list {
        display: grid;
        gap: 5px;
        max-height: 118px;
        overflow: auto;
      }

      .copy-list {
        display: grid;
        gap: 5px;
        max-height: 138px;
        overflow: auto;
      }

      .chip,
      .copy-row {
        max-width: 100%;
        padding: 4px 6px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.07);
        color: #edf2f5;
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
        font-size: 13px;
        line-height: 1.28;
        overflow-wrap: anywhere;
      }

      .copy-row {
        display: grid;
        grid-template-columns: minmax(52px, max-content) minmax(0, 1fr);
        gap: 8px;
        width: 100%;
        text-align: left;
      }

      .copy-row:hover {
        border-color: rgba(255, 211, 106, 0.55);
      }

      .copy-label {
        color: #aeb8c3;
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        font-size: 12px;
        text-transform: uppercase;
      }

      .copy-value {
        min-width: 0;
        overflow-wrap: anywhere;
      }

      .chip[data-kind="selector"] {
        color: #9fd9c7;
      }

      .chip[data-kind="framework"],
      .copy-row[data-kind="framework"],
      .copy-row[data-kind="font"] {
        color: #ffd36a;
      }

      .copy-row[data-kind="selector"],
      .copy-row[data-kind="color"] {
        color: #9fd9c7;
      }

      .status {
        min-height: 18px;
        color: #aeb8c3;
        font-size: 14px;
        line-height: 1.35;
      }

      .resize-handle {
        position: sticky;
        left: 0;
        bottom: 0;
        width: 26px;
        height: 26px;
        display: grid;
        place-items: center;
        margin: -4px 0 0 -4px;
        color: rgba(246, 247, 248, 0.72);
        cursor: nesw-resize;
        pointer-events: auto;
        touch-action: none;
        z-index: 2;
        border-radius: 0 7px 0 7px;
        background: rgba(255, 255, 255, 0.08);
        border-top: 1px solid rgba(255, 255, 255, 0.12);
        border-right: 1px solid rgba(255, 255, 255, 0.12);
        font-size: 14px;
        line-height: 1;
      }

      .resize-handle:hover {
        background: rgba(255, 211, 106, 0.16);
        color: #fff5d7;
      }

      .loupe {
        position: fixed;
        display: none;
        width: 126px;
        pointer-events: none;
        transform: translate(18px, 18px);
        border: 1px solid rgba(255, 255, 255, 0.22);
        border-radius: 8px;
        overflow: hidden;
        background: rgba(18, 22, 27, 0.94);
        box-shadow: 0 14px 38px rgba(0, 0, 0, 0.34);
      }

      .loupe canvas {
        display: block;
        width: 126px;
        height: 92px;
        image-rendering: pixelated;
        background: #11161b;
      }

      .loupe-value {
        display: grid;
        grid-template-columns: 18px 1fr;
        gap: 6px;
        align-items: center;
        padding: 6px;
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
        font-size: 11px;
      }

      .loupe-mini {
        width: 18px;
        height: 18px;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.25);
      }
    </style>

    <canvas class="plane is-active" part="plane"></canvas>

    <div class="panel" part="panel">
      <div class="titlebar" data-drag-handle>
        <div class="brand"><span class="mark">UX</span><span>UI/UX Swiss Knife</span></div>
        <div class="window-actions">
          <button class="icon-button" type="button" data-action="hide" title="Скрыть">×</button>
        </div>
      </div>

      <div class="body">
        <div class="tool-grid">
          <button class="tool-button is-active" type="button" data-tool="measure" title="Провести линию A-B и получить расстояние в пикселях">
            <strong>↔</strong><span>A-B</span>
          </button>
          <button class="tool-button" type="button" data-tool="color" title="Навести лупу на пиксель, кликнуть для фиксации цвета">
            <strong>◉</strong><span>Цвет</span>
          </button>
          <button class="tool-button" type="button" data-tool="inspect" title="Кликнуть элемент и получить id, class, data-атрибуты и selector">
            <strong>⌖</strong><span>Имена</span>
          </button>
          <button class="tool-button" type="button" data-tool="font" title="Кликнуть текстовый блок и получить подробные параметры шрифта">
            <strong>Aa</strong><span>Шрифт</span>
          </button>
        </div>

        <div class="controls">
          <button class="toggle-button" type="button" data-action="toggle-snap" title="При включении линия притягивается к 0, 45, 90 градусам">Выравнивание</button>
          <button class="plain-button" type="button" data-action="refresh-capture" title="Переснять видимую область для пипетки после скролла или изменений страницы">Обновить</button>
          <button class="icon-button" type="button" data-action="clear" title="Очистить измерения и фиксации">⌫</button>
        </div>

        <div class="readout">
          <div class="readout-title"><span>Измерение</span><span data-measure-count>0</span></div>
          <div class="big-value" data-measure-value>0 px</div>
          <div class="subtle" data-measure-detail>Зажмите ЛКМ в точке A и отпустите в точке B.</div>
        </div>

        <div class="readout">
          <div class="readout-title"><span>Пипетка</span><span data-color-state>ждет</span></div>
          <div class="color-row">
            <div class="swatch" data-color-swatch></div>
            <div>
              <div class="big-value" data-color-hex>#------</div>
              <div class="subtle" data-color-rgb>Нажмите “Цвет” и наведите на пиксель.</div>
            </div>
          </div>
          <div class="copy-list" data-color-menu></div>
        </div>

        <div class="readout">
          <div class="readout-title"><span>Имена блока</span><span data-inspect-state>live</span></div>
          <div class="code-list" data-code-list>
            <span class="chip">кликните элемент</span>
          </div>
        </div>

        <div class="readout">
          <div class="readout-title"><span>Шрифт</span><span data-font-state>live</span></div>
          <div class="copy-list" data-font-list>
            <span class="chip">кликните текст</span>
          </div>
          <div class="status" data-status>Готово к работе.</div>
        </div>
      </div>
      <div class="resize-handle" data-resize-handle title="Потянуть, чтобы расширить панель">↙</div>
    </div>

    <div class="loupe" data-loupe>
      <canvas data-loupe-canvas width="126" height="92"></canvas>
      <div class="loupe-value">
        <span class="loupe-mini" data-loupe-swatch></span>
        <span data-loupe-text>#------</span>
      </div>
    </div>
  `;

  document.documentElement.appendChild(host);

  const state = {
    visible: true,
    tool: "measure",
    snap: false,
    measurements: [],
    draft: null,
    hoverPoint: null,
    capture: null,
    hoverColor: null,
    lockedColor: null,
    hoverElement: null,
    fixedElementLabels: null,
    hoverFont: null,
    fixedFontInfo: null,
    drag: null,
    resize: null,
    dpr: window.devicePixelRatio || 1
  };

  const canvas = shadow.querySelector(".plane");
  const ctx = canvas.getContext("2d");
  const panel = shadow.querySelector(".panel");
  const resizeHandle = shadow.querySelector("[data-resize-handle]");
  const loupe = shadow.querySelector("[data-loupe]");
  const loupeCanvas = shadow.querySelector("[data-loupe-canvas]");
  const loupeCtx = loupeCanvas.getContext("2d");

  const ui = {
    toolButtons: Array.from(shadow.querySelectorAll("[data-tool]")),
    snapButton: shadow.querySelector('[data-action="toggle-snap"]'),
    measureCount: shadow.querySelector("[data-measure-count]"),
    measureValue: shadow.querySelector("[data-measure-value]"),
    measureDetail: shadow.querySelector("[data-measure-detail]"),
    colorState: shadow.querySelector("[data-color-state]"),
    colorSwatch: shadow.querySelector("[data-color-swatch]"),
    colorHex: shadow.querySelector("[data-color-hex]"),
    colorRgb: shadow.querySelector("[data-color-rgb]"),
    colorMenu: shadow.querySelector("[data-color-menu]"),
    inspectState: shadow.querySelector("[data-inspect-state]"),
    codeList: shadow.querySelector("[data-code-list]"),
    fontState: shadow.querySelector("[data-font-state]"),
    fontList: shadow.querySelector("[data-font-list]"),
    status: shadow.querySelector("[data-status]"),
    loupeSwatch: shadow.querySelector("[data-loupe-swatch]"),
    loupeText: shadow.querySelector("[data-loupe-text]")
  };

  function resizeCanvas() {
    state.dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(window.innerWidth * state.dpr));
    canvas.height = Math.max(1, Math.round(window.innerHeight * state.dpr));
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    render();
  }

  function setStatus(message) {
    ui.status.textContent = message;
  }

  let cursorStyleEl = null;

  function setPageCursor(cursor) {
    if (!cursor) {
      if (cursorStyleEl) {
        cursorStyleEl.remove();
        cursorStyleEl = null;
      }
      return;
    }

    if (!cursorStyleEl) {
      cursorStyleEl = document.createElement("style");
      cursorStyleEl.id = "site-swiss-knife-cursor-style";
      document.documentElement.appendChild(cursorStyleEl);
    }
    cursorStyleEl.textContent = `* { cursor: ${cursor} !important; }`;
  }

  async function openNativeEyeDropper() {
    setStatus("Открываю системную пипетку...");
    ui.colorState.textContent = "ожидание";
    try {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      const hex = result.sRGBHex;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const sample = {
        r, g, b, a: 255,
        hex,
        rgb: `rgb(${r}, ${g}, ${b})`
      };
      state.lockedColor = sample;
      updateColorReadout(sample, true);
      setStatus(`Цвет зафиксирован: ${hex}.`);
      ui.colorState.textContent = "зафикс.";
    } catch (err) {
      setStatus("Системная пипетка отменена.");
      ui.colorState.textContent = "live";
    }
  }

  function setTool(tool) {
    state.tool = tool;
    state.draft = null;
    state.hoverPoint = null;
    state.hoverElement = null;
    state.hoverFont = null;
    canvas.classList.toggle("is-active", state.visible);
    
    if (state.visible) {
      const cursor = tool === "measure" ? "crosshair" : tool === "color" ? "none" : "cell";
      setPageCursor(cursor);
    } else {
      setPageCursor(null);
    }
    loupe.style.display = "none";

    ui.toolButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tool === tool);
    });

    if (tool === "color") {
      if (window.EyeDropper) {
        openNativeEyeDropper();
      } else {
        refreshCapture();
        setStatus("Пипетка работает по снимку видимой области: наведите лупу и кликните ЛКМ.");
      }
    } else if (tool === "inspect") {
      setStatus("Инспектор активен: наведите на блок и кликните, чтобы зафиксировать имена.");
    } else if (tool === "font") {
      setStatus("Детектор шрифтов активен: наведите на текст и кликните для фиксации параметров.");
    } else {
      setStatus("Измерение активно: протяните линию от точки A до точки B.");
    }

    render();
  }

  function toggleVisible(force) {
    state.visible = typeof force === "boolean" ? force : !state.visible;
    host.style.display = state.visible ? "block" : "none";
    canvas.classList.toggle("is-active", state.visible);
    if (!state.visible) {
      loupe.style.display = "none";
      setPageCursor(null);
    } else {
      const cursor = state.tool === "measure" ? "crosshair" : state.tool === "color" ? "none" : "cell";
      setPageCursor(cursor);

      if (state.tool === "color" && window.EyeDropper) {
        openNativeEyeDropper();
      }
    }
  }

  function clearAll() {
    state.measurements = [];
    state.draft = null;
    state.hoverPoint = null;
    state.hoverColor = null;
    state.lockedColor = null;
    state.fixedElementLabels = null;
    state.hoverElement = null;
    state.hoverFont = null;
    state.fixedFontInfo = null;
    updateMeasureReadout(null);
    updateColorReadout(null, false);
    renderLabels([]);
    renderFontInfo([]);
    setStatus("Очищено.");
    render();
  }

  function pointerPoint(event) {
    return { x: event.clientX, y: event.clientY };
  }

  function handlePointerDown(event) {
    if (event.button !== 0) return;
    const point = pointerPoint(event);

    if (state.tool === "measure") {
      state.draft = { start: point, end: point };
      canvas.setPointerCapture(event.pointerId);
      event.preventDefault();
      render();
    }

    if (state.tool === "color") {
      lockCurrentColor();
      event.preventDefault();
    }

    if (state.tool === "inspect") {
      lockCurrentElement();
      event.preventDefault();
    }

    if (state.tool === "font") {
      lockCurrentFont();
      event.preventDefault();
    }
  }

  function handlePointerMove(event) {
    const point = pointerPoint(event);
    state.hoverPoint = point;

    if (state.tool === "measure" && state.draft) {
      state.draft.end = geometry.snapPoint(state.draft.start, point, state.snap);
      updateMeasureReadout(geometry.measurementFromPoints(state.draft.start, point, state.snap));
      render();
    }

    if (state.tool === "color") {
      updateHoverColor(point);
      render();
    }

    if (state.tool === "inspect") {
      updateHoverElement(point);
      render();
    }

    if (state.tool === "font") {
      updateHoverFont(point);
      render();
    }
  }

  function handlePointerUp(event) {
    if (state.tool !== "measure" || !state.draft) return;

    const point = pointerPoint(event);
    const measurement = geometry.measurementFromPoints(state.draft.start, point, state.snap);
    if (measurement.distance >= 1) {
      state.measurements.push({ id: Date.now(), ...measurement });
      updateMeasureReadout(measurement);
      setStatus(`Зафиксировано: ${measurement.label}.`);
    }

    state.draft = null;
    canvas.releasePointerCapture(event.pointerId);
    render();
  }

  function handlePointerLeave() {
    if (state.tool === "color" && !state.lockedColor) loupe.style.display = "none";
  }

  async function refreshCapture() {
    if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
      setStatus("Снимок вкладки недоступен вне Chrome extension context.");
      return;
    }

    ui.colorState.textContent = "снимок";
    setStatus("Обновляю чистый снимок страницы для пипетки.");

    try {
      const previousDisplay = host.style.display;
      host.style.display = "none";
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const response = await chrome.runtime.sendMessage({ type: "SITE_SWISS_KNIFE_CAPTURE_VISIBLE_TAB" });
      host.style.display = previousDisplay;
      if (!response?.ok) throw new Error(response?.error || "Не удалось получить снимок.");
      state.capture = await createCapture(response.dataUrl);
      ui.colorState.textContent = "live";
      setStatus("Пипетка обновлена: после скролла или анимаций нажмите “Обновить” еще раз.");
    } catch (error) {
      host.style.display = state.visible ? "block" : "none";
      ui.colorState.textContent = "ошибка";
      setStatus(`Пипетка не получила снимок: ${error.message}`);
    }
  }

  function createCapture(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const offscreen = document.createElement("canvas");
        offscreen.width = image.naturalWidth;
        offscreen.height = image.naturalHeight;
        const offscreenCtx = offscreen.getContext("2d", { willReadFrequently: true });
        offscreenCtx.drawImage(image, 0, 0);
        resolve({
          canvas: offscreen,
          ctx: offscreenCtx,
          width: offscreen.width,
          height: offscreen.height,
          scaleX: offscreen.width / Math.max(1, window.innerWidth),
          scaleY: offscreen.height / Math.max(1, window.innerHeight)
        });
      };
      image.onerror = () => reject(new Error("Chrome вернул нечитаемый снимок."));
      image.src = dataUrl;
    });
  }

  function sampleCapture(point) {
    if (!state.capture) return null;
    const x = Math.max(0, Math.min(state.capture.width - 1, Math.round(point.x * state.capture.scaleX)));
    const y = Math.max(0, Math.min(state.capture.height - 1, Math.round(point.y * state.capture.scaleY)));
    const imageData = state.capture.ctx.getImageData(x, y, 1, 1);
    return {
      ...colorTools.sampleImageData(imageData, 0, 0),
      imageX: x,
      imageY: y
    };
  }

  function updateHoverColor(point) {
    const sample = sampleCapture(point);
    if (!sample) return;
    state.hoverColor = sample;
    if (!state.lockedColor) updateColorReadout(sample, false);
    updateLoupe(point, sample);
  }

  function updateLoupe(point, sample) {
    if (!state.capture) return;

    const sourceSize = 11;
    const targetWidth = loupeCanvas.width;
    const targetHeight = loupeCanvas.height;
    const sx = Math.max(0, Math.min(state.capture.width - sourceSize, sample.imageX - Math.floor(sourceSize / 2)));
    const sy = Math.max(0, Math.min(state.capture.height - sourceSize, sample.imageY - Math.floor(sourceSize / 2)));

    loupeCtx.imageSmoothingEnabled = false;
    loupeCtx.clearRect(0, 0, targetWidth, targetHeight);
    loupeCtx.drawImage(state.capture.canvas, sx, sy, sourceSize, sourceSize, 0, 0, targetWidth, targetHeight);
    loupeCtx.strokeStyle = "rgba(255, 211, 106, 0.95)";
    loupeCtx.lineWidth = 2;
    loupeCtx.strokeRect(targetWidth / 2 - 7, targetHeight / 2 - 7, 14, 14);

    ui.loupeSwatch.style.background = sample.hex;
    ui.loupeText.textContent = sample.hex;
    loupe.style.left = `${Math.min(window.innerWidth - 150, point.x)}px`;
    loupe.style.top = `${Math.min(window.innerHeight - 128, point.y)}px`;
    loupe.style.display = "block";
  }

  function updateColorReadout(sample, locked) {
    const value = sample || state.lockedColor;
    if (!value) {
      ui.colorSwatch.style.background = "";
      ui.colorHex.textContent = "#------";
      ui.colorRgb.textContent = "Нажмите “Цвет” и наведите на пиксель.";
      ui.colorState.textContent = "ждет";
      renderCopyList(ui.colorMenu, [], "кликните пиксель");
      return;
    }

    ui.colorSwatch.style.background = value.hex;
    ui.colorHex.textContent = value.hex;
    ui.colorRgb.textContent = value.rgb;
    ui.colorState.textContent = locked ? "зафикс." : "live";

    if (locked) {
      renderCopyList(
        ui.colorMenu,
        colorTools.formatColorOptions(value).map((item) => ({ ...item, type: "color", copyText: item.value })),
        "кликните пиксель"
      );
    }
  }

  async function lockCurrentColor() {
    if (!state.hoverColor) return;
    state.lockedColor = state.hoverColor;
    updateColorReadout(state.lockedColor, true);
    setStatus(`Цвет зафиксирован: ${state.lockedColor.hex}. Нажмите нужный формат, чтобы скопировать.`);
  }

  function pickPageElement(point) {
    return document
      .elementsFromPoint(point.x, point.y)
      .find((element) => element !== host && !host.contains(element) && element.getAttribute("data-site-swiss-knife") !== "root");
  }

  function updateHoverElement(point) {
    const element = pickPageElement(point);
    if (!element) return;

    if (state.hoverElement && state.hoverElement.element === element) {
      state.hoverElement.rect = element.getBoundingClientRect();
      return;
    }

    const rect = element.getBoundingClientRect();
    const hints = getFrameworkHints(element);
    const labels = elementLabels.extractElementLabels(element, hints);

    state.hoverElement = { element, rect, labels };
    if (!state.fixedElementLabels) renderLabels(labels);
  }

  function lockCurrentElement() {
    if (!state.hoverElement) return;
    state.fixedElementLabels = state.hoverElement.labels;
    renderLabels(state.fixedElementLabels);

    const selector = state.fixedElementLabels.find((item) => item.type === "selector")?.value || "";
    if (selector) {
      setStatus(`Имена блока зафиксированы. Нажмите любую строку, чтобы скопировать.`);
    } else {
      setStatus("Имена блока зафиксированы.");
    }
    ui.inspectState.textContent = "зафикс.";
  }

  function updateHoverFont(point) {
    const element = pickPageElement(point);
    if (!element) return;

    if (state.hoverFont && state.hoverFont.element === element) {
      state.hoverFont.rect = element.getBoundingClientRect();
      return;
    }

    const rect = element.getBoundingClientRect();
    const computed = getComputedStyle(element);
    const loadedCandidates = fontTools
      .splitFontFamilies(computed.fontFamily)
      .filter((family) => isFontCandidateLoaded(family, computed));
    const info = fontTools.extractFontInfo(computed, loadedCandidates);

    state.hoverFont = { element, rect, info };
    if (!state.fixedFontInfo) renderFontInfo(info);
  }

  function lockCurrentFont() {
    if (!state.hoverFont) return;
    state.fixedFontInfo = state.hoverFont.info;
    renderFontInfo(state.fixedFontInfo);
    ui.fontState.textContent = "зафикс.";
    setStatus("Параметры шрифта зафиксированы. Нажмите любую строку, чтобы скопировать.");
  }

  function isFontCandidateLoaded(family, computed) {
    const generic = new Set(["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui", "ui-sans-serif", "ui-serif", "ui-monospace"]);
    if (!family || generic.has(family)) return false;
    if (!document.fonts?.check) return false;

    try {
      const style = computed.fontStyle || "normal";
      const weight = computed.fontWeight || "400";
      const size = computed.fontSize || "16px";
      return document.fonts.check(`${style} ${weight} ${size} "${family}"`);
    } catch {
      return false;
    }
  }

  function getFrameworkHints(element) {
    const hints = new Set();

    Object.keys(element).forEach((key) => {
      if (key.startsWith("__reactFiber$")) {
        let fiber = element[key];
        let hops = 0;
        while (fiber && hops < 8) {
          const name = fiber.elementType?.displayName || fiber.elementType?.name || fiber.type?.displayName || fiber.type?.name;
          if (name && name !== "Fragment") hints.add(name);
          fiber = fiber.return;
          hops += 1;
        }
      }
    });

    if (element.__vueParentComponent?.type?.name) hints.add(element.__vueParentComponent.type.name);
    if (element.__vue__?.$options?.name) hints.add(element.__vue__.$options.name);

    try {
      const angularComponent = window.ng?.getComponent?.(element);
      const angularName = angularComponent?.constructor?.name;
      if (angularName) hints.add(angularName);
    } catch {
      // Framework dev hooks are best-effort and can throw on production pages.
    }

    return Array.from(hints);
  }

  function renderLabels(labels) {
    if (!labels.length) {
      ui.codeList.innerHTML = '<span class="chip">кликните элемент</span>';
      ui.inspectState.textContent = "live";
      return;
    }

    renderCopyList(ui.codeList, elementLabels.copyableElementLabels(labels), "кликните элемент");
  }

  function renderFontInfo(info) {
    if (!info.length) {
      ui.fontList.innerHTML = '<span class="chip">кликните текст</span>';
      ui.fontState.textContent = "live";
      return;
    }

    renderCopyList(ui.fontList, info.map((item) => ({ ...item, type: "font" })), "кликните текст");
  }

  function renderCopyList(container, items, emptyText) {
    if (!items.length) {
      container.innerHTML = `<span class="chip">${emptyText}</span>`;
      return;
    }

    container.replaceChildren(
      ...items.map((item) => {
        const row = document.createElement("button");
        row.className = "copy-row";
        row.type = "button";
        row.dataset.kind = item.type || "value";
        row.dataset.copyValue = item.copyText || item.value;
        row.dataset.copyLabel = item.label;
        row.title = "Скопировать";

        const label = document.createElement("span");
        label.className = "copy-label";
        label.textContent = item.label;

        const value = document.createElement("span");
        value.className = "copy-value";
        value.textContent = item.value;

        row.append(label, value);
        return row;
      })
    );
  }

  async function copyText(text, label) {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setStatus(`Скопировано ${label}: ${text}`);
    } catch {
      setStatus(`Не удалось скопировать автоматически. Значение: ${text}`);
    }
  }

  function updateMeasureReadout(measurement) {
    ui.measureCount.textContent = String(state.measurements.length);
    if (!measurement) {
      ui.measureValue.textContent = "0 px";
      ui.measureDetail.textContent = "Зажмите ЛКМ в точке A и отпустите в точке B.";
      return;
    }

    ui.measureValue.textContent = measurement.label;
    ui.measureDetail.textContent = `dx ${geometry.roundPixel(measurement.dx)} px / dy ${geometry.roundPixel(measurement.dy)} px`;
  }

  function render() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    state.measurements.forEach((measurement) => drawMeasurement(measurement, false));

    if (state.draft) {
      drawMeasurement({
        start: state.draft.start,
        end: state.draft.end,
        label: geometry.measurementFromPoints(state.draft.start, state.draft.end, false).label
      }, true);
    }

    if (state.tool === "inspect" && state.hoverElement?.rect) {
      drawElementRect(state.hoverElement.rect);
    }

    if (state.tool === "font" && state.hoverFont?.rect) {
      drawFontRect(state.hoverFont.rect, state.hoverFont.info);
    }

    if (state.tool === "color" && state.hoverPoint) {
      drawCrosshair(state.hoverPoint);
    }
  }

  function drawMeasurement(measurement, draft) {
    const { start, end } = measurement;
    const mid = geometry.midpoint(start, end);

    ctx.save();
    ctx.lineWidth = draft ? 2 : 2.5;
    ctx.strokeStyle = draft ? "rgba(255, 211, 106, 0.88)" : "rgba(93, 214, 181, 0.95)";
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    drawPoint(start, "A", draft);
    drawPoint(end, "B", draft);
    drawFloatingLabel(mid.x, mid.y, measurement.label, draft);
    ctx.restore();
  }

  function drawPoint(point, label, draft) {
    ctx.save();
    ctx.fillStyle = draft ? "#ffd36a" : "#5dd6b5";
    ctx.strokeStyle = "#101317";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#101317";
    ctx.font = "700 10px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, point.x, point.y - 16);
    ctx.restore();
  }

  function drawFloatingLabel(x, y, text, draft) {
    ctx.save();
    ctx.font = "700 12px system-ui, sans-serif";
    const paddingX = 8;
    const width = ctx.measureText(text).width + paddingX * 2;
    const height = 24;
    const left = Math.max(8, Math.min(window.innerWidth - width - 8, x - width / 2));
    const top = Math.max(8, Math.min(window.innerHeight - height - 8, y - height - 10));
    roundRect(ctx, left, top, width, height, 7);
    ctx.fillStyle = draft ? "rgba(255, 211, 106, 0.96)" : "rgba(18, 22, 27, 0.94)";
    ctx.fill();
    ctx.strokeStyle = draft ? "rgba(20, 20, 20, 0.35)" : "rgba(93, 214, 181, 0.9)";
    ctx.stroke();
    ctx.fillStyle = draft ? "#11161b" : "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, left + width / 2, top + height / 2 + 0.5);
    ctx.restore();
  }

  function drawHighlightRect(rect, labelText, borderStroke, fillStyle, draft) {
    ctx.save();
    ctx.strokeStyle = borderStroke;
    ctx.fillStyle = fillStyle;
    ctx.lineWidth = 2;
    ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
    ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
    drawFloatingLabel(rect.left + rect.width / 2, rect.top, labelText, draft);
    ctx.restore();
  }

  function drawElementRect(rect) {
    drawHighlightRect(
      rect,
      `${Math.round(rect.width)} × ${Math.round(rect.height)} px`,
      "rgba(255, 211, 106, 0.96)",
      "rgba(255, 211, 106, 0.12)",
      true
    );
  }

  function drawFontRect(rect, info) {
    const family = info.find((item) => item.label === "Family")?.value || "font";
    const size = info.find((item) => item.label === "Size")?.value || "";
    const shortFamily = family.split(",")[0].replace(/^["']|["']$/g, "");
    drawHighlightRect(
      rect,
      `${shortFamily} ${size}`.trim(),
      "rgba(159, 217, 199, 0.96)",
      "rgba(159, 217, 199, 0.12)",
      false
    );
  }

  function drawCrosshair(point) {
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(point.x - 10, point.y);
    ctx.lineTo(point.x + 10, point.y);
    ctx.moveTo(point.x, point.y - 10);
    ctx.lineTo(point.x, point.y + 10);
    ctx.stroke();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.75)";
    ctx.strokeRect(point.x - 5, point.y - 5, 10, 10);
    ctx.restore();
  }

  function roundRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function handlePanelClick(event) {
    const copyButton = event.target.closest("[data-copy-value]");
    const toolButton = event.target.closest("[data-tool]");
    const actionButton = event.target.closest("[data-action]");

    if (copyButton) {
      copyText(copyButton.dataset.copyValue, copyButton.dataset.copyLabel || "значение");
      return;
    }

    if (toolButton) {
      setTool(toolButton.dataset.tool);
      return;
    }

    if (!actionButton) return;

    if (actionButton.dataset.action === "toggle-snap") {
      state.snap = !state.snap;
      ui.snapButton.classList.toggle("is-active", state.snap);
      ui.snapButton.textContent = state.snap ? "Выровнено" : "Выравнивание";
      setStatus(state.snap ? "Выравнивание включено: шаг 45 градусов." : "Свободная линия: можно вести от угла к углу без притяжения.");
    }

    if (actionButton.dataset.action === "refresh-capture") {
      refreshCapture();
    }

    if (actionButton.dataset.action === "clear") {
      clearAll();
    }

    if (actionButton.dataset.action === "hide") {
      toggleVisible(false);
    }
  }

  function handlePanelPointerDown(event) {
    if (event.target.closest("[data-resize-handle]")) {
      beginPanelResize(event);
      return;
    }

    if (!event.target.closest("[data-drag-handle]") || event.target.closest("button")) return;
    const rect = panel.getBoundingClientRect();
    state.drag = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top
    };
    panel.setPointerCapture(event.pointerId);
  }

  function handlePanelPointerMove(event) {
    if (state.resize) {
      updatePanelResize(event.clientX, event.clientY);
      return;
    }

    if (!state.drag) return;
    const nextLeft = Math.max(8, Math.min(window.innerWidth - panel.offsetWidth - 8, event.clientX - state.drag.offsetX));
    const nextTop = Math.max(8, Math.min(window.innerHeight - panel.offsetHeight - 8, event.clientY - state.drag.offsetY));
    panel.style.left = `${nextLeft}px`;
    panel.style.right = "auto";
    panel.style.top = `${nextTop}px`;
  }

  function handlePanelPointerUp(event) {
    if (state.resize) {
      endPanelResize(event);
      return;
    }

    if (!state.drag) return;
    state.drag = null;
    panel.releasePointerCapture(event.pointerId);
  }

  function beginPanelResize(event) {
    if (state.resize) return;
    const rect = panel.getBoundingClientRect();
    state.resize = {
      startX: event.clientX,
      startY: event.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
      right: window.innerWidth - rect.right,
      top: rect.top
    };
    panel.style.right = `${state.resize.right}px`;
    panel.style.left = "auto";
    panel.style.top = `${state.resize.top}px`;

    try {
      if (typeof panel.setPointerCapture === "function" && event.pointerId !== undefined) {
        panel.setPointerCapture(event.pointerId);
      }
    } catch {
      // Resize still works through global move listeners.
    }

    window.addEventListener("pointermove", handleWindowResizeMove, true);
    window.addEventListener("pointerup", handleWindowResizeUp, true);

    event.preventDefault();
    event.stopPropagation();
  }

  function updatePanelResize(clientX, clientY) {
    const maxWidth = Math.max(360, window.innerWidth - state.resize.right - 8);
    const maxHeight = Math.max(430, window.innerHeight - state.resize.top - 8);
    const nextWidth = Math.max(360, Math.min(maxWidth, state.resize.startWidth + (state.resize.startX - clientX)));
    const nextHeight = Math.max(430, Math.min(maxHeight, state.resize.startHeight + (clientY - state.resize.startY)));
    panel.style.width = `${nextWidth}px`;
    panel.style.height = `${nextHeight}px`;
  }

  function handleWindowResizeMove(event) {
    if (!state.resize) return;
    updatePanelResize(event.clientX, event.clientY);
    event.preventDefault();
  }

  function endPanelResize(event) {
    state.resize = null;
    try {
      if (typeof panel.releasePointerCapture === "function" && event?.pointerId !== undefined) {
        panel.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Pointer capture can already be released when mouse fallback ends the resize.
    }

    window.removeEventListener("pointermove", handleWindowResizeMove, true);
    window.removeEventListener("pointerup", handleWindowResizeUp, true);
  }

  function handleWindowResizeUp(event) {
    if (!state.resize) return;
    endPanelResize(event);
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      state.draft = null;
      loupe.style.display = "none";
      toggleVisible(false);
      render();
    }
  }

  function handlePagePointerDown(event) {
    if (!state.visible) return;
    if (event.composedPath().includes(host)) return;
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();

    const point = pointerPoint(event);

    if (state.tool === "measure") {
      state.draft = { start: point, end: point };
      render();
    }

    if (state.tool === "color") {
      lockCurrentColor();
    }

    if (state.tool === "inspect") {
      lockCurrentElement();
    }

    if (state.tool === "font") {
      lockCurrentFont();
    }
  }

  function handlePagePointerMove(event) {
    if (!state.visible) return;
    if (event.composedPath().includes(host)) {
      if (state.tool === "color" && !state.lockedColor) {
        loupe.style.display = "none";
      }
      return;
    }

    const point = pointerPoint(event);
    state.hoverPoint = point;

    if (state.tool === "measure" && state.draft) {
      state.draft.end = geometry.snapPoint(state.draft.start, point, state.snap);
      updateMeasureReadout(geometry.measurementFromPoints(state.draft.start, point, state.snap));
      render();
    }

    if (state.tool === "color") {
      updateHoverColor(point);
      render();
    }

    if (state.tool === "inspect") {
      updateHoverElement(point);
      render();
    }

    if (state.tool === "font") {
      updateHoverFont(point);
      render();
    }
  }

  function handlePagePointerUp(event) {
    if (!state.visible) return;
    if (event.composedPath().includes(host)) return;
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();

    if (state.tool === "measure" && state.draft) {
      const point = pointerPoint(event);
      const measurement = geometry.measurementFromPoints(state.draft.start, point, state.snap);
      if (measurement.distance >= 1) {
        state.measurements.push({ id: Date.now(), ...measurement });
        updateMeasureReadout(measurement);
        setStatus(`Зафиксировано: ${measurement.label}.`);
      }
      state.draft = null;
      render();
    }
  }

  function preventPageClick(event) {
    if (!state.visible) return;
    if (event.composedPath().includes(host)) return;
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
  }

  panel.addEventListener("click", handlePanelClick);
  panel.addEventListener("pointerdown", handlePanelPointerDown);
  panel.addEventListener("pointermove", handlePanelPointerMove);
  panel.addEventListener("pointerup", handlePanelPointerUp);
  resizeHandle.addEventListener("pointerdown", beginPanelResize);
  resizeHandle.addEventListener("mousedown", beginPanelResize);
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("keydown", handleKeydown, true);

  window.addEventListener("pointerdown", handlePagePointerDown, true);
  window.addEventListener("pointermove", handlePagePointerMove, true);
  window.addEventListener("pointerup", handlePagePointerUp, true);
  window.addEventListener("mousedown", preventPageClick, true);
  window.addEventListener("mouseup", preventPageClick, true);
  window.addEventListener("click", preventPageClick, true);

  resizeCanvas();
  updateMeasureReadout(null);
  renderLabels([]);
  setTool("measure");

  window[GLOBAL_KEY] = {
    toggle: toggleVisible,
    destroy() {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeydown, true);
      window.removeEventListener("pointerdown", handlePagePointerDown, true);
      window.removeEventListener("pointermove", handlePagePointerMove, true);
      window.removeEventListener("pointerup", handlePagePointerUp, true);
      window.removeEventListener("mousedown", preventPageClick, true);
      window.removeEventListener("mouseup", preventPageClick, true);
      window.removeEventListener("click", preventPageClick, true);
      
      // Clean up resize listeners in case they were active
      window.removeEventListener("pointermove", handleWindowResizeMove, true);
      window.removeEventListener("pointerup", handleWindowResizeUp, true);

      setPageCursor(null);
      host.remove();
      delete window[GLOBAL_KEY];
    }
  };
})();
