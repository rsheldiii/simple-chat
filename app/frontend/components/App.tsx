import ActionCable from "actioncable";
import React, { useState, useRef, useEffect, useMemo } from "react";
import styled from "styled-components";
import Message from "./Message";
import SendChatWindow from "./SendChatWindow";
import { simpleChatTheme } from "../theme";

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${simpleChatTheme.colors.background};
  color: ${simpleChatTheme.colors.textPrimary};
  font-family: ${simpleChatTheme.fonts.primary};
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 240px;
  background-color: ${simpleChatTheme.colors.sidebar};
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${simpleChatTheme.colors.border};
`;

const ServerHeader = styled.div`
  padding: ${simpleChatTheme.spacing.md};
  border-bottom: 1px solid ${simpleChatTheme.colors.border};
  font-weight: 600;
  font-size: 16px;
  color: ${simpleChatTheme.colors.textPrimary};
  background-color: ${simpleChatTheme.colors.darker};
  box-shadow: ${simpleChatTheme.shadows.elevation1};
`;

const ChannelList = styled.div`
  flex: 1;
  padding: ${simpleChatTheme.spacing.md} ${simpleChatTheme.spacing.sm};
`;

const ChannelItem = styled.div`
  padding: ${simpleChatTheme.spacing.sm} 12px;
  margin: 2px 0;
  border-radius: ${simpleChatTheme.borderRadius.small};
  cursor: pointer;
  color: ${simpleChatTheme.colors.textSecondary};
  font-weight: 500;
  background-color: ${simpleChatTheme.colors.accent};
  color: white;

  &:before {
    content: "# ";
    margin-right: 4px;
  }

  &:hover {
    background-color: ${simpleChatTheme.colors.hover};
    color: ${simpleChatTheme.colors.textPrimary};
  }
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${simpleChatTheme.colors.background};
`;

const ChatHeader = styled.div`
  padding: 12px ${simpleChatTheme.spacing.md};
  border-bottom: 1px solid ${simpleChatTheme.colors.border};
  background-color: ${simpleChatTheme.colors.background};
  box-shadow: ${simpleChatTheme.shadows.elevation1};
  display: flex;
  align-items: center;

  &:before {
    content: "# ";
    color: ${simpleChatTheme.colors.textSecondary};
    font-size: 20px;
    margin-right: ${simpleChatTheme.spacing.sm};
  }
`;

const ChatTitle = styled.h1`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${simpleChatTheme.colors.textPrimary};
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${simpleChatTheme.spacing.md} ${simpleChatTheme.spacing.md} 0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${simpleChatTheme.colors.scrollbar};
  }

  &::-webkit-scrollbar-thumb {
    background: ${simpleChatTheme.colors.scrollbarThumb};
    border-radius: ${simpleChatTheme.borderRadius.small};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #8e9297;
  }
`;

const useFetchUsername = () => {
  const [username, setUsername] = useState("");
  useEffect(() => {
    fetch("/user/")
      .then((response) => response.json())
      .then((data) => setUsername(data.name));
  }, []);
  return username;
};

const useFetchChats = (timestamp) => {
  const [chats, setChats] = useState([]);
  useEffect(() => {
    fetch(`/chat/?created_at=${timestamp}`)
      .then((response) => response.json())
      .then((data) => setChats(data));
  }, [timestamp]);
  return chats;
};

const App = () => {
  const [lastChatTimestamp, setLastChatTimestamp] = useState(
    new Date().toISOString()
  );
  const username = useFetchUsername();
  const chats = useFetchChats(lastChatTimestamp);
  const [messages, setMessages] = useState([]);

  const { host, protocol } = window.location;
  const wsProtocol = protocol.replace("http", "ws");
  const cable = useRef(
    ActionCable.createConsumer(`${wsProtocol}//${host}/cable`)
  );

  const chat = useRef(
    cable.current.subscriptions.create(
      { channel: "ChatChannel" },
      {
        received(data) {
          setMessages(messages.concat(data));
        },
      }
    )
  );

  const allMessages = useMemo(() => chats.concat(messages), [messages, chats]);

  const handleSend = (message, username) => {
    chat.current.send({
      action: "send_message",
      content: message,
      name: username,
      created_at: new Date().toISOString(),
    });
  };

  return (
    <AppContainer>
      <Sidebar>
        <ServerHeader>Chat Server</ServerHeader>
        <ChannelList>
          <ChannelItem>general</ChannelItem>
        </ChannelList>
      </Sidebar>
      <ChatArea>
        <ChatHeader>
          <ChatTitle>general</ChatTitle>
        </ChatHeader>
        <MessagesContainer>
          {allMessages.map((message) => (
            <Message data={message} />
          ))}
        </MessagesContainer>
        <SendChatWindow sendMessage={handleSend} username={username} />
      </ChatArea>
    </AppContainer>
  );
};

export default App;
