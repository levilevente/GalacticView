import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { sendPromptToAgent } from '../api/agent.api.ts';
import { getApiErrorMessage } from '../utils/authUtils';

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

const useAgentChat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [questionSent, setQuestionSent] = useState<boolean>(false);

    const sendMessage = async (msg: string) => {
        const userMessage: ChatMessage = {
            id: uuidv4(),
            message: msg,
            sender: 'user',
        };

        setMessages([userMessage]);
        setQuestionSent(true);
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
                message: getApiErrorMessage(error, 'Sorry, there was an error processing your request.'),
                sender: 'agent',
                isError: true,
                error: getApiErrorMessage(error, 'Sorry, there was an error processing your request.'),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        isLoading,
        questionSent,
        sendMessage,
    };
};

export default useAgentChat;
