/**
 * SaveAI - Message Style Configuration Service
 * 
 * Re-constructs extension settings controlling layout scale, table styling, 
 * thinking content visibility limits, and UI display themes.
 */

const browserAPI = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;

export class MessageConfig {
  static STORAGE_KEY = "ai-exporter-message-config";
  static THEME_STORAGE_KEY = "ai-exporter-message-theme";

  static DEFAULT_CONFIG = {
    width: "pc",
    size: "medium",
    fontFamily: "system-ui",
    tableStyle: "solid",
    showMessageTimestamp: true,
    autoSave: false,
    enableThinkingContent: false
  };

  static DEFAULT_THEME = "light";

  static getDefaultConfig() {
    return this.DEFAULT_CONFIG;
  }

  static async getAll() {
    try {
      const data = await browserAPI.storage.local.get(this.STORAGE_KEY);
      const config = data[this.STORAGE_KEY];
      if (!config) return { ...this.DEFAULT_CONFIG };
      const { theme, ...options } = config;
      return { ...this.DEFAULT_CONFIG, ...options };
    } catch {
      return { ...this.DEFAULT_CONFIG };
    }
  }

  static async getTheme() {
    try {
      const themeData = await browserAPI.storage.local.get(this.THEME_STORAGE_KEY);
      if (themeData[this.THEME_STORAGE_KEY]) {
        return themeData[this.THEME_STORAGE_KEY];
      }
      
      const configData = await browserAPI.storage.local.get(this.STORAGE_KEY);
      const config = configData[this.STORAGE_KEY];
      return config?.theme ? config.theme : this.DEFAULT_THEME;
    } catch {
      return this.DEFAULT_THEME;
    }
  }

  static async getAllWithTheme() {
    const config = await this.getAll();
    const theme = await this.getTheme();
    return { ...config, theme };
  }

  static async getAutoSave() {
    return await this.get("autoSave") ?? false;
  }

  static async setAutoSave(value) {
    await this.set("autoSave", value);
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

  static async setTheme(theme) {
    try {
      await browserAPI.storage.local.set({ [this.THEME_STORAGE_KEY]: theme });
    } catch (error) {
      throw error;
    }
  }

  static async setAllWithTheme(config) {
    try {
      const { theme, ...options } = config;
      if (theme !== undefined) {
        await this.setTheme(theme);
      }
      if (Object.keys(options).length > 0) {
        await this.setAll(options);
      }
    } catch (error) {
      throw error;
    }
  }

  static async showTimestamp() {
    const config = await this.getAll();
    return config.showMessageTimestamp;
  }

  static async set(key, value) {
    const config = await this.getAll();
    config[key] = value;
    await this.setAll(config);
  }

  static async reset() {
    await this.setAll(this.DEFAULT_CONFIG);
  }

  static async clear() {
    try {
      await browserAPI.storage.local.remove(this.STORAGE_KEY);
    } catch (error) {
      throw error;
    }
  }
}

// Visual Theme palette mappings
export const themes = {
  background: { light: "#ffffff", dark: "#212121", note: "#fffef0" },
  cardBackground: { light: "#f7f8fa", dark: "#323232ff", note: "#f2eedb" },
  text: { light: "#101010", dark: "#eee", note: "#101010" },
  codeBackground: { light: "#f7f8fa", dark: "#171717", note: "#312b10" },
  caption: { light: "#5d5d5d", dark: "#fff", note: "#fff" }
};
