import axios, { type AxiosError } from 'axios';
import type { UserCredential, UserProfile } from 'firebase/auth';

import { logoutUser } from '../utils/authUtils';

export interface AuthResponse {
    status: 'success' | 'error';
    message: string;
    user?: UserProfile;
}

const baseUrl = import.meta.env.VITE_CORE_API_BASE_URL as string;
if (!baseUrl) {
    throw new Error('VITE_CORE_API_BASE_URL environment variable is not configured');
}

export const coreAPI = axios.create({
    baseURL: baseUrl || '',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

coreAPI.interceptors.response.use(
    (response) => {
        // If the response is successful, just return it
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && originalRequest?.url !== '/auth/me') {
            console.warn('Session expired. Logging out...');
            await logoutUser();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    },
);

export async function fetchIdToken(userCredential: UserCredential): Promise<AuthResponse> {
    const user = userCredential.user;
    const token = await user.getIdToken();

    const res = await coreAPI.post<AuthResponse>('/auth/login', { id_token: token });
    return res.data;
}

export async function deleteCookie(): Promise<AuthResponse> {
    const response = await coreAPI.post<AuthResponse>('/auth/logout');
    return response.data;
}

export async function getCurrentUser(): Promise<AuthResponse> {
    const response = await coreAPI.get<AuthResponse>('/auth/me');
    return response.data;
}
