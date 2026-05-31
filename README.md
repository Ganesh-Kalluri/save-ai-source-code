# SaveAI v4.2.1 — Reconstructed Source Code Scaffolding

Welcome to the clean, modular, and human-readable reconstructed React/JavaScript source codebase for **SaveAI Chrome Extension v4.2.1**.

This scaffolding has been reverse-engineered from production bundles into organized ES Modules, structured database wrappers, styled-components theme definitions, and high-fidelity platform scraper modules.

---

## 🚀 Key Architectural Layout

The project folder is organized cleanly as follows:

- **`src/background/`**: Aggregates extension workers, GA4 analytics, message routing hubs, and internationalized translators.
- **`src/content-scripts/`**: Houses scrapers for each specific AI target page (ChatGPT, Claude, Gemini, DeepSeek, Grok, Kimi, and Perplexity) along with LaTeX mathematical patching scripts.
- **`src/inject/`**: Injected script hooks intercepting authorization cookies and credentials on web client mounts.
- **`src/db/`**: Clean IndexedDB adapter layer built on top of Dexie.js schemas.
- **`src/popup/`, `src/options/`, `src/preview/`, `src/sidepanel/`**: Separate React application entry points for popup controls, settings dashboards, full-screen export workspaces, and historical records.
- **`src/components/`**: Clean, reusable layout blocks including dialogue bubbles, attachments, and platform SVG sets.
- **`src/config/`**: Styling providers, Theme contexts, and color tokens (Note, Dark, Light themes) powered by HSL.

---

## 🛠️ Build and Development

### 1. Installation
Install all packages and dependencies:
```bash
npm install
```

### 2. Run Local Development Server
Start hot-reload server locally:
```bash
npm run dev
```

### 3. Build Production Extension
Build and package output assets for extension loading:
```bash
npm run build
```
Load the resulting output directories directly into Chrome via **Load unpacked extension** under `chrome://extensions/`.

---

## 🎨 Theme & Style Systems

The extension supports full glassmorphism and real-time color scheme swaps:
* **Light Theme**: harmonious pale-grey and clean boundaries.
* **Dark Theme**: obsidian HSL blends for sleek late-night developer usages.
* **Note Theme**: textured sepia tones offering readability in printed documents.
All layout styles operate via `styled-components` tokens imported cleanly in `src/config/themes.js`.
