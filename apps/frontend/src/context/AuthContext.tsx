import { onAuthStateChanged, type User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { auth } from '../config/firebase';
import { loginUser, logoutUser, registerUser } from '../utils/authUtils';

export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: typeof loginUser;
    register: typeof registerUser;
    logout: typeof logoutUser;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        /*
          Reads the user information from Firebase's internal IndexedDB 
        */
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
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
