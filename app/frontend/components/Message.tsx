import React from "react";
import styled from "styled-components";
import { simpleChatTheme } from "../theme";

interface MessageData {
    name: string;
    content: string;
    created_at: string;
    timestamp?: string;
}

interface MessageProps {
    data: MessageData;
}

const MessageContainer = styled.div`
    display: flex;
    padding: ${simpleChatTheme.spacing.sm} ${simpleChatTheme.spacing.md} ${simpleChatTheme.spacing.sm} 0;
    margin-bottom: ${simpleChatTheme.spacing.xs};
    border-radius: ${simpleChatTheme.borderRadius.small};
    transition: background-color 0.1s ease;
    
    &:hover {
        background-color: ${simpleChatTheme.colors.hover};
    }
`;

const Avatar = styled.div`
    width: 40px;
    height: 40px;
    border-radius: ${simpleChatTheme.borderRadius.round};
    background: linear-gradient(135deg, ${simpleChatTheme.colors.accent}, #7289da);
    margin-right: ${simpleChatTheme.spacing.md};
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
    color: white;
    text-transform: uppercase;
`;

const MessageContent = styled.div`
    flex: 1;
    min-width: 0;
`;

const MessageHeader = styled.div`
    display: flex;
    align-items: baseline;
    margin-bottom: ${simpleChatTheme.spacing.xs};
`;

const Username = styled.span`
    font-weight: 600;
    color: ${simpleChatTheme.colors.textPrimary};
    margin-right: ${simpleChatTheme.spacing.sm};
    cursor: pointer;
    
    &:hover {
        text-decoration: underline;
    }
`;

const Timestamp = styled.span`
    font-size: 12px;
    color: ${simpleChatTheme.colors.textSecondary};
    font-weight: 400;
`;

const MessageText = styled.div`
    color: ${simpleChatTheme.colors.textPrimary};
    line-height: 1.375;
    font-size: 16px;
    word-wrap: break-word;
`;

const Message = ({ data }: MessageProps) => {
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        
        if (isToday) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(word => word[0]).join('').slice(0, 2);
    };

    return (
        <MessageContainer key={data.timestamp}>
            <Avatar>
                {getInitials(data.name)}
            </Avatar>
            <MessageContent>
                <MessageHeader>
                    <Username>{data.name}</Username>
                    <Timestamp>{formatTimestamp(data.created_at)}</Timestamp>
                </MessageHeader>
                <MessageText>{data.content}</MessageText>
            </MessageContent>
        </MessageContainer>
    );
};

export default Message; 