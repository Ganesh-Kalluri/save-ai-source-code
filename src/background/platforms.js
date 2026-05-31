/**
 * SaveAI - Supported AI Platforms Configuration
 * 
 * Lists metadata, hostname patterns, and route path matchers for the 12+ 
 * supported artificial intelligence platforms integrated with the extension.
 */

export const platforms = [
  {
    name: "ChatGPT",
    id: "chatgpt",
    url: "https://chat.openai.com",
    icon: "",
    hosts: ["chat.openai.com", "chatgpt.com"],
    chatPaths: ["/c", "/g/"]
  },
  {
    name: "Gemini",
    id: "gemini",
    url: "https://gemini.google.com",
    icon: "",
    hosts: ["gemini.google.com"],
    chatPaths: ["/app/", "/gem/"]
  },
  {
    name: "Claude",
    id: "claude",
    url: "https://claude.ai",
    icon: "",
    hosts: ["claude.ai"],
    chatPaths: ["/chat", "/c"]
  },
  {
    name: "NotebookLM",
    id: "notebooklm",
    url: "https://notebooklm.google.com",
    icon: "",
    hosts: ["notebooklm.google.com"],
    chatPaths: ["/notebook"]
  },
  {
    name: "Grok",
    id: "grok",
    url: "https://grok.com",
    icon: "",
    hosts: ["grok.com"],
    chatPaths: ["/chat", "/c"]
  },
  {
    name: "Perplexity",
    id: "perplexity",
    url: "https://www.perplexity.ai",
    icon: "",
    hosts: ["www.perplexity.ai"],
    chatPaths: ["/search"]
  },
  {
    name: "DeepSeek",
    id: "deepseek",
    url: "https://chat.deepseek.com",
    icon: "",
    hosts: ["chat.deepseek.com"],
    chatPaths: ["/a/chat"]
  },
  {
    name: "Kimi",
    id: "kimi",
    url: "https://www.kimi.com",
    icon: "",
    hosts: ["www.kimi.com"],
    chatPaths: ["/chat"]
  },
  {
    name: "GoogleAIStudio",
    id: "googleaistudio",
    url: "https://aistudio.google.com",
    icon: "",
    hosts: ["aistudio.google.com"],
    chatPaths: ["/prompts"]
  },
  {
    name: "Copilot",
    id: "copilot",
    url: "https://copilot.microsoft.com",
    icon: "",
    hosts: ["copilot.microsoft.com"],
    chatPaths: ["/chats"]
  },
  {
    name: "GithubCopilot",
    id: "githubcopilot",
    url: "https://github.com",
    icon: "",
    linkUrl: "https://github.com/copilot",
    chatPaths: ["/copilot/c"]
  },
  {
    name: "YuanBao",
    id: "yuanbao",
    url: "https://yuanbao.tencent.com",
    icon: "",
    hosts: ["yuanbao.tencent.com"],
    chatPaths: ["/chat"]
  }
];
