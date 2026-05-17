import axios from 'axios';

import type { AgentDataTypeIn, AgentPromptTypeOut } from '../types/AgentDataType.ts';
import { getUTCDateString } from '../utils/dateUtils.ts';

const baseUrl = import.meta.env.VITE_AGENT_API_BASE_URL as string;
if (!baseUrl) {
    throw new Error('VITE_AGENT_API_BASE_URL environment variable is not configured');
}

export const agentApi = axios.create({
    baseURL: baseUrl || '',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

export async function sendPromptToAgent(message: string): Promise<AgentDataTypeIn> {
    const promptData: AgentPromptTypeOut = {
        question: message,
        date: getUTCDateString(new Date()),
    };
    const res = await agentApi.post<AgentDataTypeIn>('/chat', promptData);
    return res.data;
}
