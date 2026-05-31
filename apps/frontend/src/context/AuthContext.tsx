import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { deleteCookie, getCurrentUser, sendLoginRequest, sendRegisterRequest } from '../api/auth.api';
import { auth } from '../config/firebase';
import type { UserProfile } from '../types/UserType';
import { getApiErrorMessage } from '../utils/authUtils';

export interface AuthContextType {
    isAuthenticated: boolean;
    user: UserProfile | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, username: string, firstName: string, lastName: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                await refreshUser();
            } catch (error) {
                console.warn('Initial auth hydration failed', error);
            } finally {
                setLoading(false);
            }
        };

        initAuth().catch((err) => console.error('Unhandled hydration error', err));
    }, []);

    const refreshUser = async () => {
        try {
            const response = await getCurrentUser();
            if (response.status === 'success' && response.user) {
                setUser(response.user as unknown as UserProfile | null);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error refreshing user:', error);
            setUser(null);
        }
    };

    const handleLogin: AuthContextType['login'] = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await sendLoginRequest(userCredential);
            await refreshUser();
        } catch (error) {
            throw new Error(getApiErrorMessage(error, 'Login failed.'));
        }
    };

    const handleRegister: AuthContextType['register'] = async (email, password, username, firstName, lastName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendRegisterRequest(userCredential, username, firstName, lastName);
            await refreshUser();
        } catch (error) {
            console.error('Error during registration:', error);
            if (auth.currentUser) {
                try {
                    await auth.currentUser.delete();
                } catch (e) {
                    console.warn('Failed deleting partially created firebase user:', e);
                }
            }
            throw new Error(getApiErrorMessage(error, 'Registration failed. Please try again.'));
        }
    };

    const handleLogout = async () => {
        try {
            try {
                await deleteCookie();
            } catch (err) {
                console.warn('Failed clearing server session during logout:', err);
            }
            try {
                await signOut(auth);
            } catch (err) {
                console.warn('Failed signing out firebase during logout:', err);
            }
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!user,
                user,
                loading,
                login: handleLogin,
                register: handleRegister,
                logout: handleLogout,
                refreshUser,
            }}
        >
            {!loading ? children : null}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
