import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';

import { deleteCookie, sendLoginRequest, sendRegisterRequest } from '../api/auth.api';
import { auth } from '../config/firebase';

export const loginUser = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return sendLoginRequest(userCredential);
};

export const registerUser = async (
    email: string,
    password: string,
    username: string,
    firstName: string,
    lastName: string,
) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return sendRegisterRequest(userCredential, username, firstName, lastName);
};

export const logoutUser = async () => {
    try {
        await deleteCookie();
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
    }
};
