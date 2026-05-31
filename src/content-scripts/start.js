/* ============================================================
   SAVEAI EARLY-LOAD CONTENT SCRIPT (start.js)
   Fired at document_start to perform early script injections
   and boot up custom storage and internationalization helpers.
   ============================================================ */

const chromeEnv = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;

/**
 * Injects a script into the page context
 * Supports Manifest V2 (innerHTML fetch fallback) and Manifest V3 (src script injection)
 */
async function injectWebScript(scriptPath) {
  const url = chromeEnv.runtime.getURL(scriptPath);
  const script = document.createElement("script");

  if (chromeEnv.runtime.getManifest().manifest_version === 2) {
    script.innerHTML = await fetch(url).then(res => res.text());
  } else {
    script.src = url;
  }

  script.onload = () => script.remove();
  (document.head ?? document.documentElement).append(script);
}

const LANGUAGE_KEY = "ai-exporter-language";

/**
 * Storage adapter for extension language preferences
 */
class LanguageStorage {
  static LANGUAGE_KEY = LANGUAGE_KEY;

  static async getLanguage() {
    try {
      const data = await chromeEnv.storage.sync.get(this.LANGUAGE_KEY);
      const val = data[this.LANGUAGE_KEY];
      const allowedLanguages = ["en", "zh", "ja", "ko", "zhTW", "de", "it", "pt", "es", "fr", "system"];
      return allowedLanguages.includes(val) ? val : null;
    } catch {
      return null;
    }
  }

  static async setLanguage(lang) {
    try {
      await chromeEnv.storage.sync.set({ [this.LANGUAGE_KEY]: lang });
    } catch (err) {
      throw err;
    }
  }

  static async clearLanguage() {
    try {
      await chromeEnv.storage.sync.remove(this.LANGUAGE_KEY);
    } catch (err) {
      throw err;
    }
  }
}

// Full translation dictionary exported inside src/background/i18n.js and matched here
// Truncated for readability since we import/manage translation bundles via main configuration,
// but kept aligned here for full single-script runtime isolation if running directly as content injection.
const translations = {
  contextMenuRoot: { en: "AI Exporter Extension", zh: "AI Exporter 扩展", ja: "AI Exporter 拡張", ko: "AI Exporter 확장", zhTW: "AI Exporter 擴充功能", de: "AI Exporter Erweiterung", it: "AI Exporter Estensione", pt: "AI Exporter Extensão", es: "AI Exporter Extensión", fr: "AI Exporter Extension" },
  contextMenuFullPreview: { en: "Open Preview", zh: "打开预览", ja: "プレビューを開く", ko: "미리보기 열기", zhTW: "開啟預覽", de: "Vorschau öffnen", it: "Apri anteprima", pt: "Abrir prévia", es: "Abrir vista previa", fr: "Ouvrir l'aperçu" },
  contextMenuFullMarkdown: { en: "Export as MD", zh: "导出为MD", ja: "MD としてエクスポート", ko: "MD로 내보내기", zhTW: "匯出為MD", de: "Als MD exportieren", it: "Esporta come MD", pt: "Exportar como MD", es: "Exportar como MD", fr: "Exporter en MD" },
  contextMenuFullJson: { en: "Export as JSON", zh: "导出为 JSON", ja: "JSON としてエクスポート", ko: "JSON으로 내보내기", zhTW: "匯出為 JSON", de: "Als JSON exportieren", it: "Esporta come JSON", pt: "Exportar como JSON", es: "Exportar como JSON", fr: "Exporter en JSON" },
  contextMenuFullWord: { en: "Export as Word", zh: "导出为 Word", ja: "Word としてエクスポート", ko: "Word로 내보내기", zhTW: "匯出為 Word", de: "Als Word exportieren", it: "Esporta come Word", pt: "Exportar como Word", es: "Exportar como Word", fr: "Exporter en Word" },
  contextMenuFullPdf: { en: "Export as PDF", zh: "导出为 PDF", ja: "PDF としてエクスポート", ko: "PDF로 내보내기", zhTW: "匯出為 PDF", de: "Als PDF exportieren", it: "Esporta come PDF", pt: "Exportar como PDF", es: "Exportar como PDF", fr: "Exporter en PDF" },
  contextMenuSyncNotion: { en: "Sync to Notion", zh: "同步Notion", ja: "Notion に同期", ko: "Notion에 동기화", zhTW: "同步Notion", de: "Mit Notion synchronisieren", it: "Sincronizza con Notion", pt: "Sincronizar com Notion", es: "Sincronizar con Notion", fr: "Synchroniser avec Notion" },
  contextMenuCopyMarkdown: { en: "Copy as MD", zh: "复制为MD", ja: "MD としてコピー", ko: "MD로 복사", zhTW: "複製為MD", de: "Als MD kopieren", it: "Copia come MD", pt: "Copiar como MD", es: "Copiar como MD", fr: "Copier en MD" },
  contextMenuCopyJson: { en: "Copy as JSON", zh: "复制为 JSON", ja: "JSON としてコピー", ko: "JSON으로 복사", zhTW: "複製為 JSON", de: "Als JSON kopieren", it: "Copia come JSON", pt: "Copiar como JSON", es: "Copiar como JSON", fr: "Copier en JSON" },
  contextMenuOptions: { en: "Go to Settings", zh: "前往设置中心", ja: "設定センターへ移動", ko: "설정 센터로 이동", zhTW: "前往設定中心", de: "Zum Einstellungscenter", it: "Vai al centro impostazioni", pt: "Ir para a central de configurações", es: "Ir al centro de configuración", fr: "Aller au centre des paramètres" },
  "toast.copySuccess": { en: "Copy Success", zh: "复制成功", ja: "コピー成功", ko: "복사 성공", zhTW: "複製成功", de: "Kopieren erfolgreich", it: "Copia riuscita", pt: "Cópia bem-sucedida", es: "Copia exitosa", fr: "Copie réussie" },
  "toast.copyFailed": { en: "Copy failed", zh: "复制失败", ja: "コピー失敗", ko: "복사 실패", zhTW: "複製失敗", de: "Kopieren fehlgeschlagen", it: "Copia fallita", pt: "Falha na cópia", es: "Copia fallida", fr: "Copie échouée" },
  "toast.noMessages": { en: "No messages to export", zh: "没有可导出的消息", ja: "エクスポートするメッセージがありません", ko: "내보낼 메시지가 없습니다", zhTW: "沒有可匯出的訊息", de: "Keine Nachrichten zum Exportieren", it: "Nessun messaggio da esportare", pt: "Nenhuma mensagem para exportar", es: "No hay mensajes para exportar", fr: "Aucun message à exporter" },
  "toast.exportSuccess": { en: "Export Success", zh: "导出成功", ja: "エクスポート成功", ko: "내보내기 성공", zhTW: "匯出成功", de: "Export erfolgreich", it: "Esportazione riuscita", pt: "Exportação bem-sucedida", es: "Exportación exitosa", fr: "Exportation réussie" },
  "toast.exportFailed": { en: "Export failed, please check your network connection", zh: "导出失败，请检查网络连接", ja: "エクスポート失敗，ネットワーク接続を確認してください", ko: "내보내기 실패，네트워크 연결을 확인하세요", zhTW: "匯出失敗，請檢查網路連接", de: "Export fehlgeschlagen, bitte überprüfen Sie Ihre Netzwerkverbindung", it: "Esportazione fallita, controlla la tua connessione di rete", pt: "Falha na exportação, verifique sua conexão de rede", es: "Exportación fallida, por favor verifique su conexión de red", fr: "Échec de l'exportation, veuillez vérifier votre connexion réseau" },
  "hint.contentScriptNotReady": { en: "Please refresh the page and try again", zh: "请刷新页面后重试", ja: "ページをリフレッシュしてから再度試してください", ko: "페이지를 새로고침하고 다시 시도하세요", zhTW: "請刷新頁面後重試", de: "Bitte aktualisieren Sie die Seite und versuchen Sie es erneut", it: "Aggiorna la pagina e riprova", pt: "Por favor, atualize a página e tente novamente", es: "Por favor, actualice la página e intente de nuevo", fr: "Veuillez rafraîchir la page et réessayer" }
};

const pathTags = {
  zh: "zh",
  zhTW: "zh-TW",
  ja: "ja",
  ko: "ko",
  de: "de",
  it: "it",
  pt: "pt",
  es: "es",
  fr: "fr"
};

/**
 * Custom internationalization compiler
 */
class I18nManager {
  _language = "en";

  constructor() {
    this.init();
  }

  async init() {
    try {
      const stored = await LanguageStorage.getLanguage();
      if (stored && stored !== "system" && ["en", "zh", "ja", "ko", "zhTW", "de", "it", "pt", "es", "fr"].includes(stored)) {
        this._language = stored;
        return;
      }
    } catch {}

    try {
      const uiLang = chromeEnv.i18n.getUILanguage();
      this._language = this.detectLanguage(uiLang);
    } catch {
      this._language = this.detectLanguage(navigator.language);
    }
  }

  detectLanguage(code) {
    const lower = code.toLowerCase();
    if (lower.startsWith("zh-tw") || lower.startsWith("zh-hant")) return "zhTW";
    if (lower.startsWith("zh")) return "zh";
    if (lower.startsWith("ja")) return "ja";
    if (lower.startsWith("ko")) return "ko";
    if (lower.startsWith("de")) return "de";
    if (lower.startsWith("it")) return "it";
    if (lower.startsWith("pt")) return "pt";
    if (lower.startsWith("es")) return "es";
    if (lower.startsWith("fr")) return "fr";
    return "en";
  }

  setLanguage(lang) {
    if (["en", "zh", "ja", "ko", "zhTW", "de", "it", "pt", "es", "fr"].includes(lang)) {
      this._language = lang;
    } else {
      this._language = "en";
    }
  }

  getLanguage() {
    return this._language;
  }

  getLanguagePathTag() {
    return pathTags[this._language] || "";
  }

  translate(key, fallback) {
    if (!translations[key]) {
      console.log(`[SaveAI I18n] Missing translation for key: ${key}`);
      return fallback || key;
    }
    const t = translations[key];
    return t[this._language] || t.en || t.zh || fallback || key;
  }

  t(key, fallback) {
    return this.translate(key, fallback);
  }
}

// Singleton global translator instance
export const i18n = new I18nManager();

/**
 * WXT content script configuration block
 */
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
  runAt: "document_start"
};

/**
 * Main Content Script Entry
 */
export async function main() {
  console.log("[SaveAI] Injecting web bridge hooks...");
  await injectWebScript("/inject-web.js");
}

// If executed in non-module context, self-initialize
if (typeof WXT_ENTRYPOINT !== "undefined") {
  main().catch(err => console.error("[SaveAI] start script crashed:", err));
}
