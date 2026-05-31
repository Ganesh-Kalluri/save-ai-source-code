/**
 * SaveAI - Extension Settings / Options Dashboard (React)
 * 
 * Re-constructs the premium setting configuration console managing display values, 
 * IndexedDB cache retention days, context menus, custom previews, and single exports.
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import toast, { Toaster } from 'react-hot-toast';

// Configs and themes
import { browserAPI } from '../background/index.js';
import { PageSettings } from '../config/PageSettings.js';
import { MessageConfig, themes } from '../config/MessageConfig.js';
import { translations } from '../background/i18n.js';
import { ChatStore } from '../db/ChatDatabase.js';

// SVG Vector icon helper
const InfoIcon = ({ size = 16, color = "#64748b" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="16" y2="12" />
    <line x1="12" x2="12" y1="8" y2="8" />
  </svg>
);

// Styled option panels
const OptionsViewport = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #1e293b;
`;

const OptionsCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  min-height: 600px;
`;

const Sidebar = styled.div`
  width: 240px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SidebarBtn = styled.button`
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  border: none;
  background: ${props => props.$active ? "#e2e8f0" : "transparent"};
  color: ${props => props.$active ? "#0f172a" : "#475569"};
  font-weight: ${props => props.$active ? "600" : "500"};
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
`;

const MainContentArea = styled.div`
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const SectionHeader = styled.div`
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 16px;
  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
  }
`;

const OptionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f1f5f9;
`;

const OptionMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 70%;

  .title {
    font-weight: 600;
    font-size: 16px;
    color: #1e293b;
  }
  .desc {
    font-size: 13px;
    color: #64748b;
    line-height: 1.5;
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #cbd5e1;
    transition: .4s;
    border-radius: 24px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #0cb45d;
  }

  input:checked + .slider:before {
    transform: translateX(24px);
  }
`;

const SelectionInput = styled.select`
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background-color: #ffffff;
  font-size: 14px;
  color: #1e293b;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #0cb45d;
  }
`;

const WarningCard = styled.div`
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  h4 {
    margin: 0;
    color: #b45309;
    font-size: 16px;
    font-weight: 600;
  }

  ul {
    margin: 0;
    padding-left: 20px;
    font-size: 13px;
    color: #78350f;
    line-height: 1.6;
  }
`;

export const OptionsApp = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [pageConfig, setPageConfig] = useState({
    showSingleExportBtn: true,
    showContextMenuBtn: true
  });
  const [retentionDays, setRetentionDays] = useState(7);
  const [styleConfig, setStyleConfig] = useState({
    fontFamily: "system-ui",
    size: "medium",
    tableStyle: "solid"
  });

  useEffect(() => {
    // Load config states
    (async () => {
      const pageSettings = await PageSettings.getAll();
      setPageConfig(pageSettings);

      const cachedOptions = await MessageConfig.getAll();
      setStyleConfig(cachedOptions);

      // Extract Dexie cache config
      const retentionData = await browserAPI.storage.local.get("ai-exporter-chat-cache-settings");
      if (retentionData["ai-exporter-chat-cache-settings"]?.retentionDays) {
        setRetentionDays(retentionData["ai-exporter-chat-cache-settings"].retentionDays);
      }
    })();
  }, []);

  const handlePageToggle = async (key) => {
    const nextVal = !pageConfig[key];
    const nextObj = { ...pageConfig, [key]: nextVal };
    setPageConfig(nextObj);
    await PageSettings.set(key, nextVal);
    toast.success("Page configuration updated successfully!");
  };

  const handleStyleSelect = async (key, val) => {
    const nextObj = { ...styleConfig, [key]: val };
    setStyleConfig(nextObj);
    await MessageConfig.set(key, val);
    toast.success("Style options applied!");
  };

  const handleCacheChange = async (days) => {
    const val = Number(days);
    setRetentionDays(val);
    await browserAPI.storage.local.set({
      "ai-exporter-chat-cache-settings": { retentionDays: val }
    });
    toast.success("IndexedDB cache expiration updated!");
  };

  return (
    <OptionsViewport>
      <OptionsCard>
        <Sidebar>
          <BrandTitle style={{ padding: "0 16px 20px 16px" }}>SaveAI Options</BrandTitle>
          <SidebarBtn $active={activeTab === "general"} onClick={() => setActiveTab("general")}>
            General Settings
          </SidebarBtn>
          <SidebarBtn $active={activeTab === "style"} onClick={() => setActiveTab("style")}>
            Styling Defaults
          </SidebarBtn>
          <SidebarBtn $active={activeTab === "cache"} onClick={() => setActiveTab("cache")}>
            Cache & Expiration
          </SidebarBtn>
        </Sidebar>

        <MainContentArea>
          {activeTab === "general" && (
            <>
              <SectionHeader>
                <h2>General Preferences</h2>
              </SectionHeader>

              <OptionRow>
                <OptionMeta>
                  <span className="title">Show Floating Export Button</span>
                  <span className="desc">Render floating quick-export widgets on target chat conversation boards.</span>
                </OptionMeta>
                <ToggleSwitch>
                  <input 
                    type="checkbox" 
                    checked={pageConfig.showSingleExportBtn} 
                    onChange={() => handlePageToggle("showSingleExportBtn")}
                  />
                  <span className="slider" />
                </ToggleSwitch>
              </OptionRow>

              <OptionRow>
                <OptionMeta>
                  <span className="title">Enable Context Menu Items</span>
                  <span className="desc">Allow trigger shortcuts on right-click contexts inside active platforms.</span>
                </OptionMeta>
                <ToggleSwitch>
                  <input 
                    type="checkbox" 
                    checked={pageConfig.showContextMenuBtn} 
                    onChange={() => handlePageToggle("showContextMenuBtn")}
                  />
                  <span className="slider" />
                </ToggleSwitch>
              </OptionRow>
            </>
          )}

          {activeTab === "style" && (
            <>
              <SectionHeader>
                <h2>Styling Preferences</h2>
              </SectionHeader>

              <OptionRow>
                <OptionMeta>
                  <span className="title">Default Text Size</span>
                  <span className="desc">Font scaling applied to preview layouts and generated documents.</span>
                </OptionMeta>
                <SelectionInput 
                  value={styleConfig.size} 
                  onChange={(e) => handleStyleSelect("size", e.target.value)}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </SelectionInput>
              </OptionRow>

              <OptionRow>
                <OptionMeta>
                  <span className="title">Default Font Family</span>
                  <span className="desc">Global typography layout style.</span>
                </OptionMeta>
                <SelectionInput 
                  value={styleConfig.fontFamily} 
                  onChange={(e) => handleStyleSelect("fontFamily", e.target.value)}
                >
                  <option value="system-ui">System Default UI</option>
                  <option value="Georgia">Georgia Serif</option>
                  <option value="Courier New">Monospace Code</option>
                </SelectionInput>
              </OptionRow>

              <OptionRow>
                <OptionMeta>
                  <span className="title">Table Border Style</span>
                  <span className="desc">Styling borders in preview export data grids.</span>
                </OptionMeta>
                <SelectionInput 
                  value={styleConfig.tableStyle} 
                  onChange={(e) => handleStyleSelect("tableStyle", e.target.value)}
                >
                  <option value="solid">Solid Line</option>
                  <option value="dashed">Dashed Line</option>
                  <option value="none">No Gridlines</option>
                </SelectionInput>
              </OptionRow>
            </>
          )}

          {activeTab === "cache" && (
            <>
              <SectionHeader>
                <h2>Cache Options</h2>
              </SectionHeader>

              <OptionRow>
                <OptionMeta>
                  <span className="title">Chat History Retention (Days)</span>
                  <span className="desc">Days captured chat logs are kept in IndexedDB storage before being auto-pruned.</span>
                </OptionMeta>
                <SelectionInput 
                  value={retentionDays} 
                  onChange={(e) => handleCacheChange(e.target.value)}
                >
                  <option value={1}>1 Day</option>
                  <option value={3}>3 Days</option>
                  <option value={7}>7 Days (Default)</option>
                  <option value={14}>14 Days</option>
                  <option value={30}>30 Days</option>
                </SelectionInput>
              </OptionRow>

              <WarningCard>
                <h4>IndexedDB Storage Notes</h4>
                <ul>
                  <li>Pruning runs automatically on extension startup based on retention days settings.</li>
                  <li>Single exported sessions (independent files) are excluded from the auto-clean sweepers.</li>
                  <li>Clearing browser storage or uninstalling the extension wipes IndexedDB tables permanently.</li>
                </ul>
              </WarningCard>
            </>
          )}
        </MainContentArea>
      </OptionsCard>
      <Toaster position="top-center" />
    </OptionsViewport>
  );
};

export default OptionsApp;
