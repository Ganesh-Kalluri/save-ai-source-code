/**
 * SaveAI - Settings / Configuration Utility
 * 
 * Manages extension configurations stored within browser's local and sync 
 * storage including UI overlays, single export options, and context menus.
 */

const browserAPI = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;

export class PageSettings {
  static STORAGE_KEY = "ai-exporter-page-settings";
  
  static DEFAULT_CONFIG = {
    showSingleExportBtn: true,
    showContextMenuBtn: true
  };

  static getDefaultConfig() {
    return this.DEFAULT_CONFIG;
  }

  static async getAll() {
    try {
      const data = await browserAPI.storage.local.get(this.STORAGE_KEY);
      const config = data[this.STORAGE_KEY];
      return config ? { ...this.DEFAULT_CONFIG, ...config } : { ...this.DEFAULT_CONFIG };
    } catch {
      return { ...this.DEFAULT_CONFIG };
    }
  }

  static async get(key) {
    const config = await this.getAll();
    return config[key];
  }

  static async setAll(config) {
    try {
      const current = await this.getAll();
      const updated = { ...current, ...config };
      await browserAPI.storage.local.set({ [this.STORAGE_KEY]: updated });
    } catch (error) {
      throw error;
    }
  }

  static async set(key, value) {
    const config = await this.getAll();
    config[key] = value;
    await this.setAll(config);
  }

  static async reset() {
    await this.setAll(this.DEFAULT_CONFIG);
  }
}
