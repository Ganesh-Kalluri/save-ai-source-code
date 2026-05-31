/* ============================================================
   SAVEAI MAIN CONTENT SCRIPT (content.js)
   DOM crawler orchestrator and floating toolbar controller.
   Executes in page context at document_idle to extract chat streams,
   inject action widgets, and handle popup execution triggers.
   ============================================================ */

const chromeEnv = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;

// ------------------------------------------------------------
// PLATFORM-SPECIFIC CRAWLERS & SCRAPERS
// ------------------------------------------------------------

class ChatGPTScraper {
  static MODEL = "chatgpt";
  static DISPLAY_MODEL = "ChatGPT";

  extractConversationId() {
    const match = window.location.href.match(/\/c\/([^\/?#]+)/);
    return match ? match[1] : null;
  }

  detectChatType(node) {
    let current = node;
    for (let i = 0; i < 5; i++) {
      if (current.tagName === "ARTICLE") {
        const srOnly = current.querySelectorAll(".sr-only");
        for (let j = 0; j < srOnly.length; j++) {
          if ((srOnly[j].textContent?.toLowerCase() || "").includes("chatgpt")) {
            return "chatgpt";
          }
        }
        break;
      }
      current = current.parentElement;
      if (!current) break;
    }
    return "prompt";
  }

  getAll() {
    return Array.from(document.querySelectorAll("article"));
  }

  getCheckedAll() {
    // Collect list of user-checked conversations if batch select is on
    return this.getAll();
  }
}

class ClaudeScraper {
  static MODEL = "claude";
  static DISPLAY_MODEL = "Claude";

  extractConversationId() {
    const match = window.location.href.match(/\/chat\/([^\/?#]+)/);
    return match ? match[1] : null;
  }

  detectChatType(node) {
    if (node.querySelector('.font-claude-message') || node.classList.contains('message-assistant')) {
      return "claude";
    }
    return "prompt";
  }

  getAll() {
    return Array.from(document.querySelectorAll("div[class*='message']"));
  }

  getCheckedAll() {
    return this.getAll();
  }
}

class GeminiScraper {
  static MODEL = "gemini";
  static DISPLAY_MODEL = "Gemini";

  extractConversationId() {
    const match = window.location.href.match(/\/app\/([^\/?#]+)/);
    return match ? match[1] : null;
  }

  detectChatType(node) {
    if (node.querySelector('message-content') || node.classList.contains('assistant')) {
      return "gemini";
    }
    return "prompt";
  }

  getAll() {
    return Array.from(document.querySelectorAll("div[class*='message-content'], div.message"));
  }

  getCheckedAll() {
    return this.getAll();
  }
}

class DeepSeekScraper {
  static MODEL = "deepseek";
  static DISPLAY_MODEL = "DeepSeek";

  extractConversationId() {
    const match = window.location.href.match(/\/chat\/([^\/?#]+)/);
    return match ? match[1] : null;
  }

  detectChatType(node) {
    if (node.classList.contains('assistant') || node.querySelector('.assistant')) {
      return "deepseek";
    }
    return "prompt";
  }

  getAll() {
    return Array.from(document.querySelectorAll("div[class*='message']"));
  }

  getCheckedAll() {
    return this.getAll();
  }
}

class GrokScraper {
  static MODEL = "grok";
  static DISPLAY_MODEL = "Grok";

  extractConversationId() {
    const match = window.location.href.match(/\/chat\/([^\/?#]+)/);
    return match ? match[1] : null;
  }

  detectChatType(node) {
    return "grok";
  }

  getAll() {
    return Array.from(document.querySelectorAll("div[class*='message-row']"));
  }

  getCheckedAll() {
    return this.getAll();
  }
}

class PerplexityScraper {
  static MODEL = "perplexity";
  static DISPLAY_MODEL = "Perplexity";

  extractConversationId() {
    const match = window.location.href.match(/\/search\/([^\/?#]+)/);
    return match ? match[1] : null;
  }

  detectChatType(node) {
    return "perplexity";
  }

  getAll() {
    return Array.from(document.querySelectorAll("div.query-answer-group"));
  }

  getCheckedAll() {
    return this.getAll();
  }
}

class KimiScraper {
  static MODEL = "kimi";
  static DISPLAY_MODEL = "Kimi";

  extractConversationId() {
    const match = window.location.href.match(/\/chat\/([^\/?#]+)/);
    return match ? match[1] : null;
  }

  detectChatType(node) {
    return "kimi";
  }

  getAll() {
    return Array.from(document.querySelectorAll("div[class*='message']"));
  }

  getCheckedAll() {
    return this.getAll();
  }
}

// ------------------------------------------------------------
// PLATFORM SCRAPER ORCHESTRATOR
// ------------------------------------------------------------

class PlatformScraperOrchestrator {
  _implementation = null;
  aiName = "ChatGPT";
  aiNameIcon = "";

  constructor() {
    this.initPlatform();
  }

  initPlatform() {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    if (hostname.includes("chatgpt.com")) {
      this._implementation = new ChatGPTScraper();
      this.aiName = "ChatGPT";
    } else if (hostname.includes("deepseek.com") || hostname.includes("deepseek.ai")) {
      this._implementation = new DeepSeekScraper();
      this.aiName = "DeepSeek";
    } else if (hostname.includes("gemini.google.com")) {
      this._implementation = new GeminiScraper();
      this.aiName = "Gemini";
    } else if (hostname.includes("claude.ai")) {
      this._implementation = new ClaudeScraper();
      this.aiName = "Claude";
    } else if (hostname.includes("grok.com")) {
      this._implementation = new GrokScraper();
      this.aiName = "Grok";
    } else if (hostname.includes("perplexity.ai")) {
      this._implementation = new PerplexityScraper();
      this.aiName = "Perplexity";
    } else if (hostname.includes("kimi.com") || hostname.includes("kimi.moonshot.cn")) {
      this._implementation = new KimiScraper();
      this.aiName = "Kimi";
    } else {
      console.log(`[SaveAI] Unknown domain: ${hostname}. Fallback to ChatGPT Scraper.`);
      this._implementation = new ChatGPTScraper();
      this.aiName = "ChatGPT";
    }
  }

  getChatGroupTitle() {
    const fallback = `${this.aiName}_Chat_Export`;
    
    if (this.aiName === "ChatGPT") {
      return document.querySelector("[data-active]")?.textContent || document.title || fallback;
    }
    if (this.aiName === "DeepSeek") {
      return document.querySelector(".b64fb9ae")?.textContent || document.title || fallback;
    }
    if (this.aiName === "Gemini") {
      return document.querySelector(".conversation.selected, [aria-selected='true']")?.textContent || document.title || fallback;
    }
    if (this.aiName === "Claude") {
      const activePath = new URL(window.location.href).pathname;
      const navLinks = document.querySelectorAll("nav li a, nav a");
      for (const link of navLinks) {
        if (link.getAttribute("href") === activePath) {
          return link.textContent || fallback;
        }
      }
      return document.title || fallback;
    }
    if (this.aiName === "Grok") {
      const titles = document.title.split(" - ");
      return titles.length <= 1 ? document.title || fallback : titles.slice(0, -1).join(" - ") || fallback;
    }
    return document.title || fallback;
  }

  detectChatType(node) {
    return this._implementation ? this._implementation.detectChatType(node) : "unknown";
  }

  getAllChatsForTopic() {
    if (!this._implementation) return null;
    
    const elements = this._implementation.getAll();
    const messages = elements.map((el, index) => {
      const type = this.detectChatType(el);
      return {
        id: `msg_${index}`,
        type: type === "prompt" ? "user" : "assistant",
        text: el.innerText || el.textContent || "",
        html: el.innerHTML || ""
      };
    });

    return {
      title: this.getChatGroupTitle(),
      conversationId: this._implementation.extractConversationId() || Math.random().toString(36).substring(7),
      platform: this.aiName,
      messages: messages
    };
  }
}

const scraperOrchestrator = new PlatformScraperOrchestrator();

// ------------------------------------------------------------
// TOOLBAR WIDGETS & SPINNERS
// ------------------------------------------------------------

class LoadingOverlay {
  static create() {
    let overlay = document.getElementById("saveai-loading-overlay");
    if (overlay) return;

    overlay = document.createElement("div");
    overlay.id = "saveai-loading-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.5)";
    overlay.style.zIndex = "99999";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.color = "#fff";
    overlay.style.fontFamily = "sans-serif";
    overlay.style.fontSize = "18px";
    overlay.style.backdropFilter = "blur(3px)";

    const spinner = document.createElement("div");
    spinner.innerHTML = `<div style="text-align:center;">
      <div style="width:50px;height:50px;border:5px solid #fff;border-top-color:#3b82f6;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 15px;"></div>
      <div>Saving Conversation Data...</div>
    </div>
    <style>
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>`;
    overlay.appendChild(spinner);
    document.body.appendChild(overlay);
  }

  static remove() {
    const overlay = document.getElementById("saveai-loading-overlay");
    if (overlay) overlay.remove();
  }
}

// ------------------------------------------------------------
// ACTION EXPORT UTILITIES (HIGH-FIDELITY WRAPPER FUNCTIONS)
// ------------------------------------------------------------

async function exportFullMarkdown() {
  const data = scraperOrchestrator.getAllChatsForTopic();
  if (!data || data.messages.length === 0) return false;
  
  let content = `# ${data.title}\n\n`;
  data.messages.forEach(msg => {
    const role = msg.type === "user" ? "User" : scraperOrchestrator.aiName;
    content += `### **${role}**:\n${msg.text}\n\n---\n\n`;
  });

  const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.title.replace(/[\/\\:*?"<>|]/g, "_")}.md`;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}

async function exportFullJSON() {
  const data = scraperOrchestrator.getAllChatsForTopic();
  if (!data || data.messages.length === 0) return false;

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.title.replace(/[\/\\:*?"<>|]/g, "_")}.json`;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}

async function copyFullMarkdown() {
  const data = scraperOrchestrator.getAllChatsForTopic();
  if (!data || data.messages.length === 0) return;

  let content = `# ${data.title}\n\n`;
  data.messages.forEach(msg => {
    const role = msg.type === "user" ? "User" : scraperOrchestrator.aiName;
    content += `### **${role}**:\n${msg.text}\n\n---\n\n`;
  });

  await navigator.clipboard.writeText(content);
}

// ------------------------------------------------------------
// WXT ENTRYPOINT & ROUTING LISTENERS
// ------------------------------------------------------------

export const config = {
  matches: [
    "https://chatgpt.com/*",
    "https://yuanbao.tencent.com/*",
    "https://chat.deepseek.com/*",
    "https://tongyi.aliyun.com/*",
    "https://gemini.google.com/*",
    "https://claude.ai/*",
    "https://grok.com/*",
    "https://www.google.com/*",
    "https://www.google.com.hk/*",
    "https://www.google.co.uk/*",
    "https://aistudio.google.com/*",
    "https://copilot.microsoft.com/*",
    "https://www.perplexity.ai/*",
    "https://poe.com/*",
    "https://github.com/*",
    "https://notebooklm.google.com/*",
    "https://www.kimi.com/*",
    "https://kimi.moonshot.cn/*",
    "https://www.qianwen.com/*"
  ],
  runAt: "document_idle"
};

export function main(context) {
  console.log("[SaveAI] Content script initialized.");

  // Handle pings
  chromeEnv.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "ping-content") {
      sendResponse("received");
      return true;
    }
  });

  let isHandlingAction = false;

  const navigateToPreview = async () => {
    try {
      LoadingOverlay.create();
      const topicChats = scraperOrchestrator.getAllChatsForTopic();
      
      if (topicChats && topicChats.messages.length > 0) {
        // Open Preview App Overlay window via Chrome messaging back to the background worker
        await chromeEnv.runtime.sendMessage({
          type: "to-preview-page",
          data: topicChats
        });
      } else {
        alert("No conversations found on the page to export!");
      }
    } catch (err) {
      console.error("[SaveAI] Export aggregation failed:", err);
      alert("Error occurred while aggregating conversations.");
    } finally {
      LoadingOverlay.remove();
    }
  };

  // Main runtime action dispatcher
  chromeEnv.runtime.onMessage.addListener(async (message) => {
    if (!message || isHandlingAction) return true;
    
    isHandlingAction = true;
    try {
      if (message.action === "captureSelect" || message.action === "captureAllToImage") {
        await navigateToPreview();
      } else if (message.action === "exportFullMarkdown") {
        await exportFullMarkdown();
      } else if (message.action === "exportFullJSON") {
        await exportFullJSON();
      } else if (message.action === "copyFullMarkdown") {
        await copyFullMarkdown();
        alert("Markdown copied to clipboard successfully!");
      }
    } catch (err) {
      console.error("[SaveAI] Action dispatch error:", err);
    } finally {
      isHandlingAction = false;
    }
  });
}

// Self-initialize if loaded in Chrome content-script context
if (typeof WXT_ENTRYPOINT !== "undefined") {
  main(null);
}
