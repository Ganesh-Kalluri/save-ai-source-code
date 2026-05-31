/**
 * SaveAI - Browser Extension Popup View (React)
 * 
 * Re-constructs the primary browser overlay layout hosting quick-action triggers,
 * Notion synchronization interfaces, telemetry integrations, and scrollable platform chips.
 */

import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import toast, { Toaster } from 'react-hot-toast';

// Utilities & configs
import { browserAPI } from '../background/index.js';
import { PageSettings } from '../config/PageSettings.js';
import { translations } from '../background/i18n.js';
import { platforms } from '../background/platforms.js';
import { 
  databaseIcon, 
  sendActionToActiveTab, 
  logUserAction, 
  trackPopupClick 
} from '../utils/tabUtil.js';
import { generateRandomUid } from '../utils/uid.js';
import { themes } from '../config/MessageConfig.js';

// Vector Icons
const FileTextIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
  </svg>
);

const WarningIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

const SidePanelIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M15 3v18" />
  </svg>
);

// Assets Resources
const magicWandIcon = "/assets/magic-D_xyIQjt.png";
const markdownIconUrl = "/assets/md-B8nF0Nu1.png";
const pdfIconUrl = "/assets/pdf-CMPbJ9aZ.png";
const pngIconUrl = "/assets/image-JY_E3rsp.png";
const txtIconUrl = "/assets/txt-CB7qOyB7.png";
const jsonIconUrl = "/assets/json-wgKw7CF_.png";
const docxIconBase64 = "data:image/svg+xml;base64,PHN2ZyBpZD0iaWNvbi1wcmV2aWV3LXN2ZyIgdmlld0JveD0iNjUuNSA0OC41IDM4MSA0MTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgY2xhc3M9InctZnVsbCBoLWZ1bGwiPjxwYXRoIGQ9Ik0gMTYwIDY0JiMxMDsgICAgICAgICAgICBMIDE4OCA2NCYjMTA7ICAgICAgICAgICAgTCA0MDAgMTc2JiMxMDsgICAgICAgICAgICBMIDQwMCA0MDAmIzEwOyAgICAgICAgICAgIEEgNDggNDggMCAwIDEgMzUyIDQ0OCYjMTA7ICAgICAgICAgICAgTCAxNjAgNDQ4JiMxMDsgICAgICAgICAgICBBIDQ4IDQ4IDAgMCAxIDExMiA0MDAmIzEwOyAgICAgICAgICAgIEwgMTEyIDExMiYjMTA7ICAgICAgICAgICAgQSA0OCA0OCAwIDAgMSAxNjAgNjQgWiIgZmlsbD0iI2JmZDlmOCIgc3Ryb2tlPSIjMkI2Q0M0IiBzdHJva2Utd2lkdGg9IjI3IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTSAyODggNjQmIzEwOyAgICAgICAgICAgIEwgMjg4IDEyOCYjMTA7ICAgICAgICAgICAgQSA0OCA0OCAwIDAgMCAzMzYgMTc2JiMxMDsgICAgICAgICAgICBMIDQwMCAxNzYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzJCNkNDNCIgc3Ryb2tlLXdpZHRoPSIyNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHRleHQgeD0iMjU2IiB5PSIyNzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIiBmb250LXNpemU9IjE3NyIgZm9udC13ZWlnaHQ9IjkwMCIgZmlsbD0iIzFBNDM4MCIgZm9udC1mYW1pbHk9InVpLXNhbnMtc2VyaWYsIHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCAnU2Vnb2UgVUknLCBSb2JvdG8sICdIZWx2ZXRpY2EgTmV1ZScsIEFyaWFsLCBzYW5zLXNlcmlmIiBzdHlsZT0ibGV0dGVyLXNwYWNpbmc6IC0wLjAyZW07Ij5XPC90ZXh0Pjwvc3ZnPg==";

// Styled Layouts
const PopupViewport = styled.div`
  user-select: none;
  width: 340px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  color: #333;
  padding: 0;
  background: #ffffff;
  overflow: hidden;
`;

const HeaderNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
`;

const BrandTitle = styled.div`
  font-weight: 800;
  font-size: 16px;
  background: linear-gradient(135deg, #0cb45d, #0a8c8a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #0cb45d;
`;

const ContentPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 9px 14px 15px 14px;
  background: #ffffff;
`;

const PlatformsTrack = styled.div`
  background: #ffffff;
  padding: 10px 12px;
  border-bottom: 1px solid #f8fafc;
`;

const PlatformChip = styled.a`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #e5e7eb;
  flex-shrink: 0;
  text-decoration: none;
  position: relative;

  &:hover {
    transform: scale(1.05);
    border-color: #3b82f6;
    background: #f0f9ff;
  }

  ${props => props.$active && css`
    border-color: #3b82f6;
    background: #f0f9ff;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  `}

  ${props => props.$dragging && css`
    opacity: 0.5;
    background: #f1f5f9;
    border-style: dashed;
    transform: scale(0.95);
  `}

  img {
    width: 18px;
    height: 18px;
    object-fit: contain;
  }
`;

const PlatformStatusDot = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 4px;
  height: 4px;
  border: 1px solid #ffffff;
  border-radius: 50%;
  background: ${props => props.$status === "chat" ? "#10b981" : "#f59e0b"};
`;

const ScrollWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

// Featured custom exporter card
const FeaturedCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  padding: 4px 14px;
  flex: 1;
  border: 1px solid #dbeafe;
  border-radius: 14px;
  background: #f4f8ff;
  transition: all 0.25s ease;
  cursor: pointer;

  &:hover {
    background: #ebf1ff;
  }
`;

const FeaturedImage = styled.div`
  margin-right: 8px;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 62px;
    height: auto;
    object-fit: contain;
  }
`;

const FeaturedMeta = styled.div`
  flex: 1;
  min-width: 0;

  h3 {
    margin: 0 0 2px 0;
    font-size: 15px;
    color: #1e293b;
    font-weight: 700;
    line-height: 1.2;
  }

  p {
    margin: 0;
    font-size: 12px;
    color: #64748b;
    line-height: 1.4;
  }
`;

const RecommendedBadge = styled.div`
  position: absolute;
  top: -2px;
  right: 6px;
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 500;
  background: #ef4444;
  color: white;
  z-index: 10;
`;

// Action buttons grid
const ActionGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;

  > * {
    flex: 0 0 calc((100% - 20px) / 3);
    min-width: 0;
    max-width: calc((100% - 20px) / 3);
    box-sizing: border-box;
  }
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 10px 4px 8px;
  background: #ffffff;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;

  &:hover {
    background: #e8f0f7;
    border-color: #d4dfed;
  }

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  h3 {
    margin: 6px 0 0 0;
    font-size: 13px;
    color: #475569;
    font-weight: 500;
    line-height: 1.2;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  margin-top: 8px;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.3px;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #f8fafc;
  border: none;
  border-radius: 6px;
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #475569;
  }
`;

// Notion Sync components
const NotionBox = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 6px;
`;

const NotionTrigger = styled.div`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  background: #f8fafc;
`;

const NotionSyncBtn = styled.button`
  padding: 10px 16px;
  background: #ffffff;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e0f2fe;
    border-color: #bfdbfe;
  }
`;

// Footer elements
const FooterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  padding: 8px 14px;
  border-top: 1px solid #f1f5f9;
`;

const FooterIconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  background: transparent;
  color: #64748b;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
`;

// Helper platform checking hooks
const usePlatformCheck = () => {
  const [currentSiteName, setCurrentSiteName] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("");
  const [isUnsupportedSite, setIsUnsupportedSite] = useState(false);

  const checkTabSupport = useCallback(async () => {
    try {
      const activeTabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
      if (!activeTabs[0] || !activeTabs[0].url) {
        setIsUnsupportedSite(true);
        return;
      }
      
      const parsedUrl = new URL(activeTabs[0].url);
      const matchedPlatform = platforms.find(p => p.hosts.some(h => parsedUrl.host.includes(h)));
      
      if (!matchedPlatform) {
        setIsUnsupportedSite(true);
        setCurrentSiteName("");
        return;
      }

      setCurrentSiteName(matchedPlatform.name);
      const isChat = matchedPlatform.chatPaths.some(p => parsedUrl.pathname.includes(p));
      setConnectionStatus(isChat ? "chat" : "home");
      setIsUnsupportedSite(false);
    } catch {
      setIsUnsupportedSite(true);
    }
  }, []);

  useEffect(() => {
    checkTabSupport();
  }, [checkTabSupport]);

  return { currentSiteName, connectionStatus, isUnsupportedSite, checkTabSupport };
};

// Main Popup Component
export const PopupApp = () => {
  const { currentSiteName, connectionStatus, isUnsupportedSite } = usePlatformCheck();
  const [sitesList, setSitesList] = useState([]);

  useEffect(() => {
    // Notify background worker popup active
    browserAPI.runtime.sendMessage({ action: "popup-active" });
    logUserAction("open_popup");

    // Populate active platform tiles
    const loadedList = platforms.map(p => ({
      ...p,
      icon: `/assets/logo-${p.id}.png` // Scaffolding links fallback
    }));
    setSitesList(loadedList);
  }, []);

  const handlePlatformClick = (platform) => {
    logUserAction("navigation", { name: platform.name });
    window.open(platform.linkUrl || platform.url, "_blank");
  };

  const handleQuickExport = (action) => {
    if (isUnsupportedSite) {
      toast.error("SaveAI exporter only runs on supported AI web pages!");
      return;
    }
    logUserAction(action);
    sendActionToActiveTab(action);
  };

  const handleNotionSync = () => {
    if (isUnsupportedSite) {
      toast.error("Notion synchronization only runs on supported AI web pages!");
      return;
    }
    logUserAction("full-notion");
    sendActionToActiveTab("saveFullChatsToNotion");
  };

  const handleSidePanelOpen = async () => {
    try {
      const activeTabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
      const tabId = activeTabs[0]?.id;
      if (tabId) {
        await browserAPI.sidePanel.open({ tabId });
        window.close();
      }
    } catch (e) {
      console.warn("Could not load sidepanel:", e);
    }
  };

  return (
    <PopupViewport>
      <HeaderNav>
        <BrandTitle>SaveAI Exporter</BrandTitle>
      </HeaderNav>
      
      <PlatformsTrack>
        <ScrollWrapper>
          {sitesList.map((platform, i) => {
            const isActive = currentSiteName === platform.name;
            const isConnected = !isUnsupportedSite && isActive;
            
            return (
              <PlatformChip 
                key={platform.id} 
                $active={isActive} 
                $connected={isConnected}
                title={`${platform.name} ${isConnected ? `(${connectionStatus === "chat" ? "Active" : "Home"})` : ""}`}
                onClick={() => handlePlatformClick(platform)}
              >
                <img src={platform.icon} alt={platform.name} onError={(e) => { e.target.src = '/icon-16.png'; }} />
                {isConnected && <PlatformStatusDot $status={connectionStatus} />}
              </PlatformChip>
            );
          })}
        </ScrollWrapper>
      </PlatformsTrack>

      <ContentPanel>
        <FeaturedCard onClick={() => handleQuickExport("captureSelect")}>
          <RecommendedBadge>Recommended</RecommendedBadge>
          <FeaturedImage>
            <img src={magicWandIcon} alt="Custom Export" />
          </FeaturedImage>
          <FeaturedMeta>
            <h3>Custom Preview</h3>
            <p>Freely customize style, align tables, and preview before saving.</p>
          </FeaturedMeta>
        </FeaturedCard>

        <SectionHeader>
          <SectionTitle>Quick Exporters</SectionTitle>
          <CopyButton onClick={() => handleQuickExport("copyFullMarkdown")} title="Copy complete MD transcript">
            Copy Markdown
          </CopyButton>
        </SectionHeader>

        <ActionGrid>
          <GridItem onClick={() => handleQuickExport("exportFullPDF")}>
            <img src={pdfIconUrl} alt="PDF" />
            <h3>PDF</h3>
          </GridItem>
          <GridItem onClick={() => handleQuickExport("exportFullMarkdown")}>
            <img src={markdownIconUrl} alt="MD" />
            <h3>Markdown</h3>
          </GridItem>
          <GridItem onClick={() => handleQuickExport("exportFullText")}>
            <img src={txtIconUrl} alt="Text" />
            <h3>Plain Text</h3>
          </GridItem>
          <GridItem onClick={() => handleQuickExport("exportFullWord")}>
            <img src={docxIconBase64} alt="Word" />
            <h3>Word</h3>
          </GridItem>
          <GridItem onClick={() => handleQuickExport("captureAllToImage")}>
            <img src={pngIconUrl} alt="Image" />
            <h3>PNG Image</h3>
          </GridItem>
          <GridItem onClick={() => handleQuickExport("exportFullJSON")}>
            <img src={jsonIconUrl} alt="JSON" />
            <h3>JSON</h3>
          </GridItem>
        </ActionGrid>

        <SectionHeader>
          <SectionTitle>Notion Sync</SectionTitle>
        </SectionHeader>
        <NotionBox>
          <NotionTrigger onClick={handleNotionSync}>
            Sync complete dialogue history
          </NotionTrigger>
          <NotionSyncBtn onClick={handleNotionSync}>Sync</NotionSyncBtn>
        </NotionBox>
      </ContentPanel>

      <FooterBar>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <FooterIconBtn onClick={handleSidePanelOpen} title="Open History Panel">
            <SidePanelIcon />
          </FooterIconBtn>
          <FooterIconBtn onClick={() => window.open(browserAPI.runtime.getURL("/options.html"), "_blank")} title="Open Options">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </FooterIconBtn>
        </div>
      </FooterBar>
      <Toaster position="top-center" reverseOrder={true} />
    </PopupViewport>
  );
};

export default PopupApp;
