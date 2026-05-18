import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    type UserCredential,
} from 'firebase/auth';

import { auth } from '../config/firebase';

const processAuthTokens = async (userCredential: UserCredential) => {
    const user = userCredential.user;

    const token = await user.getIdToken();
    const tokenResult = await user.getIdTokenResult();

    //TODO: Handle token expiration and refreshing properly in the future.
    //      Use server-side sessions or a more secure storage mechanism like HttpOnly cookies to store tokens in a production environment.
    //      For now, we just store the tokens in localStorage.
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpire', tokenResult.expirationTime);
    localStorage.setItem('refreshToken', user.refreshToken);

    return user;
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
