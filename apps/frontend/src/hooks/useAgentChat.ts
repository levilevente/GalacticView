import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { sendPromptToAgent } from '../api/agent.api.ts';

export interface ChatMessage {
    id: string;
    message: string;
    title?: string;
    content?: string;
    keyMetrics?: string[];
    sender: 'user' | 'agent';
    isError?: boolean;
    error?: string;
}

const SESSION_STORAGE_KEY = 'agent_chat_messages';

const useAgentChat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        try {
            const storedMessages = sessionStorage.getItem(SESSION_STORAGE_KEY);
            return storedMessages ? (JSON.parse(storedMessages) as ChatMessage[]) : [];
        } catch (error) {
            console.error('Failed to parse stored messages:', error);
            return [];
        }
    });

    useEffect(() => {
        try {
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages));
        } catch (error) {
            console.error('Failed to store messages:', error);
        }
    }, [messages]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const sendMessage = async (msg: string) => {
        const userMessage: ChatMessage = {
            id: uuidv4(),
            message: msg,
            sender: 'user',
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await sendPromptToAgent(msg);

            const agentMessage: ChatMessage = {
                id: uuidv4(),
                message: response.content,
                sender: 'agent',
                title: response.title,
                content: response.content,
                keyMetrics: response.keyMetrics,
            };

            setMessages((prev) => [...prev, agentMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = {
                id: uuidv4(),
                message: 'Sorry, there was an error processing your request.',
                sender: 'agent',
                isError: true,
                error: (error as Error).message,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([]);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        setIsLoading(false);
    };

    return {
        messages,
        isLoading,
        sendMessage,
        clearChat,
    };
};

export default useAgentChat;
