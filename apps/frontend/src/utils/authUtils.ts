import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    type UserCredential,
} from 'firebase/auth';

import { deleteCookie, fetchIdToken } from '../api/auth.api';
import { auth } from '../config/firebase';

const processAuthTokens = async (userCredential: UserCredential) => {
    const response = await fetchIdToken(userCredential);
    return response;
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
        await deleteCookie();
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
    }
};
