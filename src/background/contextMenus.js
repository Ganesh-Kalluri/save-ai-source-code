/**
 * SaveAI - Context Menu Manager Service
 * 
 * Reconstructs context menus inside Chrome/Firefox extensions using selected translations,
 * matches platforms URL patterns, and binds click trigger routing back to content scripts.
 */

import { browserAPI } from './index.js';
import { translations } from './i18n.js';
import { platforms } from './platforms.js';
import { PageSettings } from '../config/PageSettings.js';

export const CONTEXT_MENU_ROOT_ID = "saveai-context-root";

export const contextMenuItems = [
  {
    id: "saveai-context-preview",
    titleKey: "contextMenuFullPreview",
    fallbackTitle: "Open Preview",
    action: "captureSelect",
    trackingActionName: "custom"
  },
  {
    id: "saveai-context-markdown",
    titleKey: "contextMenuFullMarkdown",
    fallbackTitle: "Export as MD",
    action: "exportFullMarkdown",
    trackingActionName: "markdown"
  },
  {
    id: "saveai-context-json",
    titleKey: "contextMenuFullJson",
    fallbackTitle: "Export as JSON",
    action: "exportFullJSON",
    trackingActionName: "json"
  },
  {
    id: "saveai-context-word",
    titleKey: "contextMenuFullWord",
    fallbackTitle: "Export as Word",
    action: "exportFullWord",
    trackingActionName: "word"
  },
  {
    id: "saveai-context-pdf",
    titleKey: "contextMenuFullPdf",
    fallbackTitle: "Export as PDF",
    action: "exportFullPDF",
    trackingActionName: "pdf"
  },
  {
    id: "saveai-context-notion-separator",
    type: "separator"
  },
  {
    id: "saveai-context-notion",
    titleKey: "contextMenuSyncNotion",
    fallbackTitle: "Sync to Notion",
    action: "openFullNotionExport",
    trackingActionName: "full-notion"
  },
  {
    id: "saveai-context-separator",
    type: "separator"
  },
  {
    id: "saveai-context-copy-markdown",
    titleKey: "contextMenuCopyMarkdown",
    fallbackTitle: "Copy as MD",
    action: "copyFullMarkdown",
    trackingActionName: "copy-markdown"
  },
  {
    id: "saveai-context-copy-json",
    titleKey: "contextMenuCopyJson",
    fallbackTitle: "Copy as JSON",
    action: "copyFullJSON",
    trackingActionName: "copy-json"
  },
  {
    id: "saveai-context-bottom-separator",
    type: "separator"
  },
  {
    id: "saveai-context-options",
    titleKey: "contextMenuOptions",
    fallbackTitle: "Go to Settings Center",
    browserAction: "openOptions"
  }
];

export class ContextMenuManager {
  static getLocalizedTitle(key, fallback, lang) {
    const translation = translations[key];
    return translation?.[lang] || translation?.en || translation?.zh || fallback;
  }

  static getMenuItemById(id) {
    return contextMenuItems.find(item => item.id === id);
  }

  static async removeAllContextMenus() {
    try {
      await browserAPI.contextMenus.remove(CONTEXT_MENU_ROOT_ID);
    } catch {}
  }

  static getUrlPatterns() {
    const patterns = [];
    platforms.forEach(platform => {
      platform.hosts.forEach(host => {
        patterns.push(`https://${host}/*`);
      });
    });
    return patterns;
  }

  static async init(lang) {
    try {
      await this.removeAllContextMenus();
      const showContextMenu = await PageSettings.get("showContextMenuBtn");
      if (!showContextMenu) return;

      const urlPatterns = this.getUrlPatterns();

      // Create root item
      await browserAPI.contextMenus.create({
        id: CONTEXT_MENU_ROOT_ID,
        title: this.getLocalizedTitle("contextMenuRoot", "AI Exporter", lang),
        contexts: ["all"],
        documentUrlPatterns: urlPatterns
      });

      // Populate child items
      for (const item of contextMenuItems) {
        if (item.type === "separator") {
          await browserAPI.contextMenus.create({
            id: item.id,
            parentId: CONTEXT_MENU_ROOT_ID,
            type: "separator",
            contexts: ["all"],
            documentUrlPatterns: urlPatterns
          });
          continue;
        }

        if (item.titleKey && item.fallbackTitle) {
          await browserAPI.contextMenus.create({
            id: item.id,
            parentId: CONTEXT_MENU_ROOT_ID,
            title: this.getLocalizedTitle(item.titleKey, item.fallbackTitle, lang),
            contexts: ["all"],
            documentUrlPatterns: urlPatterns
          });
        }
      }
    } catch (error) {
      console.warn("[ContextMenu] Initialization failed:", error);
    }
  }
}
