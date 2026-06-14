const SCRIPT_FILES = [
  "src/core/geometry.js",
  "src/core/color.js",
  "src/core/element-labels.js",
  "src/core/font.js",
  "content.js"
];

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: SCRIPT_FILES
    });
  } catch (error) {
    console.warn("UI/UX Swiss Knife injection failed:", error);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "SITE_SWISS_KNIFE_CAPTURE_VISIBLE_TAB") {
    return false;
  }

  const windowId = sender.tab?.windowId;

  chrome.tabs.captureVisibleTab(windowId, { format: "png" }, (dataUrl) => {
    const lastError = chrome.runtime.lastError;
    if (lastError) {
      sendResponse({ ok: false, error: lastError.message });
      return;
    }

    sendResponse({ ok: true, dataUrl });
  });

  return true;
});
