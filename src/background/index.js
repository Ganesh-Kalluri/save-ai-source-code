/**
 * SaveAI - Service Worker / Background Script
 * 
 * Orchestrates extension lifecycle events, context menus, analytics, 
 * web-extension message bridging, cookie synchronization, and server API calls.
 */

// Import chrome/browser API shim (implicitly used via global context in extension environment)
const browserAPI = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;

// Import translation tables
import { translations } from './i18n.js';
import { platforms } from './platforms.js';

// Setup background services
import { ExtensionLogger } from './logger.js';
import { AnalyticsService } from './analytics.js';
import { TranslationManager } from './language.js';
import { DatabaseStore } from './db.js';
import { AuthService } from './auth.js';
import { ImageService } from './images.js';
import { MessageFetchService } from './fetch.js';
import { BadgeService } from './badge.js';
import { ContextMenuManager } from './contextMenus.js';

export {
  browserAPI,
  translations,
  platforms,
  ExtensionLogger,
  AnalyticsService,
  TranslationManager,
  DatabaseStore,
  AuthService,
  ImageService,
  MessageFetchService,
  BadgeService,
  ContextMenuManager
};
