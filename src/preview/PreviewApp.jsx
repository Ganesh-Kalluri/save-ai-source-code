/**
 * SaveAI - Export Preview Panel (React)
 * 
 * Re-constructs the premium preview window, featuring dark/light/note themes,
 * table configurations, inline citations, rich content, and full Notion integration.
 */

import React, { useState, useEffect, useRef, useTransition } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTheme } from '../config/ThemeProvider.jsx';
import { useMessageConfig } from '../hooks/useMessageConfig.js';
import { ChatStore } from '../db/ChatDatabase.js';
import { translations } from '../background/i18n.js';
import { exportMessagesToPdf, exportMessagesToWord, exportMessagesToMarkdown, exportMessagesToText, exportMessagesToJson, copyMessagesAsMarkdown } from '../utils/FileExportHelper.js';
import { searchIcon, questionIcon, externalLinkIcon, refreshCwIcon } from '../components/shared/search.js';
import { copyIconDefinition } from '../components/shared/copyIcon.js';

// SVG Icon Helpers
const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SquareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const AlignCenterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="21" x2="3" y1="6" y2="6" />
    <line x1="15" x2="9" y1="12" y2="12" />
    <line x1="17" x2="7" y1="18" y2="18" />
  </svg>
);

// Styled Components
const MainContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => {
    switch (props.theme.name) {
      case "dark": return "#0f172a";
      case "note": return "#fdfdf6";
      default: return "#f8fafc";
    }
  }};
`;

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 56px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 100%);
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
`;

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-weight: 700;
  color: #ffffff;
  font-size: 18px;
`;

const ActionsGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SettingsDropdown = styled.div`
  display: ${props => props.$expanded ? "flex" : "none"};
  flex-direction: column;
  padding: 16px 24px;
  background: rgba(30, 41, 59, 0.98);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  gap: 16px;
  animation: slideDown 0.2s ease;

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const GroupRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const ControlLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 6px;
`;

const ActionBtn = styled.button`
  padding: 6px 12px;
  height: 32px;
  border: 1px solid ${props => props.$active ? "#3b82f6" : "rgba(255, 255, 255, 0.15)"};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$active ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.05)"};
  color: ${props => props.$active ? "#60a5fa" : "rgba(255, 255, 255, 0.8)"};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: ${props => props.$active ? "#3b82f6" : "rgba(255, 255, 255, 0.3)"};
  }
`;

const PremiumPanel = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 32px auto;
  padding: 40px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  box-sizing: border-box;
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  flex: 1;
`;

export const PreviewApp = () => {
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState("Conversation Export");
  const [fromUrl, setFromUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const { theme, setTheme } = useTheme();
  const messageConfig = useMessageConfig();

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const docId = params.get("id");
      if (docId) {
        const item = await ChatStore.getById(docId);
        if (item) {
          setTitle(item.title || "Exported Chat");
          setFromUrl(item.fromUrl || "");
          const msgList = item.messages || [];
          setMessages(msgList);
          setSelectedIds(new Set(msgList.map(m => m.id)));
        }
      }
      setLoading(false);
    })();
  }, []);

  const handleExport = async (format) => {
    const exportedMessages = messages.filter(m => selectedIds.has(m.id));
    if (exportedMessages.length === 0) {
      toast.error("Please select at least one message to export!");
      return;
    }

    let res = "failed";
    switch (format) {
      case "pdf":
        res = await exportMessagesToPdf({ messages: exportedMessages, title });
        break;
      case "word":
        res = await exportMessagesToWord({ messages: exportedMessages, title, fromUrl });
        break;
      case "markdown":
        res = await exportMessagesToMarkdown({ messages: exportedMessages, title, fromUrl });
        break;
      case "text":
        res = await exportMessagesToText({ messages: exportedMessages, title, fromUrl });
        break;
      case "json":
        res = await exportMessagesToJson({ messages: exportedMessages, title });
        break;
      default:
        break;
    }

    if (res === "success") {
      toast.success(`Exported as ${format.toUpperCase()} successfully!`);
    } else if (res === "upgrade_required") {
      toast.error("Premium plan required for this action!");
    } else {
      toast.error("Export operation failed.");
    }
  };

  return (
    <MainContainer>
      <StickyHeader>
        <HeaderRow>
          <BrandSection>
            <span>SaveAI Preview Console</span>
          </BrandSection>
          <ActionsGrid>
            <ActionBtn onClick={() => setSettingsExpanded(!settingsExpanded)}>
              <SettingsIcon />
            </ActionBtn>
            <ActionBtn $active={theme === "light"} onClick={() => setTheme("light")}>Light</ActionBtn>
            <ActionBtn $active={theme === "dark"} onClick={() => setTheme("dark")}>Dark</ActionBtn>
            <ActionBtn $active={theme === "note"} onClick={() => setTheme("note")}>Note</ActionBtn>
          </ActionsGrid>
        </HeaderRow>

        <SettingsDropdown $expanded={settingsExpanded}>
          <GroupRow>
            <ControlLabel>Quick Exports:</ControlLabel>
            <ButtonGroup>
              <ActionBtn onClick={() => handleExport("pdf")}>Export PDF</ActionBtn>
              <ActionBtn onClick={() => handleExport("word")}>Export Word</ActionBtn>
              <ActionBtn onClick={() => handleExport("markdown")}>Export MD</ActionBtn>
              <ActionBtn onClick={() => handleExport("text")}>Export Text</ActionBtn>
              <ActionBtn onClick={() => handleExport("json")}>Export JSON</ActionBtn>
            </ButtonGroup>
          </GroupRow>
        </SettingsDropdown>
      </StickyHeader>

      {loading ? (
        <LoadingSpinner>
          <span>Loading premium preview boards...</span>
        </LoadingSpinner>
      ) : (
        <PremiumPanel>
          <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "24px" }}>{title}</h2>
          <div className="preview-conversation-list" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {messages.map((msg, i) => {
              const isSelected = selectedIds.has(msg.id);
              return (
                <div 
                  key={msg.id || i} 
                  style={{ 
                    padding: "16px", 
                    borderRadius: "12px", 
                    border: "1px solid #e2e8f0", 
                    backgroundColor: msg.role === "user" ? "#f8fafc" : "#ffffff",
                    display: "flex",
                    gap: "16px"
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={(e) => {
                      const newIds = new Set(selectedIds);
                      if (e.target.checked) newIds.add(msg.id);
                      else newIds.delete(msg.id);
                      setSelectedIds(newIds);
                    }}
                    style={{ marginTop: "4px" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>
                      {msg.role === "user" ? "USER" : msg.displayModel || "ASSISTANT"}
                    </div>
                    <div style={{ fontSize: "15px", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                      {msg.contents?.map((c, idx) => c.content || "").join("\n")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </PremiumPanel>
      )}
    </MainContainer>
  );
};

export default PreviewApp;
