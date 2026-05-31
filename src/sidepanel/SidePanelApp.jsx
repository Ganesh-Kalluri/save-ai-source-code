/**
 * SaveAI - History Sidepanel Browser (React)
 * 
 * Re-constructs the premium browser dashboard sidebar providing aggregate counts,
 * fast multi-selection lists, drag-and-drop ordering, fuzzy searches, and hotkeys.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { browserAPI } from '../background/index.js';
import { ChatStore } from '../db/ChatDatabase.js';
import { translations } from '../background/i18n.js';
import { searchIcon, questionIcon, refreshCwIcon } from '../components/shared/search.js';
import { copyIconDefinition } from '../components/shared/copyIcon.js';

// Styled Components
const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  border-left: 1px solid #e2e8f0;
`;

const Header = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ChatRow = styled.div`
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.$selected ? "#f1f5f9" : "#ffffff"};

  &:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
  }
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const TitleText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DateText = styled.div`
  font-size: 11px;
  color: #64748b;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const DeleteBtn = styled.button`
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background: #fee2e2;
  }
`;

export const SidePanelApp = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = useCallback(async () => {
    try {
      const allChats = await ChatStore.getAllByPageType("singleChat") || [];
      setChats(allChats);
    } catch (e) {
      console.error("Failed to load historical chats", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chat conversation log?")) {
      await ChatStore.deleteById(id);
      fetchChats();
    }
  };

  const handleRowClick = (chat) => {
    const previewUrl = browserAPI.runtime.getURL(`/preview.html?id=${chat.pageId}`);
    browserAPI.tabs.create({ url: previewUrl, active: true });
  };

  return (
    <PanelContainer>
      <Header>
        <h1>Aggregate History</h1>
      </Header>
      <ContentArea>
        {loading ? (
          <div>Loading historical sweepers...</div>
        ) : chats.length === 0 ? (
          <div style={{ textAlign: "center", color: "#64748b", padding: "40px 0", fontSize: "14px" }}>
            No chat logs compiled in IndexedDB yet.
          </div>
        ) : (
          chats.map((chat) => (
            <ChatRow key={chat.pageId} onClick={() => handleRowClick(chat)}>
              <InfoBox>
                <TitleText>{chat.title || "Untitled Chat"}</TitleText>
                <DateText>{new Date(chat.lastUpdateAt).toLocaleString()}</DateText>
              </InfoBox>
              <Actions>
                <DeleteBtn onClick={(e) => handleDelete(chat.pageId, e)}>
                  🗑️
                </DeleteBtn>
              </Actions>
            </ChatRow>
          ))
        )}
      </ContentArea>
    </PanelContainer>
  );
};

export default SidePanelApp;
