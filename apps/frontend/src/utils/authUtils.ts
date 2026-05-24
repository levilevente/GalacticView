import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    type UserCredential,
} from 'firebase/auth';

import { fetchIdToken } from '../api/auth.api';
import { auth } from '../config/firebase';

const processAuthTokens = async (userCredential: UserCredential) => {
    await fetchIdToken(userCredential);
    return 'ok';
};

export const loginUser = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return processAuthTokens(userCredential);
};

export const registerUser = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return processAuthTokens(userCredential);
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpire');
        localStorage.removeItem('refreshToken');
    } catch (error) {
        console.error('Error signing out:', error);
    }
};
