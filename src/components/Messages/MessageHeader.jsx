/**
 * SaveAI - Message Header Component (React)
 * 
 * Re-constructs dialog headers displaying active AI platform logos, model ids,
 * custom naming tags, timestamps, and asking indicators.
 */

import React from 'react';
import styled from 'styled-components';
import { useMessageConfig } from '../../hooks/useMessageConfig.js';
import { useTheme } from '../../config/ThemeProvider.jsx';

// Inline asset image URL mappings
const defaultUserLightIcon = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='48' height='48'%3e%3cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z' fill='%232c2c2c'/%3e%3c/svg%3e";
const defaultUserDarkIcon = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='48' height='48'%3e%3cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z' fill='%23ffffff'/%3e%3c/svg%3e";

const defaultAiLightIcon = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='48' height='48'%3e%3ccircle cx='12' cy='12' r='10' fill='%23eee'/%3e%3c/svg%3e";

// Relative file paths copied during scaffolding
const chatgptDarkIcon = "/assets/chatgpt-dark-DvieJsNu.svg";
const grokDarkIcon = "/assets/grok-dark-YdOy7O8v.png";
const notebooklmDarkIcon = "/assets/notebooklm-dark-Brgdai9R.png";

const getPlatformAvatarUrl = (aiName, role, theme) => {
  if (role === "user") {
    return theme === "dark" ? defaultUserDarkIcon : defaultUserLightIcon;
  }
  
  // Custom switch resolver mapping standard brand logos
  switch (aiName?.toLowerCase()) {
    case "chatgpt":
      return theme === "dark" ? chatgptDarkIcon : defaultAiLightIcon;
    case "gemini":
      return "data:image/svg+xml,%3csvg height='1em' viewBox='0 0 24 24' width='1em' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3clinearGradient id='gemini-fill' x1='0%25' x2='68.73%25' y1='100%25' y2='30.395%25'%3e%3cstop offset='0%25' stop-color='%231C7DFF'/%3e%3cstop offset='100%25' stop-color='%23F0DCD6'/%3e%3c/linearGradient%3e%3c/defs%3e%3cpath d='M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12' fill='url(%23gemini-fill)'/%3e%3c/svg%3e";
    case "claude":
      return "data:image/svg+xml,%3csvg height='1em' viewBox='0 0 24 24' width='1em' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 0 1-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z' fill='%23D97757'/%3e%3c/svg%3e";
    case "grok":
      return theme === "dark" ? grokDarkIcon : defaultAiLightIcon;
    case "notebooklm":
      return theme === "dark" ? notebooklmDarkIcon : defaultAiLightIcon;
    default:
      return defaultAiLightIcon;
  }
};

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  margin: 0 0 10px 0;
  justify-content: ${props => props.$isUser ? "flex-end" : "flex-start"};
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 50%;
`;

const DisplayName = styled.span`
  font-size: 14px;
  padding: 0 8px;
  font-weight: 600;
  color: ${props => {
    switch (props.$theme) {
      case "light": return "#101010";
      case "dark": return "#eee";
      case "note": return "#333333";
      default: return "#101010";
    }
  }};
`;

const TimestampText = styled.span`
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 400;
  color: #888;
  margin-right: 8px;
  background-color: ${props => {
    switch (props.$theme) {
      case "light": return "#f8fafe";
      case "dark": return "#313131";
      case "note": return "#fffae6";
      default: return "#f8fafe";
    }
  }};
`;

const ModelLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #888;
  border: 1px solid rgba(0,0,0,0.1);
  padding: 1px 4px;
  border-radius: 3px;
  margin-left: 6px;
`;

export const MessageHeader = ({ role, theme = "light", aiName, modelId, createdAt, displayModel }) => {
  const config = useMessageConfig();
  const showTimestamp = config.config?.showMessageTimestamp;
  const isUser = role === "user";
  const avatarUrl = getPlatformAvatarUrl(aiName, role, theme);

  return (
    <HeaderRow $isUser={isUser}>
      {isUser && (
        <DisplayName $theme={theme}>
          {showTimestamp && createdAt && typeof createdAt === "string" && createdAt.trim() && (
            <TimestampText $theme={theme}>{createdAt}</TimestampText>
          )}
          {"You Asked"}
        </DisplayName>
      )}
      
      <Avatar src={avatarUrl} alt={isUser ? "User" : aiName || "Assistant"} />

      {!isUser && (
        <DisplayName $theme={theme}>
          {displayModel || aiName || "Assistant"}
          {modelId && <ModelLabel>{modelId}</ModelLabel>}
        </DisplayName>
      )}
    </HeaderRow>
  );
};

export default MessageHeader;
