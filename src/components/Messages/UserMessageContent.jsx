/**
 * SaveAI - User Message Component (React)
 * 
 * Renders user chat dialog balloons complete with file attachments, inline pictures,
 * sizing layouts, and hover indicators.
 */

import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTheme } from '../../config/ThemeProvider.jsx';
import { useMessageConfig } from '../../hooks/useMessageConfig.js';
import { copyIconDefinition } from '../shared/copyIcon.js';

// SVG File icon mockup 
const FileIcon = ({ size = 20, color = "#888" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
    <path d="M14 2v5a1 1 0 0 0 1 1h5" />
  </svg>
);

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const AttachmentPreviewWrapper = styled.div`
  margin: 8px 0;
  transition: all 0.2s ease;
  
  ${props => props.$hasDimensions ? css`
    width: ${props.$width}px;
    height: ${props.$height}px;
  ` : css`
    display: inline-block;
    max-width: 300px;
    ${props.$isLoading && css`
      min-width: 200px;
      min-height: 200px;
    `}
  `}
  
  ${props => props.$isLoading && css`
    border-radius: 12px;
    background: ${props.$theme === "dark" 
      ? "linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 75%)" 
      : props.$theme === "note" 
        ? "linear-gradient(90deg, rgba(0, 0, 0, 0.03) 25%, rgba(0, 0, 0, 0.06) 50%, rgba(0, 0, 0, 0.03) 75%)" 
        : "linear-gradient(90deg, rgba(0, 0, 0, 0.04) 25%, rgba(0, 0, 0, 0.08) 50%, rgba(0, 0, 0, 0.04) 75%)"
    };
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite;
  `}
  
  img {
    ${props => props.$hasDimensions ? css`
      width: 100%;
      height: 100%;
      object-fit: contain;
    ` : css`
      max-width: 300px;
      width: auto;
      height: auto;
      display: block;
    `}
    display: ${props => props.$isLoading ? "none" : "block"};
    border-radius: 12px;
  }
`;

const FileAttachmentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 4px 12px;
  max-width: 300px;
  height: 60px;
  margin: 0;
  border-radius: 8px;
  background-color: transparent;
  border: 1px solid ${props => {
    switch (props.$theme) {
      case "light": return "rgba(0, 0, 0, 0.08)";
      case "dark": return "rgba(255, 255, 255, 0.1)";
      case "note": return "rgba(0, 0, 0, 0.1)";
      default: return "rgba(0, 0, 0, 0.08)";
    }
  }};
  transition: all 0.2s ease;
`;

const IconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${props => {
    switch (props.$theme) {
      case "light": return "rgba(0, 0, 0, 0.6)";
      case "dark": return "rgba(255, 255, 255, 0.7)";
      case "note": return "rgba(0, 0, 0, 0.6)";
      default: return "rgba(0, 0, 0, 0.6)";
    }
  }};
`;

const DetailBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
  justify-content: center;
`;

const FileNameText = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${props => {
    switch (props.$theme) {
      case "light": return "#101010";
      case "dark": return "#eee";
      case "note": return "#333333";
      default: return "#101010";
    }
  }};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileSizeText = styled.div`
  font-size: 12px;
  color: ${props => {
    switch (props.$theme) {
      case "light": return "rgba(0, 0, 0, 0.6)";
      case "dark": return "rgba(255, 255, 255, 0.6)";
      case "note": return "rgba(0, 0, 0, 0.6)";
      default: return "rgba(0, 0, 0, 0.6)";
    }
  }};
`;

const MultiFileImage = styled.img`
  max-height: 56px;
  max-width: 120px;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 4px;
  flex-shrink: 0;
`;

const UserBalloonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
`;

const AttachmentsGrid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 60%;
  margin-bottom: 8px;
  align-items: flex-start;
  justify-content: flex-end;
`;

const SpeechBubble = styled.div`
  display: inline-block;
  float: right;
  padding: 12px 23px;
  margin: 0;
  border-radius: 12px;
  cursor: pointer;
  max-width: ${props => {
    switch (props.$width) {
      case "mobile": return "75%";
      case "pad": return "75%";
      case "pc": return "65%";
      default: return "75%";
    }
  }};
  background-color: ${props => {
    switch (props.$theme) {
      case "light": return "#f6f8fa";
      case "dark": return "rgba(50, 50, 50, 0.8)";
      case "note": return "#faf9e8";
      default: return "#f6f8fa";
    }
  }};
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const BubbleText = styled.div`
  color: ${props => {
    switch (props.$theme) {
      case "light": return "#101010";
      case "dark": return "#eee";
      case "note": return "#333333";
      default: return "#101010";
    }
  }};
  white-space: pre-wrap;
  word-break: break-word;
`;

// Helper formatting utilities
const formatBytes = (bytes) => {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const limitFileName = (name) => {
  if (name.length > 30) {
    return `${name.substring(0, 15)}***${name.substring(name.length - 15)}`;
  }
  return name;
};

const getFileTypeColor = (mimeType) => {
  if (!mimeType) return "#b38080";
  if (mimeType === "application/pdf") return "#dc2626";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "#16a34a";
  if (mimeType.includes("word") || mimeType.includes("document")) return "#2563eb";
  return "#b38080";
};

const calculateImageDimensions = (w, h) => {
  if (w && h) {
    const ratio = w / h;
    return w > h 
      ? { width: 300, height: 300 / ratio, hasDimensions: true }
      : { width: 300 * ratio, height: 300, hasDimensions: true };
  }
  return { width: undefined, height: undefined, hasDimensions: false };
};

// Sub-component for individual attachments
const AttachmentItem = ({ attachment, isSingleImage = false, isMultipleFiles = false }) => {
  const { theme } = useTheme();
  const isImage = attachment.mime_type?.startsWith("image/");
  const [loaded, setLoaded] = useState(false);
  const color = getFileTypeColor(attachment.mime_type);

  if (isSingleImage && isImage && attachment.url) {
    const { width, height, hasDimensions } = calculateImageDimensions(attachment.width, attachment.height);
    return (
      <AttachmentPreviewWrapper $theme={theme} $width={width} $height={height} $isLoading={!loaded} $hasDimensions={hasDimensions}>
        <img 
          src={attachment.url} 
          alt={attachment.name} 
          crossOrigin="anonymous" 
          onLoad={() => setLoaded(true)} 
          onError={() => setLoaded(true)} 
        />
      </AttachmentPreviewWrapper>
    );
  }

  return (
    <FileAttachmentContainer $theme={theme}>
      {isMultipleFiles && isImage && attachment.url ? (
        <MultiFileImage 
          src={attachment.url} 
          alt={attachment.name} 
          crossOrigin="anonymous" 
          onLoad={() => setLoaded(true)} 
          onError={() => setLoaded(true)} 
        />
      ) : (
        <>
          <IconBox $theme={theme}>
            <FileIcon size={20} color={color} />
          </IconBox>
          <DetailBox>
            <FileNameText $theme={theme}>{limitFileName(attachment.name)}</FileNameText>
            {attachment.size !== 0 && (
              <FileSizeText $theme={theme}>{formatBytes(attachment.size)}</FileSizeText>
            )}
          </DetailBox>
        </>
      )}
    </FileAttachmentContainer>
  );
};

// Main Export Component
export const UserMessageContent = ({ contents }) => {
  const config = useMessageConfig();
  const { width } = config;
  const { theme } = useTheme();

  if (!contents || contents.length === 0) return null;

  // Filter attachments out
  const attachments = contents.filter(c => c.type === "attachment" && c.attachment).map(c => c.attachment);
  const isSingleImage = attachments.length === 1 && attachments[0].mime_type?.startsWith("image/") && attachments[0].url;
  const isMultiple = attachments.length > 1 && !isSingleImage;

  return (
    <UserBalloonContainer>
      {attachments.length > 0 && (
        <AttachmentsGrid>
          {attachments.map((att, i) => (
            <AttachmentItem 
              key={`att-${i}`} 
              attachment={att} 
              isSingleImage={isSingleImage} 
              isMultipleFiles={isMultiple} 
            />
          ))}
        </AttachmentsGrid>
      )}
      
      <SpeechBubble className="user-message-bubble" $theme={theme} $width={width}>
        {contents.filter(c => c.type !== "thinking" && c.type !== "attachment").map((c, idx) => {
          if (c.type === "image" && c.imageUrl) {
            return (
              <div key={`img-${idx}`} style={{ width: '50%', margin: '8px 0' }}>
                <img src={c.imageUrl} alt="user inline asset" style={{ maxWidth: '100%', borderRadius: '12px' }} />
              </div>
            );
          }
          return (
            <BubbleText key={`text-${idx}`} $theme={theme}>
              {c.content || ""}
            </BubbleText>
          );
        })}
      </SpeechBubble>
    </UserBalloonContainer>
  );
};

export default UserMessageContent;
