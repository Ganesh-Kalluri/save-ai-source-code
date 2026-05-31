/**
 * SaveAI - Google Chrome Tab and Window Navigation Helpers
 * 
 * Extracts information about currently active browser instances, routes
 * actions and parameters downstream, and schedules analytics dispatching.
 */

const browserAPI = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;

export const databaseIcon = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
];

export const getActiveTabId = async () => {
  const tabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
  return tabs[0]?.id;
};

export const getActiveTabHost = async () => {
  try {
    const tabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
    return tabs[0] && tabs[0].url ? new URL(tabs[0].url).host : "";
  } catch {
    return "";
  }
};

export const sendActionToActiveTab = async (action, data = {}) => {
  try {
    const tabId = await getActiveTabId();
    if (!tabId) return;
    await browserAPI.tabs.sendMessage(tabId, { action, data });
  } catch (error) {
    console.error(`Error sending message to active tab for action ${action}:`, error);
  } finally {
    window.close(); // Closes extension popup overlay
  }
};

export const logUserAction = async (actionName, extraParams = {}) => {
  try {
    const host = await getActiveTabHost();
    // Dispatch telemetry event to background worker
    await browserAPI.runtime.sendMessage({
      eventName: "ga4-send-event",
      data: {
        eventName: "click_action",
        params: {
          ...extraParams,
          host_url: host,
          trigger_source: "popup"
        }
      }
    });
  } catch (error) {
    console.warn("Telemetry log action failed:", error);
  }
};

export const trackPopupClick = async (actionName) => {
  await logUserAction(actionName);
};
