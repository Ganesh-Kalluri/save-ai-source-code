/**
 * SaveAI - Inject Web Script
 * 
 * This script is injected directly into target AI web pages (ChatGPT, Gemini, Claude, etc.)
 * to intercept API requests, authentication headers, and session tokens. It facilitates
 * communication between the webpage context and the extension's content scripts via a postMessage-based bridge.
 */

var injectWeb = (function() {
  "use strict";

  function unwrapMain(handler) {
    return handler == null || typeof handler === "function" ? { main: handler } : handler;
  }

  const BRIDGE_MESSAGE_TYPE = "web-bridge";
  const HANDSHAKE_ACTION = "__handshake__";

  /**
   * WebBridge handles two-way postMessage communication between
   * the webpage context and the content script context.
   */
  class WebBridge {
    constructor(communicationId, options = {}) {
      this.messageHandlers = new Map();
      this.pendingRequests = new Map();
      this.isReady = false;
      this.handshakeAttempts = 0;
      
      this.options = {
        requestTimeout: 30000,
        handshakeTimeout: 500,
        handshakeRetryInterval: 1000,
        maxHandshakeAttempts: 10
      };

      this.handleMessage = (event) => {
        const message = event.data;
        if (!message || typeof message !== "object" || message.type !== this.messageType) return;
        
        if (this.isAllowedId(message.communicationId)) {
          if (message.action) {
            this.handleRequestMessage(message);
          }
          if (message.requestId) {
            this.handleResponseMessage(message);
          }
        }
      };

      this.communicationId = communicationId;
      this.messageType = options.messageType || BRIDGE_MESSAGE_TYPE;
      this.allowedIds = new Set(options.allowedIds || []);
      Object.assign(this.options, options);
      
      this.setupMessageListener();
      this.setupHandshakeHandler();
    }

    addAllowedId(id) {
      this.allowedIds.add(id);
    }

    removeAllowedId(id) {
      this.allowedIds.delete(id);
    }

    isAllowedId(id) {
      return this.allowedIds.size === 0 || this.allowedIds.has(id);
    }

    generateId() {
      return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    async ensureReady() {
      if (!this.isReady) {
        if (this.readyPromise) return this.readyPromise;
        this.readyPromise = this.performHandshakeWithRetry();
        try {
          await this.readyPromise;
        } finally {
          this.readyPromise = undefined;
        }
      }
    }

    async performHandshakeWithRetry() {
      return new Promise((resolve, reject) => {
        const attemptHandshake = async () => {
          try {
            await this.sendSingleHandshakeRequest();
            this.isReady = true;
            this.stopHandshakeRetry();
            resolve();
          } catch (error) {
            this.handshakeAttempts++;
            if (this.handshakeAttempts >= this.options.maxHandshakeAttempts) {
              this.stopHandshakeRetry();
              reject(new Error(`Connection handshake failed: ${error}`));
              return;
            }
            this.handshakeRetryInterval = setTimeout(attemptHandshake, this.options.handshakeRetryInterval);
          }
        };
        attemptHandshake();
      });
    }

    async sendSingleHandshakeRequest() {
      return new Promise((resolve, reject) => {
        const requestId = this.generateId();
        const timeoutId = setTimeout(() => {
          this.pendingRequests.delete(requestId);
          reject(new Error("Handshake timeout"));
        }, this.options.handshakeTimeout);

        this.pendingRequests.set(requestId, { resolve, reject, timeout: timeoutId });

        const message = {
          type: this.messageType,
          communicationId: this.communicationId,
          id: requestId,
          action: HANDSHAKE_ACTION,
          data: { timestamp: Date.now() },
          needResponse: true,
          timestamp: Date.now()
        };
        globalThis.postMessage(message, "*");
      });
    }

    stopHandshakeRetry() {
      if (this.handshakeRetryInterval) {
        clearTimeout(this.handshakeRetryInterval);
        this.handshakeRetryInterval = undefined;
      }
    }

    send(action, data) {
      const message = {
        type: this.messageType,
        communicationId: this.communicationId,
        id: this.generateId(),
        action: action,
        data: data,
        needResponse: false,
        timestamp: Date.now()
      };
      globalThis.postMessage(message, "*");
    }

    async invoke(action, data) {
      await this.ensureReady();
      return this.invokeRequest(action, data);
    }

    async invokeRequest(action, data) {
      return new Promise((resolve, reject) => {
        const requestId = this.generateId();
        const timeoutId = setTimeout(() => {
          this.pendingRequests.delete(requestId);
          reject(new Error(`Request timeout: ${action}`));
        }, this.options.requestTimeout);

        this.pendingRequests.set(requestId, { resolve, reject, timeout: timeoutId });

        const message = {
          type: this.messageType,
          communicationId: this.communicationId,
          id: requestId,
          action: action,
          data: data,
          needResponse: true,
          timestamp: Date.now()
        };
        globalThis.postMessage(message, "*");
      });
    }

    handle(action, handler) {
      this.messageHandlers.set(action, handler);
      return () => {
        this.messageHandlers.delete(action);
      };
    }

    getReady() {
      return this.isReady;
    }

    destroy() {
      this.stopHandshakeRetry();
      this.messageHandlers.clear();
      this.clearPendingRequests();
      globalThis.removeEventListener("message", this.handleMessage);
    }

    setupMessageListener() {
      this.handleMessage = this.handleMessage.bind(this);
      globalThis.addEventListener("message", this.handleMessage);
    }

    async handleRequestMessage(message) {
      const { action, data, needResponse, id } = message;
      try {
        const handler = this.messageHandlers.get(action);
        if (!handler) {
          if (needResponse) {
            this.sendResponse(id, false, undefined, `No handler registered for: ${action}`);
          }
          return;
        }
        let result = handler(data);
        if (result && typeof result.then === "function") {
          result = await result;
        }
        if (needResponse) {
          this.sendResponse(id, true, result);
        }
      } catch (error) {
        console.error(`Error handling message [${action}]:`, error);
        if (needResponse) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.sendResponse(id, false, undefined, errorMessage);
        }
      }
    }

    handleResponseMessage(message) {
      const { requestId, success, data, error } = message;
      const pending = this.pendingRequests.get(requestId);
      if (pending) {
        clearTimeout(pending.timeout);
        this.pendingRequests.delete(requestId);
        if (success) {
          pending.resolve(data);
        } else {
          pending.reject(new Error(error || "Unknown response error"));
        }
      }
    }

    sendResponse(requestId, success, data, error) {
      const message = {
        type: this.messageType,
        communicationId: this.communicationId,
        id: this.generateId(),
        requestId: requestId,
        success: success,
        data: data,
        error: error,
        timestamp: Date.now()
      };
      globalThis.postMessage(message, "*");
    }

    setupHandshakeHandler() {
      this.handle(HANDSHAKE_ACTION, () => ({
        success: true,
        timestamp: Date.now()
      }));
    }

    clearPendingRequests() {
      this.pendingRequests.forEach(({ reject, timeout }) => {
        clearTimeout(timeout);
        reject(new Error("Connection disconnected"));
      });
      this.pendingRequests.clear();
    }
  }

  function createWebBridge(communicationId, options = {}) {
    return new WebBridge(communicationId, options);
  }

  /**
   * Gemini Auth Data Storage
   */
  class GeminiAuthStore {
    static reqId = null;
    static updatedAt = null;
    static extHeaders = {};

    static setReqId(reqId) {
      if (reqId) {
        this.reqId = reqId;
        this.updatedAt = Date.now();
      }
    }

    static getLatest() {
      return {
        reqId: this.reqId,
        updatedAt: this.updatedAt
      };
    }

    static setExtHeaders(headers) {
      this.extHeaders = { ...this.extHeaders, ...headers };
    }

    static getExtHeaders() {
      return this.extHeaders;
    }
  }

  /**
   * Gemini Request interceptor using XMLHttpRequests
   */
  class GeminiInterceptor {
    originalXHROpen = null;
    originalXHRSend = null;
    isHooked = false;
    targetUrl = "/_/BardChatUi/data/batchexecute";

    start() {
      if (!this.isHooked) {
        this.hookXHR();
        this.isHooked = true;
      }
    }

    stop() {
      if (this.isHooked) {
        this.unhookXHR();
        this.isHooked = false;
      }
    }

    isGeminiAPIRequest(url) {
      return url.includes(this.targetUrl);
    }

    hasTargetRpcids(url) {
      try {
        return new URL(url, window.location.origin).searchParams.get("rpcids") === "hNvQHb";
      } catch {
        return false;
      }
    }

    hookXHR() {
      this.originalXHROpen = XMLHttpRequest.prototype.open;
      this.originalXHRSend = XMLHttpRequest.prototype.send;
      
      const self = this;
      
      XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this._interceptor_url = url;
        this._interceptor_headers = {};
        const originalSetHeader = this.setRequestHeader.bind(this);
        
        this.setRequestHeader = function(header, value) {
          if (header.toLowerCase().startsWith("x-goog-ext-")) {
            this._interceptor_headers[header] = value;
          }
          originalSetHeader(header, value);
        };
        
        return self.originalXHROpen.call(this, method, url, async !== false, user || null, password || null);
      };

      XMLHttpRequest.prototype.send = function(body) {
        const url = this._interceptor_url;
        const headers = this._interceptor_headers;
        
        if (url && self.isGeminiAPIRequest(url)) {
          try {
            const reqId = new URL(url, window.location.origin).searchParams.get("_reqid");
            if (reqId) {
              GeminiAuthStore.setReqId(reqId);
            }
          } catch {}
          
          if (url && self.hasTargetRpcids(url) && headers && Object.keys(headers).length > 0) {
            GeminiAuthStore.setExtHeaders(headers);
          }
        }
        return self.originalXHRSend.call(this, body);
      };
    }

    unhookXHR() {
      if (this.originalXHROpen) {
        XMLHttpRequest.prototype.open = this.originalXHROpen;
      }
      if (this.originalXHRSend) {
        XMLHttpRequest.prototype.send = this.originalXHRSend;
      }
    }
  }

  /**
   * Base Network Hook / Interceptor supporting Fetch and XHR
   */
  class NetworkHook {
    originalFetch = null;
    originalXHROpen = null;
    originalXHRSend = null;
    isHooked = false;
    enableFetch = true;
    enableXHR = false;

    start() {
      if (!this.isHooked) {
        if (this.enableFetch) this.hookFetch();
        if (this.enableXHR) this.hookXHR();
        this.isHooked = true;
      }
    }

    stop() {
      if (this.isHooked) {
        if (this.enableFetch) this.unhookFetch();
        if (this.enableXHR) this.unhookXHR();
        this.isHooked = false;
      }
    }

    getHeaderValue(headers, key) {
      if (!headers) return null;
      const lowerKey = key.toLowerCase();
      if (headers instanceof Headers) {
        return headers.get(key) || null;
      }
      if (Array.isArray(headers)) {
        for (const [k, v] of headers) {
          if (k.toLowerCase() === lowerKey) return v;
        }
        return null;
      }
      const rawHeaders = headers;
      const matchedKey = Object.keys(rawHeaders).find(k => k.toLowerCase() === lowerKey) || null;
      return matchedKey ? rawHeaders[matchedKey] : null;
    }

    getAllHeaders(headers) {
      const result = {};
      if (!headers) return result;
      if (headers instanceof Headers) {
        const seen = new Set();
        headers.forEach((value, key) => {
          const lower = key.toLowerCase();
          if (!seen.has(lower)) {
            seen.add(lower);
            result[key] = value;
          }
        });
        return result;
      }
      if (Array.isArray(headers)) {
        const seen = new Set();
        for (const [key, value] of headers) {
          const lower = key.toLowerCase();
          if (!seen.has(lower)) {
            seen.add(lower);
            result[key] = value;
          }
        }
        return result;
      }
      const rawHeaders = headers;
      const seen = new Set();
      for (const key of Object.keys(rawHeaders)) {
        const lower = key.toLowerCase();
        if (!seen.has(lower)) {
          seen.add(lower);
          result[key] = rawHeaders[key];
        }
      }
      return result;
    }

    resolveUrl(target) {
      try {
        return typeof target === "string" ? new URL(target, window.location.origin).href :
               target instanceof URL ? target.href : target.url;
      } catch {
        return window.location.href;
      }
    }

    hookFetch() {
      this.originalFetch = window.fetch;
      const self = this;
      
      window.fetch = function(input, init) {
        try {
          const url = self.resolveUrl(input);
          if (self.isTargetRequest(url)) {
            const headers = init && init.headers ? init.headers : 
                            (typeof input !== "string" && !(input instanceof URL) ? input.headers : null);
            self.onTargetMatch(headers, url);
          }
        } catch {}
        return self.originalFetch.apply(this, arguments);
      };
    }

    hookXHR() {
      this.originalXHROpen = XMLHttpRequest.prototype.open;
      this.originalXHRSend = XMLHttpRequest.prototype.send;
      
      const self = this;
      
      XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        try {
          this._interceptor_url = new URL(url, window.location.origin).href;
        } catch {
          this._interceptor_url = url;
        }
        this._interceptor_headers = {};
        
        if (!this._interceptor_setRequestHeaderHooked) {
          this._interceptor_originalSetRequestHeader = this.setRequestHeader.bind(this);
          this._interceptor_setRequestHeaderHooked = true;
          this.setRequestHeader = function(header, value) {
            this._interceptor_headers[header] = value;
            this._interceptor_originalSetRequestHeader(header, value);
          };
        }
        return self.originalXHROpen.call(this, method, url, async !== false, user || null, password || null);
      };

      XMLHttpRequest.prototype.send = function(body) {
        try {
          const url = this._interceptor_url;
          if (url && self.isTargetRequest(url)) {
            const headers = this._interceptor_headers || {};
            self.onTargetMatch(headers, url);
          }
        } catch {}
        return self.originalXHRSend.call(this, body);
      };
    }

    unhookFetch() {
      if (this.originalFetch) {
        window.fetch = this.originalFetch;
      }
    }

    unhookXHR() {
      if (this.originalXHROpen) {
        XMLHttpRequest.prototype.open = this.originalXHROpen;
      }
      if (this.originalXHRSend) {
        XMLHttpRequest.prototype.send = this.originalXHRSend;
      }
    }
  }

  /**
   * Copilot Auth Data Storage
   */
  class CopilotAuthStore {
    static authorization = null;
    static userIdentityType = null;
    static updatedAt = null;

    static setAuthData(auth, identityType) {
      if (auth) {
        this.authorization = auth;
        if (identityType !== undefined) {
          this.userIdentityType = identityType;
        }
        this.updatedAt = Date.now();
      }
    }

    static getLatest() {
      return {
        authorization: this.authorization,
        userIdentityType: this.userIdentityType,
        updatedAt: this.updatedAt
      };
    }
  }
  window.CopilotAuthStore = CopilotAuthStore;

  /**
   * Copilot network requests interceptor
   */
  class CopilotInterceptor extends NetworkHook {
    name = "Copilot";
    apiOrigin = "https://copilot.microsoft.com";
    apiPathPrefix = "/c/api/";

    isTargetRequest(url) {
      try {
        const u = new URL(url);
        return u.origin === this.apiOrigin && u.pathname.startsWith(this.apiPathPrefix);
      } catch {
        return false;
      }
    }

    onTargetMatch(headers) {
      if (!headers) return;
      const auth = this.getHeaderValue(headers, "Authorization");
      const userIdentity = this.getHeaderValue(headers, "X-Useridentitytype");
      if (auth) {
        CopilotAuthStore.setAuthData(auth, userIdentity);
      }
    }
  }

  /**
   * ChatGPT Auth Data Storage
   */
  class ChatGPTAuthStore {
    static authorization = null;
    static updatedAt = null;
    static extraHeaders = {};

    static setAuthData(auth) {
      if (auth) {
        this.authorization = auth;
        this.updatedAt = Date.now();
      }
    }

    static setExtraHeaders(headers) {
      this.extraHeaders = headers;
      this.updatedAt = Date.now();
    }

    static getLatest() {
      return {
        authorization: this.authorization,
        updatedAt: this.updatedAt,
        extraHeaders: Object.keys(this.extraHeaders).length > 0 ? this.extraHeaders : undefined
      };
    }
  }
  window.ChatGPTAuthStore = ChatGPTAuthStore;

  const CHATGPT_EXTRA_HEADER_PREFIXES = ["chatgpt-", "oai-"];

  /**
   * ChatGPT network requests interceptor
   */
  class ChatGPTInterceptor extends NetworkHook {
    name = "ChatGPT";
    targetPath = "/backend-api/";

    isTargetRequest(url) {
      return url.includes(this.targetPath);
    }

    onTargetMatch(headers) {
      if (!headers) return;
      const auth = this.getHeaderValue(headers, "Authorization");
      if (auth) {
        ChatGPTAuthStore.setAuthData(auth);
      }

      const allHeaders = this.getAllHeaders(headers);
      const extraHeaders = {};
      for (const [key, value] of Object.entries(allHeaders)) {
        const lowerKey = key.toLowerCase();
        if (CHATGPT_EXTRA_HEADER_PREFIXES.some(prefix => lowerKey.startsWith(prefix))) {
          extraHeaders[key] = value;
        }
      }
      if (Object.keys(extraHeaders).length > 0) {
        ChatGPTAuthStore.setExtraHeaders(extraHeaders);
      }
    }
  }

  /**
   * Google AI Auth / Request URL Storage
   */
  class GoogleAIAuthStore {
    static url = null;
    static updatedAt = null;

    static setUrl(url) {
      if (url) {
        this.url = url;
        this.updatedAt = Date.now();
      }
    }

    static getLatest() {
      return {
        url: this.url,
        updatedAt: this.updatedAt
      };
    }
  }

  /**
   * Google AI studio request interceptor
   */
  class GoogleAIInterceptor {
    originalXHROpen = null;
    originalXHRSend = null;
    originalFetch = null;
    isHooked = false;
    targetSuffix = "MakerSuiteService/ResolveDriveResource";

    start() {
      if (!this.isHooked) {
        this.hookXHR();
        this.hookFetch();
        this.isHooked = true;
      }
    }

    stop() {
      if (this.isHooked) {
        this.unhookXHR();
        this.unhookFetch();
        this.isHooked = false;
      }
    }

    isTargetRequest(url) {
      const uStr = typeof url === "string" ? url : url.toString();
      return uStr.endsWith(this.targetSuffix) || 
             uStr.includes(this.targetSuffix + "?") || 
             uStr.includes(this.targetSuffix + "$");
    }

    hookXHR() {
      this.originalXHROpen = XMLHttpRequest.prototype.open;
      this.originalXHRSend = XMLHttpRequest.prototype.send;
      const self = this;

      XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this._interceptor_url = url;
        return self.originalXHROpen.call(this, method, url, async !== false, user || null, password || null);
      };

      XMLHttpRequest.prototype.send = function(body) {
        const url = this._interceptor_url;
        if (url && self.isTargetRequest(url)) {
          GoogleAIAuthStore.setUrl(url);
        }
        return self.originalXHRSend.call(this, body);
      };
    }

    hookFetch() {
      this.originalFetch = window.fetch;
      const self = this;

      window.fetch = async function(input, init) {
        let url;
        if (input instanceof Request) {
          url = input.url;
        } else {
          url = input;
        }
        if (self.isTargetRequest(url)) {
          const uStr = typeof url === "string" ? url : url.toString();
          GoogleAIAuthStore.setUrl(uStr);
        }
        return self.originalFetch.call(window, input, init);
      };
    }

    unhookXHR() {
      if (this.originalXHROpen) {
        XMLHttpRequest.prototype.open = this.originalXHROpen;
      }
      if (this.originalXHRSend) {
        XMLHttpRequest.prototype.send = this.originalXHRSend;
      }
    }

    unhookFetch() {
      if (this.originalFetch) {
        window.fetch = this.originalFetch;
      }
    }
  }

  /**
   * NotebookLM Auth Data Storage
   */
  class NotebookLMAuthStore {
    static reqId = null;
    static atToken = null;
    static conversationUuid = null;
    static updatedAt = null;

    static setReqId(reqId) {
      if (reqId) {
        this.reqId = reqId;
        this.updatedAt = Date.now();
      }
    }

    static setAtToken(token) {
      if (token) {
        this.atToken = token;
        this.updatedAt = Date.now();
      }
    }

    static setConversationUuid(uuid) {
      if (uuid) {
        this.conversationUuid = uuid;
        this.updatedAt = Date.now();
      }
    }

    static getLatest() {
      return {
        reqId: this.reqId,
        atToken: this.atToken,
        conversationUuid: this.conversationUuid,
        updatedAt: this.updatedAt
      };
    }
  }

  /**
   * NotebookLM interceptor
   */
  class NotebookLMInterceptor {
    originalXHROpen = null;
    originalXHRSend = null;
    isHooked = false;
    targetUrl = "/_/LabsTailwindUi/data/batchexecute";

    start() {
      if (!this.isHooked) {
        this.hookXHR();
        this.isHooked = true;
      }
    }

    stop() {
      if (this.isHooked) {
        this.unhookXHR();
        this.isHooked = false;
      }
    }

    isNotebookLMAPIRequest(url) {
      return url.includes(this.targetUrl);
    }

    hasTargetRpcids(url) {
      try {
        const rpcids = new URL(url, window.location.origin).searchParams.get("rpcids");
        return rpcids === "VfAZjd" || rpcids === "khqZz";
      } catch {
        return false;
      }
    }

    hookXHR() {
      this.originalXHROpen = XMLHttpRequest.prototype.open;
      this.originalXHRSend = XMLHttpRequest.prototype.send;
      const self = this;

      XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this._interceptor_url = url;
        return self.originalXHROpen.call(this, method, url, async !== false, user || null, password || null);
      };

      XMLHttpRequest.prototype.send = function(body) {
        const url = this._interceptor_url;
        if (url && self.isNotebookLMAPIRequest(url) && self.hasTargetRpcids(url)) {
          try {
            const reqId = new URL(url, window.location.origin).searchParams.get("_reqid");
            if (reqId) {
              NotebookLMAuthStore.setReqId(reqId);
            }
          } catch {}

          if (typeof body === "string") {
            if (body.includes("at=")) {
              try {
                const token = new URLSearchParams(body).get("at");
                if (token) NotebookLMAuthStore.setAtToken(token);
              } catch {}
            }
          } else if (body instanceof URLSearchParams) {
            const token = body.get("at");
            if (token) NotebookLMAuthStore.setAtToken(token);
          } else if (body instanceof FormData) {
            const token = body.get("at");
            if (token && typeof token === "string") {
              NotebookLMAuthStore.setAtToken(token);
            }
          }

          try {
            const rpcids = new URL(url, window.location.origin).searchParams.get("rpcids");
            if (rpcids === "khqZz") {
              let fReq = null;
              if (typeof body === "string" && body.includes("f.req=")) {
                fReq = new URLSearchParams(body).get("f.req");
              } else if (body instanceof URLSearchParams) {
                fReq = body.get("f.req");
              } else if (body instanceof FormData) {
                const reqVal = body.get("f.req");
                fReq = typeof reqVal === "string" ? reqVal : null;
              }
              
              if (fReq) {
                const reqJson = JSON.parse(fReq);
                const reqPayload = reqJson?.[0]?.[0]?.[1];
                if (reqPayload) {
                  const innerPayload = JSON.parse(reqPayload);
                  const uuid = innerPayload?.[3];
                  if (uuid && typeof uuid === "string") {
                    NotebookLMAuthStore.setConversationUuid(uuid);
                  }
                }
              }
            }
          } catch {}
        }
        return self.originalXHRSend.call(this, body);
      };
    }

    unhookXHR() {
      if (this.originalXHROpen) {
        XMLHttpRequest.prototype.open = this.originalXHROpen;
      }
      if (this.originalXHRSend) {
        XMLHttpRequest.prototype.send = this.originalXHRSend;
      }
    }
  }

  /**
   * Kimi Auth Data Storage
   */
  class KimiAuthStore {
    static authorization = null;
    static extraHeaders = {};
    static listMessagesUrl = null;
    static updatedAt = null;

    static setAuthData(auth) {
      if (auth) {
        this.authorization = auth;
        this.updatedAt = Date.now();
      }
    }

    static setExtraHeaders(headers) {
      this.extraHeaders = { ...this.extraHeaders, ...headers };
      this.updatedAt = Date.now();
    }

    static setListMessagesUrl(url) {
      if (url) {
        this.listMessagesUrl = url;
        this.updatedAt = Date.now();
      }
    }

    static getLatest() {
      return {
        authorization: this.authorization,
        extraHeaders: this.extraHeaders,
        listMessagesUrl: this.listMessagesUrl,
        updatedAt: this.updatedAt
      };
    }
  }
  window.KimiAuthStore = KimiAuthStore;

  /**
   * Kimi requests interceptor
   */
  class KimiInterceptor extends NetworkHook {
    name = "Kimi";
    enableXHR = true;
    apiPrefixes = ["https://www.kimi.com/api", "https://www.kimi.com/apiv2"];
    servicePrefix = "/apiv2/kimi.gateway.chat";
    methodSuffix = "/ListMessages";
    extraHeaderKeys = ["x-language", "x-msh-device-id", "x-msh-platform", "x-msh-session-id", "x-msh-version", "x-traffic-id", "r-timezone"];

    isListMessagesRequest(url) {
      const path = url.split("?")[0];
      return path.includes(this.servicePrefix) && path.endsWith(this.methodSuffix);
    }

    isTargetRequest(url) {
      return this.apiPrefixes.some(prefix => url.startsWith(prefix));
    }

    onTargetMatch(headers, url) {
      const allHeaders = headers ? this.getAllHeaders(headers) : {};
      if (!headers) return;

      if (url && this.isListMessagesRequest(url)) {
        KimiAuthStore.setListMessagesUrl(url);
      }

      const auth = this.getHeaderValue(headers, "authorization");
      if (auth) {
        KimiAuthStore.setAuthData(auth);
      }

      const matchedHeaders = {};
      for (const [key, value] of Object.entries(allHeaders)) {
        const lowerKey = key.toLowerCase();
        if (this.extraHeaderKeys.includes(lowerKey)) {
          matchedHeaders[key] = value;
        }
      }
      if (Object.keys(matchedHeaders).length > 0) {
        KimiAuthStore.setExtraHeaders(matchedHeaders);
      }
    }
  }

  // Define and run the main bridge initialization
  const mainModule = unwrapMain(() => {
    const bridge = createWebBridge("inject-chat-web", {
      allowedIds: ["saveai-extension-content"]
    });

    // Register query handlers for target contexts to poll retrieved authentication tokens
    bridge.handle("getGeminiGlobalData", () => window.WIZ_global_data);
    bridge.handle("getGoogleAiKeys", () => window.AF_initDataKeys);
    bridge.handle("getCopilotAuthHeader", () => CopilotAuthStore.getLatest());
    bridge.handle("getChatGPTAuthHeader", () => ChatGPTAuthStore.getLatest());
    bridge.handle("getGeminiLatestReqId", () => GeminiAuthStore.getLatest());
    bridge.handle("getGeminiExtHeaders", () => GeminiAuthStore.getExtHeaders());
    bridge.handle("getGoogleAiResolveUrl", () => GoogleAIAuthStore.getLatest());
    bridge.handle("getNotebookLMLatestReqId", () => NotebookLMAuthStore.getLatest());
    bridge.handle("getKimiAuthHeader", () => KimiAuthStore.getLatest());

    // Hook setups for active platforms
    const startGemini = () => {
      const hook = new GeminiInterceptor();
      hook.start();
      window.addEventListener("beforeunload", () => hook.stop());
    };

    const startCopilot = () => {
      const hook = new CopilotInterceptor();
      hook.start();
      window.addEventListener("beforeunload", () => hook.stop());
    };

    const startChatGPT = () => {
      const hook = new ChatGPTInterceptor();
      hook.start();
      window.addEventListener("beforeunload", () => hook.stop());
    };

    const startGoogleAI = () => {
      const hook = new GoogleAIInterceptor();
      hook.start();
      window.addEventListener("beforeunload", () => hook.stop());
    };

    const startNotebookLM = () => {
      const hook = new NotebookLMInterceptor();
      hook.start();
      window.addEventListener("beforeunload", () => hook.stop());
    };

    const startKimi = () => {
      const hook = new KimiInterceptor();
      hook.start();
      window.addEventListener("beforeunload", () => hook.stop());
    };

    const isGemini = document.URL.includes("https://gemini.google.com");
    const isCopilot = document.URL.includes("https://copilot.microsoft.com");
    const isChatGPT = document.URL.includes("https://chatgpt.com");
    const isGoogleAI = document.URL.includes("https://aistudio.google.com");
    const isNotebookLM = document.URL.includes("https://notebooklm.google.com");
    const isKimi = document.URL.includes("https://www.kimi.com");

    if (isGemini) startGemini();
    if (isCopilot) startCopilot();
    if (isChatGPT) startChatGPT();
    if (isGoogleAI) startGoogleAI();
    if (isNotebookLM) startNotebookLM();
    if (isKimi) startKimi();
  });

  // Safe Logger utility
  function noop() {}
  function debugLog(loggerFunc, ...args) {}
  
  const logger = {
    debug: (...args) => debugLog(console.debug, ...args),
    log: (...args) => debugLog(console.log, ...args),
    warn: (...args) => debugLog(console.warn, ...args),
    error: (...args) => debugLog(console.error, ...args)
  };

  return (async () => {
    try {
      return await mainModule.main();
    } catch (error) {
      console.error('The injected script "inject-web" crashed on startup!', error);
      throw error;
    }
  })();
})();

injectWeb;