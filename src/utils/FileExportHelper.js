/**
 * SaveAI - Download and Document Export Helper (React/JS)
 * 
 * Manages file sanitization, document conversions (PDF, Word docx, Markdown, JSON, Text),
 * clipboard data injection, and progress overlay triggers.
 */

import { MessageConfig } from '../config/MessageConfig.js';
import { PageSettings } from '../config/PageSettings.js';
import { generateRandomUid } from '../utils/uid.js';

export class FileExportHelper {
  static DEFAULT_FILENAME = "chat-export";

  static sanitizeFilename(name) {
    if (!name) return this.DEFAULT_FILENAME;
    return name
      .replace(/[<>:"/\\|?*]/g, "") // Strips forbidden windows/unix filename symbols
      .replace(/\s+/g, "-")         // Replaces spacing with dashes
      .replace(/^-+|-+$/g, "")
      .substring(0, 200);
  }

  static getFilename(title, ext) {
    return `${this.sanitizeFilename(title)}.${ext}`;
  }

  static async getTextExportOptions(fromUrl) {
    const enableThinking = await MessageConfig.get("enableThinkingContent") ?? false;
    const showSourceUrl = await PageSettings.get("includeSourceUrl");
    const showTimestamp = await MessageConfig.showTimestamp();
    return {
      enableThinkingContent: enableThinking,
      effectiveFromUrl: showSourceUrl ? fromUrl : undefined,
      showTimestamp
    };
  }

  static async withLoading(showLoading, taskPromise) {
    // Triggers full window dynamic spinner overlay
    if (showLoading) {
      this.showSpinnerOverlay(true);
    }
    try {
      return await taskPromise();
    } finally {
      if (showLoading) {
        this.showSpinnerOverlay(false);
      }
    }
  }

  static showSpinnerOverlay(show) {
    if (show) {
      const loader = document.createElement("div");
      loader.id = "saveai-dynamic-loading-modal";
      loader.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:99999;";
      loader.innerHTML = "<div style='color:white;font-weight:600;font-size:16px;background:rgba(0,0,0,0.85);padding:16px 24px;border-radius:12px;'>Exporting Document...</div>";
      document.body.appendChild(loader);
    } else {
      const loader = document.getElementById("saveai-dynamic-loading-modal");
      if (loader) {
        document.body.removeChild(loader);
      }
    }
  }

  // Trigger browser file download dialog
  static saveBlobToFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static async exportMessagesToPdf({ messages, title, showLoading = true }) {
    return this.withLoading(showLoading, async () => {
      if (messages.length === 0) throw new Error("No messages to export");
      const config = await MessageConfig.getAll();
      const theme = await MessageConfig.getTheme();
      const filename = this.getFilename(title, "pdf");
      
      // In a real environment, this invokes the bundled pdf library renderer
      console.log(`[PDF] Exporting ${messages.length} messages with name ${filename}`);
      return "success";
    });
  }

  static async exportMessagesToWord({ messages, title, fromUrl, showLoading = true }) {
    return this.withLoading(showLoading, async () => {
      if (messages.length === 0) throw new Error("No messages to export");
      const filename = this.getFilename(title, "docx");
      
      console.log(`[Word] Exporting ${messages.length} messages with name ${filename} from URL ${fromUrl}`);
      return "success";
    });
  }

  static async exportMessagesToMarkdown({ messages, title, fromUrl, showLoading = true }) {
    return this.withLoading(showLoading, async () => {
      if (messages.length === 0) throw new Error("No messages to export");
      const { enableThinkingContent, effectiveFromUrl, showTimestamp } = await this.getTextExportOptions(fromUrl);
      
      // Dummy markdown serializer matching internal os() function
      const markdown = messages.map(m => `### ${m.role === "user" ? "You Asked" : "AI Assistant"}\n\n${m.contents?.map(c => c.content || "").join(" ")}`).join("\n\n");
      const filename = this.getFilename(title, "md");
      this.saveBlobToFile(markdown, filename, "text/markdown;charset=utf-8");
      return "success";
    });
  }

  static async exportMessagesToText({ messages, title, fromUrl, showLoading = true }) {
    return this.withLoading(showLoading, async () => {
      if (messages.length === 0) throw new Error("No messages to export");
      const { enableThinkingContent, effectiveFromUrl, showTimestamp } = await this.getTextExportOptions(fromUrl);
      
      const text = messages.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.contents?.map(c => c.content || "").join(" ")}`).join("\n\n");
      const filename = this.getFilename(title, "txt");
      this.saveBlobToFile(text, filename, "text/plain;charset=utf-8");
      return "success";
    });
  }

  static async exportMessagesToJson({ messages, title, showLoading = true }) {
    return this.withLoading(showLoading, async () => {
      if (messages.length === 0) throw new Error("No messages to export");
      const json = JSON.stringify(messages, null, 2);
      const filename = this.getFilename(title, "json");
      this.saveBlobToFile(json, filename, "application/json;charset=utf-8");
      return "success";
    });
  }

  static async copyMessagesAsMarkdown({ messages, fromUrl, showLoading = true }) {
    return this.withLoading(showLoading, async () => {
      if (messages.length === 0) throw new Error("No messages to copy");
      const { enableThinkingContent, effectiveFromUrl, showTimestamp } = await this.getTextExportOptions(fromUrl);
      
      const markdown = messages.map(m => `### ${m.role === "user" ? "You Asked" : "AI Assistant"}\n\n${m.contents?.map(c => c.content || "").join(" ")}`).join("\n\n");
      await navigator.clipboard.writeText(markdown);
      return "success";
    });
  }
}
