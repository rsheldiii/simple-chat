import React, { useState } from "react";
import styled from "styled-components";
import { simpleChatTheme } from "../theme";

interface SendChatWindowProps {
    sendMessage: (message: string, username: string) => void;
    username: string;
}

const ChatInputContainer = styled.div`
    padding: ${simpleChatTheme.spacing.md};
    background-color: ${simpleChatTheme.colors.background};
`;

const InputWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const MessageInput = styled.input`
    flex: 1;
    background-color: ${simpleChatTheme.colors.inputBackground};
    border: none;
    border-radius: ${simpleChatTheme.borderRadius.medium};
    padding: 11px ${simpleChatTheme.spacing.md};
    color: ${simpleChatTheme.colors.textPrimary};
    font-size: 14px;
    line-height: 1.375;
    outline: none;
    font-family: ${simpleChatTheme.fonts.primary};
    
    &::placeholder {
        color: ${simpleChatTheme.colors.textSecondary};
    }
    
    &:focus {
        background-color: #484c52;
    }
`;

const SendButton = styled.button`
    background: none;
    border: none;
    color: ${simpleChatTheme.colors.textSecondary};
    cursor: pointer;
    padding: ${simpleChatTheme.spacing.sm} 12px;
    border-radius: ${simpleChatTheme.borderRadius.small};
    margin-left: ${simpleChatTheme.spacing.sm};
    font-size: 14px;
    font-weight: 500;
    transition: all 0.1s ease;
    
    &:hover {
        background-color: ${simpleChatTheme.colors.inputBackground};
        color: ${simpleChatTheme.colors.textPrimary};
    }
    
    &:active {
        transform: translateY(1px);
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const TypingIndicator = styled.div`
    position: absolute;
    bottom: -20px;
    left: ${simpleChatTheme.spacing.md};
    font-size: 12px;
    color: ${simpleChatTheme.colors.textSecondary};
    font-style: italic;
`;

const SendChatWindow = ({ sendMessage, username }: SendChatWindowProps) => {
    const [message, setMessage] = useState("");

    const handleSend = (e) => { 
        e.preventDefault();
        if (message.trim()) {
            sendMessage(message, username);
            setMessage("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };


    return (
        <ChatInputContainer>
            <InputWrapper>
                <MessageInput 
                    type="text" 
                    placeholder="Message #general"
                    value={message} 
                    onChange={handleInputChange} 
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                />
                <SendButton 
                    onClick={handleSend} 
                    disabled={!message.trim()}
                >
                    Send
                </SendButton>
            </InputWrapper>
        </ChatInputContainer>
    );
};

export default SendChatWindow; 