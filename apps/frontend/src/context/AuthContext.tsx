import React, { createContext, useContext, useEffect, useState } from 'react';

import { getCurrentUser } from '../api/auth.api';
import type { UserProfile } from '../types/UserType';
import { loginUser, logoutUser, registerUser } from '../utils/authUtils';

export interface AuthContextType {
    isAuthenticated: boolean;
    user: UserProfile | null;
    loading: boolean;
    login: typeof loginUser;
    register: typeof registerUser;
    logout: typeof logoutUser;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            getCurrentUser()
                .then((response) => {
                    if (response.status === 'success' && response.user) {
                        setUser(response.user as unknown as UserProfile | null);
                        console.log('User authenticated:', response.user);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching user:', error);
                    setLoading(false);
                });
        } catch (error) {
            console.error('Error fetching user:', error);
            setLoading(false);
        }
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
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
                login: loginUser,
                register: registerUser,
                logout: handleLogout,
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
