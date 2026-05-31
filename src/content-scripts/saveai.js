/* ============================================================
   SAVEAI IDENTITY SYNC CONTENT SCRIPT (saveai.js)
   Runs on https://saveai.net/* to bridge authentication
   and user profile state between the website and the extension.
   ============================================================ */

const chromeEnv = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;

// Storage Keys
const EXT_AUTH_TOKEN_KEY = "auth_token_data";
const EXT_USER_INFO_KEY = "user_info_data";

const WEB_AUTH_TOKEN_KEY = "auth-token-data";
const WEB_USER_INFO_KEY = "auth-user-data";

const MESSAGE_SOURCE = "saveai";

// Event action types
const SYNC_ACTIONS = new Set(["login-sucess", "update"]);
const LOGOUT_ACTION = "logout";

/**
 * Validates the structure of the authentication token
 */
function isValidToken(data) {
  return (
    data &&
    typeof data === "object" &&
    typeof data.token === "string" &&
    data.token.length > 0 &&
    typeof data.refreshToken === "string" &&
    data.refreshToken.length > 0 &&
    typeof data.tokenExpires === "number" &&
    data.tokenExpires > 0
  );
}

/**
 * Validates the structure of the user profile
 */
function isValidUser(data) {
  return data && typeof data === "object" && !!data.uid;
}

/**
 * Safely reads and parses a JSON value from the website's localStorage
 */
function getFromLocalStorage(keys) {
  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch {
        // Ignore JSON parse errors and continue
      }
    }
  }
  return null;
}

/**
 * Clears the extension's stored session data
 */
async function clearExtensionSession() {
  await chromeEnv.storage.local.remove([EXT_AUTH_TOKEN_KEY, EXT_USER_INFO_KEY]);
}

/**
 * Synchronizes session data from website's localStorage into the extension
 */
async function syncSessionToExtension() {
  try {
    const syncData = {};

    // Get and validate token
    const token = getFromLocalStorage([WEB_AUTH_TOKEN_KEY]);
    if (token && isValidToken(token)) {
      syncData[EXT_AUTH_TOKEN_KEY] = token;
    }

    // Get and validate user profile
    const user = getFromLocalStorage([WEB_USER_INFO_KEY]);
    if (user && isValidUser(user)) {
      syncData[EXT_USER_INFO_KEY] = user;
    }

    if (Object.keys(syncData).length === 0) {
      return false;
    }

    await chromeEnv.storage.local.set(syncData);
    return true;
  } catch (err) {
    console.error("[SaveAI Sync] Sync failed:", err);
    return false;
  }
}

/**
 * Checks if the window postMessage is a valid SaveAI sync message
 */
function isValidSyncMessage(eventData) {
  return (
    eventData &&
    typeof eventData === "object" &&
    eventData.from === MESSAGE_SOURCE &&
    typeof eventData.type === "string"
  );
}

/**
 * Sets up listeners for messages sent from the saveai.net webapp
 */
function startSyncListener() {
  const handleMessage = async (event) => {
    try {
      if (event.source !== window || event.origin !== window.location.origin) {
        return;
      }

      const data = event.data;
      if (!isValidSyncMessage(data)) {
        return;
      }

      if (data.type === LOGOUT_ACTION) {
        console.log("[SaveAI Sync] Logging out, clearing session...");
        await clearExtensionSession();
        return;
      }

      if (SYNC_ACTIONS.has(data.type)) {
        console.log("[SaveAI Sync] Synchronizing session parameters...");
        await syncSessionToExtension();
      }
    } catch (err) {
      console.error("[SaveAI Sync] Error handling message:", err);
    }
  };

  window.addEventListener("message", handleMessage);

  return () => {
    window.removeEventListener("message", handleMessage);
  };
}

/**
 * WXT content script configuration block
 */
export const config = {
  matches: ["https://saveai.net/*"],
  runAt: "document_start"
};

/**
 * Main Content Script Entry
 */
export async function main(context) {
  console.log("[SaveAI Sync] Initializing identity bridge...");
  
  // Pre-sync state immediately on load
  await syncSessionToExtension();

  // Listen for dynamic updates during session
  const stopListener = startSyncListener();
  
  if (context && typeof context.onInvalidated === "function") {
    context.onInvalidated(() => {
      stopListener();
      console.log("[SaveAI Sync] Identity bridge stopped.");
    });
  }
}

// If executed in non-module context, self-initialize
if (typeof WXT_ENTRYPOINT !== "undefined") {
  main(null).catch(err => console.error("[SaveAI Sync] Start failed:", err));
}
